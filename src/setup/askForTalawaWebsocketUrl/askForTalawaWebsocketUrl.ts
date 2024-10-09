import inquirer from 'inquirer';

export async function askForTalawaWebsocketUrl(): Promise<string> {
  const { endpoint } = await inquirer.prompt([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your talawa-websocket endpoint:',
      default: 'ws://localhost:4000/graphql/',
    },
  ]);
  return endpoint;
}