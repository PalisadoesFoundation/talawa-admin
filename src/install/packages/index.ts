import type { IOSInfo, PackageName } from '../types';
import * as windows from '../os/windows';
import * as linux from '../os/linux';
import * as macos from '../os/macos';

/**
 * Install a package based on OS
 */
export async function installPackage(
  pkg: PackageName,
  os: IOSInfo,
): Promise<void> {
  if (pkg === 'node' || pkg === 'fnm') {
    throw new Error(
      `${pkg} installation should be handled by shell installers (install.sh/install.ps1). ` +
        'Please run the shell installer first.',
    );
  }

  switch (os.name) {
    case 'windows':
      return installWindowsPackage(pkg);
    case 'linux':
      return installLinuxPackage(pkg, os);
    case 'macos':
      return installMacOSPackage(pkg);
    default:
      throw new Error(`Unsupported OS: ${os.name}`);
  }
}

async function installWindowsPackage(pkg: PackageName): Promise<void> {
  switch (pkg) {
    case 'git':
      return windows.installGit();
    case 'node':
      return windows.installNode();
    case 'fnm':
      return windows.installFnm();
    // case 'pnpm':
    //   return windows.installPnpm();
    case 'typescript':
      return windows.installTypeScript();
    case 'docker':
      return windows.installDocker();
    default:
      throw new Error(`Unknown package: ${pkg}`);
  }
}

async function installLinuxPackage(
  pkg: PackageName,
  os: IOSInfo,
): Promise<void> {
  switch (pkg) {
    case 'git':
      return linux.installGit(os);
    case 'node':
      return linux.installNode();
    case 'fnm':
      return linux.installFnm();
    // case 'pnpm':
    //   return linux.installPnpm();
    case 'typescript':
      return linux.installTypeScript();
    case 'docker':
      return linux.installDocker(os);
    default:
      throw new Error(`Unknown package: ${pkg}`);
  }
}

async function installMacOSPackage(pkg: PackageName): Promise<void> {
  switch (pkg) {
    case 'git':
      return macos.installGit();
    case 'node':
      return macos.installNode();
    case 'fnm':
      return macos.installFnm();
    // case 'pnpm':
    //   return macos.installPnpm();
    case 'typescript':
      return macos.installTypeScript();
    case 'docker':
      return macos.installDocker();
    default:
      throw new Error(`Unknown package: ${pkg}`);
  }
}
