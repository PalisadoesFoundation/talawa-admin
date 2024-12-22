import inquirer from 'inquirer';

export async function askForCustomPort(): Promise<number> {
  const { customPort } = await inquirer.prompt<{ customPort: string }>([
    {
      type: 'input',
      name: 'customPort',
      message:
        'Enter custom port for development server (leave blank for default 4321):',
      default: '4321',
      validate: (input) => {
        const port = Number(input);
        if (isNaN(port) || port <= 0 || port > 65535) {
          return 'Please enter a valid port number between 1 and 65535.';
        }
        return true;
      },
    },
  ]);
  return Number(customPort);
}
