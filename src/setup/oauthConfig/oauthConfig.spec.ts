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
  validateRedirectUri,
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
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'google-client-id-123',
        redirectUri: 'http://localhost:5173/user/oauth/google/callback',
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
      'http://localhost:5173/user/oauth/google/callback',
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
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'github-client-id-456',
        redirectUri: 'http://localhost:5173/user/oauth/github/callback',
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
      'http://localhost:5173/user/oauth/github/callback',
    );
  });

  it('should set up both Google and GitHub OAuth', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'both',
      })
      .mockResolvedValueOnce({
        clientId: 'google-client-id-123',
        redirectUri: 'https://example.com/auth/google',
      })
      .mockResolvedValueOnce({
        clientId: 'github-client-id-456',
        redirectUri: 'https://example.com/auth/github',
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
      'https://example.com/auth/google',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_CLIENT_ID',
      'github-client-id-456',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_REDIRECT_URI',
      'https://example.com/auth/github',
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
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'test-client-id',
        redirectUri: 'http://localhost:5173/callback',
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
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'test-client-id',
        redirectUri: 'http://localhost:5173/callback',
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

  it('should accept custom redirect URIs with valid URLs', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'custom-client-id',
        redirectUri: 'https://custom-domain.com/oauth/callback',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'https://custom-domain.com/oauth/callback',
    );
  });

  it('should use default redirect URI for Google', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'test-id',
        redirectUri: 'http://localhost:5173/user/oauth/google/callback',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GOOGLE_REDIRECT_URI',
      'http://localhost:5173/user/oauth/google/callback',
    );
  });

  it('should use default redirect URI for GitHub', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'test-id',
        redirectUri: 'http://localhost:5173/user/oauth/github/callback',
      });

    await askAndSetOAuth();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'VITE_GITHUB_REDIRECT_URI',
      'http://localhost:5173/user/oauth/github/callback',
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

describe('validateRedirectUri', () => {
  it('should return error message for empty string', () => {
    expect(validateRedirectUri('', 'Google')).toBe(
      'Google Redirect URI cannot be empty.',
    );
  });

  it('should return error message for whitespace-only string', () => {
    expect(validateRedirectUri('   ', 'Google')).toBe(
      'Google Redirect URI cannot be empty.',
    );
  });

  it('should return error message for invalid URL', () => {
    expect(validateRedirectUri('not-a-url', 'Google')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
  });

  it('should return error message for URL with invalid protocol', () => {
    expect(validateRedirectUri('ftp://invalid.com/path', 'Google')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
    expect(validateRedirectUri('file://path/to/file', 'GitHub')).toBe(
      'Please enter a valid URL with http or https protocol.',
    );
  });

  it('should return true for valid http URL', () => {
    expect(validateRedirectUri('http://valid.com/path', 'Google')).toBe(true);
    expect(
      validateRedirectUri('http://localhost:5173/callback', 'GitHub'),
    ).toBe(true);
  });

  it('should return true for valid https URL', () => {
    expect(validateRedirectUri('https://valid.com/path', 'Google')).toBe(true);
    expect(validateRedirectUri('https://github.com/callback', 'GitHub')).toBe(
      true,
    );
  });

  it('should work with different provider names', () => {
    expect(validateRedirectUri('', 'GitHub')).toBe(
      'GitHub Redirect URI cannot be empty.',
    );
    expect(validateRedirectUri('https://example.com/oauth', 'GitHub')).toBe(
      true,
    );
  });
});

describe('validate callbacks in configureProvider', () => {
  it('should call validate function for clientId with correct parameters', async () => {
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockImplementationOnce(
        (
          questions: Array<{ validate?: (input: string) => boolean | string }>,
        ) => {
          // Test the validate callback for clientId (line 117)
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

          // Test the validate callback for redirectUri (line 124)
          const redirectUriQuestion = questions.find(
            (q) => 'name' in q && q.name === 'redirectUri',
          );
          expect(redirectUriQuestion).toBeDefined();

          if (redirectUriQuestion?.validate) {
            // Test empty input
            expect(redirectUriQuestion.validate('')).toBe(
              'Google Redirect URI cannot be empty.',
            );
            // Test invalid URL
            expect(redirectUriQuestion.validate('not-a-url')).toBe(
              'Please enter a valid URL with http or https protocol.',
            );
            // Test valid URL
            expect(
              redirectUriQuestion.validate('https://example.com/callback'),
            ).toBe(true);
          }

          return Promise.resolve({
            clientId: 'test-client-id',
            redirectUri: 'https://example.com/callback',
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

          // Test the validate callback for redirectUri with GitHub provider name
          const redirectUriQuestion = questions.find(
            (q) => 'name' in q && q.name === 'redirectUri',
          );

          if (redirectUriQuestion?.validate) {
            // Verify provider name is passed correctly
            expect(redirectUriQuestion.validate('')).toBe(
              'GitHub Redirect URI cannot be empty.',
            );
            expect(
              redirectUriQuestion.validate('http://localhost:3000/callback'),
            ).toBe(true);
          }

          return Promise.resolve({
            clientId: 'test-client-id',
            redirectUri: 'http://localhost:3000/callback',
          });
        },
      );

    await askAndSetOAuth();
  });
});
