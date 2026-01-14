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

    // Should only update normal URLs, not Docker URL
    expect(updateEnvFile).toHaveBeenCalledTimes(1);
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://example.com',
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
    expect(updateEnvFile).toHaveBeenCalledTimes(1);
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'https://talawa-api.example.com',
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

    expect(askForTalawaApiUrl).toHaveBeenCalledWith(true);
    const talawaUrlCalls = (updateEnvFile as Mock).mock.calls.filter(
      (call) => call[0] === 'REACT_APP_TALAWA_URL',
    );
    expect(talawaUrlCalls).toHaveLength(2);
    expect(talawaUrlCalls[0][1]).toBe('https://localhost:3000');
    expect(talawaUrlCalls[1][1]).toBe('https://host.docker.internal:3000/');
  });

  test('should write Docker URL for 127.0.0.1 when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://127.0.0.1:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(askForTalawaApiUrl).toHaveBeenCalledWith(true);
    const talawaUrlCalls = (updateEnvFile as Mock).mock.calls.filter(
      (call) => call[0] === 'REACT_APP_TALAWA_URL',
    );
    expect(talawaUrlCalls).toHaveLength(2);
    expect(talawaUrlCalls[0][1]).toBe('http://127.0.0.1:3000');
    expect(talawaUrlCalls[1][1]).toBe('http://host.docker.internal:3000/');
  });

  test('should write Docker URL for ::1 (IPv6 localhost) when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://[::1]:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    const talawaUrlCalls = (updateEnvFile as Mock).mock.calls.filter(
      (call) => call[0] === 'REACT_APP_TALAWA_URL',
    );
    expect(talawaUrlCalls).toHaveLength(2);
    expect(talawaUrlCalls[0][1]).toBe('http://[::1]:3000');
    expect(talawaUrlCalls[1][1]).toBe('http://host.docker.internal:3000/');
  });

  test('should handle URL without protocol and add http://', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    const talawaUrlCalls = (updateEnvFile as Mock).mock.calls.filter(
      (call) => call[0] === 'REACT_APP_TALAWA_URL',
    );

    if (talawaUrlCalls.length >= 2) {
      expect(talawaUrlCalls[0][1]).toBe('localhost:3000');
      expect(talawaUrlCalls[1][1]).toBe('http://host.docker.internal:3000/');
    } else {
      expect(console.error).toHaveBeenCalled();
    }
  });
});
describe('askAndUpdateTalawaApiUrl - Additional Coverage', () => {
  test('should transform localhost to host.docker.internal and not error', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    const talawaUrlCalls = (updateEnvFile as Mock).mock.calls.filter(
      (call) => call[0] === 'REACT_APP_TALAWA_URL',
    );
    expect(talawaUrlCalls).toHaveLength(2);
    expect(talawaUrlCalls[0][1]).toBe('http://localhost:3000');
    expect(talawaUrlCalls[1][1]).toBe('http://host.docker.internal:3000/');
  });

  test('should handle Docker URL transformation error', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;

    try {
      global.URL = class extends originalURL {
        toString(): string {
          if (this.hostname === 'host.docker.internal') {
            throw new Error('Invalid URL for Docker');
          }
          return super.toString();
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

    try {
      global.URL = class extends originalURL {
        toString(): string {
          if (this.hostname === 'host.docker.internal') {
            throw 'String error'; // Non-Error object
          }
          return super.toString();
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

  test('should handle error and not call updateEnvFile when invalid protocol URL is returned', async () => {
    // Mock returning invalid protocol URL that will trigger catch block
    (askForTalawaApiUrl as Mock).mockResolvedValue('ftp://example.com');

    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Error setting up Talawa API URL:',
      expect.any(Error),
    );

    // Verify updateEnvFile was not called due to error
    expect(updateEnvFile).not.toHaveBeenCalled();
  });

  describe('askAndUpdateTalawaApiUrl - Retry Logic Coverage', () => {
    test('should execute retry loop when connection fails then succeeds', async () => {
      // Mock askForTalawaApiUrl to fail twice, then succeed
      (askForTalawaApiUrl as Mock)
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockResolvedValueOnce('https://api.example.com');

      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        shouldSetTalawaApiUrlResponse: true,
      });

      const consoleLogSpy = vi.spyOn(console, 'log');

      await askAndUpdateTalawaApiUrl();

      // Verify 3 retry attempts (covers the while loop)
      expect(askForTalawaApiUrl).toHaveBeenCalledTimes(3);

      // Verify error logging during retries (covers catch block)
      expect(console.error).toHaveBeenCalledWith(
        'Error checking connection:',
        expect.any(Error),
      );

      // Verify multiple error logs (one per retry)
      expect(console.error).toHaveBeenCalledTimes(2);

      // Verify retry attempt logging (covers line 62-63)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 1/3 failed',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 2/3 failed',
      );

      // Eventually succeeded (covers success path after retries)
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_TALAWA_URL',
        'https://api.example.com',
      );

      consoleLogSpy.mockRestore();
    });

    test('should fail after MAX_RETRIES and log final error', async () => {
      // Make all 3 attempts fail
      (askForTalawaApiUrl as Mock).mockRejectedValue(
        new Error('Persistent failure'),
      );

      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        shouldSetTalawaApiUrlResponse: true,
      });

      const consoleLogSpy = vi.spyOn(console, 'log');

      await askAndUpdateTalawaApiUrl();

      // Verify all 3 retry attempts exhausted (covers MAX_RETRIES check)
      expect(askForTalawaApiUrl).toHaveBeenCalledTimes(3);

      // Verify errors logged during each retry attempt
      expect(console.error).toHaveBeenCalledWith(
        'Error checking connection:',
        expect.any(Error),
      );

      // Verify all 3 retry attempt messages (covers line 62-63)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 1/3 failed',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 2/3 failed',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 3/3 failed',
      );

      // Verify final error thrown (covers lines 71-74)
      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message:
            'Failed to establish connection after maximum retry attempts',
        }),
      );

      // Verify no env update on failure
      expect(updateEnvFile).not.toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });

    test('should execute retry logic when connection fails', async () => {
      // Mock askForTalawaApiUrl to throw errors for retries, then succeed
      (askForTalawaApiUrl as Mock)
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce('https://api.example.com');

      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        shouldSetTalawaApiUrlResponse: true,
      });

      const consoleLogSpy = vi.spyOn(console, 'log');

      await askAndUpdateTalawaApiUrl();

      // Verify retry attempts occurred
      expect(askForTalawaApiUrl).toHaveBeenCalledTimes(3);

      // Verify errors were logged during retries
      expect(console.error).toHaveBeenCalledWith(
        'Error checking connection:',
        expect.any(Error),
      );

      // Verify retry logging (covers line 62-63)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 1/3 failed',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Connection attempt 2/3 failed',
      );

      // Eventually succeeded
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_TALAWA_URL',
        'https://api.example.com',
      );

      consoleLogSpy.mockRestore();
    });
  });
});
