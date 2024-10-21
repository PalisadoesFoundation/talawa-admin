import inquirer, { InputQuestion, QuestionCollection } from 'inquirer';
import { askForTalawaWebSocketUrl } from './askForTalawaWebSocketUrl';
import { isValidWebSocketUrl } from './askForTalawaWebSocketUrl';

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('Checkes validity of WebSocket URL', () => {
  test('should return true for a valid ws:// URL', () => {
    const validUrl = 'ws://example.com/graphql/';
    expect(isValidWebSocketUrl(validUrl)).toBe(true);
  });

  test('should return true for a valid wss:// URL', () => {
    const validUrl = 'wss://example.com/graphql/';
    expect(isValidWebSocketUrl(validUrl)).toBe(true);
  });

  test('should return false for an invalid WebSocket URL', () => {
    const invalidUrl = 'http://example.com/graphql/';
    expect(isValidWebSocketUrl(invalidUrl)).toBe(false);
  });

  test('should return false for a malformed URL', () => {
    const malformedUrl = 'not-a-valid-url';
    expect(isValidWebSocketUrl(malformedUrl)).toBe(false);
  });

  test('should return false for an empty string', () => {
    const emptyUrl = '';
    expect(isValidWebSocketUrl(emptyUrl)).toBe(false);
  });
});

describe('askForTalawaWebSocketUrl validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return an error message for invalid WebSocket URLs', async () => {
    const mockPrompt = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async (questions: QuestionCollection) => {
        const validate = (questions as InputQuestion[])[0].validate!;
        const result = validate('http://invalid-url');
        expect(result).toBe(
          'Please enter a valid WebSocket URL (starting with ws:// or wss://).',
        );
        return { endpoint: 'http://invalid-url' };
      });

    await askForTalawaWebSocketUrl();
    expect(mockPrompt).toHaveBeenCalled();
  });

  test('should return true for valid WebSocket URLs', async () => {
    const mockPrompt = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async (questions: QuestionCollection) => {
        const validate = (questions as InputQuestion[])[0].validate!;
        const result = validate('ws://valid-url.com');
        expect(result).toBe(true);
        return { endpoint: 'ws://valid-url.com' };
      });

    await askForTalawaWebSocketUrl();
    expect(mockPrompt).toHaveBeenCalled();
  });

  test('should return true for empty input (default behavior)', async () => {
    const mockPrompt = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async (questions: QuestionCollection) => {
        const validate = (questions as InputQuestion[])[0].validate!;
        const result = validate('');
        expect(result).toBe(true);
        return { endpoint: '' };
      });

    await askForTalawaWebSocketUrl();
    expect(mockPrompt).toHaveBeenCalled();
  });
});

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
