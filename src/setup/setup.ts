import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import { backupEnvFile } from './backupEnvFile/backupEnvFile';
import { pathToFileURL } from 'url';

/**
 * Environment variable value constants
 */
export const ENV_VALUES = {
  YES: 'YES',
  NO: 'NO',
} as const;

/**
 * Environment variable key names used by the setup script
 */
export const ENV_KEYS = {
  USE_RECAPTCHA: 'REACT_APP_USE_RECAPTCHA',
  RECAPTCHA_SITE_KEY: 'REACT_APP_RECAPTCHA_SITE_KEY',
  ALLOW_LOGS: 'ALLOW_LOGS',
  USE_DOCKER: 'USE_DOCKER',
  TALAWA_URL: 'REACT_APP_TALAWA_URL',
  BACKEND_WEBSOCKET_URL: 'REACT_APP_BACKEND_WEBSOCKET_URL',
} as const;

const isExitPromptError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name: string }).name === 'ExitPromptError';

/**
 * Prompts user to configure reCAPTCHA settings and updates the .env file.
 *
 * @remarks
 * This function handles the interactive setup for reCAPTCHA configuration:
 * - Asks whether to enable reCAPTCHA protection
 * - If enabled, prompts for and validates the site key
 * - Updates REACT_APP_USE_RECAPTCHA and REACT_APP_RECAPTCHA_SITE_KEY in .env
 *
 * @example
 * ```typescript
 * await askAndSetRecaptcha();
 * ```
 *
 * @returns `Promise<void>` - Resolves when configuration is complete.
 * @throws ExitPromptError - If user cancels the prompt.
 * @throws Error - If user input fails or environment update fails.
 */
export const askAndSetRecaptcha = async (): Promise<void> => {
  try {
    const { shouldUseRecaptcha } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldUseRecaptcha',
        message: 'Would you like to set up reCAPTCHA?',
        default: true,
      },
    ]);

    updateEnvFile(
      ENV_KEYS.USE_RECAPTCHA,
      shouldUseRecaptcha ? ENV_VALUES.YES : ENV_VALUES.NO,
    );

    if (shouldUseRecaptcha) {
      const { recaptchaSiteKeyInput } = await inquirer.prompt([
        {
          type: 'input',
          name: 'recaptchaSiteKeyInput',
          message: 'Enter your reCAPTCHA site key:',
          validate: (input: string): boolean | string =>
            validateRecaptcha(input) ||
            'Invalid reCAPTCHA site key. Please try again.',
        },
      ]);

      updateEnvFile(ENV_KEYS.RECAPTCHA_SITE_KEY, recaptchaSiteKeyInput);
    } else {
      updateEnvFile(ENV_KEYS.RECAPTCHA_SITE_KEY, '');
    }
  } catch (error) {
    if (isExitPromptError(error)) {
      throw error;
    }
    console.error('Error setting up reCAPTCHA:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to set up reCAPTCHA: ${errorMessage}`);
  }
};

/**
 * Prompts user to configure error logging settings and updates the .env file.
 *
 * @remarks
 * This function handles the interactive setup for error logging configuration:
 * - Asks whether to enable compile-time and runtime error logging
 * - Updates ALLOW_LOGS in .env based on user choice
 *
 * @example
 * ```typescript
 * await askAndSetLogErrors();
 * ```
 *
 * @returns `Promise<void>` - Resolves when configuration is complete.
 * @throws Error - If user input fails or environment update fails.
 */
export const askAndSetLogErrors = async (): Promise<void> => {
  const { shouldLogErrors } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldLogErrors',
    message:
      'Would you like to log Compiletime and Runtime errors in the console?',
    default: true,
  });

  updateEnvFile(
    ENV_KEYS.ALLOW_LOGS,
    shouldLogErrors ? ENV_VALUES.YES : ENV_VALUES.NO,
  );
};

/**
 * Main setup orchestrator for Talawa Admin initial configuration.
 *
 * @remarks
 * Executes the following steps in order:
 * 1. Validates .env file existence
 * 2. Creates backup of existing .env
 * 3. Configures Docker options
 * 4. Sets up port (if not using Docker) and API URL
 * 5. Configures reCAPTCHA settings
 * 6. Configures error logging preferences
 *
 * If any step fails, exits with error code 1.
 * Can be cancelled with CTRL+C (exits with code 130).
 *
 * @example
 * ```typescript
 * // When run directly:
 * // node setup.ts
 *
 * // When imported for testing:
 * import { main } from './setup';
 * await main();
 * ```
 *
 * @returns `Promise<void>` - A promise that resolves when setup completes successfully.
 * @throws Error - if any setup step fails.
 */
export async function main(): Promise<void> {
  // Handle user cancellation (CTRL+C)
  let backupPath: string | null = null;
  const sigintHandler = (): void => {
    console.log('\n\n⚠️  Setup cancelled by user.');
    console.log(
      'Configuration may be incomplete. Run setup again to complete.',
    );
    process.exit(130);
  };

  process.on('SIGINT', sigintHandler);

  try {
    if (!checkEnvFile()) {
      console.error(
        '❌ Environment file check failed. Please ensure .env exists.',
      );
      throw new Error(
        'Environment file check failed. Please ensure .env exists.',
      );
    }

    console.log('Welcome to the Talawa Admin setup! 🚀');

    backupPath = await backupEnvFile();
    modifyEnvFile();
    await askAndSetDockerOption();

    // Use async file read instead of sync
    const envFileContent = await fs.promises.readFile('.env', 'utf8');
    const envConfig = dotenv.parse(envFileContent);
    const useDocker =
      (envConfig[ENV_KEYS.USE_DOCKER] ?? '').toUpperCase() === ENV_VALUES.YES;

    // Ask for port only when NOT using Docker
    if (!useDocker) {
      await askAndUpdatePort();
    }

    // Always ask for API URL (behavior differs based on useDocker flag)
    await askAndUpdateTalawaApiUrl(useDocker);

    await askAndSetRecaptcha();
    await askAndSetLogErrors();

    console.log(
      '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉',
    );
  } catch (error) {
    if (isExitPromptError(error)) {
      console.log('\n\n⚠️  Setup cancelled by user.');
      process.exit(130);
    }

    console.error('\n❌ Setup failed:', error);
    if (backupPath) {
      console.log('🔄 Attempting to restore from backup...');
      try {
        fs.copyFileSync(backupPath, '.env');
        console.log('✅ Configuration restored from backup.');
      } catch (restoreError) {
        console.error('❌ Failed to restore backup:', restoreError);
        console.log(`Manual restore needed. Backup location: ${backupPath}`);
      }
    }

    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  } finally {
    process.removeListener('SIGINT', sigintHandler);
  }
}
/* v8 ignore next 3 */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
