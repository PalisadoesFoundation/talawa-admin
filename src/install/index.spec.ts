import inquirer from 'inquirer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as installModule from './index';
const { runIfDirectExecution, main, handleDirectExecutionError } =
  installModule;
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

afterEach(() => {
  vi.clearAllMocks();
});

describe('install/index', () => {
  beforeEach(() => {
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
    it('should call main when argv[1] contains install/index.ts', () => {
      const mainMock = vi.fn().mockResolvedValue(undefined);
      const errorSpy = vi.fn();
      const fakePath = '/different/path/to/install/index.ts';
      const argv = ['node', fakePath];
      runIfDirectExecution(argv, fakePath, mainMock, errorSpy);
      expect(mainMock).toHaveBeenCalled();
    });

    it('should not call main when argv[1] does not match conditions', () => {
      const mainMock = vi.fn();
      const argv = ['node', '/some/other/file.ts'];
      runIfDirectExecution(argv, undefined, mainMock);
      expect(mainMock).not.toHaveBeenCalled();
    });

    it('should not call main when argv[1] is undefined', () => {
      const mainMock = vi.fn().mockResolvedValue(undefined);
      runIfDirectExecution(['node'], undefined, mainMock);
      expect(mainMock).not.toHaveBeenCalled();
    });

    it('should handle main rejection with error handler', async () => {
      const testError = new Error('Main failed');
      const mainMock = vi.fn().mockRejectedValue(testError);
      const errorSpy = vi.fn();
      const fakePath = '/some/path/install/index.ts';
      const argv = ['node', fakePath];
      runIfDirectExecution(argv, fakePath, mainMock, errorSpy);
      await vi.waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith(testError);
      });
    });

    it('should use process.argv by default', () => {
      const originalArgv = process.argv;
      const mainSpy = vi.fn().mockResolvedValue(undefined);
      const errorSpy = vi.fn();
      try {
        process.argv = ['node', '/some/path/install/index.ts'];
        runIfDirectExecution(
          undefined,
          '/some/path/install/index.ts',
          mainSpy,
          errorSpy,
        );
        expect(mainSpy).toHaveBeenCalled();
      } finally {
        process.argv = originalArgv;
      }
    });
  });
});
