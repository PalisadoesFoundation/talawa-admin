import type { IOSInfo } from '../types';
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

export async function installDocker(os: IOSInfo): Promise<void> {
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
  logInfo('  Documentation: https://docs.docker.com/engine/install/');
  logInfo('');
  if (os.distro === 'ubuntu') {
    logInfo('  Ubuntu: https://docs.docker.com/engine/install/ubuntu/');
  } else if (os.distro === 'debian') {
    logInfo('  Debian: https://docs.docker.com/engine/install/debian/');
  } else {
    logInfo(`  ${os.distro}: https://docs.docker.com/engine/install/`);
  }
  logInfo('');
  logInfo('After installation, run this setup script again.');

  throw new Error(
    'Docker must be installed manually. Please follow the instructions above.',
  );
}
