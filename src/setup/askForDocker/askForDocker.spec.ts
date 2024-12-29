import inquirer from 'inquirer';
import { askForDocker } from './askForDocker';
import { describe, test, expect, vi } from 'vitest';

vi.mock('inquirer');

describe('askForDocker', () => {
  test('should return default docker port if user provides no input', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    const result = await askForDocker();
    expect(result).toBe('4321');
  });

  test('should return user-provided port', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockResolvedValueOnce({
      dockerAppPort: '8080',
    });

    const result = await askForDocker();
    expect(result).toBe('8080');
  });

  test('should retry if user enters an invalid port (non-numeric)', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock
      .mockResolvedValueOnce({
        dockerAppPort: 'abc', // Invalid input
      })
      .mockResolvedValueOnce({
        dockerAppPort: '4321', // Valid input on second prompt
      });

    const result = await askForDocker();
    expect(promptMock).toHaveBeenCalledTimes(2); // Should prompt twice
    expect(result).toBe('4321'); // The valid input should be returned
  });

  test('should retry if user enters a port outside the valid range', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock
      .mockResolvedValueOnce({
        dockerAppPort: '999', // Invalid port (out of range)
      })
      .mockResolvedValueOnce({
        dockerAppPort: '4321', // Valid port on second prompt
      });

    const result = await askForDocker();
    expect(promptMock).toHaveBeenCalledTimes(2); // Should prompt twice
    expect(result).toBe('4321'); // The valid input should be returned
  });

  test('should return valid port within the range', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockResolvedValueOnce({
      dockerAppPort: '8080',
    });

    const result = await askForDocker();
    expect(result).toBe('8080');
  });
});
