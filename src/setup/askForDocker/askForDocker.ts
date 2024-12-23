import type { QuestionCollection } from 'inquirer';
import inquirer from 'inquirer';

export const askForDocker = async (): Promise<string> => {
  const questions: QuestionCollection = [
    {
      type: 'input',
      name: 'dockerAppPort',
      message: 'Enter the port to expose Docker (default: 4321):',
      default: '4321', // Default should be a string since `input` returns string values
      validate: (input: string) => {
        const port = Number(input);
        if (isNaN(port) || port < 1024 || port > 65535) {
          return 'Please enter a valid port number between 1024 and 65535';
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.dockerAppPort;
};
