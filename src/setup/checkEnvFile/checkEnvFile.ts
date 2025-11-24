import dotenv from 'dotenv';
import fs from 'fs';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';

dotenv.config();

export function checkEnvFile(): boolean {
  if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
      fs.writeFileSync('.env', '', 'utf8');
    } else {
      console.error('Setup requires .env.example to proceed.\n');
      return false;
    }
  }
  return true;
}

export function modifyEnvFile(): void {
  const env = dotenv.parse(fs.readFileSync('.env'));
  const envSample = dotenv.parse(fs.readFileSync('.env.example'));
  const misplaced = Object.keys(envSample).filter((key) => !(key in env));
  if (misplaced.length > 0) {
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    misplaced.map((key) => updateEnvFile(key, config[key]));
  }
}
