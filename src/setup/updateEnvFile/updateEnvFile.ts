import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env');

const PARAM_DESCRIPTIONS: Record<string, string> = {
  PORT: 'Frontend port number to run the app on.',
  USE_DOCKER: 'Indicates whether Docker is being used.',
  DOCKER_PORT: 'Docker container port mapping for frontend.',
  REACT_APP_TALAWA_URL: 'GraphQL endpoint for the Talawa backend.',
  REACT_APP_DOCKER_TALAWA_URL: 'GraphQL endpoint inside Docker container.',
  REACT_APP_USE_RECAPTCHA: 'Enable or disable reCAPTCHA protection.',
  REACT_APP_RECAPTCHA_SITE_KEY:
    'Google reCAPTCHA site key used for verification.',
  ALLOW_LOGS: 'Whether logs are allowed in the console.',
};

export const updateEnvFile = (
  key: string,
  value: string | undefined | null,
): void => {
  try {
    const description = PARAM_DESCRIPTIONS[key];
    if (!description) {
      console.warn(
        `Warning: No description found for "${key}". Using fallback.`,
      );
    }
    const finalDescription = description || 'No description available.';

    if (!fs.existsSync(ENV_PATH)) {
      fs.writeFileSync(ENV_PATH, '');
    }

    let envContent = fs.readFileSync(ENV_PATH, 'utf8');

    // Remove existing key and its comment (and any surrounding blank lines)
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      String.raw`(^|\r?\n)\s*(?:#.*\r?\n\s*)*\s*#?\s*${escapedKey}\s*=.*(\r?\n)?`,
      'gm',
    );

    envContent = envContent.replace(regex, '\n');
    envContent = envContent
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Prepare new variable block
    const commentLine = ['#', finalDescription].join(' ');
    const valueLine = [key, value ?? ''].join('=');
    const newBlock = [commentLine, valueLine].join('\n');

    // Append block with exactly one blank line separation if not empty
    envContent = envContent ? `${envContent}\n\n${newBlock}` : newBlock;
    fs.writeFileSync(ENV_PATH, envContent.trim() + '\n', 'utf8');
  } catch (error) {
    console.error('Error updating the .env file:', error);
  }
};

export default updateEnvFile;
