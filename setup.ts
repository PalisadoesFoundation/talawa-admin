import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkConnection } from './src/setup/checkConnection/checkConnection';
import { askForTalawaApiUrl } from './src/setup/askForTalawaApiUrl/askForTalawaApiUrl';
import { checkEnvFile } from './src/setup/checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './src/setup/validateRecaptcha/validateRecaptcha';
import { askForCustomPort } from './src/setup/askForCustomPort/askForCustomPort';

export async function main(): Promise<void> {
  console.log('Welcome to the Talawa Admin setup! 🚀');

  try {
    if (!fs.existsSync('.env')) {
      if (!fs.existsSync('.env.example')) {
        throw new Error('.env.example file not found');
      }
      await fs.promises.open('.env', 'w', 0o666);
      const config = dotenv.parse(await fs.promises.readFile('.env.example'));
      const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      await fs.promises.writeFile('.env', envContent + '\n');
    } else {
      checkEnvFile();
    }
  } catch (error) {
    console.error('Failed to setup environment file:', error);
    process.exit(1);
  }

  let shouldSetCustomPort: boolean;

  if (process.env.PORT) {
    console.log(
      `\nCustom port for development server already exists with the value:\n${process.env.PORT}`,
    );
    shouldSetCustomPort = true;
  } else {
    const { shouldSetCustomPortResponse } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldSetCustomPortResponse',
      message: 'Would you like to set up a custom port?',
      default: true,
    });
    shouldSetCustomPort = shouldSetCustomPortResponse;
  }

  if (shouldSetCustomPort) {
    const customPort = await askForCustomPort();
    try {
      const data = await fs.promises.readFile('.env', 'utf8');
      const config = dotenv.parse(data);
      const result = data.replace(`PORT=${config.PORT}`, `PORT=${customPort}`);
      await fs.promises.writeFile('.env', result, 'utf8');
    } catch (error) {
      console.error('Failed to update port configuration:', error);
      process.exit(1);
    }
  }

  let shouldSetTalawaApiUrl: boolean;

  if (process.env.REACT_APP_TALAWA_URL) {
    console.log(
      `\nEndpoint for accessing talawa-api graphql service already exists with the value:\n${process.env.REACT_APP_TALAWA_URL}`,
    );
    shouldSetTalawaApiUrl = true;
  } else {
    const { shouldSetTalawaApiUrlResponse } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldSetTalawaApiUrlResponse',
      message: 'Would you like to set up talawa-api endpoint?',
      default: true,
    });
    shouldSetTalawaApiUrl = shouldSetTalawaApiUrlResponse;
  }

  if (shouldSetTalawaApiUrl) {
    let isConnected = false,
      endpoint = '';

    while (!isConnected) {
      endpoint = await askForTalawaApiUrl();

      // Validate and parse URL directly
      let url;
      try {
        url = new URL(endpoint);
      } catch {
        console.error('Invalid URL. Please provide a valid Talawa API URL.');
        continue;
      }

      isConnected = await checkConnection(url.origin);
    }
    const envPath = '.env';
    const currentEnvContent = fs.readFileSync(envPath, 'utf8');
    const talawaApiUrl = dotenv.parse(currentEnvContent).REACT_APP_TALAWA_URL;

    const updatedEnvContent = currentEnvContent.replace(
      `REACT_APP_TALAWA_URL=${talawaApiUrl}`,
      `REACT_APP_TALAWA_URL=${endpoint}`,
    );

    fs.writeFileSync(envPath, updatedEnvContent, 'utf8');
    const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');
    const currentWebSocketUrl =
      dotenv.parse(updatedEnvContent).REACT_APP_BACKEND_WEBSOCKET_URL;

    const finalEnvContent = updatedEnvContent.replace(
      `REACT_APP_BACKEND_WEBSOCKET_URL=${currentWebSocketUrl}`,
      `REACT_APP_BACKEND_WEBSOCKET_URL=${websocketUrl}`,
    );

    fs.writeFileSync(envPath, finalEnvContent, 'utf8');
  }

  const { shouldUseRecaptcha } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldUseRecaptcha',
    message: 'Would you like to set up ReCAPTCHA?',
    default: true,
  });

  async function updateEnvFile(
    key: string,
    oldValue: string,
    newValue: string,
  ): Promise<void> {
    try {
      const data = await fs.promises.readFile('.env', 'utf8');
      const result = data.replace(`${key}=${oldValue}`, `${key}=${newValue}`);
      await fs.promises.writeFile('.env', result, 'utf8');
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      process.exit(1);
    }
  }

  if (shouldUseRecaptcha) {
    const data = await fs.promises.readFile('.env', 'utf8');
    const config = dotenv.parse(data);
    await updateEnvFile(
      'REACT_APP_USE_RECAPTCHA',
      config.REACT_APP_USE_RECAPTCHA,
      'yes',
    );

    let shouldSetRecaptchaSiteKey: boolean;
    if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
      console.log(
        `\nreCAPTCHA site key already exists with the value ${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`,
      );
      shouldSetRecaptchaSiteKey = true;
    } else {
      const { shouldSetRecaptchaSiteKeyResponse } = await inquirer.prompt({
        type: 'confirm',
        name: 'shouldSetRecaptchaSiteKeyResponse',
        message: 'Would you like to set up a reCAPTCHA site key?',
        default: true,
      });
      shouldSetRecaptchaSiteKey = shouldSetRecaptchaSiteKeyResponse;
    }

    if (shouldSetRecaptchaSiteKey) {
      const { recaptchaSiteKeyInput } = await inquirer.prompt([
        {
          type: 'input',
          name: 'recaptchaSiteKeyInput',
          message: 'Enter your reCAPTCHA site key:',
          validate: async (input: string): Promise<boolean | string> => {
            if (validateRecaptcha(input)) {
              return true;
            }
            return 'Invalid reCAPTCHA site key. Please try again.';
          },
        },
      ]);

      const recaptchaSiteKey = dotenv.parse(
        fs.readFileSync('.env'),
      ).REACT_APP_RECAPTCHA_SITE_KEY;

      try {
        const data = await fs.promises.readFile('.env', 'utf8');
        const result = data.replace(
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKey}`,
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKeyInput}`,
        );
        await fs.promises.writeFile('.env', result, 'utf8');
      } catch (error) {
        console.error('Failed to update ReCAPTCHA configuration:', error);
        process.exit(1);
      }
    }
  }

  const { shouldLogErrors } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldLogErrors',
    message:
      'Would you like to log Compiletime and Runtime errors in the console?',
    default: true,
  });

  if (shouldLogErrors) {
    const logErrors = dotenv.parse(fs.readFileSync('.env')).ALLOW_LOGS;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(`ALLOW_LOGS=${logErrors}`, 'ALLOW_LOGS=YES');
      fs.writeFileSync('.env', result, 'utf8');
    });
  }

  console.log(
    '\nCongratulations! Talawa Admin has been successfully setup! 🥂🎉',
  );
}

main().catch((error) => {
  console.error('Setup failed:', error);
  process.exit(1);
});
