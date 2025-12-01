import type { IPackageStatus, PackageName } from '../types';
import { createSpinner } from './logger';
import * as checkers from './checkers';

export async function checkInstalledPackages(
  useDocker: boolean,
): Promise<IPackageStatus[]> {
  // Build packages array in correct order:
  // git, docker (if useDocker), typescript
  // Node and fnm are now handled by shell installers
  const packages: PackageName[] = ['git'];

  if (useDocker) {
    packages.push('docker');
  }

  packages.push('typescript');

  const results: IPackageStatus[] = [];

  for (const pkg of packages) {
    const spinner = createSpinner(`Checking ${pkg}...`);
    spinner.start();

    try {
      const status = await checkPackage(pkg);
      results.push(status);

      if (status.installed) {
        const versionText = status.version ? ` (${status.version})` : '';
        spinner.succeed(`${pkg}${versionText} - Already installed`);
      } else {
        spinner.stop();
        console.log(`✗ ${pkg} - Not found`);
      }
    } catch {
      spinner.fail(`Failed to check ${pkg}`);
      results.push({ name: pkg, installed: false });
    }
  }

  // fnm check removed - fnm is now handled by shell installers

  return results;
}

async function checkPackage(pkg: PackageName): Promise<IPackageStatus> {
  switch (pkg) {
    case 'git':
      return await checkers.checkGit();
    case 'node':
      return await checkers.checkNode();
    case 'fnm':
      return await checkers.checkFnm();
    // case 'pnpm':
    //   return await checkers.checkPnpm();
    case 'typescript':
      return await checkers.checkTypeScript();
    case 'docker':
      return await checkers.checkDocker();
    default:
      return { name: pkg, installed: false };
  }
}
