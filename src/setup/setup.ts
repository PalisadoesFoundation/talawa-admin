import inquirer from 'inquirer';
import { checkEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import * as utils from './utils';
import { backupEnvFile } from './backupEnvFile/backupEnvFile';

// Ask and set up reCAPTCHA
export const askForRecaptcha = async (): Promise<{
  useRecaptcha: 'yes' | 'no';
  recaptchaSiteKey?: string;
}> => {
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
        validate: (input: string): boolean | string => {
          return (
            validateRecaptcha(input) ||
            'Invalid reCAPTCHA site key. Please try again.'
          );
        },
      },
    ]);
    return {
      useRecaptcha: 'yes',
      recaptchaSiteKey: recaptchaSiteKeyInput,
    };
  }

  return { useRecaptcha: 'no' };
};

// Ask and set up logging errors in the console
export const askForLogErrors = async (): Promise<'yes' | 'no'> => {
  const { shouldLogErrors } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldLogErrors',
    message:
      'Would you like to log Compiletime and Runtime errors in the console?',
    default: true,
  });
  return shouldLogErrors ? 'yes' : 'no';
};

// Ask if using Docker
export const askForDocker = async (): Promise<boolean> => {
  const { useDocker } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Are you using Docker for development?',
      default: false,
    },
  ]);
  return useDocker;
};

// Main function to run the setup process
export async function main(): Promise<void> {
  try {
    if (!checkEnvFile()) {
      return;
    }

    console.log('Welcome to the Talawa Admin setup! 🚀');

    await backupEnvFile();

    const config: Record<string, string> = {};

    // ---- Docker Config ----
    const useDocker = await askForDocker();
    config.USE_DOCKER = useDocker ? 'YES' : 'NO';

    if (useDocker) {
      const { dockerPort } = await inquirer.prompt([
        {
          type: 'input',
          name: 'dockerPort',
          message: 'Enter the port to expose when running in Docker:',
          default: '4321',
        },
      ]);
      config.DOCKER_PORT = dockerPort;
      config.REACT_APP_DOCKER_TALAWA_URL =
        'http://host.docker.internal:4000/graphql';
      config.REACT_APP_DOCKER_BACKEND_WEBSOCKET_URL =
        'ws://host.docker.internal:4000/graphql';
    } else {
      config.PORT = '4321';
      const talawaApiUrl = 'http://localhost:4000/graphql';
      config.REACT_APP_TALAWA_URL = talawaApiUrl;
      config.REACT_APP_BACKEND_WEBSOCKET_URL = talawaApiUrl.replace(
        'http',
        'ws',
      );
    }

    // ---- reCAPTCHA Config ----
    const recaptchaSettings = await askForRecaptcha();
    config.REACT_APP_USE_RECAPTCHA = recaptchaSettings.useRecaptcha;
    if (recaptchaSettings.useRecaptcha === 'yes') {
      config.REACT_APP_RECAPTCHA_SITE_KEY =
        recaptchaSettings.recaptchaSiteKey || '';
    }

    // ---- Logging Config ----
    config.ALLOW_LOGS = await askForLogErrors();

    // ---- Save Env ----
    utils.updateEnvFile(config);

    console.log(
      '\n✅ Talawa Admin has been successfully set up! 🎉\nAll configuration parameters have been added to your .env file.',
    );
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('Please try again or contact support if the issue persists.');
    process.exit(1);
  }
}

// Run setup only when not in a test environment
if (process.env.NODE_ENV !== 'test') {
  main();
}
