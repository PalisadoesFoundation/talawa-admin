import inquirer from 'inquirer';
import { askForTalawaApiUrl } from './askForTalawaApiUrl';
import { vi, it, describe, expect, beforeEach } from 'vitest';

vi.mock('inquirer', async (importOriginal) => {
  const actual = await importOriginal<typeof inquirer>(); // Adding explicit type
  return {
    ...actual,
    prompt: vi.fn(),
  };
});

describe('askForTalawaApiUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the provided endpoint when user enters it', async () => {
    const mockPrompt = vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
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

  it('should return the default endpoint when the user does not enter anything', async () => {
    const mockPrompt = vi
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
