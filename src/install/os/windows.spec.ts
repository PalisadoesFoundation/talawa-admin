import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkVersion, commandExists, execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';
import { installDocker, installTypeScript } from './windows';

vi.mock('../utils/exec');
vi.mock('../utils/logger', () => {
  const originalModule = vi.importActual('../utils/logger');
  return {
    ...(originalModule as object),
    createSpinner: vi.fn(),
    logError: vi.fn(),
    logInfo: vi.fn(),
    logWarning: vi.fn(),
  };
});

describe('Windows installers', () => {
  const spinnerMock = {
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    stop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createSpinner).mockReturnValue(spinnerMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('installTypeScript', () => {
    it('uses pnpm when available', async () => {
      // First dynamic commandExists for pnpm inside installTypeScript
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });
      vi.mocked(commandExists).mockResolvedValueOnce(true); // for pnpm
      vi.mocked(commandExists).mockResolvedValueOnce(true); // for tsc
      vi.mocked(checkVersion).mockResolvedValue('5.0.0');

      await installTypeScript();

      expect(execCommand).toHaveBeenCalledWith(
        'pnpm',
        ['install', '-g', 'typescript'],
        expect.objectContaining({ silent: true }),
      );
      expect(spinnerMock.succeed).toHaveBeenCalledWith(
        'TypeScript installed successfully',
      );
      expect(commandExists).toHaveBeenCalledWith('tsc');
      expect(checkVersion).toHaveBeenCalledWith('tsc');
    });

    it('falls back to npm when pnpm is not available', async () => {
      const dynamicExecModule = await import('../utils/exec');
      // First commandExists call within installTypeScript's dynamic import
      vi.mocked(dynamicExecModule.commandExists).mockResolvedValueOnce(false);
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });
      vi.mocked(commandExists).mockResolvedValueOnce(true); // for tsc

      await installTypeScript();

      expect(logWarning).toHaveBeenCalledWith(
        'pnpm not found, using npm instead',
      );
      expect(execCommand).toHaveBeenCalledWith(
        'npm',
        ['install', '-g', 'typescript'],
        expect.objectContaining({ silent: true }),
      );
    });

    it('warns when verification fails after installation', async () => {
      const dynamicExecModule = await import('../utils/exec');
      vi.mocked(dynamicExecModule.commandExists).mockResolvedValueOnce(true); // pnpm exists
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });
      vi.mocked(commandExists).mockResolvedValueOnce(false); // tsc doesn't exist

      await installTypeScript();

      expect(logWarning).toHaveBeenCalledWith(
        'TypeScript installation completed but verification failed. PATH may need to be refreshed. Please restart your terminal.',
      );
    });

    it('logs and rethrows on failure', async () => {
      const dynamicExecModule = await import('../utils/exec');
      vi.mocked(dynamicExecModule.commandExists).mockResolvedValueOnce(true);
      const error = new Error('install failed');
      vi.mocked(execCommand).mockRejectedValue(error);

      await expect(installTypeScript()).rejects.toThrow(error);

      expect(spinnerMock.fail).toHaveBeenCalledWith(
        'Failed to install TypeScript',
      );
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('TypeScript installation failed'),
      );
      expect(logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Please install TypeScript manually'),
      );
    });
  });

  describe('installDocker', () => {
    it('throws error and logs installation instructions', async () => {
      await expect(installDocker()).rejects.toThrow(
        'Docker must be installed manually. Please follow the instructions above.',
      );

      expect(logInfo).toHaveBeenCalledWith(
        'Docker installation requires manual setup to choose your preferred edition.',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  • Docker Community Edition (CE) - Free and open-source',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  • Docker Enterprise Edition (EE) - Commercial with additional features',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  Docker Desktop: https://www.docker.com/products/docker-desktop',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  Documentation: https://docs.docker.com/desktop/install/windows-install/',
      );
      expect(logInfo).toHaveBeenCalledWith(
        'After installation, run this setup script again.',
      );
    });
  });
});
