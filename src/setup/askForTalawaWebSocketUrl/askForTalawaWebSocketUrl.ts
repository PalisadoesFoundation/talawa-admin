import inquirer from 'inquirer';

function isValidWebSocketUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'ws:' || parsedUrl.protocol === 'wss:';
  } catch {
    return false;
  }
}

export async function askForTalawaWebSocketUrl(): Promise<string> {
  const { endpoint } = await inquirer.prompt([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your Talawa WebSocket endpoint:',
      default: 'ws://localhost:4000/graphql/',
      validate: (input: string) => {
        if (input.trim() === '') {
          return true;
        }
        if (!isValidWebSocketUrl(input)) {
          return 'Please enter a valid WebSocket URL (starting with ws:// or wss://).';
        }
        return true;
      },
    },
  ]);

  return endpoint || 'ws://localhost:4000/graphql/';
}
