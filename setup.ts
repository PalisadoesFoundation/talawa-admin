/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import fetch from 'node-fetch';

dotenv.config();

async function checkConnection(url: string): Promise<any> {
  console.log('\nChecking Talawa-API connection....');
  let isConnected = false;
  await fetch(url)
    .then(() => {
      isConnected = true;
      console.log('\nConnection to Talawa-API successful! 🎉');
    })
    .catch(() => {
      console.log(
        '\nTalawa-API service is unavailable. Is it running? Check your network connectivity too.'
      );
    });
  return isConnected;
}

async function askForTalawaApiUrl(): Promise<string> {
  const { endpoint } = await inquirer.prompt([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your talawa-api endpoint:',
      default: 'http://localhost:4000/graphql/',
    },
  ]);
  return endpoint;
}

// Check if all the fields in .env.example are present in .env
function checkEnvFile(): void {
  const env = dotenv.parse(fs.readFileSync('.env'));
  const envSample = dotenv.parse(fs.readFileSync('.env.example'));
  const misplaced = Object.keys(envSample).filter((key) => !(key in env));
  if (misplaced.length > 0) {
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    misplaced.map((key) =>
      fs.appendFileSync('.env', `${key}=${config[key]}\n`)
    );
  }
}

function validateRecaptcha(string: string): boolean {
  const pattern = /^[a-zA-Z0-9_-]{40}$/;
  return pattern.test(string);
}

async function main(): Promise<void> {
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

  let shouldSetTalawaApiUrl: boolean;

  if (process.env.REACT_APP_TALAWA_URL) {
    console.log(
      `\nEndpoint for accessing talawa-api graphql service already exists with the value:\n${process.env.REACT_APP_TALAWA_URL}`
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
      fs.readFileSync('.env')
    ).REACT_APP_TALAWA_URL;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(
        `REACT_APP_TALAWA_URL=${talawaApiUrl}`,
        `REACT_APP_TALAWA_URL=${endpoint}`
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
      fs.readFileSync('.env')
    ).REACT_APP_USE_RECAPTCHA;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(
        `REACT_APP_USE_RECAPTCHA=${useRecaptcha}`,
        `REACT_APP_USE_RECAPTCHA=yes`
      );
      fs.writeFileSync('.env', result, 'utf8');
    });
    let shouldSetRecaptchaSiteKey: boolean;
    if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
      console.log(
        `\nreCAPTCHA site key already exists with the value ${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`
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
        fs.readFileSync('.env')
      ).REACT_APP_RECAPTCHA_SITE_KEY;

      fs.readFile('.env', 'utf8', (err, data) => {
        const result = data.replace(
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKey}`,
          `REACT_APP_RECAPTCHA_SITE_KEY=${recaptchaSiteKeyInput}`
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
    '\nCongratulations! Talawa Admin has been successfully setup! 🥂🎉'
  );
}

main();
