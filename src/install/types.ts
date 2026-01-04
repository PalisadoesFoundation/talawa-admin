export type OS = 'windows' | 'linux' | 'macos';
export type LinuxDistro = 'ubuntu' | 'debian' | 'other';

export interface IOSInfo {
  name: OS;
  distro?: LinuxDistro;
  version?: string;
  isWsl?: boolean;
}

export interface IPackageStatus {
  name: string;
  installed: boolean;
  version?: string;
}

export const PACKAGE_NAMES = ['typescript', 'docker'] as const;

export type PackageName = (typeof PACKAGE_NAMES)[number];
