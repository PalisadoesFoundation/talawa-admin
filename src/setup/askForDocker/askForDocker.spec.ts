import inquirer from 'inquirer';
import { askForDocker } from './askForDocker';

import { describe, test, expect, vi } from 'vitest';

vi.mock('inquirer');

describe('askForCustomPort', () => {
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
});
