import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkConnection } from './src/setup/checkConnection/checkConnection';
import { askForTalawaApiUrl } from './src/setup/askForTalawaApiUrl/askForTalawaApiUrl';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import { askForCustomPort } from './src/setup/askForCustomPort/askForCustomPort';
import { askForDocker } from './src/setup/askForDocker/askForDocker';

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
    message:
      'Would you like to set up a custom port for running Talawa Admin without Docker?',
    default: true,
  });

  if (shouldSetCustomPortResponse) {
    const customPort = await askForCustomPort();
    if (customPort < 1024 || customPort > 65535) {
      throw new Error('Port must be between 1024 and 65535');
    }

    updateEnvFile('PORT', String(customPort));
  }
};

// Function to manage Docker setup
const askAndSetDockerOption = async (): Promise<void> => {
  const { useDocker } = await inquirer.prompt({
    type: 'confirm',
    name: 'useDocker',
    message: 'Would you like to set up with Docker?',
    default: false,
  });

  if (useDocker) {
    console.log('Setting up with Docker...');
    updateEnvFile('USE_DOCKER', 'YES');
    const answers = await askForDocker();
    const DOCKER_PORT_NUMBER = answers;
    updateEnvFile('DOCKER_PORT', DOCKER_PORT_NUMBER);

    const DOCKER_NAME = 'talawa-admin';
    console.log(`
      
        Run the commands below after setup:-
              1. docker build -t ${DOCKER_NAME} .
              2. docker run -d -p ${DOCKER_PORT_NUMBER}:${DOCKER_PORT_NUMBER} ${DOCKER_NAME}
              
     `);
  } else {
    console.log('Setting up without Docker...');
    updateEnvFile('USE_DOCKER', 'NO');
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
    let endpoint = '';
    let isConnected = false;

    while (!isConnected) {
      endpoint = await askForTalawaApiUrl();
      const url = new URL(endpoint);
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid URL protocol. Must be http or https');
      }
      isConnected = await checkConnection(url.origin);
    }

    updateEnvFile('REACT_APP_TALAWA_URL', endpoint);
    const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
    try {
      new URL(websocketUrl);
    } catch {
      throw new Error('Invalid WebSocket URL generated');
    }
    updateEnvFile('REACT_APP_BACKEND_WEBSOCKET_URL', websocketUrl);
    if (endpoint.includes('localhost')) {
      const dockerUrl = endpoint.replace('localhost', 'host.docker.internal');
      updateEnvFile('REACT_APP_DOCKER_TALAWA_URL', dockerUrl);
    }
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

    handleEnvFile();
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
