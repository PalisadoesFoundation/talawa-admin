export type OS = 'windows' | 'linux' | 'macos';
export type LinuxDistro = 'ubuntu' | 'debian' | 'other';

export interface IOSInfo {
  name: OS;
  distro?: LinuxDistro;
  version?: string;
}

export interface IPackageStatus {
  name: string;
  installed: boolean;
  version?: string;
}

export const PACKAGE_NAMES = [
  // 'git', // This is a prerequisite for the project
  // 'node', // Handled by shell installers (install.sh/install.ps1)
  // 'fnm', // Handled by shell installers (install.sh/install.ps1)
  // 'pnpm',
  'typescript',
  'docker',
] as const;

export type PackageName = (typeof PACKAGE_NAMES)[number];
