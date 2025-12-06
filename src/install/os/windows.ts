import { execCommand, commandExists, checkVersion } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';

/**
 * Windows-specific package installers
 *
 * NOTE: Git/Node/fnm installation is now handled by shell installers
 * (scripts/install.sh / scripts/install.ps1). The TypeScript-level helpers
 * below are intentionally commented out to avoid duplicating that logic and
 * are kept only for historical/reference purposes.
 */

// export async function installGit(): Promise<void> {
//   const spinner = createSpinner('Installing Git...');
//   spinner.start();
//
//   try {
//     // Try winget first
//     try {
//       await execCommand(
//         'winget',
//         [
//           'install',
//           '--id',
//           'Git.Git',
//           '-e',
//           '--accept-source-agreements',
//           '--accept-package-agreements',
//         ],
//         {
//           silent: true,
//         },
//       );
//       spinner.succeed('Git installed successfully');
//
//       // Verify installation
//       const gitExists = await commandExists('git');
//       if (!gitExists) {
//         logWarning(
//           'Git installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
//         );
//       } else {
//         const version = await checkVersion('git');
//         if (version) {
//           logInfo(`Git version: ${version}`);
//         }
//       }
//       return;
//     } catch {
//       // winget failed, try chocolatey
//       logInfo('winget failed, trying chocolatey...');
//       try {
//         await execCommand('choco', ['install', 'git', '-y'], {
//           silent: true,
//         });
//         spinner.succeed('Git installed successfully');
//
//         // Verify installation
//         const gitExists = await commandExists('git');
//         if (!gitExists) {
//           logWarning(
//             'Git installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
//           );
//         } else {
//           const version = await checkVersion('git');
//           if (version) {
//             logInfo(`Git version: ${version}`);
//           }
//         }
//         return;
//       } catch {
//         throw new Error(
//           'Neither winget nor chocolatey found. Please install Git manually from https://git-scm.com/downloads',
//         );
//       }
//     }
//   } catch (error) {
//     spinner.fail('Failed to install Git');
//     logError(`Git installation failed: ${error}`);
//     throw error;
//   }
// }
//
// export async function installNode(): Promise<void> {
//   const spinner = createSpinner('Installing Node.js...');
//   spinner.start();
//
//   // Install fnm first, then use it to install Node.js
//   try {
//     await installFnm();
//   } catch (error) {
//     spinner.fail('Failed to install fnm (required for Node.js installation)');
//     logError(`fnm installation failed: ${error}`);
//     throw new Error(
//       'Failed to install fnm (required for Node.js installation). Please install fnm manually and try again.',
//     );
//   }
//
//   // Activate fnm and use it to install Node.js in the same PowerShell session
//   try {
//     await execCommand(
//       'powershell',
//       [
//         '-Command',
//         'fnm env --use-on-cd | Out-String | Invoke-Expression; fnm install --lts; fnm use --install-if-missing lts-latest',
//       ],
//       {
//         silent: true,
//       },
//     );
//
//     spinner.succeed('Node.js installed successfully via fnm');
//     logWarning(
//       'Please restart your terminal or run: fnm env --use-on-cd | Out-String | Invoke-Expression',
//     );
//
//     // Verify installation (may fail until terminal is restarted)
//     const nodeExists = await commandExists('node');
//     if (!nodeExists) {
//       logWarning(
//         'Node.js installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
//       );
//     } else {
//       const version = await checkVersion('node');
//       if (version) {
//         logInfo(`Node.js version: ${version}`);
//       }
//     }
//   } catch (error) {
//     spinner.fail('Failed to install Node.js via fnm');
//     logError(`Node.js installation failed: ${error}`);
//     logWarning(
//       'Please run manually: fnm install --lts && fnm use --install-if-missing lts-latest',
//     );
//     logWarning(
//       'Then restart your terminal or run: fnm env --use-on-cd | Out-String | Invoke-Expression',
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
//     await execCommand(
//       'winget',
//       [
//         'install',
//         '--id',
//         'Schniz.fnm',
//         '-e',
//         '--accept-source-agreements',
//         '--accept-package-agreements',
//       ],
//       {
//         silent: true,
//       },
//     );
//     spinner.succeed('fnm installed successfully');
//     logWarning(
//       'Please restart your terminal or run: fnm env --use-on-cd | Out-String | Invoke-Expression',
//     );
//
//     // Verify installation (may fail until terminal is restarted)
//     const doesFnmExist = await commandExists('fnm');
//     if (!doesFnmExist) {
//       logWarning(
//         'fnm installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
//       );
//     } else {
//       const version = await checkVersion('fnm');
//       if (version) {
//         logInfo(`fnm version: ${version}`);
//       }
//     }
//   } catch (error) {
//     spinner.fail('Failed to install fnm');
//     logError(`fnm installation failed: ${error}`);
//     throw error;
//   }
// }

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
