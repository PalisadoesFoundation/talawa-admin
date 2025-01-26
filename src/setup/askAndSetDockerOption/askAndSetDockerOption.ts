import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';

// Function to manage Docker setup
const askAndSetDockerOption = async (): Promise<void> => {
  const { useDocker } = await inquirer.prompt({
    type: 'confirm',
    name: 'useDocker',
    message: 'Would you like to set up with Docker?',
    default: false,
  });

  if (useDocker) {
    console.log('Setting up with Docker...');
    updateEnvFile('USE_DOCKER', 'YES');
    const answers = await askForDocker();
    const DOCKER_PORT_NUMBER = answers;
    updateEnvFile('DOCKER_PORT', DOCKER_PORT_NUMBER);

    const DOCKER_NAME = 'talawa-admin';
    console.log(`
        
          Run the commands below after setup:-
                1. docker build -t ${DOCKER_NAME} .
                2. docker run -d -p ${DOCKER_PORT_NUMBER}:${DOCKER_PORT_NUMBER} ${DOCKER_NAME}
                
       `);
  } else {
    console.log('Setting up without Docker...');
    updateEnvFile('USE_DOCKER', 'NO');
  }
};

export default askAndSetDockerOption;
