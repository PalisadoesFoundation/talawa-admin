import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { askForCustomPort } from 'setup/askForCustomPort/askForCustomPort';
import inquirer from 'inquirer';

// Ask and update the custom port
const askAndUpdatePort = async (): Promise<void> => {
  const { shouldSetCustomPortResponse } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldSetCustomPortResponse',
    message:
      'Would you like to set up a custom port for running Talawa Admin without Docker?',
    default: true,
  });

  if (shouldSetCustomPortResponse) {
    const customPort = await askForCustomPort();
    if (customPort < 1024 || customPort > 65535) {
      throw new Error('Port must be between 1024 and 65535');
    }

    updateEnvFile('PORT', String(customPort));
  }
};

export default askAndUpdatePort;
