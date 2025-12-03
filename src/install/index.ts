import inquirer from 'inquirer';
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

    // Skip project dependencies installation - already handled by shell installer
    logInfo('Project dependencies already installed by shell installer.');
    console.log('');

    // Phase 7: Final instructions
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
    name: `${pkg.name}${pkg.version ? ` (${pkg.version})` : ''}`,
    value: pkg.name,
    checked: isRequired(pkg.name),
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
 * Check if a package is required
 */
function isRequired(pkgName: string): boolean {
  // Core required packages: typescript
  // docker is required when useDocker is true (it only appears when selected)
  // Git is required to clone the repo, so we don't check for it here
  // Node and fnm are now handled by shell installers
  const required = ['typescript', 'docker'];
  // const required = ['git', 'typescript', 'docker']; // git commented out - required to clone repo
  return required.includes(pkgName);
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
    console.log('');
  }

  console.log('Next steps:');
  console.log('  1. Run the setup script to configure Talawa Admin:');
  console.log('     $ pnpm run setup');
  console.log('');
  console.log('  2. After setup, start the application:');
  console.log('     $ pnpm run serve');
  console.log('');
  console.log('For more information, visit:');
  console.log('  https://docs-admin.talawa.io/docs/installation\n');
}

// Run main if this file is executed directly
if (
  import.meta.url.endsWith(process.argv[1]) ||
  process.argv[1]?.includes('install/index.ts')
) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
