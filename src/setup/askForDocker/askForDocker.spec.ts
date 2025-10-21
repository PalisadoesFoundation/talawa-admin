import inquirer from 'inquirer';
import { askAndUpdateTalawaApiUrl, askForDocker } from './askForDocker';
import { askForTalawaApiUrl } from '../askForTalawaApiUrl/askForTalawaApiUrl';
import { writeEnvParameter } from '../updateEnvFile/updateEnvFile';
import { checkConnection } from '../checkConnection/checkConnection';
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('inquirer', async () => {
  const actual = await vi.importActual('inquirer');
  return {
    default: {
      ...actual,
      prompt: vi.fn(),
    },
  };
});

vi.mock('../askForTalawaApiUrl/askForTalawaApiUrl');
vi.mock('../updateEnvFile/updateEnvFile');
vi.mock('../checkConnection/checkConnection');

describe('askForDocker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test('should reject non-numeric input with validation error', async () => {
    vi.spyOn(inquirer, 'prompt').mockImplementationOnce(() => {
      throw new Error(
        'Please enter a valid port number between 1024 and 65535'
      );
    });

    await expect(askForDocker()).rejects.toThrow(
      'Please enter a valid port number between 1024 and 65535'
    );
  });

  test('should handle edge case: maximum valid port', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '65535',
    });

    const result = await askForDocker();
    expect(result).toBe('65535');
  });

  test('should handle edge case: minimum valid port', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '1024',
    });

    const result = await askForDocker();
    expect(result).toBe('1024');
  });
});

describe('askAndUpdateTalawaApiUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should set API URLs with proper comments when user confirms', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'http://example.com/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(true);

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      'http://example.com/graphql',
      'Talawa API GraphQL endpoint URL'
    );
    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'ws://example.com/graphql',
      'WebSocket URL for real-time communication'
    );
  });

  test('should convert http to ws for WebSocket URL', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'http://api.example.com/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(true);

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'ws://api.example.com/graphql',
      'WebSocket URL for real-time communication'
    );
  });

  test('should convert https to wss for WebSocket URL', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'https://api.example.com/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(true);

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'wss://api.example.com/graphql',
      'WebSocket URL for real-time communication'
    );
  });

  test('should create Docker URL for localhost', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'http://localhost:4000/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(true);

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      'http://host.docker.internal:4000/graphql',
      'Talawa API URL for Docker environment'
    );
  });

  test('should set empty Docker URL for non-localhost', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'http://example.com/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(true);

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      '',
      'Talawa API URL for Docker environment'
    );
  });

  test('should set empty values when user declines API setup', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: false,
    });

    await askAndUpdateTalawaApiUrl();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_TALAWA_URL',
      '',
      'Talawa API GraphQL endpoint URL'
    );
    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      '',
      'WebSocket URL for real-time communication'
    );
    expect(writeEnvParameter).toHaveBeenCalledWith(
      'REACT_APP_DOCKER_TALAWA_URL',
      '',
      'Talawa API URL for Docker environment'
    );
  });

  test('should retry connection on failure', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl)
      .mockResolvedValueOnce('http://example.com/graphql')
      .mockResolvedValueOnce('http://example.com/graphql');
    vi.mocked(checkConnection)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await askAndUpdateTalawaApiUrl();

    expect(checkConnection).toHaveBeenCalledTimes(2);
  });

  test('should throw error after max retries', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue(
      'http://example.com/graphql'
    );
    vi.mocked(checkConnection).mockResolvedValue(false);

    await expect(askAndUpdateTalawaApiUrl()).rejects.toThrow(
      'Failed to establish connection after maximum retry attempts'
    );
  });

  test('should handle invalid URL protocol', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldSetTalawaApiUrlResponse: true,
    });
    vi.mocked(askForTalawaApiUrl).mockResolvedValue('ftp://example.com/graphql');

    await expect(askAndUpdateTalawaApiUrl()).rejects.toThrow();
  });
});