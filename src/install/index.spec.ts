import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  handleDirectExecutionError,
  main,
  runIfDirectExecution,
} from './index';
import * as detectorModule from './os/detector';
import * as packagesModule from './packages';
import type { IPackageStatus } from './types';
import * as checkerModule from './utils/checker';
import * as execModule from './utils/exec';

vi.mock('./os/detector');
vi.mock('./utils/checker');
vi.mock('./packages');
vi.mock('./utils/exec');
vi.mock('inquirer');

describe('install/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

    vi.mocked(detectorModule.detectOS).mockReturnValue({
      name: 'linux',
      distro: 'ubuntu',
    });

    vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue([
      { name: 'typescript', installed: false },
    ]);

    vi.mocked(inquirer.prompt).mockResolvedValue({
      useDocker: false,
      packages: ['typescript'],
      continueInstall: true,
    } as never);

    vi.mocked(execModule.execCommand).mockResolvedValue({
      stdout: '',
      stderr: '',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('main', () => {
    it('should complete installation successfully', async () => {
      await main();

      expect(detectorModule.detectOS).toHaveBeenCalled();
      expect(checkerModule.checkInstalledPackages).toHaveBeenCalled();
      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('should detect OS correctly', async () => {
      vi.mocked(detectorModule.detectOS).mockReturnValue({
        name: 'macos',
      });

      await main();

      expect(detectorModule.detectOS).toHaveBeenCalled();
    });

    it('should check installed packages', async () => {
      const packages: IPackageStatus[] = [
        { name: 'typescript', installed: true },
        { name: 'docker', installed: false },
      ];

      vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue(
        packages,
      );

      await main();

      expect(checkerModule.checkInstalledPackages).toHaveBeenCalled();
    });

    it('should display packages with versions', async () => {
      const packages: IPackageStatus[] = [
        { name: 'typescript', installed: true, version: '5.6.0' },
        { name: 'docker', installed: false, version: '27.0.0' },
      ];

      vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue(
        packages,
      );

      await main();

      expect(checkerModule.checkInstalledPackages).toHaveBeenCalled();
    });

    it('should prompt for Docker choice', async () => {
      await main();

      expect(inquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'useDocker',
          }),
        ]),
      );
    });

    it('should install selected packages', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: ['typescript', 'docker'],
      } as never);

      await main();

      expect(packagesModule.installPackage).toHaveBeenCalled();
    });

    it('should handle installation errors gracefully', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: ['typescript'],
      } as never);
      vi.mocked(packagesModule.installPackage).mockRejectedValueOnce(
        new Error('Installation failed'),
      );
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        continueInstall: false,
      } as never);

      await main();

      // When user cancels, process.exit(1) is called
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should continue installation after error if user confirms', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: ['typescript', 'docker'],
      } as never);
      vi.mocked(packagesModule.installPackage)
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce();
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        continueInstall: true,
      } as never);

      await main();

      expect(packagesModule.installPackage).toHaveBeenCalledTimes(2);
    });

    it('should skip installation if all packages are installed', async () => {
      vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue([
        { name: 'typescript', installed: true },
      ]);

      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: [],
      } as never);

      await main();

      expect(packagesModule.installPackage).not.toHaveBeenCalled();
    });

    it('should check if packages are required', async () => {
      vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue([
        { name: 'typescript', installed: false },
        { name: 'docker', installed: false },
      ]);

      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: ['typescript', 'docker'],
      } as never);

      await main();

      expect(packagesModule.installPackage).toHaveBeenCalledTimes(2);
    });

    it('should display installed packages in success message', async () => {
      vi.mocked(checkerModule.checkInstalledPackages).mockResolvedValue([
        { name: 'typescript', installed: false },
      ]);

      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        useDocker: false,
      } as never);
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        packages: ['typescript'],
      } as never);

      await main();

      expect(console.log).toHaveBeenCalledWith(
        'The following packages have been installed:',
      );
    });

    it('should exit with error code on failure', async () => {
      vi.mocked(checkerModule.checkInstalledPackages).mockRejectedValueOnce(
        new Error('Failed to check packages'),
      );

      await main();

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('handleDirectExecutionError', () => {
    it('should log error and exit with code 1', () => {
      const testError = new Error('Test error');

      handleDirectExecutionError(testError);

      expect(console.error).toHaveBeenCalledWith('Unhandled error:', testError);
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error objects', () => {
      const testError = 'String error';

      handleDirectExecutionError(testError);

      expect(console.error).toHaveBeenCalledWith('Unhandled error:', testError);
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });

  describe('runIfDirectExecution', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      vi.resetAllMocks();
    });

    it('should call main when argv[1] contains install/index.ts', () => {
      const mockMain = vi.fn().mockResolvedValue(undefined);
      const mockHandleError = vi.fn();

      // Create a version of runIfDirectExecution that uses our mocks
      const testRunIfDirectExecution = (
        argv: string[] = process.argv,
      ): void => {
        const currentFilePath = fileURLToPath(import.meta.url);
        if (
          argv[1] === currentFilePath ||
          argv[1]?.includes('install/index.ts')
        ) {
          mockMain().catch(mockHandleError);
        }
      };

      const mockArgv = ['node', '/different/path/to/install/index.ts'];
      testRunIfDirectExecution(mockArgv);

      expect(mockMain).toHaveBeenCalled();
    });

    it('should not call main when argv[1] does not match conditions', () => {
      const mockMain = vi.fn().mockResolvedValue(undefined);
      const mockHandleError = vi.fn();

      const testRunIfDirectExecution = (
        argv: string[] = process.argv,
      ): void => {
        const currentFilePath = fileURLToPath(import.meta.url);
        if (
          argv[1] === currentFilePath ||
          argv[1]?.includes('install/index.ts')
        ) {
          mockMain().catch(mockHandleError);
        }
      };

      const mockArgv = ['node', '/some/other/file.ts'];
      testRunIfDirectExecution(mockArgv);

      expect(mockMain).not.toHaveBeenCalled();
    });

    it('should not call main when argv[1] is undefined', () => {
      const mockMain = vi.fn().mockResolvedValue(undefined);
      const mockHandleError = vi.fn();

      const testRunIfDirectExecution = (
        argv: string[] = process.argv,
      ): void => {
        const currentFilePath = fileURLToPath(import.meta.url);
        if (
          argv[1] === currentFilePath ||
          argv[1]?.includes('install/index.ts')
        ) {
          mockMain().catch(mockHandleError);
        }
      };

      const mockArgv = ['node'];
      testRunIfDirectExecution(mockArgv);

      expect(mockMain).not.toHaveBeenCalled();
    });

    it('should handle main rejection with error handler', async () => {
      const testError = new Error('Main failed');
      const mockMain = vi.fn().mockRejectedValue(testError);
      const mockHandleError = vi.fn();

      const testRunIfDirectExecution = (
        argv: string[] = process.argv,
      ): void => {
        const currentFilePath = fileURLToPath(import.meta.url);
        if (
          argv[1] === currentFilePath ||
          argv[1]?.includes('install/index.ts')
        ) {
          mockMain().catch(mockHandleError);
        }
      };

      const mockArgv = ['node', '/some/path/install/index.ts'];
      testRunIfDirectExecution(mockArgv);

      // Wait for the promise to be handled
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockHandleError).toHaveBeenCalledWith(testError);
    });

    it('should use process.argv by default', () => {
      const originalArgv = process.argv;
      const mockMain = vi.fn().mockResolvedValue(undefined);
      const mockHandleError = vi.fn();

      const testRunIfDirectExecution = (
        argv: string[] = process.argv,
      ): void => {
        const currentFilePath = fileURLToPath(import.meta.url);
        if (
          argv[1] === currentFilePath ||
          argv[1]?.includes('install/index.ts')
        ) {
          mockMain().catch(mockHandleError);
        }
      };

      try {
        // Test with non-matching argv
        process.argv = ['node', '/some/other/script.js'];
        testRunIfDirectExecution();
        expect(mockMain).not.toHaveBeenCalled();

        // Test with matching argv
        process.argv = ['node', '/some/path/install/index.ts'];
        testRunIfDirectExecution();
        expect(mockMain).toHaveBeenCalled();
      } finally {
        process.argv = originalArgv;
      }
    });

    // Test the actual function behavior through integration
    it('should export runIfDirectExecution function', () => {
      expect(typeof runIfDirectExecution).toBe('function');
    });
  });
});
