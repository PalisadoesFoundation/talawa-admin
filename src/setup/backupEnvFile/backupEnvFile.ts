import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

export const backupEnvFile = async (): Promise<void> => {
  try {
    const { shouldBackup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldBackup',
        message: 'Would you like to backup the .env file?',
        default: true,
      },
    ]);

    if (shouldBackup) {
      // Create .backup directory if it doesn't exist
      const backupDir = path.join(process.cwd(), '.backup');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Generate epoch timestamp
      const epochTimestamp = Math.floor(Date.now() / 1000);
      const backupFileName = `.env.${epochTimestamp}`;
      const backupFilePath = path.join(backupDir, backupFileName);

      // Copy .env to backup location
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        fs.copyFileSync(envPath, backupFilePath);
        console.log(`\n✅ Backup created: ${backupFileName}`);
        console.log(`   Location: ${backupFilePath}`);
      } else {
        console.log('\n⚠️  No .env file found to backup.');
      }
    }
  } catch (error) {
    console.error('Error backing up .env file:', error);
    throw new Error(`Failed to backup .env file: ${(error as Error).message}`);
  }
};
