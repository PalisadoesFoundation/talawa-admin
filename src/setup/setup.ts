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

const isExitPromptError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name: string }).name === 'ExitPromptError';

// Ask and set up reCAPTCHA
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

    updateEnvFile('REACT_APP_USE_RECAPTCHA', shouldUseRecaptcha ? 'YES' : 'NO');

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

      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', recaptchaSiteKeyInput);
    } else {
      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', '');
    }
  } catch (error) {
    if (isExitPromptError(error)) {
      throw error;
    }
    console.error('Error setting up reCAPTCHA:', error);
    throw new Error(
      `Failed to set up reCAPTCHA: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
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

  updateEnvFile('ALLOW_LOGS', shouldLogErrors ? 'YES' : 'NO');
};

// Main function to run the setup process
export async function main(): Promise<void> {
  // Handle user cancellation (CTRL+C)
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
      return;
    }

    console.log('Welcome to the Talawa Admin setup! 🚀');

    await backupEnvFile();
    modifyEnvFile();
    await askAndSetDockerOption();

    // Use async file read instead of sync
    const envFileContent = await fs.promises.readFile('.env', 'utf8');
    const envConfig = dotenv.parse(envFileContent);
    const useDocker = envConfig.USE_DOCKER === 'YES';

    if (useDocker) {
      await askAndUpdateTalawaApiUrl(useDocker);
    } else {
      await askAndUpdatePort();
      await askAndUpdateTalawaApiUrl(useDocker);
    }

    await askAndSetRecaptcha();
    await askAndSetLogErrors();

    console.log(
      '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉',
    );
  } catch (error) {
    if (isExitPromptError(error)) {
      process.exit(130);
    }

    console.error('\n❌ Setup failed:', error);
    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  } finally {
    process.removeListener('SIGINT', sigintHandler);
  }
}

main();
