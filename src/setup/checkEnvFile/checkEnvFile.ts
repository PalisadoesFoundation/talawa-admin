import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export function checkEnvFile(): void {
  // create .env file if not found
  if (!fs.existsSync('.env')) {
    fs.copyFileSync('.env.example', '.env');
  }

  const env = dotenv.parse(fs.readFileSync('.env'));
  const envSample = dotenv.parse(fs.readFileSync('.env.example'));
  const misplaced = Object.keys(envSample).filter((key) => !(key in env));
  if (misplaced.length > 0) {
    const config = dotenv.parse(fs.readFileSync('.env.example'));
    misplaced.map((key) =>
      fs.appendFileSync('.env', `${key}=${config[key]}\n`),
    );
  }
}
