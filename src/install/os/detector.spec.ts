import { readFileSync } from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectOS } from './detector';

vi.mock('fs');

describe('detector', () => {
  let originalPlatform: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalPlatform = process.platform;
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  const setPlatform = (platform: string) => {
    Object.defineProperty(process, 'platform', {
      value: platform,
      writable: true,
    });
  };

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
      vi.mocked(readFileSync).mockReturnValue(
        'ID=ubuntu\nVERSION_ID="22.04"\n',
      );
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('ubuntu');
      expect(result.version).toBe('22.04');
    });

    it('should detect Debian Linux', () => {
      setPlatform('linux');
      vi.mocked(readFileSync).mockReturnValue('ID=debian\nVERSION_ID="11"\n');
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('debian');
    });

    it('should default to other for unknown Linux distro', () => {
      setPlatform('linux');
      vi.mocked(readFileSync).mockReturnValue('ID=arch\n');
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('other');
    });

    it('should handle file read errors gracefully', () => {
      setPlatform('linux');
      vi.mocked(readFileSync).mockImplementation(() => {
        throw new Error('File not found');
      });
      const result = detectOS();
      expect(result.name).toBe('linux');
      expect(result.distro).toBe('other');
    });

    it('should fallback to linux for unknown platforms', () => {
      setPlatform('freebsd');
      expect(detectOS()).toEqual({ name: 'linux', distro: 'other' });
    });
  });
});
