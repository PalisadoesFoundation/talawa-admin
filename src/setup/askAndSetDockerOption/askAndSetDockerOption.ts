import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';
import type { DockerMode } from 'types/docker';

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

    const { dockerMode } = await inquirer.prompt<{ dockerMode: DockerMode }>([
      {
        type: 'list',
        name: 'dockerMode',
        message: 'Choose Docker mode:',
        choices: [
          {
            name: 'Rootful (default)',
            value: 'ROOTFUL',
          },
          {
            name: 'Rootless (least privilege)',
            value: 'ROOTLESS',
          },
        ],
        default: 'ROOTFUL',
      },
    ]);

    updateEnvFile('DOCKER_MODE', dockerMode);

    const dockerPort = await askForDocker();
    updateEnvFile('DOCKER_PORT', dockerPort);
    updateEnvFile('PORT', dockerPort);

    const composeFile =
      dockerMode === 'ROOTLESS'
        ? 'docker/docker-compose.rootless.dev.yaml'
        : 'docker/docker-compose.dev.yaml';
    const rootlessHostCommand =
      dockerMode === 'ROOTLESS'
        ? 'eval "$(./scripts/docker/resolve-docker-host.sh --mode rootless --emit-export --warn-if-docker-group)"'
        : '';

    const postSetupCommands = [
      'Run the commands below after setup:-',
      ...(rootlessHostCommand ? [rootlessHostCommand] : []),
      `docker compose --env-file .env -f ${composeFile} up`,
    ];

    console.log(`\n${postSetupCommands.join('\n')}\n`);
  } else {
    console.log('Setting up without Docker...');
    updateEnvFile('USE_DOCKER', 'NO');
    updateEnvFile('DOCKER_MODE', 'ROOTFUL');
  }
};

export default askAndSetDockerOption;
