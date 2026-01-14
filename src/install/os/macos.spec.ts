import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo } from '../utils/logger';
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
        '  Documentation: https://docs.docker.com/desktop/install/mac-install/',
      );
      expect(logInfo).toHaveBeenCalledWith(
        'After installation, run this setup script again.',
      );
    });
  });
});
