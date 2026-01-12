import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function backupEnvFile(): Promise<string> {
  const backupDir = path.join(process.cwd(), '.backup');
  await mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `.env-backup-${timestamp}`);

  await copyFile('.env', backupPath);
  console.log(`Backup created: ${backupPath}`);

  return backupPath; // Return path for potential restore
}
