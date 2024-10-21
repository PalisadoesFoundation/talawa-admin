import inquirer from 'inquirer';
import { askForTalawaWebSocketUrl } from './askForTalawaWebSocketUrl';

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('askForTalawaWebSocketUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the provided endpoint when user enters it', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: 'ws://example.com/graphql/',
    });

    const result = await askForTalawaWebSocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your Talawa WebSocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
        validate: expect.any(Function),
      },
    ]);

    expect(result).toBe('ws://example.com/graphql/');
  });

  test('should return the default endpoint when the user does not enter anything', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: '',
    });

    const result = await askForTalawaWebSocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your Talawa WebSocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
        validate: expect.any(Function),
      },
    ]);

    expect(result).toBe('ws://localhost:4000/graphql/');
  });

  test('should throw an error if the prompt fails', async () => {
    const mockError = new Error('Prompt failed');
    jest.spyOn(inquirer, 'prompt').mockRejectedValueOnce(mockError);

    await expect(askForTalawaWebSocketUrl()).rejects.toThrow('Prompt failed');
  });

  test('should handle empty user input and use the default value', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: '',
    });

    const result = await askForTalawaWebSocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your Talawa WebSocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
        validate: expect.any(Function),
      },
    ]);

    expect(result).toBe('ws://localhost:4000/graphql/');
  });

  test('should not fail on unexpected input type', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: '12345',
    });

    const result = await askForTalawaWebSocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your Talawa WebSocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
        validate: expect.any(Function),
      },
    ]);

    expect(result).toBe('12345');
  });
});
