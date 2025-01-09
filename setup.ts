import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './src/setup/askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './src/setup/updateEnvFile/updateEnvFile';
import askAndUpdatePort from './src/setup/askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './src/setup/askForDocker/askForDocker';

// Ask and set up reCAPTCHA
const askAndSetRecaptcha = async (): Promise<void> => {
  try {
    const { shouldUseRecaptcha } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldUseRecaptcha',
      message: 'Would you like to set up reCAPTCHA?',
      default: true,
    });

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

      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', recaptchaSiteKeyInput);
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

  if (shouldLogErrors) {
    updateEnvFile('ALLOW_LOGS', 'YES');
  }
};

// Main function to run the setup process
export async function main(): Promise<void> {
  try {
    console.log('Welcome to the Talawa Admin setup! 🚀');

    checkEnvFile();
    await askAndSetDockerOption();
    const envConfig = dotenv.parse(fs.readFileSync('.env', 'utf8'));
    const useDocker = envConfig.USE_DOCKER === 'YES';

    // Only run these commands if Docker is NOT used
    if (!useDocker) {
      await askAndUpdatePort();
      await askAndUpdateTalawaApiUrl();
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

main();
