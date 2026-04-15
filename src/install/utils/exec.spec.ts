import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkVersion, commandExists, deps, execCommand } from './exec';

describe('exec', () => {
  let originalExec: typeof deps.exec;

  beforeEach(() => {
    vi.restoreAllMocks();
    // Save the original exec function
    originalExec = deps.exec;
    // Replace with a mock
    deps.exec = vi.fn();
  });

  afterEach(() => {
    // Restore the original
    deps.exec = originalExec;
  });

  describe('execCommand', () => {
    let originalPlatform: PropertyDescriptor | undefined;
    let originalConsoleWarn: typeof console.warn;

    beforeEach(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
      originalConsoleWarn = console.warn;
    });

    afterEach(() => {
      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
      console.warn = originalConsoleWarn;
      vi.restoreAllMocks();
    });

    it('should execute command successfully', async () => {
      vi.mocked(deps.exec).mockResolvedValue({ stdout: 'output', stderr: '' });

      const result = await execCommand('test', ['arg1', 'arg2']);

      expect(result.stdout).toBe('output');
      expect(result.stderr).toBe('');
    });

    it('should handle command errors', async () => {
      const error = new Error('Command failed');
      (error as NodeJS.ErrnoException & { stderr?: string }).stderr =
        'error message';
      vi.mocked(deps.exec).mockRejectedValue(error);

      await expect(execCommand('test', [])).rejects.toThrow();
    });

    describe('sudo option', () => {
      it('should prepend sudo on non-Windows platforms', async () => {
        Object.defineProperty(process, 'platform', {
          value: 'linux',
          writable: true,
          configurable: true,
        });

        vi.mocked(deps.exec).mockResolvedValue({
          stdout: 'output',
          stderr: '',
        });

        await execCommand('test', ['arg1'], { sudo: true });

        expect(deps.exec).toHaveBeenCalledWith(
          'sudo test arg1',
          expect.any(Object),
        );
      });

      it('should warn but not prepend sudo on Windows', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        Object.defineProperty(process, 'platform', {
          value: 'win32',
          writable: true,
          configurable: true,
        });

        vi.mocked(deps.exec).mockResolvedValue({
          stdout: 'output',
          stderr: '',
        });

        await execCommand('test', ['arg1'], { sudo: true });

        expect(warnSpy).toHaveBeenCalledWith(
          'Warning: sudo is not supported on Windows. Command will run without elevation.',
        );
        expect(deps.exec).toHaveBeenCalledWith('test arg1', expect.any(Object));
      });
    });
  });

  describe('commandExists', () => {
    let originalPlatform: PropertyDescriptor | undefined;

    beforeEach(() => {
      originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
    });

    afterEach(() => {
      if (originalPlatform) {
        Object.defineProperty(process, 'platform', originalPlatform);
      }
    });

    it('should return true if command exists on Windows', async () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true,
      });

      vi.mocked(deps.exec).mockResolvedValue({
        stdout: 'C:\\path\\to\\command',
        stderr: '',
      });

      const exists = await commandExists('test');

      expect(exists).toBe(true);
    });

    it('should return false if command does not exist', async () => {
      vi.mocked(deps.exec).mockRejectedValue(new Error('not found'));

      const exists = await commandExists('nonexistent');

      expect(exists).toBe(false);
    });
  });

  describe('checkVersion', () => {
    it('should return version string on success', async () => {
      vi.mocked(deps.exec).mockResolvedValue({ stdout: 'v1.0.0', stderr: '' });

      const version = await checkVersion('test');

      expect(version).toBe('v1.0.0');
    });

    it('should return null on error', async () => {
      vi.mocked(deps.exec).mockRejectedValue(new Error('failed'));

      const version = await checkVersion('test');

      expect(version).toBeNull();
    });
  });
});
