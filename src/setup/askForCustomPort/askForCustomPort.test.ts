import inquirer from 'inquirer';
import { askForCustomPort } from './askForCustomPort';

jest.mock('inquirer');

describe('askForCustomPort', () => {
  test('should return default port if user provides no input', async () => {
    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ customPort: '4321' });

    const result = await askForCustomPort();
    expect(result).toBe('4321');
  });

  test('should return user-provided port', async () => {
    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ customPort: '8080' });

    const result = await askForCustomPort();
    expect(result).toBe('8080');
  });
});
