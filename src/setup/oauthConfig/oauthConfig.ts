import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { ENV_KEYS, isExitPromptError } from 'setup/setup';

/**
 * Configuration object for setting up an OAuth provider.
 */
interface InterfaceOAuthProviderConfig {
  name: string;
  envClientId: string;
  envRedirectUri: string;
  defaultRedirectUri: string;
  credentialsUrl: string;
  instructions: string[];
}

/**
 * Configures a single OAuth provider by prompting for credentials and updating environment variables.
 *
 * @remarks
 * This function handles the configuration flow for a specific OAuth provider:
 * - Displays helpful instructions on where to obtain OAuth credentials
 * - Prompts for OAuth Client ID with validation (cannot be empty)
 * - Prompts for OAuth Redirect URI with validation (must be a valid http/https URL)
 * - Updates the corresponding environment variables in the .env file
 *
 * The function validates that:
 * - Client ID is not empty or whitespace-only
 * - Redirect URI is a valid URL with http or https protocol
 *
 * @param config - Configuration object for the OAuth provider containing:
 *   - name: Display name of the provider (e.g., "Google", "GitHub")
 *   - envClientId: Environment variable key for the client ID
 *   - envRedirectUri: Environment variable key for the redirect URI
 *   - defaultRedirectUri: Default value for the redirect URI prompt
 *   - credentialsUrl: URL where users can obtain OAuth credentials
 *   - instructions: Array of instruction strings to display to the user
 *
 * @example
 * ```typescript
 * await configureProvider({
 *   name: 'Google',
 *   envClientId: 'VITE_GOOGLE_CLIENT_ID',
 *   envRedirectUri: 'VITE_GOOGLE_REDIRECT_URI',
 *   defaultRedirectUri: 'http://localhost:5173/user/oauth/google/callback',
 *   credentialsUrl: 'https://console.developers.google.com/apis/credentials',
 *   instructions: [
 *     '1. Create OAuth 2.0 Client ID',
 *     '2. Add your redirect URI to authorized redirect URIs'
 *   ]
 * });
 * ```
 *
 * @returns `Promise<void>` - Resolves when provider configuration is complete and environment variables are updated.
 * @throws Error - If user input validation fails or environment file update fails.
 */
async function configureProvider(
  config: InterfaceOAuthProviderConfig,
): Promise<void> {
  console.log(`\n--- ${config.name} OAuth Configuration ---`);
  console.log(`Get your ${config.name} OAuth credentials from:`);
  console.log(config.credentialsUrl);
  console.log('Make sure to:');
  config.instructions.forEach((line) => {
    console.log(line);
  });
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientId',
      message: `Enter your ${config.name} OAuth Client ID:`,
      validate: (input: string) =>
        input.trim().length > 0 || `${config.name} Client ID cannot be empty.`,
    },
    {
      type: 'input',
      name: 'redirectUri',
      message: `Enter your ${config.name} OAuth Redirect URI:`,
      default: config.defaultRedirectUri,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) return `${config.name} Redirect URI cannot be empty.`;
        try {
          const url = new URL(trimmed);
          if (url.protocol !== 'http:' && url.protocol !== 'https:')
            return 'Please enter a valid URL with http or https protocol.';
          return true;
        } catch {
          return 'Please enter a valid URL with http or https protocol.';
        }
      },
    },
  ]);

  updateEnvFile(config.envClientId, answers.clientId.trim());
  updateEnvFile(config.envRedirectUri, answers.redirectUri.trim());
}

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
      await configureProvider({
        name: 'Google',
        envClientId: ENV_KEYS.GOOGLE_CLIENT_ID,
        envRedirectUri: ENV_KEYS.GOOGLE_REDIRECT_URI,
        defaultRedirectUri: 'http://localhost:5173/user/oauth/google/callback',
        credentialsUrl:
          'https://console.developers.google.com/apis/credentials',
        instructions: [
          '1. Create OAuth 2.0 Client ID',
          '2. Add your redirect URI to authorized redirect URIs',
        ],
      });
    } else {
      updateEnvFile(ENV_KEYS.GOOGLE_CLIENT_ID, '');
      updateEnvFile(ENV_KEYS.GOOGLE_REDIRECT_URI, '');
    }

    // Setup GitHub OAuth
    if (setupGitHub) {
      await configureProvider({
        name: 'GitHub',
        envClientId: ENV_KEYS.GITHUB_CLIENT_ID,
        envRedirectUri: ENV_KEYS.GITHUB_REDIRECT_URI,
        defaultRedirectUri: 'http://localhost:5173/user/oauth/github/callback',
        credentialsUrl: 'https://github.com/settings/developers',
        instructions: [
          '1. Go to GitHub Developer Settings > OAuth Apps',
          '2. Register a new application with the callback URL',
        ],
      });
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
