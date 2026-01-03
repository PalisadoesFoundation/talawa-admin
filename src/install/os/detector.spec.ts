import { readFileSync } from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectOS, isRunningInWsl } from './detector';

vi.mock('fs');

describe('detector', () => {
  let originalPlatform: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalPlatform = process.platform;
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
    });
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  const setPlatform = (platform: string) => {
    Object.defineProperty(process, 'platform', {
      value: platform,
      writable: true,
    });
  };

  describe('isRunningInWsl', () => {
    it('should return true when WSL_DISTRO_NAME is set', () => {
      process.env.WSL_DISTRO_NAME = 'Ubuntu';
      expect(isRunningInWsl()).toBe(true);
    });

    it('should return true when /proc/version contains Microsoft', () => {
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockReturnValue(
        'Linux version 5.15.0-1-Microsoft-standard-WSL2',
      );
      expect(isRunningInWsl()).toBe(true);
    });

    it('should return true when /proc/version contains WSL (case-insensitive)', () => {
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockReturnValue('Linux version 5.15.0 (WSL2)');
      expect(isRunningInWsl()).toBe(true);
    });

    it('should return false for native Linux', () => {
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockReturnValue(
        'Linux version 5.15.0-generic (Ubuntu)',
      );
      expect(isRunningInWsl()).toBe(false);
    });

    it('should return false when /proc/version cannot be read', () => {
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation(() => {
        throw new Error('File not found');
      });
      expect(isRunningInWsl()).toBe(false);
    });
  });

  describe('detectOS', () => {
    it('should detect Windows', () => {
      setPlatform('win32');
      expect(detectOS().name).toBe('windows');
    });

    it('should detect macOS', () => {
      setPlatform('darwin');
      expect(detectOS().name).toBe('macos');
    });

    it('should detect Ubuntu Linux', () => {
      setPlatform('linux');
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation((path: unknown) => {
        if (path === '/proc/version') {
          return 'Linux version 5.15.0-generic';
        }
        return 'ID=ubuntu\nVERSION_ID="22.04"\n';
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('ubuntu');
      expect(result.version).toBe('22.04');
      expect(result.isWsl).toBe(false);
    });

    it('should detect Debian Linux', () => {
      setPlatform('linux');
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation((path: unknown) => {
        if (path === '/proc/version') {
          return 'Linux version 5.15.0-generic';
        }
        return 'ID=debian\nVERSION_ID="11"\n';
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('debian');
      expect(result.isWsl).toBe(false);
    });

    it('should detect WSL Ubuntu', () => {
      setPlatform('linux');
      process.env.WSL_DISTRO_NAME = 'Ubuntu';
      vi.mocked(readFileSync).mockReturnValue(
        'ID=ubuntu\nVERSION_ID="22.04"\n',
      );
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('ubuntu');
      expect(result.isWsl).toBe(true);
    });

    it('should detect WSL via /proc/version', () => {
      setPlatform('linux');
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation((path: unknown) => {
        if (path === '/proc/version') {
          return 'Linux version 5.15.0-1-Microsoft-standard-WSL2';
        }
        return 'ID=ubuntu\nVERSION_ID="22.04"\n';
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.isWsl).toBe(true);
    });

    it('should default to other for unknown Linux distro', () => {
      setPlatform('linux');
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation((path: unknown) => {
        if (path === '/proc/version') {
          return 'Linux version 5.15.0-generic';
        }
        return 'ID=arch\n';
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('other');
    });

    it('should handle file read errors gracefully', () => {
      setPlatform('linux');
      delete process.env.WSL_DISTRO_NAME;
      vi.mocked(readFileSync).mockImplementation(() => {
        throw new Error('File not found');
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('other');
      expect(result.isWsl).toBe(false);
    });

    it('should fallback to linux for unknown platforms', () => {
      setPlatform('freebsd');
      expect(detectOS()).toEqual({ name: 'linux', distro: 'other' });
    });
  });
});
