import inquirer from 'inquirer';

export const askForDocker = async (): Promise<string> => {
  const answers = await inquirer.prompt<{ dockerAppPort: string }>([
    {
      type: 'input',
      name: 'dockerAppPort',
      message: 'Enter the port to expose Docker (default: 4321):',
      default: '4321',
      validate: (input: string) => {
        const port = Number(input);
        if (isNaN(port) || port < 1024 || port > 65535) {
          return 'Please enter a valid port number between 1024 and 65535';
        }
        return true;
      },
    },
  ]);

  return answers.dockerAppPort;
};
