import inquirer from 'inquirer';
import { askForTalawaWebsocketUrl } from './askForTalawaWebsocketUrl';


jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('askForTalawaWebsocketUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should return the provided endpoint when user enters it', async () => {
    const mockPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      endpoint: 'ws://example.com/graphql/',
    });

    const result = await askForTalawaWebsocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your talawa-websocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
      },
    ]);

    expect(result).toBe('ws://example.com/graphql/');
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

    const result = await askForTalawaWebsocketUrl();

    expect(mockPrompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your talawa-websocket endpoint:',
        default: 'ws://localhost:4000/graphql/',
      },
    ]);

    expect(result).toBe('ws://localhost:4000/graphql/');
  });
});
