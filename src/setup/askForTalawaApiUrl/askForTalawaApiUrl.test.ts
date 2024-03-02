import inquirer from 'inquirer';
import { askForTalawaApiUrl } from './askForTalawaApiUrl';

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('askForTalawaApiUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return the provided endpoint when user enters it', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: 'http://example.com/graphql/',
    });

    const result = await askForTalawaApiUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your talawa-api endpoint:',
        default: 'http://localhost:4000/graphql/',
      },
    ]);

    expect(result).toBe('http://example.com/graphql/');
  });

  test('should return the default endpoint when the user does not enter anything', async () => {
    const mockPrompt = jest
      .spyOn(inquirer, 'prompt')
      .mockImplementation(async (questions: any) => {
        const answers: Record<string, string | undefined> = {};
        questions.forEach(
          (question: { name: string | number; default: any }) => {
            answers[question.name] = question.default;
          },
        );
        return answers;
      });

    const result = await askForTalawaApiUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your talawa-api endpoint:',
        default: 'http://localhost:4000/graphql/',
      },
    ]);

    expect(result).toBe('http://localhost:4000/graphql/');
  });
});
