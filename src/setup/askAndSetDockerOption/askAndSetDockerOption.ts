import inquirer from 'inquirer';
import updateEnvFile, { writeEnvParameter } from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';

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
    
    writeEnvParameter(
      'USE_DOCKER',
      'YES',
      'Enable Docker-based deployment'
    );
    
    const dockerPort = await askForDocker();
    
    writeEnvParameter(
      'DOCKER_PORT',
      String(dockerPort),
      'Port for Docker container'
    );

    const DOCKER_NAME = 'talawa-admin';
    console.log(`
        
          Run the commands below after setup:-
                1. docker build -t ${DOCKER_NAME} .
                2. docker run -d -p ${dockerPort}:${dockerPort} ${DOCKER_NAME}
                
       `);
  } else {
    console.log('Setting up without Docker...');
    
    writeEnvParameter(
      'USE_DOCKER',
      'NO',
      'Enable Docker-based deployment'
    );
    
    // Set empty PORT initially (will be configured in askAndUpdatePort)
    writeEnvParameter(
      'PORT',
      '',
      'Port for development server without Docker'
    );
  }
};

export default askAndSetDockerOption;