import type { IPackageStatus, PackageName } from '../types';
import { createSpinner } from './logger';
import * as checkers from './checkers';

export async function checkInstalledPackages(
  useDocker: boolean,
): Promise<IPackageStatus[]> {
  // Build packages array in correct order:
  // docker (if useDocker), typescript
  const packages: PackageName[] = [];

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

  return results;
}

export async function checkPackage(pkg: PackageName): Promise<IPackageStatus> {
  switch (pkg) {
    case 'typescript':
      return await checkers.checkTypeScript();
    case 'docker':
      return await checkers.checkDocker();
    default:
      throw new Error(
        `Unknown package type: ${pkg}. This is a programming error.`,
      );
  }
}
