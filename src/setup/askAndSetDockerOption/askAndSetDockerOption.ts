import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';

// Function to manage Docker setup
const askAndSetDockerOption = async (): Promise<void> => {
  const { useDocker } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Would you like to set up with Docker?',
      default: false,
    },
  ]);

  if (useDocker) {
    console.log('Setting up with Docker...');
    updateEnvFile('USE_DOCKER', 'YES');
    const answers = await askForDocker();
    const DOCKER_PORT_NUMBER = answers;
    updateEnvFile('DOCKER_PORT', DOCKER_PORT_NUMBER);
    updateEnvFile('PORT', DOCKER_PORT_NUMBER);

    console.log(`
        
          Run the commands below after setup:-
                docker compose --env-file .env -f docker/docker-compose.dev.yaml up       
       `);
  } else {
    console.log('Setting up without Docker...');
    updateEnvFile('USE_DOCKER', 'NO');
  }
};

export default askAndSetDockerOption;
