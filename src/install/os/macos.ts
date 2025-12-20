import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';

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
  const spinner = createSpinner('Installing Docker...');
  spinner.start();

  try {
    await execCommand('brew', ['install', '--cask', 'docker'], {
      silent: true,
    });
    spinner.succeed('Docker installed successfully');
    logWarning(
      'Please open Docker Desktop from Applications to complete setup.',
    );
  } catch (error) {
    spinner.fail('Failed to install Docker');
    logError(`Docker installation failed: ${error}`);
    logInfo(
      'Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop',
    );
    throw error;
  }
}
