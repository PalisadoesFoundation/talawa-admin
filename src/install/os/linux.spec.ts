import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type IOSInfo } from '../types';
import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo } from '../utils/logger';
import { installDocker, installTypeScript } from './linux';

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
describe('linux OS installers', () => {
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
    it('installs TypeScript via pnpm', async () => {
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });

      await installTypeScript();

      expect(createSpinner).toHaveBeenCalledWith('Installing TypeScript...');
      expect(spinnerMock.start).toHaveBeenCalled();
      expect(execCommand).toHaveBeenCalledWith(
        'pnpm',
        ['install', '-g', 'typescript'],
        expect.objectContaining({ silent: true }),
      );
      expect(spinnerMock.succeed).toHaveBeenCalledWith(
        'TypeScript installed successfully',
      );
    });

    it('logs and rethrows on failure', async () => {
      const error = new Error('pnpm failed');
      vi.mocked(execCommand).mockRejectedValue(error);

      await expect(installTypeScript()).rejects.toThrow(error);

      expect(spinnerMock.fail).toHaveBeenCalledWith(
        'Failed to install TypeScript',
      );
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('TypeScript installation failed'),
      );
    });
  });

  describe('installDocker', () => {
    it('throws error and logs installation instructions for Ubuntu', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu' };

      await expect(installDocker(os)).rejects.toThrow(
        'Docker must be installed manually. Please follow the instructions above.',
      );

      expect(logInfo).toHaveBeenCalledWith(
        'Docker installation requires manual setup to choose your preferred edition.',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  • Docker Community Edition (CE) - Free and open-source',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  Ubuntu: https://docs.docker.com/engine/install/ubuntu/',
      );
      expect(logInfo).toHaveBeenCalledWith(
        'After installation, run this setup script again.',
      );
    });

    it('throws error and logs installation instructions for Debian', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'debian' };

      await expect(installDocker(os)).rejects.toThrow(
        'Docker must be installed manually. Please follow the instructions above.',
      );

      expect(logInfo).toHaveBeenCalledWith(
        'Docker installation requires manual setup to choose your preferred edition.',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  Debian: https://docs.docker.com/engine/install/debian/',
      );
    });

    it('throws error and logs generic installation instructions for other distros', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'other' };

      await expect(installDocker(os)).rejects.toThrow(
        'Docker must be installed manually. Please follow the instructions above.',
      );

      expect(logInfo).toHaveBeenCalledWith(
        'Docker installation requires manual setup to choose your preferred edition.',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  other: https://docs.docker.com/engine/install/',
      );
    });

    it('throws error and logs Docker Desktop instructions for WSL environments', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu', isWsl: true };

      await expect(installDocker(os)).rejects.toThrow(
        'Docker must be installed manually. Please follow the instructions above.',
      );

      expect(logInfo).toHaveBeenCalledWith(
        'Docker installation requires manual setup to choose your preferred edition.',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '🔷 WSL Detected: You should use Docker Desktop for Windows',
      );
      expect(logInfo).toHaveBeenCalledWith(
        'Please install Docker Desktop with WSL backend:',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  1. Install Docker Desktop for Windows:',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '     https://www.docker.com/products/docker-desktop',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  2. Enable WSL 2 backend in Docker Desktop settings:',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '     Settings → General → "Use the WSL 2 based engine"',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '  3. Enable integration with your WSL distro:',
      );
      expect(logInfo).toHaveBeenCalledWith(
        '     Settings → Resources → WSL Integration → Enable for your distro',
      );
      expect(logInfo).toHaveBeenCalledWith('  Documentation:');
      expect(logInfo).toHaveBeenCalledWith(
        '  https://docs.docker.com/desktop/wsl/',
      );
    });
  });
});
