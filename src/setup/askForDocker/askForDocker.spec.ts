import inquirer from 'inquirer';
import { askAndUpdateTalawaApiUrl, askForDocker } from './askForDocker';
import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
  Mock,
} from 'vitest';

vi.mock('inquirer', async () => {
  const actual = await vi.importActual('inquirer');
  return {
    default: {
      ...actual,
      prompt: vi.fn(),
    },
  };
});

vi.mock('../askForTalawaApiUrl/askForTalawaApiUrl', () => ({
  askForTalawaApiUrl: vi.fn(),
}));

vi.mock('../updateEnvFile/updateEnvFile', () => ({
  default: vi.fn(),
}));

import updateEnvFile from '../updateEnvFile/updateEnvFile';
import { askForTalawaApiUrl } from '../askForTalawaApiUrl/askForTalawaApiUrl';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('askForDocker', () => {
  test('should validate port number is not below 1024', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    await askForDocker();

    const promptArgs = promptMock.mock.calls[0][0];
    const promptsArray = Array.isArray(promptArgs) ? promptArgs : [promptArgs];

    const validateFn = promptsArray[0].validate;

    expect(typeof validateFn).toBe('function');
    const validate = validateFn as (input: string) => string | boolean;
    expect(validate('1023')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validate('1024')).toBe(true);
  });

  describe('askAndUpdateTalawaApiUrl - Retry Logging', () => {
    test('should log connection errors when retries fail', async () => {
      // Restore the console.error mock to capture actual calls
      vi.restoreAllMocks();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Mock askForTalawaApiUrl to return invalid protocol URLs that trigger retries
      (askForTalawaApiUrl as Mock)
        .mockResolvedValueOnce('ftp://invalid1.com')
        .mockResolvedValueOnce('ftp://invalid2.com')
        .mockResolvedValueOnce('https://api.example.com');

      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        shouldSetTalawaApiUrlResponse: true,
      });

      await askAndUpdateTalawaApiUrl();

      // Verify connection error messages were logged (2 failures before success)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error checking connection:',
        expect.objectContaining({
          message: 'Invalid URL protocol. Must be http or https',
        }),
      );
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('should log all connection errors and final failure after max retries', async () => {
      // Restore the console.error mock to capture actual calls
      vi.restoreAllMocks();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Mock askForTalawaApiUrl to return invalid protocol that triggers retries
      (askForTalawaApiUrl as Mock).mockResolvedValue('ftp://invalid.com');

      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        shouldSetTalawaApiUrlResponse: true,
      });

      await askAndUpdateTalawaApiUrl();

      // Verify all 3 connection error messages were logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error checking connection:',
        expect.objectContaining({
          message: 'Invalid URL protocol. Must be http or https',
        }),
      );

      // Verify final failure message was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message:
            'Failed to establish connection after maximum retry attempts',
        }),
      );

      // Total: 3 connection errors + 1 final error = 4 calls
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });
  });

  test('should validate port number is not above 65535', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    await askForDocker();

    const promptArgs = promptMock.mock.calls[0][0];
    const promptsArray = Array.isArray(promptArgs) ? promptArgs : [promptArgs];
    const validate = promptsArray[0].validate as (
      input: string,
    ) => string | boolean;

    expect(validate('65536')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validate('65535')).toBe(true);
  });

  test('should validate port number is numeric', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    await askForDocker();

    const promptArgs = promptMock.mock.calls[0][0];
    const promptsArray = Array.isArray(promptArgs) ? promptArgs : [promptArgs];
    const validate = promptsArray[0].validate as (
      input: string,
    ) => string | boolean;

    expect(validate('abc')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validate('12.34')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
  });

  test('should return the entered port number', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '8080',
    });

    const result = await askForDocker();

    expect(result).toBe('8080');
  });
});

describe('askAndUpdateTalawaApiUrl - extended coverage', () => {
  test('should skip setup when user selects No', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: false,
    });

    await askAndUpdateTalawaApiUrl();

    expect(askForTalawaApiUrl).not.toHaveBeenCalled();
    expect(updateEnvFile).not.toHaveBeenCalled();
  });

  test('should ignore Docker logic when URL hostname is not localhost', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://example.com',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'wss://example.com',
    );
    expect(updateEnvFile).not.toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.anything(),
    );
  });

  test('should handle 127.0.0.1 as localhost', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://127.0.0.1:4000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('host.docker.internal:4000'),
    );
  });

  test('should handle URLs with trailing slash', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://example.com/');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://example.com/',
    );
  });

  test('should handle URLs with path segments', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue(
      'https://example.com/api/v1',
    );
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://example.com/api/v1',
    );
  });
});

describe('askAndUpdateTalawaApiUrl', () => {
  test('should proceed with setup when user confirms', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue(
      'https://talawa-api.example.com',
    );
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(askForTalawaApiUrl).toHaveBeenCalled();
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://talawa-api.example.com',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'wss://talawa-api.example.com',
    );
  });

  test('should handle invalid URL protocol (ftp)', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('ftp://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();
    expect(updateEnvFile).not.toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      expect.stringContaining('ftp://'),
    );
  });

  test('should write Docker URL for localhost when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringMatching(/^https?:\/\/host\.docker\.internal:3000\/?$/),
    );
  });

  test('should transform http to ws for WebSocket URL', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'ws://example.com',
    );
  });

  test('should handle errors during URL parsing', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('invalid-url');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
    );
  });

  test('should handle askForTalawaApiUrl throwing error', async () => {
    (askForTalawaApiUrl as Mock).mockRejectedValue(new Error('User cancelled'));
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.objectContaining({
        message: 'Failed to establish connection after maximum retry attempts',
      }),
    );
  });

  test('should not call updateEnvFile when useDocker=false for localhost', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(false);

    expect(updateEnvFile).not.toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.anything(),
    );
  });
});

describe('askAndUpdateTalawaApiUrl - Additional Coverage', () => {
  test('should handle WebSocket URL with invalid protocol', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          super(url);
          if (
            typeof url === 'string' &&
            (url.startsWith('ws:') ||
              url.startsWith('wss:') ||
              url.includes('ws://') ||
              url.includes('wss://'))
          ) {
            Object.defineProperty(this, 'protocol', {
              get: () => 'invalid:',
              configurable: true,
            });
          }
        }
      } as typeof URL;

      await askAndUpdateTalawaApiUrl();

      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message: expect.stringContaining('Invalid WebSocket URL generated'),
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });

  test('should transform localhost to host.docker.internal and not error', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');

    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await askAndUpdateTalawaApiUrl(true);

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('host.docker.internal'),
    );

    consoleErrorSpy.mockRestore();
  });

  test('should handle URL without port in Docker mode', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('host.docker.internal'),
    );
  });

  test('should handle empty URL from askForTalawaApiUrl', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
    );
  });

  test('should handle URL with query parameters', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue(
      'https://example.com?key=value',
    );
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://example.com?key=value',
    );
  });

  test('should handle localhost with different ports', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost:9999');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('host.docker.internal:9999'),
    );
  });
});
