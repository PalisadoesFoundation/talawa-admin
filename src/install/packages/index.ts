import * as linux from '../os/linux';
import * as macos from '../os/macos';
import * as windows from '../os/windows';
import type { IOSInfo, PackageName } from '../types';

/**
 * Install a package based on OS
 */
export async function installPackage(
  pkg: PackageName,
  os: IOSInfo,
): Promise<void> {
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
    case 'typescript':
      return macos.installTypeScript();
    case 'docker':
      return macos.installDocker();
    default:
      throw new Error(`Unknown package: ${pkg}`);
  }
}
