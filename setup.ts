import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkConnection } from './src/setup/checkConnection/checkConnection';
import { askForTalawaApiUrl } from './src/setup/askForTalawaApiUrl/askForTalawaApiUrl';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './src/setup/askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './src/setup/updateEnvFile/updateEnvFile';
import askAndUpdatePort from './src/setup/askAndUpdatePort/askAndUpdatePort';

// Ask and update the Talawa API URL
const askAndUpdateTalawaApiUrl = async (): Promise<void> => {
  try {
    const { shouldSetTalawaApiUrlResponse } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldSetTalawaApiUrlResponse',
      message: 'Would you like to set up Talawa API endpoint?',
      default: true,
    });

    if (shouldSetTalawaApiUrlResponse) {
      let endpoint = '';
      let isConnected = false;

      while (!isConnected) {
        try {
          endpoint = await askForTalawaApiUrl();
          const url = new URL(endpoint);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol. Must be http or https');
          }
          isConnected = await checkConnection(url.origin);
        } catch (error) {
          console.error('Error checking connection:', error);
          isConnected = false;
        }
      }
      updateEnvFile('REACT_APP_TALAWA_URL', endpoint);
      const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
      try {
        const wsUrl = new URL(websocketUrl);
        if (!['ws:', 'wss:'].includes(wsUrl.protocol)) {
          throw new Error('Invalid WebSocket protocol');
        }
        updateEnvFile('REACT_APP_BACKEND_WEBSOCKET_URL', websocketUrl);
      } catch (error) {
        throw new Error(`Invalid WebSocket URL generated: ${error}`);
      }

      if (endpoint.includes('localhost')) {
        const dockerUrl = endpoint.replace('localhost', 'host.docker.internal');
        updateEnvFile('REACT_APP_DOCKER_TALAWA_URL', dockerUrl);
      }
    }
  } catch (error) {
    console.error('Error setting up Talawa API URL:', error);
  }
};

// Ask and set up reCAPTCHA
const askAndSetRecaptcha = async (): Promise<void> => {
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
    if (useDocker) {
      console.log(' ');
    } else {
      console.log('Setting up Talawa Admin without Docker...');
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
