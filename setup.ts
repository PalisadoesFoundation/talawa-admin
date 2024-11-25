import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkConnection } from './src/setup/checkConnection/checkConnection';
import { askForTalawaApiUrl } from './src/setup/askForTalawaApiUrl/askForTalawaApiUrl';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import { askForCustomPort } from './src/setup/askForCustomPort/askForCustomPort';
import { askForDocker } from 'setup/askForDocker/askForDocker';

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
// Function to update the docker environment file
const updateDockerEnvFile = (key: string, value: string): void => {
  const envFilePath = './.env';

  let envContent = '';
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf-8');
  }

  const lines = envContent.split('\n').filter(Boolean);
  const updatedContent = lines.map((line) =>
    line.startsWith(`${key}=`) ? `${key}=${value}` : line,
  );

  // Add the key if it doesn't exist
  if (!lines.some((line) => line.startsWith(`${key}=`))) {
    updatedContent.push(`${key}=${value}`);
  }

  fs.writeFileSync(envFilePath, updatedContent.join('\n'));
  console.log(`Updated .env file: ${key}=${value}`);
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
      'Would you like to set up a custom port for running talawa-admin without docker ?',
    default: true,
  });

  if (shouldSetCustomPortResponse) {
    const customPort = await askForCustomPort();
    if (customPort < 1024 || customPort > 65535) {
      throw new Error('Port must be between 1024 and 65535');
    }

    updateDockerEnvFile('PORT', String(customPort));
  }
};

// Generate Docker file
const generateDockerfile = (port: string): void => {
  const dockerfileContent = `
  # Stage 1: Build
  FROM node:20.10.0-alpine AS build
  
  # Set working directory
  WORKDIR /usr/src/app
  
  # Copy package files and install dependencies
  COPY package*.json ./ 
  RUN npm install
  
  # Copy source code and build
  COPY . . 
  RUN npm run build
  
  # Expose the specified port
  EXPOSE ${port}
  
  # Start the application
  CMD ["npm", "run", "serve"]
  `;

  fs.writeFileSync('Dockerfile', dockerfileContent);
  console.log(`Dockerfile generated successfully with port ${port}! 🚀`);
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
    updateDockerEnvFile('USE_DOCKER', 'YES');

    const dockerConfig = await askForDocker(); // Prompt for Docker configuration

    // Ensure Docker config is valid
    if (dockerConfig.dockerAppPort && dockerConfig.containerName) {
      generateDockerfile(dockerConfig.dockerAppPort);

      const defaultPort = dockerConfig.dockerAppPort;
      const containerName = dockerConfig.containerName;

      console.log(`
  ✨ **Next Steps**:
  1.  To build the Docker image, use:
     \`docker build -t ${containerName} .\`

  2. The default Docker application port is **${defaultPort}**. You can run the container with this default port using:
     \`docker run -d -p ${defaultPort}:${defaultPort} ${containerName}\`
  
  3. To use a custom port (e.g., 5000), you can override the default port by running:
     \`docker run -d -p 5000:${defaultPort} ${containerName}\`
  
  4. If you don’t specify a custom port, the default exposed port (4321) will be used.
  `);

      const dockerUrl = process.env.REACT_APP_TALAWA_URL?.replace(
        'localhost',
        'host.docker.internal',
      );

      if (dockerUrl) {
        updateDockerEnvFile('REACT_APP_DOCKER_TALAWA_URL', dockerUrl);
      } else {
        console.warn(
          '⚠️ Docker URL setup skipped as no Talawa API URL was provided.',
        );
      }
    } else {
      console.warn('⚠️ Docker setup incomplete due to missing configuration.');
    }
  } else {
    console.log('Setting up without Docker...');
    updateDockerEnvFile('USE_DOCKER', 'NO');
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
        throw new Error('Invalid URL protocol.Must be http or https');
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
    await askAndUpdatePort();
    await askAndUpdateTalawaApiUrl();
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
