import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile, { writeEnvParameter } from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';

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

      writeEnvParameter('REACT_APP_USE_RECAPTCHA', 'yes', 'Enable or disable reCAPTCHA protection');
      writeEnvParameter('REACT_APP_RECAPTCHA_SITE_KEY', recaptchaSiteKeyInput, 'Your reCAPTCHA site key for frontend validation');
    } else {
      writeEnvParameter('REACT_APP_USE_RECAPTCHA', 'no', 'Enable or disable reCAPTCHA protection');
      writeEnvParameter('REACT_APP_RECAPTCHA_SITE_KEY', '', 'Your reCAPTCHA site key for frontend validation');
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    throw new Error(`Failed to set up reCAPTCHA: ${(error as Error).message}`);
  }
};

const askAndSetLogErrors = async (): Promise<void> => {
  const { shouldLogErrors } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldLogErrors',
    message: 'Would you like to log Compiletime and Runtime errors in the console?',
    default: true,
  });

  writeEnvParameter('ALLOW_LOGS', shouldLogErrors ? 'YES' : 'NO', 'Enable or disable error logging in console');
};

export async function main(): Promise<void> {
  try {
    if (!checkEnvFile()) return;

    console.log('Welcome to the Talawa Admin setup! 🚀');

    modifyEnvFile();
    await askAndSetDockerOption();

    const envConfig = dotenv.parse(fs.readFileSync('.env', 'utf8'));
    const useDocker = envConfig.USE_DOCKER === 'YES';

    if (useDocker) {
      const { dockerApiUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'dockerApiUrl',
          message: 'Enter the Talawa API URL for Docker environment:',
          default: 'http://host.docker.internal:4000/graphql',
          validate: (input: string) => {
            try {
              const url = new URL(input);
              if (!['http:', 'https:'].includes(url.protocol)) {
                return 'Please enter a valid URL.';
              }
              if (!url.hostname) {
                return 'Please enter a valid URL.';
              }
              return true;
            } catch {
              return 'Please enter a valid URL.';
            }
          },
        },
      ]);

      // Clear non-Docker env vars when using Docker
      writeEnvParameter(
        'REACT_APP_TALAWA_URL',
        '',
        'Talawa API GraphQL endpoint URL'
      );
      writeEnvParameter(
        'REACT_APP_BACKEND_WEBSOCKET_URL',
        '',
        'WebSocket URL for real-time communication'
      );

      // Write Docker-specific env var
      writeEnvParameter(
        'REACT_APP_DOCKER_TALAWA_URL',
        dockerApiUrl,
        'Talawa API URL for Docker environment'
      );
    } else {
      // Clear Docker env var when not using Docker
      writeEnvParameter(
        'REACT_APP_DOCKER_TALAWA_URL',
        '',
        'Talawa API URL for Docker environment'
      );

      await askAndUpdatePort();
      await askAndUpdateTalawaApiUrl();
    }

    await askAndSetRecaptcha();
    await askAndSetLogErrors();

    console.log('\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  }
}

// Make the module import-safe by guarding the call
if (process.env.NODE_ENV !== 'test') {
  main();
}