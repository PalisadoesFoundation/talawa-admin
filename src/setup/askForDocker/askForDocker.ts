import inquirer from 'inquirer';
import { askForTalawaApiUrl } from '../askForTalawaApiUrl/askForTalawaApiUrl';
import updateEnvFile from '../updateEnvFile/updateEnvFile';
const DEFAULT_PORT = 4321;

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
      message: `Enter the custom port for Talawa Admin: (default ${DEFAULT_PORT}):`,
      default: DEFAULT_PORT.toString(),
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
export const askAndUpdateTalawaApiUrl = async (
  useDocker = false,
): Promise<void> => {
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
          endpoint = await askForTalawaApiUrl(useDocker);
          const url = new URL(endpoint);
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol. Must be http or https');
          }
          isConnected = await checkConnection();
        } catch (error) {
          console.error('Error checking connection:', error);
          console.log(
            `Connection attempt ${retryCount + 1}/${MAX_RETRIES} failed`,
          ); // ← Move here
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
      if (useDocker && endpoint) {
        const raw = endpoint.includes('://') ? endpoint : `http://${endpoint}`;
        try {
          const parsed = new URL(raw);
          // Normalize hostname and strip IPv6 brackets (e.g. "[::1]")
          const hostname = (parsed.hostname || '').replace(/^\[|\]$/g, '');
          const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(
            hostname,
          );

          if (isLocalHost) {
            parsed.hostname = 'host.docker.internal';
            const dockerUrl = parsed.toString();
            updateEnvFile('REACT_APP_TALAWA_URL', dockerUrl);
          }
        } catch (error) {
          throw new Error(
            `Docker URL transformation failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  } catch (error) {
    console.error('Error setting up Talawa API URL:', error);
  }
};
