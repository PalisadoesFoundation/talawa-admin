import fs from 'fs';

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
