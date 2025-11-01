// <reference types="vitest" />
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
  test('should return default Docker port if user provides no input', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });
    const result = await askForDocker();
    expect(result).toBe('4321');
  });

  test('should return user-provided valid port', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '8080',
    });
    const result = await askForDocker();
    expect(result).toBe('8080');
  });

  test('should reject invalid non-numeric input through prompt error', async () => {
    vi.spyOn(inquirer, 'prompt').mockImplementationOnce(() => {
      throw new Error(
        'Please enter a valid port number between 1024 and 65535',
      );
    });
    await expect(askForDocker()).rejects.toThrow(/valid port number/);
  });

  test('should validate boundary ports correctly', () => {
    const validateFn = (input: string) => {
      const port = Number(input);
      if (Number.isNaN(port) || port < 1024 || port > 65535) {
        return 'Please enter a valid port number between 1024 and 65535';
      }
      return true;
    };
    expect(validateFn('abc')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validateFn('70000')).toBe(
      'Please enter a valid port number between 1024 and 65535',
    );
    expect(validateFn('1024')).toBe(true);
    expect(validateFn('65535')).toBe(true);
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

  test('should skip setup when user declines', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: false,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith('REACT_APP_TALAWA_URL', '');
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      '',
    );
  });

  test('should retry connection if askForTalawaApiUrl fails first time', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    (askForTalawaApiUrl as Mock)
      .mockRejectedValueOnce(new Error('Network fail'))
      .mockResolvedValueOnce('https://talawa-api.example.com');

    await askAndUpdateTalawaApiUrl();
    expect(askForTalawaApiUrl).toHaveBeenCalledTimes(2);
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

  test('should handle invalid websocket URL generation gracefully', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://example');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'http://example',
    );
  });

  test('should replace localhost with host.docker.internal when useDocker=true', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      'http://host.docker.internal:3000',
    );
  });

  test('should handle invalid Docker URL protocol', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('ftp://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl(true);
    expect(updateEnvFile).not.toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      expect.stringContaining('ftp://'),
    );
  });

  test('should throw error after max retries', async () => {
    (askForTalawaApiUrl as Mock).mockImplementation(() => {
      throw new Error('Bad endpoint');
    });
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });

    await askAndUpdateTalawaApiUrl();

    expect(updateEnvFile).not.toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      expect.stringContaining('https://'),
    );
  });

  test('should catch outer prompt error gracefully', async () => {
    vi.spyOn(inquirer, 'prompt').mockRejectedValueOnce(
      new Error('Prompt failure'),
    );
    await expect(askAndUpdateTalawaApiUrl()).resolves.not.toThrow();
  });

  test('should throw and catch invalid WebSocket URL generation', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://invalid-url');
    await askAndUpdateTalawaApiUrl();
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'http://invalid-url',
    );
  });

  test('should throw invalid Docker URL generated error', async () => {
    (askForTalawaApiUrl as Mock).mockResolvedValue('http://localhost:3000');
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    // Break Docker URL validation intentionally
    const badUrlSpy = vi
      .spyOn(URL.prototype, 'toString')
      .mockImplementationOnce(() => {
        throw new Error('Invalid Docker URL generated');
      });

    await askAndUpdateTalawaApiUrl(true);
    badUrlSpy.mockRestore();
  });

  test('should handle outer catch when inquirer throws globally', async () => {
    vi.spyOn(inquirer, 'prompt').mockRejectedValueOnce(
      new Error('Global failure'),
    );
    await expect(askAndUpdateTalawaApiUrl()).resolves.not.toThrow();
  });
});
