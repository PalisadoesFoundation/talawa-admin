import inquirer from 'inquirer';

const DEFAULT_PORT = 4321;
const MAX_RETRY_ATTEMPTS = 5;

export function validatePort(input: string): string | boolean {
  const port = Number(input);
  if (
    Number.isNaN(port) ||
    !Number.isInteger(port) ||
    port <= 0 ||
    port > 65535
  ) {
    return 'Please enter a valid port number between 1 and 65535.';
  }
  return true;
}

export async function reservedPortWarning(port: number): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmPort',
      message: `Port ${port} is a reserved port. Are you sure you want to use it?`,
      default: false,
    },
  ]);

  return answer.confirmPort;
}

export async function askForCustomPort(): Promise<number> {
  let remainingAttempts = MAX_RETRY_ATTEMPTS;

  while (remainingAttempts--) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'customPort',
        message: `Enter the custom port for Talawa Admin: (default ${DEFAULT_PORT}):`,
        default: DEFAULT_PORT.toString(),
        validate: validatePort,
      },
    ]);

    const customPort = answer.customPort;

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
  console.log(
    `\nMaximum attempts reached. Using default port ${DEFAULT_PORT}.`,
  );
  return DEFAULT_PORT;
}
