import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import { backupEnvFile } from './backupEnvFile/backupEnvFile';

// Ask and set up reCAPTCHA
export const askAndSetRecaptcha = async (): Promise<void> => {
  try {
    const { shouldUseRecaptcha } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldUseRecaptcha',
        message: 'Would you like to set up reCAPTCHA?',
        default: true,
      },
    ]);

    updateEnvFile('REACT_APP_USE_RECAPTCHA', shouldUseRecaptcha ? 'YES' : 'NO');

    if (shouldUseRecaptcha) {
      const { recaptchaSiteKeyInput } = await inquirer.prompt([
        {
          type: 'input',
          name: 'recaptchaSiteKeyInput',
          message: 'Enter your reCAPTCHA site key:',
          validate: (input: string): boolean | string => {
            return (
              validateRecaptcha(input) ||
              'Invalid reCAPTCHA site key. Please try again.'
            );
          },
        },
      ]);

      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', recaptchaSiteKeyInput);
    } else {
      updateEnvFile('REACT_APP_RECAPTCHA_SITE_KEY', '');
    }
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to set up reCAPTCHA: ${errorMessage}`);
  }
};

// Ask and set up logging errors in the console
const askAndSetLogErrors = async (): Promise<void> => {
  try {
    const { shouldLogErrors } = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldLogErrors',
      message:
        'Would you like to log Compiletime and Runtime errors in the console?',
      default: true,
    });

    updateEnvFile('ALLOW_LOGS', shouldLogErrors ? 'YES' : 'NO');
  } catch (error) {
    console.error('Error setting up log configuration:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to set log configuration: ${errorMessage}`);
  }
};

// Main function to run the setup process
export async function main(): Promise<void> {
  let backupPath: string | null = null;

  try {
    if (!checkEnvFile()) {
      console.error(
        '❌ Environment file check failed. Please ensure .env exists.',
      );
      process.exit(1);
    }

    console.log('Welcome to the Talawa Admin setup! 🚀');

    modifyEnvFile();

    // Modify backupEnvFile to return backup path
    backupPath = await backupEnvFile();

    await askAndSetDockerOption();
    const envConfig = dotenv.parse(await fs.promises.readFile('.env', 'utf8'));
    const useDocker = envConfig.USE_DOCKER === 'YES';

    if (useDocker) {
      await askAndUpdateTalawaApiUrl(useDocker);
    } else {
      await askAndUpdatePort();
      await askAndUpdateTalawaApiUrl(useDocker);
    }

    await askAndSetRecaptcha();
    await askAndSetLogErrors();

    console.log(
      '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉',
    );
    console.log('DEBUG: backupPath is:', backupPath);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);

    if (backupPath) {
      console.log('🔄 Attempting to restore from backup...');
      try {
        fs.copyFileSync(backupPath, '.env');
        console.log('✅ Configuration restored from backup.');
      } catch (restoreError) {
        console.error('❌ Failed to restore backup:', restoreError);
        console.log(`Manual restore needed. Backup location: ${backupPath}`);
      }
    }

    console.log('\nPlease try again or contact support if the issue persists.');
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  main();
}
