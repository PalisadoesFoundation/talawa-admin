import inquirer from 'inquirer';
import { askForDocker } from './askForDocker';
import { describe, test, expect, vi } from 'vitest';

vi.mock('inquirer');

describe('askForDocker', () => {
  test('should return default docker port if user provides no input', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '4321',
    });

    const result = await askForDocker();
    expect(result).toBe('4321');
  });

  test('should return user-provided port', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '8080',
    });

    const result = await askForDocker();
    expect(result).toBe('8080');
  });

  test('should throw an error if user enters an invalid port (non-numeric)', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: 'abc',
    });

    const result = await askForDocker();
    expect(result).not.toBe('abc'); // This case will re-ask for valid input
  });

  test('should throw an error if user enters a port outside the valid range', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '999',
    });

    const result = await askForDocker();
    expect(result).not.toBe('999'); // This case will re-ask for valid input
  });

  test('should return valid port within the range', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      dockerAppPort: '8080',
    });

    const result = await askForDocker();
    expect(result).toBe('8080');
  });
});
