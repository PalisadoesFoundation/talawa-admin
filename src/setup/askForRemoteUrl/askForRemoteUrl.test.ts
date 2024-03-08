import inquirer from 'inquirer';
import { askForRemoteUrl, validateUrl } from './askForRemoteUrl'; // Replace 'yourFileName' with the actual name of your TypeScript file

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('validateUrl function', () => {
  it('should return true for a valid URL', () => {
    const validUrl = 'http://example.com/';
    const result = validateUrl(validUrl);
    expect(result).toBe(true);
  });

  it('should return false for an invalid URL', () => {
    const invalidUrl = 'invalid-url';
    const result = validateUrl(invalidUrl);
    expect(result).toBe(false);
  });
});

describe('askForRemoteUrl function', () => {
  test('should return the provided endpoint when user enters it', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      url: 'http://example.com/',
    });
    const result = await askForRemoteUrl();
    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'url',
        message: `Enter your remote url in the format 'http://hosturl/' (don't enter the port)`,
        validate: validateUrl,
      },
    ]);
    expect(result).toBe('http://example.com/');
  });

  test('should re-prompt the user until a valid URL is entered', async () => {
    const invalidUrl = 'invalid-url';
    const validUrl = 'http://example.com/';
    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({
        url: invalidUrl,
      })
      .mockResolvedValueOnce({ url: validUrl });

    await askForRemoteUrl();
    expect(inquirer.prompt).toHaveBeenCalledTimes(2);
  });
});
