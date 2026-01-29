import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import { main, askAndSetRecaptcha } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import inquirer from 'inquirer';

vi.mock('./backupEnvFile/backupEnvFile', () => ({
  backupEnvFile: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('inquirer');
vi.mock('dotenv');
vi.mock('fs');
vi.mock('./checkEnvFile/checkEnvFile');
vi.mock('./validateRecaptcha/validateRecaptcha');
vi.mock('./askAndSetDockerOption/askAndSetDockerOption');
vi.mock('./updateEnvFile/updateEnvFile');
vi.mock('./askAndUpdatePort/askAndUpdatePort');
vi.mock('./askForDocker/askForDocker');

describe('Talawa Admin Setup', () => {
  let processExitSpy: MockInstance;
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    // default flow: env file check passes
    vi.mocked(checkEnvFile).mockReturnValue(true);

    // default fs content says NO docker
    vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=NO');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO' });

    // mock external functions to resolve normally
    vi.mocked(askAndSetDockerOption).mockResolvedValue(undefined);
    vi.mocked(askAndUpdatePort).mockResolvedValue(undefined);
    vi.mocked(askAndUpdateTalawaApiUrl).mockResolvedValue(undefined);
    vi.mocked(modifyEnvFile).mockImplementation(() => undefined);
    vi.mocked(updateEnvFile).mockImplementation(() => undefined);

    // default process.exit spy (we won't throw unless a test needs it)
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      // keep as noop for normal tests
      return undefined as never;
    });

    consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
  });
  it('should exit when logging prompt rejects', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockRejectedValueOnce(new Error('Prompt failure'));

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(consoleSpy).toHaveBeenCalledWith(
      '\n❌ Setup failed:',
      new Error('Prompt failure'),
    );
    expect(updateEnvFile).not.toHaveBeenCalledWith('ALLOW_LOGS', 'YES');

    consoleSpy.mockRestore();
    exitMock.mockRestore();
  });
  it('should exit when updateEnvFile throws during logging setup', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: true });

    vi.mocked(updateEnvFile).mockImplementation((key, value) => {
      if (key === 'ALLOW_LOGS' && value === 'YES') {
        throw new Error('Env update failure');
      }
      return undefined;
    });

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(consoleSpy).toHaveBeenCalledWith(
      '\n❌ Setup failed:',
      new Error('Env update failure'),
    );

    exitMock.mockRestore();
    consoleSpy.mockRestore();
  });

  afterEach(() => {
    vi.resetAllMocks();
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should successfully complete setup with default options', async () => {
    // inquirer prompts used by askAndSetRecaptcha and askAndSetLogErrors
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(checkEnvFile).toHaveBeenCalled();
    expect(modifyEnvFile).toHaveBeenCalled();
    expect(askAndSetDockerOption).toHaveBeenCalled();
    // Because USE_DOCKER=NO in mocks, askAndUpdatePort should run
    expect(askAndUpdatePort).toHaveBeenCalled();
    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalled();
    // When reCAPTCHA is opted out, updateEnvFile is called to set flags (according to implementation)
    expect(updateEnvFile).toHaveBeenCalledWith('REACT_APP_USE_RECAPTCHA', 'NO');
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_RECAPTCHA_SITE_KEY',
      '',
    );
  });

  it('should call askAndUpdateTalawaApiUrl when Docker is used and skip port setup', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=YES');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'YES' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    // with docker = YES, askAndUpdatePort should NOT be called
    expect(askAndUpdatePort).not.toHaveBeenCalled();
    // askAndUpdateTalawaApiUrl is called (implementation calls it when useDocker true)
    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalled();
  });

  it('should handle error logging setup when user opts in', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: true });

    await main();

    // ALLOW_LOGS should be set to YES when user opts in
    expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
  });

  it('should handle errors during setup process (and call process.exit(1))', async () => {
    const mockError = new Error('Setup failed');

    vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

    // make process.exit throw so we can assert it was called (and break out)
    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(consoleSpy).toHaveBeenCalledWith('\n❌ Setup failed:', mockError);
    expect(exitMock).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitMock.mockRestore();
  });

  it('should handle errors during reCAPTCHA setup and propagate a helpful message', async () => {
    const mockError = new Error('ReCAPTCHA setup failed');

    vi.mocked(inquirer.prompt).mockRejectedValueOnce(mockError);

    const localConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(askAndSetRecaptcha()).rejects.toThrow(
      'Failed to set up reCAPTCHA: ReCAPTCHA setup failed',
    );

    expect(localConsoleError).toHaveBeenCalledWith(
      'Error setting up reCAPTCHA:',
      mockError,
    );

    localConsoleError.mockRestore();
  });
  it('should handle reCAPTCHA setup when user opts in with valid key', async () => {
    const mockValidKey = 'valid-key';
    const { validateRecaptcha: mockValidateRecaptcha } = await vi.importMock<
      typeof import('./validateRecaptcha/validateRecaptcha')
    >('./validateRecaptcha/validateRecaptcha');
    mockValidateRecaptcha.mockReturnValue(true);

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: true })
      .mockResolvedValueOnce({ recaptchaSiteKeyInput: mockValidKey });

    await askAndSetRecaptcha();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_USE_RECAPTCHA',
      'YES',
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_RECAPTCHA_SITE_KEY',
      mockValidKey,
    );
  });
});
