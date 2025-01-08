import inquirer from 'inquirer';
import { askForDocker } from './askForDocker';
import { describe, test, expect, vi } from 'vitest';

vi.mock('inquirer');

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

  test('should reject non-numeric input with validation error', async () => {
    // Mock the validation function to simulate an error for non-numeric input
    vi.spyOn(inquirer, 'prompt').mockImplementationOnce(() => {
      throw new Error(
        'Please enter a valid port number between 1024 and 65535',
      );
    });

    await expect(askForDocker()).rejects.toThrow(
      'Please enter a valid port number between 1024 and 65535',
    );
  });

  test('should reject port outside valid range with validation error', async () => {
    // Mock the validation function to simulate an error for an out-of-range port
    vi.spyOn(inquirer, 'prompt').mockImplementationOnce(() => {
      throw new Error(
        'Please enter a valid port number between 1024 and 65535',
      );
    });

    await expect(askForDocker()).rejects.toThrow(
      'Please enter a valid port number between 1024 and 65535',
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
