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

// Helper to extract error message safely
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error === undefined) {
    return 'undefined';
  }
  if (error === null) {
    return 'null';
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

// Ask and set up reCAPTCHA
export const askAndSetRecaptcha = async (): Promise<void> => {
  try {
    const { shouldUseRecaptcha } = await inquirer.prompt<{
      shouldUseRecaptcha: boolean;
    }>([
      {
        type: 'confirm',
        name: 'shouldUseRecaptcha',
        message: 'Would you like to set up reCAPTCHA?',
        default: true,
      },
    ]);

    updateEnvFile('REACT_APP_USE_RECAPTCHA', shouldUseRecaptcha ? 'YES' : 'NO');

    if (shouldUseRecaptcha) {
      const { recaptchaSiteKeyInput } = await inquirer.prompt<{
        recaptchaSiteKeyInput: string;
      }>([
        {
          type: 'input',
          name: 'recaptchaSiteKeyInput',
          message: 'Enter your reCAPTCHA site key:',
          validate: (input: string) => {
            try {
              const isValid = validateRecaptcha(input);
              if (isValid) {
                return true;
              }
              return 'Invalid reCAPTCHA site key. Please try again.';
            } catch (err) {
              return `Validation error: ${getErrorMessage(err)}`;
            }
          },
        },
      ]);
      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', recaptchaSiteKeyInput);
    } else {
      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', '');
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    throw new Error(`Failed to set up reCAPTCHA: ${getErrorMessage(error)}`);
  }
};

// Ask and set up logging errors in the console
export const askAndSetLogErrors = async (): Promise<void> => {
  try {
    const { shouldLogErrors } = await inquirer.prompt<{
      shouldLogErrors: boolean;
    }>({
      type: 'confirm',
      name: 'shouldLogErrors',
      message:
        'Would you like to log Compiletime and Runtime errors in the console?',
      default: true,
    });

    updateEnvFile('ALLOW_LOGS', shouldLogErrors ? 'YES' : 'NO');
  } catch (error) {
    console.error('Error setting up logging:', error);
    throw new Error(`Failed to set up logging: ${getErrorMessage(error)}`);
  }
};

// Main function to run the setup process
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
    console.error('\n❌ Setup failed:', error);
    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  }
}