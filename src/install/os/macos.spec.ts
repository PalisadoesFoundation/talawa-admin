import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';
import { installDocker, installTypeScript } from './macos';

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
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

describe('macOS installers', () => {
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
    it('installs Docker via brew cask', async () => {
      vi.mocked(execCommand).mockResolvedValue({ stdout: '', stderr: '' });

      await installDocker();

      expect(createSpinner).toHaveBeenCalledWith('Installing Docker...');
      expect(spinnerMock.start).toHaveBeenCalled();
      expect(execCommand).toHaveBeenCalledWith(
        'brew',
        ['install', '--cask', 'docker'],
        expect.objectContaining({ silent: true }),
      );
      expect(spinnerMock.succeed).toHaveBeenCalledWith(
        'Docker installed successfully',
      );
      expect(logWarning).toHaveBeenCalledWith(
        expect.stringContaining('Please open Docker Desktop from Applications'),
      );
    });

    it('logs and rethrows on failure', async () => {
      const error = new Error('brew failed');
      vi.mocked(execCommand).mockRejectedValue(error);

      await expect(installDocker()).rejects.toThrow(error);

      expect(spinnerMock.fail).toHaveBeenCalledWith('Failed to install Docker');
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('Docker installation failed'),
      );
      expect(logInfo).toHaveBeenCalledWith(
        expect.stringContaining('Please install Docker Desktop manually'),
      );
    });
  });
});
