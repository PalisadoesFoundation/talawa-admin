import { mkdir, copyFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export const backupEnvFile = async (): Promise<void> => {
  try {
    const { shouldBackup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldBackup',
        message:
          'Would you like to back up the current .env file before setup modifies it?',
        default: true,
      },
    ]);

    if (shouldBackup) {
      // Create .backup directory
      const backupDir = path.join(process.cwd(), '.backup');
      await mkdir(backupDir, { recursive: true });

      // Generate epoch timestamp
      const epochTimestamp = Math.floor(Date.now() / 1000);
      const backupFileName = `.env.${epochTimestamp}`;
      const backupFilePath = path.join(backupDir, backupFileName);

      // Copy .env to backup location
      const envPath = path.join(process.cwd(), '.env');
      try {
        await access(envPath, constants.F_OK);
        await copyFile(envPath, backupFilePath);
        console.log(`\n✅ Backup created: ${backupFileName}`);
        console.log(`   Location: ${backupFilePath}`);
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') {
          console.log('\n⚠️  No .env file found to backup.');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error backing up .env file:', error);
    throw new Error(`Failed to backup .env file: ${(error as Error).message}`);
  }
};
