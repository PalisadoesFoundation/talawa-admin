import inquirer from 'inquirer';

export async function askForCustomPort(): Promise<number> {
  const { customPort } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customPort',
      message:
        'Enter custom port for development server (leave blank for default 4321):',
      default: 4321,
    },
  ]);
  return customPort;
}
