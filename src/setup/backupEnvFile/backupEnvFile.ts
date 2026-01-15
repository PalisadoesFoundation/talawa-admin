import path from 'path';
import { mkdir, copyFile } from 'fs/promises';

export async function backupEnvFile(): Promise<string | null> {
  const backupDir = path.join(process.cwd(), '.backup');
  await mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `.env-backup-${timestamp}`);

  await copyFile('.env', backupPath);
  console.log(`Backup created: ${backupPath}`);
  if (!backupPath) {
    console.error('Failed to return the backup path for .env');
  } else {
    console.log(`Backup path created successfully`);
  }
  return backupPath; // Return path for potential restore
}
