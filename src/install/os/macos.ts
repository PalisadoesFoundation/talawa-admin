import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo } from '../utils/logger';

export async function installTypeScript(): Promise<void> {
  const spinner = createSpinner('Installing TypeScript...');
  spinner.start();

  try {
    await execCommand('pnpm', ['install', '-g', 'typescript'], {
      silent: true,
    });
    spinner.succeed('TypeScript installed successfully');
  } catch (error) {
    spinner.fail('Failed to install TypeScript');
    logError(`TypeScript installation failed: ${error}`);
    throw error;
  }
}

export async function installDocker(): Promise<void> {
  logInfo(
    'Docker installation requires manual setup to choose your preferred edition.',
  );
  logInfo('');
  logInfo('Docker offers two editions:');
  logInfo('  • Docker Community Edition (CE) - Free and open-source');
  logInfo(
    '  • Docker Enterprise Edition (EE) - Commercial with additional features',
  );
  logInfo('');
  logInfo('Please install Docker manually:');
  logInfo('  Docker Desktop: https://www.docker.com/products/docker-desktop');
  logInfo(
    '  Documentation: https://docs.docker.com/desktop/install/mac-install/',
  );
  logInfo('');
  logInfo('After installation, run this setup script again.');

  throw new Error(
    'Docker must be installed manually. Please follow the instructions above.',
  );
}
