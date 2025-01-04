import inquirer from 'inquirer';
import { askForTalawaApiUrl } from '../askForTalawaApiUrl/askForTalawaApiUrl';
import updateEnvFile from '../updateEnvFile/updateEnvFile';

// Mock implementation of checkConnection
const checkConnection = async (): Promise<boolean> => {
  // Simulate checking connection
  return true; // Replace with actual connection check logic
};

// Function to ask for Docker port
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

// Function to ask and update Talawa API URL
export const askAndUpdateTalawaApiUrl = async (): Promise<void> => {
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
      let retryCount = 0;
      const MAX_RETRIES = 3;
      while (!isConnected && retryCount < MAX_RETRIES) {
        try {
          endpoint = await askForTalawaApiUrl();
          const url = new URL(endpoint);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol. Must be http or https');
          }
          isConnected = await checkConnection();
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
      updateEnvFile('REACT_APP_TALAWA_URL', endpoint);
      const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
      try {
        const wsUrl = new URL(websocketUrl);
        if (!['ws:', 'wss:'].includes(wsUrl.protocol)) {
          throw new Error('Invalid WebSocket protocol');
        }
        updateEnvFile('REACT_APP_BACKEND_WEBSOCKET_URL', websocketUrl);
      } catch {
        throw new Error('Invalid WebSocket URL generated: ');
      }

      if (endpoint.includes('localhost')) {
        const dockerUrl = endpoint.replace('localhost', 'host.docker.internal');
        try {
          const url = new URL(dockerUrl);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid Docker URL protocol');
          }
        } catch {
          throw new Error('Invalid Docker URL generated');
        }
        updateEnvFile('REACT_APP_DOCKER_TALAWA_URL', dockerUrl);
      }
    }
  } catch (error) {
    console.error('Error setting up Talawa API URL:', error);
  }
};
