import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';

/**
 * macOS-specific package installers
 *
 * NOTE: Git/Node/fnm installation is now handled by shell installers
 * (scripts/install.sh / scripts/install.ps1). The TypeScript-level helpers
 * below are intentionally commented out to avoid duplicating that logic and
 * are kept only for historical/reference purposes.
 */

// export async function installGit(): Promise<void> {
//   const spinner = createSpinner('Checking Git...');
//   spinner.start();
//
//   try {
//     // Check if git is already installed (usually pre-installed on macOS)
//     const { commandExists } = await import('../utils/exec');
//     const exists = await commandExists('git');
//     if (exists) {
//       spinner.succeed('Git is already installed');
//       return;
//     }
//
//     // Install via Homebrew
//     await execCommand('brew', ['install', 'git'], {
//       silent: true,
//     });
//     spinner.succeed('Git installed successfully');
//   } catch (error) {
//     spinner.fail('Failed to install Git');
//     logError(`Git installation failed: ${error}`);
//     logWarning(
//       'Git may already be installed. If not, install Homebrew first: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"',
//     );
//     throw error;
//   }
// }
//
// export async function installNode(): Promise<void> {
//   const spinner = createSpinner('Installing Node.js...');
//   spinner.start();
//
//   try {
//     // Install fnm first
//     await installFnm();
//
//     spinner.succeed('fnm is available for Node.js management');
//
//     // Ask user if they want to auto-install Node.js now
//     const inquirer = (await import('inquirer')).default;
//     const { autoInstall } = await inquirer.prompt<{
//       autoInstall: boolean;
//     }>([
//       {
//         type: 'confirm',
//         name: 'autoInstall',
//         message:
//           'Do you want to automatically install the latest LTS version of Node.js using fnm now?',
//         default: true,
//       },
//     ]);
//
//     if (!autoInstall) {
//       logWarning(
//         'Skipping automatic Node.js installation. You can install it later with:',
//       );
//       logWarning(
//         '  fnm install --lts && fnm use --install-if-missing lts-latest',
//       );
//       logWarning(
//         'Then add to your shell config: eval \"$(fnm env --use-on-cd)\"',
//       );
//       return;
//     }
//
//     // In this process, make sure fnm is available and install latest LTS Node
//     const fnmDir = process.env.HOME ? `${process.env.HOME}/.fnm` : '$HOME/.fnm';
//     const setupFnmEnv = `export FNM_DIR=\"${fnmDir}\"; export PATH=\"$FNM_DIR:$PATH\"`;
//
//     const nodeSpinner = createSpinner(
//       'Installing latest LTS Node.js via fnm...',
//     );
//     nodeSpinner.start();
//
//     try {
//       await execCommand(
//         'bash',
//         [
//           '-c',
//           `${setupFnmEnv}; fnm install --lts; fnm use --install-if-missing lts-latest`,
//         ],
//         { silent: true },
//       );
//
//       nodeSpinner.succeed('Node.js (LTS) installed successfully via fnm');
//       logWarning(
//         'Node.js is managed by fnm. To make it available in new terminals, add to your shell config:',
//       );
//       logWarning('  eval \"$(fnm env --use-on-cd)\"');
//     } catch (error) {
//       nodeSpinner.fail('Failed to install Node.js via fnm');
//       throw error;
//     }
//   } catch (error) {
//     spinner.fail('Failed to install Node.js');
//     logError(`Node.js installation failed: ${error}`);
//     logInfo(
//       'Alternatively, you can install Node.js using the official installer from https://nodejs.org/en/download',
//     );
//     throw error;
//   }
// }
//
// export async function installFnm(): Promise<void> {
//   const fnmExists = await commandExists('fnm');
//   if (fnmExists) {
//     logInfo('fnm is already installed');
//     const version = await checkVersion('fnm');
//     if (version) {
//       logInfo(`fnm version: ${version}`);
//     }
//     return; // Skip installation if already installed
//   }
//
//   const spinner = createSpinner('Installing fnm...');
//   spinner.start();
//
//   try {
//     // Try Homebrew first
//     try {
//       await execCommand('brew', ['install', 'fnm'], {
//         silent: true,
//       });
//       spinner.succeed('fnm installed successfully');
//       logWarning(
//         'Please restart your terminal or add to your shell config: eval \"$(fnm env --use-on-cd)\"',
//       );
//       return;
//     } catch {
//       // Fallback to curl installer
//       await execCommand(
//         'bash',
//         [
//           '-c',
//           'curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir \"$HOME/.fnm\" --skip-shell',
//         ],
//         {
//           silent: true,
//         },
//       );
//       spinner.succeed('fnm installed successfully');
//       logWarning(
//         'Please restart your terminal or add to your shell config: eval \"$(fnm env --use-on-cd)\"',
//       );
//     }
//   } catch (error) {
//     spinner.fail('Failed to install fnm');
//     logError(`fnm installation failed: ${error}`);
//     logWarning(
//       'Please install Homebrew first: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"',
//     );
//     throw error;
//   }
// }

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
