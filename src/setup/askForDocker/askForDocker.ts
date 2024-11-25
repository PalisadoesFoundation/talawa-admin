import inquirer from 'inquirer';

export const askForDocker = async (): Promise<{
  useDocker: boolean;
  dockerAppPort: string;
  containerName: string;
}> => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Do you want to use Docker for this project?',
      default: true,
    },
    {
      type: 'input',
      name: 'dockerAppPort',
      message: 'Enter the port to expose Docker (default: 4321):',
      default: 4321,
    },
    {
      type: 'input',
      name: 'containerName',
      message: 'Enter the name for the Docker container:',
      default: 'talawa-admin',
    },
  ]);

  return answers;
};
