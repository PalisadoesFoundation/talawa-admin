import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import fetch from 'node-fetch';

dotenv.config();

// Check Talawa API Connection
export async function checkConnection(url: string): Promise<any> {
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

export function isValidUrl(url): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export async function askForTalawaApiUrl(): Promise<string> {
  const env = dotenv.parse(fs.readFileSync('.env'));
  const defaultEndpoint =
    env.REACT_APP_TALAWA_URL || 'http://localhost:4000/graphql/';

  const { endpoint } = await inquirer.prompt([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your talawa-api endpoint:',
      default: defaultEndpoint,
      validate: (input) => {
        if (isValidUrl(input)) {
          return true;
        }
        return 'Invalid URL. Please enter a valid URL.';
      },
    },
  ]);

  return endpoint;
}

export async function askForCustomPort(): Promise<number> {
  const { customPort } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customPort',
      message:
        'Enter custom port for development server (leave blank for default 4321):',
      default: 4321,
      validate: (input) => {
        const port = parseInt(input, 10);
        if (!isNaN(port) && port >= 0 && port <= 65535) {
          return true;
        }
        return 'Invalid port. Please enter a valid port number.';
      },
    },
  ]);

  return customPort;
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

// Validate ReCaptcha
function validateRecaptcha(string: string): boolean {
  const pattern = /^[a-zA-Z0-9_-]{40}$/;
  return pattern.test(string);
}

async function main(): Promise<void> {
  console.log('Welcome to the Talawa Admin setup! 🚀');
  const envPath = '.env';

  if (!fs.existsSync(envPath)) {
    fs.openSync(envPath, 'w');
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    for (const key in config) {
      fs.appendFileSync(envPath, `${key}=${config[key]}\n`);
    }
  } else {
    checkEnvFile();
  }

  const tempEnv = {};

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
      `\nCustom port for development server already exists with the value:\n${process.env.PORT}`
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

  const customPort = 4321; // Replace 4321 with the desired port number

  const endpoint = 'http://localhost:4000/graphql/'; // Replace 'http://localhost:4000/graphql/' with the actual value
  if (shouldLogErrors) {
    const logErrors = dotenv.parse(fs.readFileSync('.env')).ALLOW_LOGS;

    fs.readFile('.env', 'utf8', (err, data) => {
      const result = data.replace(`ALLOW_LOGS=${logErrors}`, 'ALLOW_LOGS=YES');
      fs.writeFileSync('.env', result, 'utf8');
    });
  }

  tempEnv['PORT'] = customPort;
  tempEnv['REACT_APP_TALAWA_URL'] = endpoint;
  tempEnv['ALLOW_LOGS'] = 'YES';

  const existingEnv = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
  let hasChanges = false;

  for (const key in tempEnv) {
    if (existingEnv[key] !== tempEnv[key]) {
      hasChanges = true;
      break;
    }
  }

  if (hasChanges) {
    // Update .env with tempEnv values
    for (const key in tempEnv) {
      const data = fs.readFileSync(envPath, 'utf8');
      const result =
        existingEnv[key] !== undefined
          ? data.replace(`${key}=${existingEnv[key]}`, `${key}=${tempEnv[key]}`)
          : `${key}=${tempEnv[key]}\n`;
      fs.writeFileSync(envPath, result, 'utf8');
    }

    console.log('\nChanges applied to .env file.');
  } else {
    console.log('\nNo changes detected. .env file remains unchanged.');
  }

  console.log(
    '\nCongratulations! Talawa Admin has been successfully setup! 🥂🎉'
  );
}

main();
