import inquirer from 'inquirer';

export async function askForTalawaApiUrl(): Promise<string> {
  const { endpoint } = await inquirer.prompt<{ endpoint: string }>([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your talawa-api endpoint:',
      default: 'http://localhost:4000/graphql/',
    },
  ]);
  return endpoint;
}
