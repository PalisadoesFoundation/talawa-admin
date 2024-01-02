import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';

dotenv.config();

function abort(): void {
  console.log('\nSetup process aborted. 🫠');
  process.exit(1);
}

// Check if all the fields in .env.example are present in .env
function checkEnvFile(): void {
  const env = dotenv.parse(fs.readFileSync('.env'));
  const envSample = dotenv.parse(fs.readFileSync('.env.example'));
  const misplaced = Object.keys(envSample).filter((key) => !(key in env));
  if (misplaced.length > 0) {
    console.log('Please copy the contents of .env.example to .env file');
    abort();
  }
}

function validateRecaptcha(string: string): boolean {
  const pattern = /^[a-zA-Z0-9_-]{40}$/;
  return pattern.test(string);
}

async function main(): Promise<void> {
  console.log('Welcome to the Talawa Admin setup! 🚀');

  if (!fs.existsSync('.env')) {
    fs.copyFileSync('.env.example', '.env');
  } else {
    checkEnvFile();
  }

  if (process.env.REACT_APP_TALAWA_URL) {
    console.log(
      `\nEndpoint for accessing talawa-api graphql service already exists with the value:\n${process.env.REACT_APP_TALAWA_URL}`
    );
  }

  const { shouldSetTalawaApiUrl } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldSetTalawaApiUrl',
    message: 'Would you like to set up talawa-api endpoint?',
    default: true,
  });

  if (shouldSetTalawaApiUrl) {
    const { endpoint } = await inquirer.prompt([
      {
        type: 'input',
        name: 'endpoint',
        message: 'Enter your talawa-api endpoint:',
        default: 'http://localhost:4000/graphql/',
      },
    ]);
    const config = dotenv.parse(fs.readFileSync('.env'));
    config.REACT_APP_TALAWA_URL = endpoint;
    fs.writeFileSync('.env', '');
    for (const key in config) {
      fs.appendFileSync('.env', `${key}=${config[key]}\n`);
    }
  }

  const { shouldUseRecaptcha } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldUseRecaptcha',
    message: 'Would you like to set up ReCAPTCHA?',
    default: true,
  });

  if (shouldUseRecaptcha) {
    const config = dotenv.parse(fs.readFileSync('.env'));
    config.REACT_APP_USE_RECAPTCHA = 'yes';
    fs.writeFileSync('.env', '');
    for (const key in config) {
      fs.appendFileSync('.env', `${key}=${config[key]}\n`);
    }
    if (process.env.REACT_APP_RECAPTCHA_SITE_KEY) {
      console.log(
        `\nreCAPTCHA site key already exists with the value ${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`
      );
    }
    const { shouldSetRecaptchaSiteKey } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldSetRecaptchaSiteKey',
      message: 'Would you like to set up a reCAPTCHA site key?',
      default: true,
    });

    if (shouldSetRecaptchaSiteKey) {
      const { recaptchaSiteKey } = await inquirer.prompt([
        {
          type: 'input',
          name: 'recaptchaSiteKey',
          message: 'Enter your reCAPTCHA site key:',
          validate: async (input: string): Promise<boolean | string> => {
            if (validateRecaptcha(input)) {
              return true;
            }
            return 'Invalid reCAPTCHA site key. Please try again.';
          },
        },
      ]);

      const config = dotenv.parse(fs.readFileSync('.env'));
      config.REACT_APP_RECAPTCHA_SITE_KEY = recaptchaSiteKey;
      fs.writeFileSync('.env', '');
      for (const key in config) {
        fs.appendFileSync('.env', `${key}=${config[key]}\n`);
      }
    }
  }

  console.log(
    '\nCongratulations! Talawa Admin has been successfully setup! 🥂🎉'
  );
}

main();
