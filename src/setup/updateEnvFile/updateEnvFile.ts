import fs from 'fs';

const updateEnvFile = (key: string, value: string): void => {
  const currentEnvContent = fs.readFileSync('.env', 'utf8');
  const keyRegex = new RegExp(`^${key}=.*$`, 'm');
  if (keyRegex.test(currentEnvContent)) {
    const updatedEnvContent = currentEnvContent.replace(
      keyRegex,
      `${key}=${value}`,
    );
    fs.writeFileSync('.env', updatedEnvContent, 'utf8');
  } else {
    fs.appendFileSync('.env', `\n${key}=${value}`, 'utf8');
  }
};

export default updateEnvFile;
