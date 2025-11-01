import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env');

const PARAM_DESCRIPTIONS: Record<string, string> = {
  PORT: 'Frontend port number to run the app on.',
  REACT_APP_TALAWA_URL: 'GraphQL endpoint for the Talawa backend.',
  REACT_APP_USE_RECAPTCHA: 'Enable or disable reCAPTCHA protection.',
  REACT_APP_RECAPTCHA_SITE_KEY:
    'Google reCAPTCHA site key used for verification.',
  REACT_APP_BACKEND_WEBSOCKET_URL: 'WebSocket endpoint for real-time updates.',
  ALLOW_LOGS: 'Whether logs are allowed in the console.',
  USE_DOCKER: 'Indicates whether Docker is being used.',
  DOCKER_PORT: 'Docker container port mapping for frontend.',
  REACT_APP_DOCKER_TALAWA_URL: 'GraphQL endpoint inside Docker container.',
};

export const updateEnvFile = (key: string, value: string): void => {
  try {
    const description = PARAM_DESCRIPTIONS[key] || 'No description available.';

    if (!fs.existsSync(ENV_PATH)) {
      fs.writeFileSync(ENV_PATH, '');
    }

    let envContent = fs.readFileSync(ENV_PATH, 'utf8');

    // Remove ALL occurrences of this key (even commented)
    const regex = new RegExp(`^\\s*#?\\s*${key}\\s*=.*$`, 'gm');
    envContent = envContent.replace(regex, '').trim();

    // Append new formatted block (always non-commented)
    const formattedBlock = `\n# ${description}\n${key}=${value ?? ''}`;
    envContent = envContent
      ? `${envContent}\n${formattedBlock}\n`
      : `${formattedBlock}\n`;

    fs.writeFileSync(ENV_PATH, envContent, 'utf8');
  } catch (error) {
    console.error('Error updating the .env file:', error);
  }
};

export default updateEnvFile;
