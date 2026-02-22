import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock modules
vi.mock('inquirer', async () => {
  const actual = await vi.importActual('inquirer');
  return {
    default: {
      ...actual,
      prompt: vi.fn(),
    },
  };
});

vi.mock('setup/updateEnvFile/updateEnvFile', () => ({
  default: vi.fn(),
}));

// Import after mocking
import askAndSetOAuth, {
  validateClientId,
  validateBaseUrl,
} from './oauthConfig';
import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';

describe('askAndSetOAuth', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('should clear OAuth settings when user declines setup', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      shouldSetupOAuth: false,
    });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GOOGLE_CLIENT_ID', '');
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GOOGLE_REDIRECT_URI', '');
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GITHUB_CLIENT_ID', '');
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GITHUB_REDIRECT_URI', '');
    expect(updateEnvFile).toHaveBeenCalledTimes(4);
  });

  it('should set up Google OAuth only', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'google-client-id-123',
      });

    await askAndSetOAuth();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Google OAuth Configuration'),
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_CLIENT_ID',
      'google-client-id-123',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'http://localhost:4321/auth/callback',
    );
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GITHUB_CLIENT_ID', '');
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GITHUB_REDIRECT_URI', '');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('OAuth provider configuration completed!'),
    );
  });

  it('should set up GitHub OAuth only', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'github-client-id-456',
      });

    await askAndSetOAuth();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('GitHub OAuth Configuration'),
    );
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GOOGLE_CLIENT_ID', '');
    expect(updateEnvFile).toHaveBeenCalledWith('VITE_GOOGLE_REDIRECT_URI', '');
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_CLIENT_ID',
      'github-client-id-456',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_REDIRECT_URI',
      'http://localhost:4321/auth/callback',
    );
  });

  it('should set up both Google and GitHub OAuth', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'https://example.com',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'both',
      })
      .mockResolvedValueOnce({
        clientId: 'google-client-id-123',
      })
      .mockResolvedValueOnce({
        clientId: 'github-client-id-456',
      });

    await askAndSetOAuth();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Google OAuth Configuration'),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('GitHub OAuth Configuration'),
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_CLIENT_ID',
      'google-client-id-123',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'https://example.com/auth/callback',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_CLIENT_ID',
      'github-client-id-456',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_REDIRECT_URI',
      'https://example.com/auth/callback',
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('OAuth provider configuration completed!'),
    );
  });

  it('should display helpful instructions for Google OAuth', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'test-client-id',
      });

    await askAndSetOAuth();

    expect(console.log).toHaveBeenCalledWith(
      'https://console.developers.google.com/apis/credentials',
    );
    expect(console.log).toHaveBeenCalledWith('Make sure to:');
    expect(console.log).toHaveBeenCalledWith('1. Create OAuth 2.0 Client ID');
    expect(console.log).toHaveBeenCalledWith(
      '2. Add your redirect URI to authorized redirect URIs',
    );
  });

  it('should display helpful instructions for GitHub OAuth', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'test-client-id',
      });

    await askAndSetOAuth();

    expect(console.log).toHaveBeenCalledWith(
      'https://github.com/settings/developers',
    );
    expect(console.log).toHaveBeenCalledWith('Make sure to:');
    expect(console.log).toHaveBeenCalledWith(
      '1. Go to GitHub Developer Settings > OAuth Apps',
    );
    expect(console.log).toHaveBeenCalledWith(
      '2. Register a new application with the callback URL',
    );
  });

  it('should handle ExitPromptError and rethrow it', async () => {
    const exitError = new Error('User cancelled');
    (exitError as { name: string }).name = 'ExitPromptError';

    (inquirer.prompt as unknown as Mock).mockRejectedValueOnce(exitError);

    await expect(askAndSetOAuth()).rejects.toThrow('User cancelled');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle general errors and wrap them', async () => {
    const generalError = new Error('Network error');

    (inquirer.prompt as unknown as Mock).mockRejectedValueOnce(generalError);

    await expect(askAndSetOAuth()).rejects.toThrow(
      'Failed to set up OAuth: Network error',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error setting up OAuth:',
      generalError,
    );
  });

  it('should handle non-Error objects in catch block', async () => {
    (inquirer.prompt as unknown as Mock).mockRejectedValueOnce(
      'String error message',
    );

    await expect(askAndSetOAuth()).rejects.toThrow(
      'Failed to set up OAuth: String error message',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error setting up OAuth:',
      'String error message',
    );
  });

  it('should accept custom base URLs with valid URLs', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'https://custom-domain.com',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'custom-client-id',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'https://custom-domain.com/auth/callback',
    );
  });

  it('should use default base URL', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'test-id',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'http://localhost:4321/auth/callback',
    );
  });

  it('should remove trailing slash from base URL', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321/',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'test-id',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_REDIRECT_URI',
      'http://localhost:4321/auth/callback',
    );
  });
});

describe('validateClientId', () => {
  it('should return error message for empty string', () => {
    expect(validateClientId('', 'Google')).toBe(
      'Google Client ID cannot be empty.',
    );
  });

  it('should return error message for whitespace-only string', () => {
    expect(validateClientId('   ', 'Google')).toBe(
      'Google Client ID cannot be empty.',
    );
  });

  it('should return true for valid client ID', () => {
    expect(validateClientId('valid-id', 'Google')).toBe(true);
  });

  it('should work with different provider names', () => {
    expect(validateClientId('', 'GitHub')).toBe(
      'GitHub Client ID cannot be empty.',
    );
    expect(validateClientId('valid-id', 'GitHub')).toBe(true);
  });
});

describe('validateBaseUrl', () => {
  it('should return error message for empty string', () => {
    expect(validateBaseUrl('')).toBe('Base URL cannot be empty.');
  });

  it('should return error message for whitespace-only string', () => {
    expect(validateBaseUrl('   ')).toBe('Base URL cannot be empty.');
  });

  it('should return error message for invalid URL', () => {
    expect(validateBaseUrl('not-a-url')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
  });

  it('should return error message for URL with invalid protocol', () => {
    expect(validateBaseUrl('ftp://invalid.com/path')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
    expect(validateBaseUrl('file://path/to/file')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
  });

  it('should return true for valid http URL', () => {
    expect(validateBaseUrl('http://valid.com')).toBe(true);
    expect(validateBaseUrl('http://localhost:5173')).toBe(true);
  });

  it('should return true for valid https URL', () => {
    expect(validateBaseUrl('https://valid.com')).toBe(true);
    expect(validateBaseUrl('http://localhost:4321')).toBe(true);
  });

  it('should handle URLs with paths', () => {
    expect(validateBaseUrl('https://example.com/path')).toBe(true);
  });
});

describe('validate callbacks in configureProvider', () => {
  it('should call validate function for clientId with correct parameters', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockImplementationOnce(
        (
          questions: Array<{ validate?: (input: string) => boolean | string }>,
        ) => {
          // Test the validate callback for clientId
          const clientIdQuestion = questions.find(
            (q) => 'name' in q && q.name === 'clientId',
          );
          expect(clientIdQuestion).toBeDefined();

          if (clientIdQuestion?.validate) {
            // Test empty input
            expect(clientIdQuestion.validate('')).toBe(
              'Google Client ID cannot be empty.',
            );
            // Test whitespace input
            expect(clientIdQuestion.validate('   ')).toBe(
              'Google Client ID cannot be empty.',
            );
            // Test valid input
            expect(clientIdQuestion.validate('valid-client-id')).toBe(true);
          }

          return Promise.resolve({
            clientId: 'test-client-id',
          });
        },
      );

    await askAndSetOAuth();
  });

  it('should call validate function for GitHub with correct provider name', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        baseUrl: 'http://localhost:4321',
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockImplementationOnce(
        (
          questions: Array<{ validate?: (input: string) => boolean | string }>,
        ) => {
          // Test the validate callback for clientId with GitHub provider name
          const clientIdQuestion = questions.find(
            (q) => 'name' in q && q.name === 'clientId',
          );

          if (clientIdQuestion?.validate) {
            // Verify provider name is passed correctly
            expect(clientIdQuestion.validate('')).toBe(
              'GitHub Client ID cannot be empty.',
            );
            expect(clientIdQuestion.validate('valid-id')).toBe(true);
          }

          return Promise.resolve({
            clientId: 'test-client-id',
          });
        },
      );

    await askAndSetOAuth();
  });

  it('should validate base URL with correct validation function', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockImplementationOnce(
        (
          questions: Array<{ validate?: (input: string) => boolean | string }>,
        ) => {
          // Test the validate callback for base URL
          const baseUrlQuestion = questions.find(
            (q) => 'name' in q && q.name === 'baseUrl',
          );
          expect(baseUrlQuestion).toBeDefined();

          if (baseUrlQuestion?.validate) {
            // Test empty input
            expect(baseUrlQuestion.validate('')).toBe(
              'Base URL cannot be empty.',
            );
            // Test invalid URL
            expect(baseUrlQuestion.validate('not-a-url')).toBe(
              'Please enter a valid URL with http or https protocol.',
            );
            // Test valid URL
            expect(baseUrlQuestion.validate('http://localhost:4321')).toBe(
              true,
            );
          }

          return Promise.resolve({
            baseUrl: 'http://localhost:4321',
          });
        },
      )
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'test-client-id',
      });

    await askAndSetOAuth();
  });
});
