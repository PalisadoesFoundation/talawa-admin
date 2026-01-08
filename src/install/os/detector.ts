import { readFileSync } from 'fs';
import type { IOSInfo, LinuxDistro } from '../types';

/**
 * Check if running inside WSL (Windows Subsystem for Linux)
 */
export function isRunningInWsl(): boolean {
  // Check WSL_DISTRO_NAME environment variable (set by WSL)
  if (process.env.WSL_DISTRO_NAME) {
    return true;
  }

  // Check /proc/version for Microsoft or WSL indicators
  try {
    const procVersion = readFileSync('/proc/version', 'utf8').toLowerCase();
    if (procVersion.includes('microsoft') || procVersion.includes('wsl')) {
      return true;
    }
  } catch {
    // File doesn't exist or can't be read - not WSL
  }

  return false;
}

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
    const isWsl = isRunningInWsl();

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

      return { name: 'linux', distro, version, isWsl };
    } catch {
      return { name: 'linux', distro: 'other', isWsl };
    }
  }

  // Fallback for unknown platforms
  return { name: 'linux', distro: 'other' };
}
