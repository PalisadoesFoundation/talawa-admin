import fs from 'fs';
import path from 'path';

// Descriptions for each environment variable
const descriptions: Record<string, string> = {
  USE_DOCKER: 'Use Docker for development (YES/NO).',
  PORT: 'The port for the development server when not using Docker.',
  REACT_APP_TALAWA_URL: 'The URL of the Talawa API when not using Docker.',
  REACT_APP_BACKEND_WEBSOCKET_URL:
    'The WebSocket URL for the backend when not using Docker.',
  DOCKER_PORT: 'The port to expose when running in Docker.',
  REACT_APP_DOCKER_TALAWA_URL: 'The URL of the Talawa API when using Docker.',
  REACT_APP_DOCKER_BACKEND_WEBSOCKET_URL:
    'The WebSocket URL for the backend when using Docker.',
  REACT_APP_USE_RECAPTCHA: 'Enable or disable reCAPTCHA (yes/no).',
  REACT_APP_RECAPTCHA_SITE_KEY: 'The site key for reCAPTCHA.',
  ALLOW_LOGS:
    'Enable or disable console logging for compile-time and runtime errors (yes/no).',
};

/**
 * Updates the .env file with the provided configuration.
 * This function will overwrite the existing .env file.
 * @param config An object where keys are env variable names and values are their values.
 */
export const updateEnvFile = (config: Record<string, string>) => {
  const envFilePath = path.join(process.cwd(), '.env');
  let envFileContent = '';

  // Define the full order of all possible keys
  const allKeys = [
    'USE_DOCKER',
    'PORT',
    'REACT_APP_TALAWA_URL',
    'REACT_APP_BACKEND_WEBSOCKET_URL',
    'DOCKER_PORT',
    'REACT_APP_DOCKER_TALAWA_URL',
    'REACT_APP_DOCKER_BACKEND_WEBSOCKET_URL',
    'REACT_APP_USE_RECAPTCHA',
    'REACT_APP_RECAPTCHA_SITE_KEY',
    'ALLOW_LOGS',
  ];

  for (const key of allKeys) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const value = config[key] || '';
      const description = descriptions[key];

      if (envFileContent !== '') {
        envFileContent += '\n';
      }

      if (description) {
        envFileContent += `# ${description}\n`;
      }
      envFileContent += `${key}=${value}\n`;
    }
  }

  fs.writeFileSync(envFilePath, envFileContent);
};
