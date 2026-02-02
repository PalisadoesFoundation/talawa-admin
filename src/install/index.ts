import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { detectOS } from './os/detector';
import { installPackage } from './packages';
import type { IPackageStatus, PackageName } from './types';
import { checkInstalledPackages } from './utils/checker';
import { logError, logInfo, logStep, logSuccess } from './utils/logger';

/**
 * Main installation function
 */
export async function main(): Promise<void> {
  try {
    console.log('Welcome to Talawa Admin Installation! 🚀');

    const os = detectOS();
    logInfo(`Detected OS: ${os.name}${os.distro ? ` (${os.distro})` : ''}`);

    const useDocker = await promptDockerChoice();

    logStep('Checking installed prerequisites...');
    const installedPackages = await checkInstalledPackages(useDocker);
    console.log('');

    const packagesToInstall = await promptPackagesToInstall(installedPackages);

    if (packagesToInstall.length === 0) {
      logSuccess('All required packages are already installed!');
    } else {
      logStep(`Installing ${packagesToInstall.length} package(s)...`);
      for (const pkg of packagesToInstall) {
        try {
          await installPackage(pkg as PackageName, os);
        } catch {
          logError(`Failed to install ${pkg}`);
          const { continueInstall } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continueInstall',
              message: `Continue with remaining installations?`,
              default: true,
            },
          ]);
          if (!continueInstall) {
            throw new Error('Installation cancelled by user');
          }
        }
      }
    }

    displaySuccessMessage(packagesToInstall);
  } catch (error) {
    logError(`Installation failed: ${error}`);
    console.log(
      '\nPlease try again or contact project maintainers if the issue persists.',
    );
    process.exit(1);
  }
}

/**
 * Prompt user for Docker choice
 */
async function promptDockerChoice(): Promise<boolean> {
  const { useDocker } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Would you like to use Docker for this installation?',
      default: false,
    },
  ]);
  console.log('');
  return useDocker;
}

/**
 * Prompt user for packages to install
 */
async function promptPackagesToInstall(
  installed: IPackageStatus[],
): Promise<string[]> {
  const missing = installed.filter((p) => !p.installed);

  if (missing.length === 0) {
    return [];
  }

  const choices = missing.map((pkg) => ({
    name: pkg.name,
    value: pkg.name,
    checked: true,
  }));

  const { packages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'packages',
      message: 'Select packages to install:',
      choices,
    },
  ]);

  return packages;
}

/**
 * Display success message
 */
function displaySuccessMessage(packagesInstalled: string[]): void {
  console.log('');
  console.log(
    'Congratulations, necessary packages to set up the Talawa Admin have been installed.🥂🎉',
  );
  console.log('');

  if (packagesInstalled.length > 0) {
    console.log('The following packages have been installed:');
    packagesInstalled.forEach((pkg) => {
      logSuccess(`  ✓ ${pkg}`);
    });
  }

  console.log('Next steps:');
  console.log('  1. Run the setup script to configure Talawa Admin:');
  console.log('     $ pnpm run setup');
  console.log('');
  console.log('For more information, visit:');
  console.log('  https://docs-admin.talawa.io/docs/installation');
}

export function handleDirectExecutionError(error: unknown): void {
  console.error('Unhandled error:', error);
  process.exit(1);
}

/**
 * Runs the main installation function if this file is executed directly.
 *
 * @param argv - The command line arguments array to check. Defaults to process.argv.
 * @param currentFilePath - The current file path to compare against argv[1]. Defaults to fileURLToPath(import.meta.url).
 * @param mainFn - The async main function to execute when direct execution is detected. Defaults to the exported main function.
 * @param errorHandler - The error handler function to call if mainFn throws an error. Defaults to handleDirectExecutionError.
 * @returns void
 */
export function runIfDirectExecution(
  argv: string[] = process.argv,
  currentFilePath: string = fileURLToPath(import.meta.url),
  mainFn: () => Promise<void> = main,
  errorHandler: (error: unknown) => void = handleDirectExecutionError,
): void {
  if (argv[1] === currentFilePath || argv[1]?.includes('install/index.ts')) {
    mainFn().catch(errorHandler);
  }
}

// Run main if this file is executed directly
runIfDirectExecution();
