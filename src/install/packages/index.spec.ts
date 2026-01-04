import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as linux from '../os/linux';
import * as macos from '../os/macos';
import * as windows from '../os/windows';
import type { IOSInfo, PackageName } from '../types';
import { installPackage } from './index';

vi.mock('../os/windows');
vi.mock('../os/linux');
vi.mock('../os/macos');

describe('packages/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('installPackage', () => {
    it('should call Windows installer for Windows OS', async () => {
      const os: IOSInfo = { name: 'windows' };
      vi.mocked(windows.installDocker).mockResolvedValue();

      await installPackage('docker', os);

      expect(windows.installDocker).toHaveBeenCalled();
    });

    it('should call Linux installer for Linux OS', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu' };
      vi.mocked(linux.installDocker).mockResolvedValue();

      await installPackage('docker', os);

      expect(linux.installDocker).toHaveBeenCalledWith(os);
    });

    it('should call macOS installer for macOS OS', async () => {
      const os: IOSInfo = { name: 'macos' };
      vi.mocked(macos.installDocker).mockResolvedValue();

      await installPackage('docker', os);

      expect(macos.installDocker).toHaveBeenCalled();
    });

    it('should route TypeScript installation for Linux OS', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu' };
      vi.mocked(linux.installTypeScript).mockResolvedValue();

      await installPackage('typescript', os);

      expect(linux.installTypeScript).toHaveBeenCalled();
    });

    it('should route TypeScript installation for macOS OS', async () => {
      const os: IOSInfo = { name: 'macos' };
      vi.mocked(macos.installTypeScript).mockResolvedValue();

      await installPackage('typescript', os);

      expect(macos.installTypeScript).toHaveBeenCalled();
    });

    it('should throw error for unsupported OS', async () => {
      const os = { name: 'unknown' } as unknown as IOSInfo;

      await expect(installPackage('docker', os)).rejects.toThrow(
        'Unsupported OS',
      );
    });

    it('should route all package types correctly', async () => {
      const os: IOSInfo = { name: 'windows' };
      const packages: PackageName[] = ['typescript', 'docker'];

      vi.mocked(windows.installTypeScript).mockResolvedValue();
      vi.mocked(windows.installDocker).mockResolvedValue();

      for (const pkg of packages) {
        await installPackage(pkg, os);
      }

      expect(windows.installTypeScript).toHaveBeenCalled();
      expect(windows.installDocker).toHaveBeenCalled();
    });

    it('should throw error for unknown package', async () => {
      const os: IOSInfo = { name: 'windows' };

      await expect(
        installPackage('unknown' as PackageName, os),
      ).rejects.toThrow('Unknown package');
    });

    it('should throw error for unknown package on Linux', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu' };

      await expect(
        installPackage('unknown' as PackageName, os),
      ).rejects.toThrow('Unknown package');
    });

    it('should throw error for unknown package on macOS', async () => {
      const os: IOSInfo = { name: 'macos' };

      await expect(
        installPackage('unknown' as PackageName, os),
      ).rejects.toThrow('Unknown package');
    });
  });
});
