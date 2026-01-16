import { mkdir, copyFile, access } from 'fs/promises';
import path from 'path';

export const backupEnvFile = async (): Promise<string | null> => {
  try {
    const backupDir = path.join(process.cwd(), '.backup');
    await mkdir(backupDir, { recursive: true });

    const epochTimestamp = Math.floor(Date.now() / 1000);
    const backupFileName = `.env.${epochTimestamp}`;
    const backupFilePath = path.join(backupDir, backupFileName);

    const envPath = path.join(process.cwd(), '.env');

    try {
      await access(envPath);
      await copyFile(envPath, backupFilePath);

      console.log('\nℹ️  Backing up existing .env file');
      console.log(`✅ Backup created: ${backupFileName}`);
      console.log(`Location: ${backupFilePath}`);

      return backupFilePath;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === 'ENOENT') {
        console.log('\n⚠️  No .env file found to backup.');
        return null;
      }

      throw error;
    }
  } catch (error) {
    console.error('Error backing up .env file:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to backup .env file: ${errorMessage}`);
  }
};
