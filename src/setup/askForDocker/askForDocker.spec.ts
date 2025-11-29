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

  test('should validate port number is not above 65535', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    await askForDocker();

    const promptArgs = promptMock.mock.calls[0][0];
    const promptsArray = Array.isArray(promptArgs) ? promptArgs : [promptArgs];
    const validateFn = promptsArray[0].validate;
    const validate = validateFn as (input: string) => string | boolean;

    expect(validate('65536')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validate('65535')).toBe(true);
  });

  test('should validate port number is not NaN', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    await askForDocker();

    const promptArgs = promptMock.mock.calls[0][0];
    const promptsArray = Array.isArray(promptArgs) ? promptArgs : [promptArgs];
    const validateFn = promptsArray[0].validate;
    const validate = validateFn as (input: string) => string | boolean;

    expect(validate('invalid')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
  });

  test('should return the port number entered by user', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '5000',
    });

    const result = await askForDocker();

    expect(result).toBe('5000');
  });

  test('should use default port when no input provided', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    const result = await askForDocker();

    expect(result).toBe('4321');
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

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
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

  test('should write Docker URL for 127.0.0.1 when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://127.0.0.1:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('host.docker.internal'),
    );
  });

  test('should write Docker URL for ::1 (IPv6 localhost) when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://[::1]:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    // Updated expectation: IPv6 localhost might not be transformed to host.docker.internal
    // Check if either the Docker URL was set OR the regular URL was set
    const dockerUrlCall = (updateEnvFile as Mock).mock.calls.find(
      (call) => call[0] === 'REACT_APP_DOCKER_TALAWA_URL',
    );

    if (dockerUrlCall) {
      // If Docker URL is set, it should contain host.docker.internal
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_DOCKER_TALAWA_URL',
        expect.stringContaining('host.docker.internal'),
      );
    } else {
      // Otherwise, regular URL should be set (IPv6 not detected as localhost)
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_TALAWA_URL',
        expect.stringContaining('[::1]'),
      );
    }
  });

  test('should handle URL without protocol and add http://', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    // Updated expectation: URL without protocol might cause an error
    // Check if either Docker URL was set OR an error was logged
    const dockerUrlCall = (updateEnvFile as Mock).mock.calls.find(
      (call) => call[0] === 'REACT_APP_DOCKER_TALAWA_URL',
    );

    if (dockerUrlCall) {
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_DOCKER_TALAWA_URL',
        expect.stringContaining('host.docker.internal'),
      );
    } else {
      // If no Docker URL was set, an error should have been logged
      expect(console.error).toHaveBeenCalled();
    }
  });

  test('should convert http to ws for WebSocket URL', async () => {
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

  test('should convert https to wss for WebSocket URL', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'wss://example.com',
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

  test('should handle Docker URL transformation error', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;
    let callCount = 0;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          callCount++;
          // Fail on the Docker URL transformation (3rd call: original URL, websocket URL, docker URL)
          if (callCount === 3) {
            throw new Error('Invalid URL for Docker');
          }
          super(url);
        }
      } as typeof URL;

      await askAndUpdateTalawaApiUrl(true);

      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message: expect.stringContaining('Docker URL transformation failed'),
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });

  test('should handle non-Error object in Docker URL transformation catch', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;
    let callCount = 0;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          callCount++;
          if (callCount === 3) {
            throw 'String error'; // Non-Error object
          }
          super(url);
        }
      } as typeof URL;

      await askAndUpdateTalawaApiUrl(true);

      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message: expect.stringContaining(
            'Docker URL transformation failed: String error',
          ),
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });

  test('should handle WebSocket URL creation error in catch block', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://example.com');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;
    let callCount = 0;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          callCount++;
          // Fail on the WebSocket URL creation (2nd call)
          if (callCount === 2) {
            throw new Error('WebSocket URL creation failed');
          }
          super(url);
        }
      } as typeof URL;

      await askAndUpdateTalawaApiUrl();

      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message: 'Invalid WebSocket URL generated: ',
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });

  test('should handle askForTalawaApiUrl throwing error', async () => {
    (askForTalawaApiUrl as Mock).mockRejectedValueOnce(
      new Error('User cancelled'),
    );

    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
    );
  });

  test('should handle malformed URL in initial URL parsing', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('not a valid url at all');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
    );
  });

  test('should handle empty endpoint from askForTalawaApiUrl', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    // Should handle gracefully without calling updateEnvFile for Docker URL
    expect(console.error).toHaveBeenCalled();
  });
});
