import inquirer from 'inquirer';

export const askForDocker = async (): Promise<string> => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'dockerAppPort',
      message: 'Enter the port to expose Docker (default: 4321):',
      default: 4321,
    },
  ]);

  return answers.dockerAppPort;
};
