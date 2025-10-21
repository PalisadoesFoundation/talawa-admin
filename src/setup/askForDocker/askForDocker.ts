import inquirer from 'inquirer';
import { askForTalawaApiUrl } from '../askForTalawaApiUrl/askForTalawaApiUrl';
import { writeEnvParameter } from '../updateEnvFile/updateEnvFile';
import { checkConnection } from '../checkConnection/checkConnection';

export const askForDocker = async (): Promise<string> => {
  const answers = await inquirer.prompt<{ dockerAppPort: string }>([
    {
      type: 'input',
      name: 'dockerAppPort',
      message: 'Enter the port to expose Docker (default: 4321):',
      default: '4321',
      validate: (input: string) => {
        const port = Number(input);
        if (Number.isNaN(port) || port < 1024 || port > 65535) {
          return 'Please enter a valid port number between 1024 and 65535';
        }
        return true;
      },
    },
  ]);

  return answers.dockerAppPort;
};

export const askAndUpdateTalawaApiUrl = async (): Promise<void> => {
  try {
    const { shouldSetTalawaApiUrlResponse } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldSetTalawaApiUrlResponse',
        message: 'Would you like to set up Talawa API endpoint?',
        default: true,
      },
    ]);

    if (shouldSetTalawaApiUrlResponse) {
      let endpoint = '';
      let isConnected = false;
      let retryCount = 0;
      const MAX_RETRIES = 3;
      
      while (!isConnected && retryCount < MAX_RETRIES) {
        try {
          endpoint = await askForTalawaApiUrl();
          const url = new URL(endpoint);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol. Must be http or https');
          }
          isConnected = await checkConnection(endpoint);
          if (!isConnected) {
            console.log(
              `Connection attempt ${retryCount + 1}/${MAX_RETRIES} failed`,
            );
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          isConnected = false;
        }
        retryCount++;
      }
      
      if (!isConnected) {
        throw new Error(
          'Failed to establish connection after maximum retry attempts',
        );
      }
      
      writeEnvParameter(
        'REACT_APP_TALAWA_URL',
        endpoint,
        'Talawa API GraphQL endpoint URL'
      );
      
      const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
      try {
        const wsUrl = new URL(websocketUrl);
        if (!['ws:', 'wss:'].includes(wsUrl.protocol)) {
          throw new Error('Invalid WebSocket protocol');
        }
        writeEnvParameter(
          'REACT_APP_BACKEND_WEBSOCKET_URL',
          websocketUrl,
          'WebSocket URL for real-time communication'
        );
      } catch {
        throw new Error('Invalid WebSocket URL generated');
      }

      if (endpoint.includes('localhost')) {
        const dockerUrl = endpoint.replace('localhost', 'host.docker.internal');
        try {
          const url = new URL(dockerUrl);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid Docker URL protocol');
          }
          writeEnvParameter(
            'REACT_APP_DOCKER_TALAWA_URL',
            dockerUrl,
            'Talawa API URL for Docker environment'
          );
        } catch {
          throw new Error('Invalid Docker URL generated');
        }
      } else {
        writeEnvParameter(
          'REACT_APP_DOCKER_TALAWA_URL',
          '',
          'Talawa API URL for Docker environment'
        );
      }
    } else {
      // Set empty values if user declines
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
      writeEnvParameter(
        'REACT_APP_DOCKER_TALAWA_URL',
        '',
        'Talawa API URL for Docker environment'
      );
    }
  } catch (error) {
    console.error('Error setting up Talawa API URL:', error);
    throw error;
  }
};