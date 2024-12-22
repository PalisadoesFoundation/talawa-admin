import inquirer from 'inquirer';

export function validatePort(input: string): string | true {
  const port = Number(input);
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    return 'Please enter a valid port number between 1 and 65535.';
  }
  return true;
}

export async function askForCustomPort(): Promise<number> {
  let validPort: number | null = null;

  while (validPort === null) {
    const { customPort } = await inquirer.prompt<{ customPort: string }>([
      {
        type: 'input',
        name: 'customPort',
        message:
          'Enter custom port for development server (leave blank for default 4321):',
        default: '4321',
        validate: validatePort,
      },
    ]);

    validPort = Number(customPort);
    if (Number.isNaN(validPort) || validPort <= 0 || validPort > 65535) {
      validPort = null;
    }
  }

  return validPort;
}
