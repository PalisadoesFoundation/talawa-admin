import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type IOSInfo } from '../types';
import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';
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
    it('installs Docker on Ubuntu/Debian with apt and Docker repo setup', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'ubuntu' };
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });

      await installDocker(os);

      expect(createSpinner).toHaveBeenCalledWith('Installing Docker...');
      expect(spinnerMock.start).toHaveBeenCalled();
      expect(execCommand).toHaveBeenCalledWith(
        'apt-get',
        expect.arrayContaining(['update']),
        expect.objectContaining({ sudo: true, silent: true }),
      );
      expect(execCommand).toHaveBeenCalledWith(
        'curl',
        expect.arrayContaining([
          'https://download.docker.com/linux/ubuntu/gpg',
        ]),
        expect.objectContaining({ sudo: true, silent: true }),
      );
      expect(execCommand).toHaveBeenCalledWith(
        'apt-get',
        expect.arrayContaining(['install', '-y', 'docker-ce']),
        expect.objectContaining({ sudo: true, silent: true }),
      );
      expect(spinnerMock.succeed).toHaveBeenCalledWith(
        'Docker installed successfully',
      );
      expect(logWarning).toHaveBeenCalledWith(
        expect.stringContaining('Add your user to the docker group'),
      );
    });

    it('throws for unsupported distros and logs guidance', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'other' };

      await expect(installDocker(os)).rejects.toThrow(
        'Automatic Docker installation in this script is currently implemented only for Ubuntu and Debian.',
      );

      expect(spinnerMock.fail).toHaveBeenCalledWith('Failed to install Docker');
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('Docker installation failed'),
      );
      expect(logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Automatic Docker installation in this script'),
      );
    });

    it('logs and rethrows when apt-based install fails', async () => {
      const os: IOSInfo = { name: 'linux', distro: 'debian' };
      const error = new Error('apt-get install failed');
      vi.mocked(execCommand)
        // First remove call is ignored with catch(() => {}), so let it succeed
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // update
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // ca-certificates/curl
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // mkdir keyrings
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // curl gpg
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // chmod
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // bash repo script
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // apt-get update
        .mockResolvedValueOnce({ stdout: '', stderr: '' })
        // final install fails
        .mockRejectedValueOnce(error);

      await expect(installDocker(os)).rejects.toThrow(error);

      expect(spinnerMock.fail).toHaveBeenCalledWith('Failed to install Docker');
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('Docker installation failed'),
      );
    });
  });
});
