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

const isExitPromptError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'ExitPromptError'
  );
};

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

const askAndSetLogErrors = async (): Promise<void> => {
  try {
    const { shouldLogErrors } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldLogErrors',
      message:
        'Would you like to log Compiletime and Runtime errors in the console?',
      default: true,
    });

    updateEnvFile('ALLOW_LOGS', shouldLogErrors ? 'YES' : 'NO');
  } catch (error) {
    if (isExitPromptError(error)) {
      throw error;
    }
    console.error('Error setting up log configuration:', error);
    throw new Error(
      `Failed to set up log configuration: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

export async function main(): Promise<void> {
  try {
    if (!checkEnvFile()) {
      return;
    }

    console.log('\nWelcome to the Talawa Admin setup!\n');

    try {
      await backupEnvFile();
    } catch (error) {
      if (isExitPromptError(error)) {
        throw error;
      }
      console.error('Error backing up .env file:', error);
      throw new Error(
        `Failed to backup .env file: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    modifyEnvFile();

    try {
      await askAndSetDockerOption();
    } catch (error) {
      if (isExitPromptError(error)) {
        throw error;
      }
      console.error('Error setting up Docker option:', error);
      throw error;
    }

    const envFileContent = await fs.promises.readFile('.env', 'utf8');
    const envConfig = dotenv.parse(envFileContent);
    const useDocker = envConfig.USE_DOCKER === 'YES';

    try {
      if (useDocker) {
        await askAndUpdateTalawaApiUrl(useDocker);
      } else {
        await askAndUpdatePort();
        await askAndUpdateTalawaApiUrl(useDocker);
      }
    } catch (error) {
      if (isExitPromptError(error)) {
        throw error;
      }
      console.error('Error setting up Talawa API URL:', error);
      throw error;
    }

    await askAndSetRecaptcha();
    await askAndSetLogErrors();

    console.log('\nTalawa Admin setup completed successfully!\n');
  } catch (error) {
    if (isExitPromptError(error)) {
      console.log('\nSetup cancelled by user.\n');
      process.exit(130);
    }

    console.error('\nSetup failed:', error);
    console.error(
      '\nPlease try again or contact support if the issue persists.',
    );
    process.exit(1);
  }
}

main();
