import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkConnection } from './src/setup/checkConnection/checkConnection';
import { askForTalawaApiUrl } from './src/setup/askForTalawaApiUrl/askForTalawaApiUrl';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import { askForCustomPort } from './src/setup/askForCustomPort/askForCustomPort';

// Update the .env file with new values
const updateEnvFile = (key: string, value: string): void => {
  const currentEnvContent = fs.readFileSync('.env', 'utf8');
  const keyRegex = new RegExp(`^${key}=.*$`, 'm');
  if (keyRegex.test(currentEnvContent)) {
    const updatedEnvContent = currentEnvContent.replace(
      keyRegex,
      `${key}=${value}`,
    );
    fs.writeFileSync('.env', updatedEnvContent, 'utf8');
  } else {
    fs.appendFileSync('.env', `\n${key}=${value}`, 'utf8');
  }
};

// Handle .env file creation or validation
const handleEnvFile = (): void => {
  if (!fs.existsSync('.env')) {
    fs.openSync('.env', 'w');
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    for (const key in config) {
      fs.appendFileSync('.env', `${key}=${config[key]}\n`);
    }
  } else {
    checkEnvFile();
  }
};

// Ask and update the custom port
const askAndUpdatePort = async (): Promise<void> => {
  const { shouldSetCustomPortResponse } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldSetCustomPortResponse',
    message: 'Would you like to set up a custom port?',
    default: true,
  });

  if (shouldSetCustomPortResponse) {
    const customPort = await askForCustomPort();
    updateEnvFile('PORT', String(customPort));
  }
};

// Ask and update the Talawa API URL
const askAndUpdateTalawaApiUrl = async (): Promise<void> => {
  const { shouldSetTalawaApiUrlResponse } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldSetTalawaApiUrlResponse',
    message: 'Would you like to set up Talawa API endpoint?',
    default: true,
  });

  if (shouldSetTalawaApiUrlResponse) {
    let endpoint = ' ';
    let isConnected = false;

    while (!isConnected) {
      endpoint = await askForTalawaApiUrl();
      const url = new URL(endpoint);
      isConnected = await checkConnection(url.origin);
    }

    updateEnvFile('REACT_APP_TALAWA_URL', endpoint);
    const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
    updateEnvFile('REACT_APP_BACKEND_WEBSOCKET_URL', websocketUrl);
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
  console.log('Welcome to the Talawa Admin setup! 🚀');

  handleEnvFile();

  await askAndUpdatePort();
  await askAndUpdateTalawaApiUrl();
  await askAndSetRecaptcha();
  await askAndSetLogErrors();

  console.log(
    '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉',
  );
}

main();
