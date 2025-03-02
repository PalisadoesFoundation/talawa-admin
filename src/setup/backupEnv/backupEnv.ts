import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export function backupEnv(): void {
  if (!fs.existsSync('.env')) {
    console.log('No existing .env file found. Skipping backup.');
    return;
  }

  const backupDir = path.join(process.cwd(), '.backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const backupFilePath = path.join(backupDir, `.env.${timestamp}`);
  fs.copyFileSync('.env', backupFilePath);
  console.log(`Backup created: ${backupFilePath}`);
}
