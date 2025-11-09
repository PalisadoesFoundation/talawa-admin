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

  test('should validate Docker URL protocol when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      'https://host.docker.internal:3000',
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
    let callCount = 0;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          super(url);
          callCount++;
          if (callCount === 2 && url.startsWith('ws')) {
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
          message: 'Invalid WebSocket URL generated: ',
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });

  test('should handle Docker URL with invalid protocol after construction', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('https://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    const originalURL = global.URL;
    let callCount = 0;

    try {
      global.URL = class extends originalURL {
        constructor(url: string) {
          super(url);
          callCount++;
          if (callCount === 3 && url.includes('host.docker.internal')) {
            Object.defineProperty(this, 'protocol', {
              get: () => 'ftp:',
              configurable: true,
            });
          }
        }
      } as typeof URL;

      await askAndUpdateTalawaApiUrl(true);

      expect(console.error).toHaveBeenCalledWith(
        'Error setting up Talawa API URL:',
        expect.objectContaining({
          message: 'Invalid Docker URL generated',
        }),
      );
    } finally {
      global.URL = originalURL;
    }
  });
});
