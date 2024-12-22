import inquirer from 'inquirer';

export function validatePort(input: string): string | true {
  const port = Number(input);
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    return 'Please enter a valid port number between 1 and 65535.';
  }
  return true;
}

export async function reservedPortWarning(port: number): Promise<boolean> {
  const { confirmPort } = await inquirer.prompt<{ confirmPort: boolean }>([
    {
      type: 'confirm',
      name: 'confirmPort',
      message: `Port ${port} is a reserved port. Are you sure you want to use it?`,
      default: false,
    },
  ]);

  return confirmPort;
}

export async function askForCustomPort(): Promise<number> {
  let MAX_ATTEMPTS = 5;

  while (MAX_ATTEMPTS--) {
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

    if (customPort && validatePort(customPort) === true) {
      if (Number(customPort) >= 1024) {
        return Number(customPort);
      }

      if (
        Number(customPort) < 1024 &&
        (await reservedPortWarning(Number(customPort)))
      ) {
        return Number(customPort);
      }
    }
  }
  console.log('\nMaximum attempts reached. Using default port 4321.');
  return 4321;
}
