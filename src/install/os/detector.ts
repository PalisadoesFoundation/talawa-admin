import { readFileSync } from 'fs';
import type { IOSInfo, LinuxDistro } from '../types';

/**
 * Detect the operating system
 */
export function detectOS(): IOSInfo {
  const platform = process.platform;

  if (platform === 'win32') {
    return { name: 'windows' };
  }

  if (platform === 'darwin') {
    return { name: 'macos' };
  }

  if (platform === 'linux') {
    try {
      const osRelease = readFileSync('/etc/os-release', 'utf8');
      const lines = osRelease.split('\n');

      let distro: LinuxDistro = 'other';
      let version: string | undefined;

      for (const line of lines) {
        if (line.startsWith('ID=')) {
          const id = line.split('=')[1].toLowerCase().replace(/"/g, '');
          if (id === 'ubuntu') {
            distro = 'ubuntu';
          } else if (id === 'debian') {
            distro = 'debian';
          }
        }
        if (line.startsWith('VERSION_ID=')) {
          version = line.split('=')[1].replace(/"/g, '');
        }
      }

      return { name: 'linux', distro, version };
    } catch {
      return { name: 'linux', distro: 'other' };
    }
  }

  // Fallback for unknown platforms
  return { name: 'linux', distro: 'other' };
}
