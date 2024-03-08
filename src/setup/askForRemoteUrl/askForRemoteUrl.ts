import inquirer from 'inquirer';

export const validateUrl = (input: string): boolean => {
  const ans =
    input.includes(':') && input.indexOf(':') == input.lastIndexOf(':');
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return ans && urlRegex.test(input);
};

export async function askForRemoteUrl(): Promise<string> {
  const { url } = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: `Enter your remote url in the format 'http://hosturl/' (don't enter the port)`,
      validate: validateUrl,
    },
  ]);
  return url;
}
