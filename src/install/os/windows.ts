import { checkVersion, execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';

export async function installTypeScript(): Promise<void> {
  const spinner = createSpinner('Installing TypeScript...');
  spinner.start();

  try {
    // Check if pnpm exists, fallback to npm
    const { commandExists } = await import('../utils/exec');
    const hasPnpm = await commandExists('pnpm');
    const packageManager = hasPnpm ? 'pnpm' : 'npm';

    if (!hasPnpm) {
      logWarning('pnpm not found, using npm instead');
    }

    await execCommand(packageManager, ['install', '-g', 'typescript'], {
      silent: true,
    });
    spinner.succeed('TypeScript installed successfully');

    // Verify installation
    const tscExists = await commandExists('tsc');
    if (!tscExists) {
      logWarning(
        'TypeScript installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
      );
    } else {
      const version = await checkVersion('tsc');
      if (version) {
        logInfo(`TypeScript version: ${version}`);
      }
    }
  } catch (error) {
    spinner.fail('Failed to install TypeScript');
    logError(`TypeScript installation failed: ${error}`);
    logInfo(
      'Please install TypeScript manually from https://www.npmjs.com/package/typescript',
    );
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
    '  Documentation: https://docs.docker.com/desktop/install/windows-install/',
  );
  logInfo('');
  logInfo('After installation, run this setup script again.');

  throw new Error(
    'Docker must be installed manually. Please follow the instructions above.',
  );
}
