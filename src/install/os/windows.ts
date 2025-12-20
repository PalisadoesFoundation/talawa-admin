import { checkVersion, commandExists, execCommand } from '../utils/exec';
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
  const spinner = createSpinner('Installing Docker Desktop...');
  spinner.start();

  try {
    await execCommand(
      'winget',
      [
        'install',
        '--id',
        'Docker.DockerDesktop',
        '-e',
        '--accept-source-agreements',
        '--accept-package-agreements',
      ],
      {
        silent: true,
      },
    );
    spinner.succeed('Docker installed successfully');
    logWarning(
      'Docker Desktop requires a restart. Please restart your computer after installation.',
    );

    // Verify installation (may fail until Docker Desktop is started)
    const dockerExists = await commandExists('docker');
    if (!dockerExists) {
      logWarning(
        'Docker installation completed but verification failed. Docker Desktop may need to be started or PATH may need to be refreshed.',
      );
    } else {
      const version = await checkVersion('docker');
      if (version) {
        logInfo(`Docker version: ${version}`);
      }
    }
  } catch (error) {
    spinner.fail('Failed to install Docker');
    logError(`Docker installation failed: ${error}`);
    logInfo(
      'Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop',
    );
    throw error;
  }
}
