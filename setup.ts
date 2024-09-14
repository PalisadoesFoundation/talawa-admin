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

  if (!fs.existsSync('.env')) {
    fs.openSync('.env', 'w');
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    for (const key in config) {
      fs.appendFileSync('.env', `${key}=${config[key]}\n`);
    }
  } else {
    checkEnvFile();
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

    const port = dotenv.parse(fs.readFileSync('.env')).PORT;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(`PORT=${port}`, `PORT=${customPort}`);
      fs.writeFileSync('.env', result, 'utf8');
    });
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
      const url = new URL(endpoint);
      isConnected = await checkConnection(url.origin);
    }

    const talawaApiUrl = dotenv.parse(
      fs.readFileSync('.env'),
    ).REACT_APP_TALAWA_URL;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(
        `REACT_APP_TALAWA_URL=${talawaApiUrl}`,
        `REACT_APP_TALAWA_URL=${endpoint}`,
      );
      fs.writeFileSync('.env', result, 'utf8');
    });
  }

  const { shouldUseRecaptcha } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldUseRecaptcha',
    message: 'Would you like to set up ReCAPTCHA?',
    default: true,
  });

  if (shouldUseRecaptcha) {
    const useRecaptcha = dotenv.parse(
      fs.readFileSync('.env'),
    ).REACT_APP_USE_RECAPTCHA;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(
        `REACT_APP_USE_RECAPTCHA=${useRecaptcha}`,
        `REACT_APP_USE_RECAPTCHA=yes`,
      );
      fs.writeFileSync('.env', result, 'utf8');
    });
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

      fs.readFile('.env', 'utf8', (err, data) => {
        const result = data.replace(
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKey}`,
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKeyInput}`,
        );
        fs.writeFileSync('.env', result, 'utf8');
      });
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

main();
