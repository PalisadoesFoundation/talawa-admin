import { PackageName } from 'install/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkInstalledPackages } from './checker';
import { checkDocker } from './checkers';
import * as execModule from './exec';

vi.mock('./exec');

describe('checker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkInstalledPackages', () => {
    it('should check all packages and return status', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue('v1.0.0');

      const result = await checkInstalledPackages(false);

      expect(result).toHaveLength(1);
      expect(result.every((pkg) => pkg.installed)).toBe(true);
      expect(result[0].name).toBe('typescript');
    });

    it('should detect missing packages', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(false);
      vi.mocked(execModule.checkVersion).mockResolvedValue(null);

      const result = await checkInstalledPackages(false);

      expect(result.find((p) => p.name === 'typescript')?.installed).toBe(
        false,
      );
    });

    it('should include version when available', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue('v2.42.0');

      const result = await checkInstalledPackages(false);

      expect(result.find((p) => p.name === 'typescript')?.version).toBe(
        'v2.42.0',
      );
    });

    it('should handle packages without version', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue(null);

      const result = await checkInstalledPackages(false);

      expect(
        result.find((p) => p.name === 'typescript')?.version,
      ).toBeUndefined();
    });

    it('should include docker when useDocker is true', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue('v1.0.0');

      const result = await checkInstalledPackages(true);

      expect(result).toHaveLength(2);
      expect(result.find((p) => p.name === 'docker')).toBeDefined();
      expect(result.find((p) => p.name === 'typescript')).toBeDefined();
    });

    it('should throw error for unknown package type', async () => {
      const { checkPackage } = await import('./checker');
      const invalidPackage = 'unknown-package' as PackageName;

      await expect(checkPackage(invalidPackage)).rejects.toThrow(
        `Unknown package type: ${invalidPackage}. This is a programming error.`,
      );
    });

    it('should gracefully handle errors from checkPackage', async () => {
      const checkersModule = await import('./checkers');
      vi.spyOn(checkersModule, 'checkTypeScript').mockRejectedValue(
        new Error('Unknown package type'),
      );

      const result = await checkInstalledPackages(false);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].installed).toBe(false);
    });
  });

  describe('checkDocker', () => {
    it('returns not installed when docker command is missing', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(false);

      const result = await checkDocker();

      expect(result).toEqual({
        name: 'docker',
        installed: false,
      });
    });

    it('returns installed with version when docker is available', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue('v1.2.3');

      const result = await checkDocker();

      expect(result).toEqual({
        name: 'docker',
        installed: true,
        version: 'v1.2.3',
      });
    });

    it('returns installed without version when docker version is not available', async () => {
      vi.mocked(execModule.commandExists).mockResolvedValue(true);
      vi.mocked(execModule.checkVersion).mockResolvedValue(null);

      const result = await checkDocker();

      expect(result).toEqual({
        name: 'docker',
        installed: true,
        version: undefined,
      });
    });
  });
});
