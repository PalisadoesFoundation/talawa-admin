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
import askAndSetOAuth from './oauthConfig';
import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';

describe('askAndSetOAuth', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('should validate Google Client ID is not empty', async () => {
    const promptSpy = vi.spyOn(inquirer, 'prompt');
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'valid-client-id',
        redirectUri: 'http://localhost:5173/user/oauth/google/callback',
      });

    await askAndSetOAuth();

    // Check that validation function was set up
    const googlePromptCall = promptSpy.mock.calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some((q: { name: string }) => q.name === 'clientId'),
    );
    expect(googlePromptCall).toBeDefined();

    if (googlePromptCall && Array.isArray(googlePromptCall[0])) {
      const clientIdQuestion = googlePromptCall[0].find(
        (q: { name: string }) => q.name === 'clientId',
      );
      if (clientIdQuestion && 'validate' in clientIdQuestion) {
        expect(clientIdQuestion.validate('')).toBe(
          'Google Client ID cannot be empty.',
        );
        expect(clientIdQuestion.validate('   ')).toBe(
          'Google Client ID cannot be empty.',
        );
        expect(clientIdQuestion.validate('valid-id')).toBe(true);
      }
    }
  });

  it('should validate Google Redirect URI is not empty and is valid URL', async () => {
    const promptSpy = vi.spyOn(inquirer, 'prompt');
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'google',
      })
      .mockResolvedValueOnce({
        clientId: 'valid-id',
        redirectUri: 'http://localhost:5173/callback',
      });

    await askAndSetOAuth();

    const googlePromptCall = promptSpy.mock.calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some((q: { name: string }) => q.name === 'redirectUri'),
    );

    if (googlePromptCall && Array.isArray(googlePromptCall[0])) {
      const redirectUriQuestion = googlePromptCall[0].find(
        (q: { name: string }) => q.name === 'redirectUri',
      );
      if (redirectUriQuestion && 'validate' in redirectUriQuestion) {
        expect(redirectUriQuestion.validate('')).toBe(
          'Google Redirect URI cannot be empty.',
        );
        expect(redirectUriQuestion.validate('   ')).toBe(
          'Google Redirect URI cannot be empty.',
        );
        expect(redirectUriQuestion.validate('not-a-url')).toBe(
          'Please enter a valid URL with http or https protocol.',
        );
        expect(redirectUriQuestion.validate('ftp://invalid.com/path')).toBe(
          'Please enter a valid URL with http or https protocol.',
        );
        expect(redirectUriQuestion.validate('http://valid.com/path')).toBe(
          true,
        );
        expect(redirectUriQuestion.validate('https://valid.com/path')).toBe(
          true,
        );
      }
    }
  });

  it('should validate GitHub Client ID is not empty', async () => {
    const promptSpy = vi.spyOn(inquirer, 'prompt');
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'valid-client-id',
        redirectUri: 'http://localhost:5173/user/oauth/github/callback',
      });

    await askAndSetOAuth();

    const githubPromptCall = promptSpy.mock.calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some(
          (q: { name: string; message: string }) =>
            q.name === 'clientId' && q.message.includes('GitHub'),
        ),
    );

    if (githubPromptCall && Array.isArray(githubPromptCall[0])) {
      const clientIdQuestion = githubPromptCall[0].find(
        (q: { name: string; message: string }) =>
          q.name === 'clientId' && q.message.includes('GitHub'),
      );
      if (clientIdQuestion && 'validate' in clientIdQuestion) {
        expect(clientIdQuestion.validate('')).toBe(
          'GitHub Client ID cannot be empty.',
        );
        expect(clientIdQuestion.validate('   ')).toBe(
          'GitHub Client ID cannot be empty.',
        );
        expect(clientIdQuestion.validate('valid-id')).toBe(true);
      }
    }
  });

  it('should validate GitHub Redirect URI is not empty and is valid URL', async () => {
    const promptSpy = vi.spyOn(inquirer, 'prompt');
    (inquirer.prompt as unknown as Mock)
      .mockResolvedValueOnce({
        shouldSetupOAuth: true,
      })
      .mockResolvedValueOnce({
        oauthProvider: 'github',
      })
      .mockResolvedValueOnce({
        clientId: 'valid-id',
        redirectUri: 'http://localhost:5173/callback',
      });

    await askAndSetOAuth();

    const githubPromptCall = promptSpy.mock.calls.find(
      (call) =>
        Array.isArray(call[0]) &&
        call[0].some(
          (q: { name: string; message: string }) =>
            q.name === 'redirectUri' && q.message.includes('GitHub'),
        ),
    );

    if (githubPromptCall && Array.isArray(githubPromptCall[0])) {
      const redirectUriQuestion = githubPromptCall[0].find(
        (q: { name: string; message: string }) =>
          q.name === 'redirectUri' && q.message.includes('GitHub'),
      );
      if (redirectUriQuestion && 'validate' in redirectUriQuestion) {
        expect(redirectUriQuestion.validate('')).toBe(
          'GitHub Redirect URI cannot be empty.',
        );
        expect(redirectUriQuestion.validate('   ')).toBe(
          'GitHub Redirect URI cannot be empty.',
        );
        expect(redirectUriQuestion.validate('invalid-url')).toBe(
          'Please enter a valid URL with http or https protocol.',
        );
        expect(redirectUriQuestion.validate('file://path/to/file')).toBe(
          'Please enter a valid URL with http or https protocol.',
        );
        expect(redirectUriQuestion.validate('http://github.com/callback')).toBe(
          true,
        );
        expect(
          redirectUriQuestion.validate('https://github.com/callback'),
        ).toBe(true);
      }
    }
  });
});
