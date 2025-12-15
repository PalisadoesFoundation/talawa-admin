import inquirer from 'inquirer';

export async function askForTalawaApiUrl(useDocker = false): Promise<string> {
  const defaultEndpoint = useDocker
    ? 'http://host.docker.internal:4000/graphql'
    : 'http://localhost:4000/graphql';

  const { endpoint } = await inquirer.prompt<{ endpoint: string }>([
    {
      type: 'input',
      name: 'endpoint',
      message: 'Enter your talawa-api endpoint:',
      default: defaultEndpoint,
    },
  ]);

  const trimmedEndpoint = endpoint.trim();

  // Fallback to default if user enters only spaces or nothing
  const baseEndpoint =
    trimmedEndpoint.length > 0 ? trimmedEndpoint : defaultEndpoint;

  const cleanedEndpoint = baseEndpoint.replace(/\/+$/, '');

  // Ensure /graphql suffix is present
  const correctEndpoint = cleanedEndpoint.endsWith('/graphql')
    ? cleanedEndpoint
    : `${cleanedEndpoint}/graphql`;

  return correctEndpoint;
}
