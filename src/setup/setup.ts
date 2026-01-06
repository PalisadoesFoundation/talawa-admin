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

/**
 * Environment variable value constants
 */
const ENV_VALUES = {
  YES: "YES",
  NO: "NO",
} as const;

/**
 * Environment variable key names
 */
const ENV_KEYS = {
  USE_RECAPTCHA: "REACT_APP_USE_RECAPTCHA",
  RECAPTCHA_SITE_KEY: "REACT_APP_RECAPTCHA_SITE_KEY",
  ALLOW_LOGS: "ALLOW_LOGS",
  USE_DOCKER: "USE_DOCKER",
  TALAWA_URL: "REACT_APP_TALAWA_URL",
  BACKEND_WEBSOCKET_URL: "REACT_APP_BACKEND_WEBSOCKET_URL",
} as const;

/**
 * Prompts user to configure reCAPTCHA settings and updates .env file.
 * 
 * Asks whether to enable reCAPTCHA and, if yes, validates and stores the site key.
 * Updates REACT_APP_USE_RECAPTCHA and REACT_APP_RECAPTCHA_SITE_KEY in .env.
 * 
 * @throws {Error} If user input fails or environment update fails
 * @returns {Promise<void>}
 * 
 * @example
 * await askAndSetRecaptcha();
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
          validate: (input: string): boolean | string => {
            return (
              validateRecaptcha(input) ||
              'Invalid reCAPTCHA site key. Please try again.'
            );
          },
        },
      ]);

      updateEnvFile(ENV_KEYS.RECAPTCHA_SITE_KEY, recaptchaSiteKeyInput);
    } else {
      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', '');
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    throw new Error(`Failed to set up reCAPTCHA: ${(error as Error).message}`);
  }
};

// Ask and set up logging errors in the console
const askAndSetLogErrors = async (): Promise<void> => {
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
 * Executes the following steps in order:
 * 1. Validates .env file existence
 * 2. Creates backup of existing .env
 * 3. Configures Docker options
 * 4. Sets up port (if not using Docker) and API URL
 * 5. Configures reCAPTCHA settings
 * 6. Configures error logging preferences
 * 
 * If any step fails, attempts to restore from backup and exits with error code 1.
 * Can be cancelled with CTRL+C (exits with code 130).
 * 
 * @throws {Error} If any setup step fails
 * @returns {Promise<void>}
 * 
 * @example
 * // When run directly:
 * // node setup.ts
 * 
 * // When imported for testing:
 * import { main } from './setup';
 * await main();
 */
export async function main(): Promise<void> {
  try {
    if (!checkEnvFile()) {
      return;
    }

    console.log('Welcome to the Talawa Admin setup! 🚀');

    await backupEnvFile();

    modifyEnvFile();
    await askAndSetDockerOption();
    const envConfig = dotenv.parse(fs.readFileSync('.env', 'utf8'));
    const useDocker = envConfig[ENV_KEYS.USE_DOCKER] === ENV_VALUES.YES;

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
    console.error('\n❌ Setup failed:', error);
    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  }
}

main();
