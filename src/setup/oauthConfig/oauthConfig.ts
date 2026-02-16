import inquirer from 'inquirer';
import updateEnvFile from '../updateEnvFile/updateEnvFile';

const ENV_KEYS = {
  GOOGLE_CLIENT_ID: 'VITE_GOOGLE_CLIENT_ID',
  GOOGLE_REDIRECT_URI: 'VITE_GOOGLE_REDIRECT_URI',
  GITHUB_CLIENT_ID: 'VITE_GITHUB_CLIENT_ID',
  GITHUB_REDIRECT_URI: 'VITE_GITHUB_REDIRECT_URI',
} as const;

/**
 * Checks if an error is an ExitPromptError (user cancelled with CTRL+C)
 */
const isExitPromptError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name: string }).name === 'ExitPromptError';

/**
 * Prompts user to configure OAuth settings and updates the .env file.
 *
 * @remarks
 * This function handles the interactive setup for OAuth configuration:
 * - Asks if user wants to set up OAuth
 * - If yes, asks which OAuth provider(s) to set up (Google, GitHub, or both)
 * - For each selected provider, prompts for Client ID and Redirect URI
 * - Provides helpful instructions on where to obtain OAuth credentials
 * - Validates redirect URIs as proper URLs
 * - Updates the corresponding VITE_*_CLIENT_ID and VITE_*_REDIRECT_URI in .env
 *
 * @example
 * ```typescript
 * await askAndSetOAuth();
 * ```
 *
 * @returns `Promise<void>` - Resolves when configuration is complete.
 * @throws ExitPromptError - If user cancels the prompt.
 * @throws Error - If user input fails or environment update fails.
 */
async function askAndSetOAuth(): Promise<void> {
  try {
    // First ask if they want to setup OAuth at all
    const { shouldSetupOAuth } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldSetupOAuth',
        message: 'Do you want to set up OAuth?',
        default: false,
      },
    ]);

    if (!shouldSetupOAuth) {
      // Clear OAuth settings
      updateEnvFile(ENV_KEYS.GOOGLE_CLIENT_ID, '');
      updateEnvFile(ENV_KEYS.GOOGLE_REDIRECT_URI, '');
      updateEnvFile(ENV_KEYS.GITHUB_CLIENT_ID, '');
      updateEnvFile(ENV_KEYS.GITHUB_REDIRECT_URI, '');
      return;
    }

    // Then ask which providers to configure
    const { oauthProvider } = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'oauthProvider',
        message: 'Which OAuth providers would you like to configure?',
        choices: [
          { name: 'Google OAuth', value: 'google' },
          { name: 'GitHub OAuth', value: 'github' },
          { name: 'Both Google and GitHub', value: 'both' },
        ],
        default: 0,
      },
    ]);

    const setupGoogle = oauthProvider === 'google' || oauthProvider === 'both';
    const setupGitHub = oauthProvider === 'github' || oauthProvider === 'both';

    // Setup Google OAuth
    if (setupGoogle) {
      console.log('\n--- Google OAuth Configuration ---');
      console.log('Get your Google OAuth credentials from:');
      console.log('https://console.developers.google.com/apis/credentials');
      console.log('Make sure to:');
      console.log('1. Create OAuth 2.0 Client ID');
      console.log('2. Add your redirect URI to authorized redirect URIs');
      console.log();

      const googleAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'clientId',
          message: 'Enter your Google OAuth Client ID:',
          validate: (input: string) => {
            if (input.trim().length < 1) {
              return 'Google Client ID cannot be empty.';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'redirectUri',
          message: 'Enter your Google OAuth Redirect URI:',
          default: 'http://localhost:5173/user/oauth/google/callback',
          validate: (input: string) => {
            const trimmed = input.trim();
            if (trimmed.length < 1) {
              return 'Google Redirect URI cannot be empty.';
            }
            try {
              const url = new URL(trimmed);
              if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return 'Please enter a valid URL with http or https protocol.';
              }
              return true;
            } catch {
              return 'Please enter a valid URL with http or https protocol.';
            }
          },
        },
      ]);

      updateEnvFile(ENV_KEYS.GOOGLE_CLIENT_ID, googleAnswers.clientId.trim());
      updateEnvFile(
        ENV_KEYS.GOOGLE_REDIRECT_URI,
        googleAnswers.redirectUri.trim(),
      );
    } else {
      updateEnvFile(ENV_KEYS.GOOGLE_CLIENT_ID, '');
      updateEnvFile(ENV_KEYS.GOOGLE_REDIRECT_URI, '');
    }

    // Setup GitHub OAuth
    if (setupGitHub) {
      console.log('\n--- GitHub OAuth Configuration ---');
      console.log('Get your GitHub OAuth credentials from:');
      console.log('https://github.com/settings/developers');
      console.log('Make sure to:');
      console.log('1. Create a new OAuth App');
      console.log('2. Set the correct Authorization callback URL');
      console.log();

      const githubAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'clientId',
          message: 'Enter your GitHub OAuth Client ID:',
          validate: (input: string) => {
            if (input.trim().length < 1) {
              return 'GitHub Client ID cannot be empty.';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'redirectUri',
          message: 'Enter your GitHub OAuth Redirect URI:',
          default: 'http://localhost:5173/user/oauth/github/callback',
          validate: (input: string) => {
            const trimmed = input.trim();
            if (trimmed.length < 1) {
              return 'GitHub Redirect URI cannot be empty.';
            }
            try {
              const url = new URL(trimmed);
              if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return 'Please enter a valid URL with http or https protocol.';
              }
              return true;
            } catch {
              return 'Please enter a valid URL with http or https protocol.';
            }
          },
        },
      ]);

      updateEnvFile(ENV_KEYS.GITHUB_CLIENT_ID, githubAnswers.clientId.trim());
      updateEnvFile(
        ENV_KEYS.GITHUB_REDIRECT_URI,
        githubAnswers.redirectUri.trim(),
      );
    } else {
      updateEnvFile(ENV_KEYS.GITHUB_CLIENT_ID, '');
      updateEnvFile(ENV_KEYS.GITHUB_REDIRECT_URI, '');
    }

    console.log('\nOAuth provider configuration completed!');
  } catch (error) {
    if (isExitPromptError(error)) {
      throw error;
    }
    console.error('Error setting up OAuth:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to set up OAuth: ${errorMessage}`);
  }
}

export default askAndSetOAuth;
