import { describe, test, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import { askForTalawaApiUrl } from './askForTalawaApiUrl';

// Mock the `inquirer` module
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

describe('askForTalawaApiUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return the provided endpoint when user enters it', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      endpoint: 'http://example.com/graphql/',
    });

    const result = await askForTalawaApiUrl();

    expect(inquirer.prompt).toHaveBeenCalledWith([
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
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      endpoint: 'http://localhost:4000/graphql/',
    });

    const result = await askForTalawaApiUrl();

    expect(inquirer.prompt).toHaveBeenCalledWith([
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
