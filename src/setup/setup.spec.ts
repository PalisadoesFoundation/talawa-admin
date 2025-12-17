import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { main, askAndSetRecaptcha } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import inquirer from 'inquirer';

// Create hoisted mocks for fs and dotenv
const { mockReadFileSync, mockParse } = vi.hoisted(() => ({
  mockReadFileSync: vi.fn(),
  mockParse: vi.fn(),
}));

vi.mock('./backupEnvFile/backupEnvFile', () => ({
  backupEnvFile: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('inquirer');
vi.mock('dotenv', () => ({
  default: { parse: mockParse, config: vi.fn() },
  parse: mockParse,
  config: vi.fn(),
}));
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    default: { ...actual, readFileSync: mockReadFileSync },
    readFileSync: mockReadFileSync,
  };
});
vi.mock('./checkEnvFile/checkEnvFile');
vi.mock('./validateRecaptcha/validateRecaptcha');
vi.mock('./askAndSetDockerOption/askAndSetDockerOption');
vi.mock('./updateEnvFile/updateEnvFile');
vi.mock('./askAndUpdatePort/askAndUpdatePort');
vi.mock('./askForDocker/askForDocker');

describe('Talawa Admin Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // default flow: env file check passes
    vi.mocked(checkEnvFile).mockReturnValue(true);

    // default fs content says NO docker
    mockReadFileSync.mockReturnValue('USE_DOCKER=NO');
    mockParse.mockReturnValue({ USE_DOCKER: 'NO' });

    // mock external functions to resolve normally
    vi.mocked(askAndSetDockerOption).mockResolvedValue(undefined);
    vi.mocked(askAndUpdatePort).mockResolvedValue(undefined);
    vi.mocked(askAndUpdateTalawaApiUrl).mockResolvedValue(undefined);
    vi.mocked(modifyEnvFile).mockImplementation(() => undefined);
    vi.mocked(updateEnvFile).mockImplementation(() => undefined);

    // default process.exit spy (we won't throw unless a test needs it)
    vi.spyOn(process, 'exit').mockImplementation(() => {
      // keep as noop for normal tests
      return undefined as never;
    });

    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restores all spies including processExitSpy and consoleErrorSpy
  });

  // ADD THESE NEW TEST BLOCKS
  it('should call API setup with false when Docker is disabled', async () => {
    // Setup environment for NO Docker
    mockReadFileSync.mockReturnValue('USE_DOCKER=NO');
    mockParse.mockReturnValue({ USE_DOCKER: 'NO' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(false);
  });

  it('should call API setup with true when Docker is enabled', async () => {
    // Setup environment for YES Docker
    mockReadFileSync.mockReturnValue('USE_DOCKER=YES');
    mockParse.mockReturnValue({ USE_DOCKER: 'YES' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(true);
  });

  it('should exit early when checkEnvFile returns false', async () => {
    vi.mocked(checkEnvFile).mockReturnValue(false);

    await main();

    // Should not proceed with setup
    expect(modifyEnvFile).not.toHaveBeenCalled();
    expect(askAndSetDockerOption).not.toHaveBeenCalled();
    expect(askAndUpdatePort).not.toHaveBeenCalled();
    expect(askAndUpdateTalawaApiUrl).not.toHaveBeenCalled();
  });

  it('should call askAndUpdateTalawaApiUrl when Docker is used and skip port setup', async () => {
    mockReadFileSync.mockReturnValue('USE_DOCKER=YES');
    mockParse.mockReturnValue({ USE_DOCKER: 'YES' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    // with docker = YES, askAndUpdatePort should NOT be called
    expect(askAndUpdatePort).not.toHaveBeenCalled();
    // askAndUpdateTalawaApiUrl is called (implementation calls it when useDocker true)
    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(true);
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

  // Helper function to extract validation function from prompt spy
  const extractRecaptchaValidationFn = (promptSpy: {
    mock: {
      calls: unknown[][];
    };
  }): ((input: string) => boolean | string) | undefined => {
    const secondCallArgs = promptSpy.mock.calls[1][0];
    const questionArray = Array.isArray(secondCallArgs)
      ? secondCallArgs
      : [secondCallArgs];
    const recaptchaKeyQuestion = questionArray.find(
      (q: { name?: string; validate?: (input: string) => boolean | string }) =>
        q.name === 'recaptchaSiteKeyInput',
    );

    return recaptchaKeyQuestion?.validate;
  };

  it('should test the validation function for reCAPTCHA site key with valid input', async () => {
    const { validateRecaptcha } = await import(
      './validateRecaptcha/validateRecaptcha'
    );

    // Mock validateRecaptcha to return true for valid input
    vi.mocked(validateRecaptcha).mockReturnValue(true);

    const promptSpy = vi
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ shouldUseRecaptcha: true })
      .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'valid-key' });

    await askAndSetRecaptcha();

    // Verify prompt was called twice
    expect(promptSpy).toHaveBeenCalledTimes(2);

    // Extract and test the validation function
    const capturedValidationFn = extractRecaptchaValidationFn(promptSpy);
    expect(capturedValidationFn).toBeDefined();
    if (!capturedValidationFn) {
      throw new Error(
        'Validation function for reCAPTCHA site key was not captured',
      );
    }
    const result = capturedValidationFn('valid-key');
    expect(result).toBe(true);
  });

  it('should test the validation function for reCAPTCHA site key with invalid input', async () => {
    const { validateRecaptcha } = await import(
      './validateRecaptcha/validateRecaptcha'
    );

    // Mock validateRecaptcha to return false for invalid input
    vi.mocked(validateRecaptcha).mockReturnValue(false);

    const promptSpy = vi
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ shouldUseRecaptcha: true })
      .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'invalid-key' });

    await askAndSetRecaptcha();

    // Verify prompt was called twice
    expect(promptSpy).toHaveBeenCalledTimes(2);

    // Extract and test the validation function
    const capturedValidationFn = extractRecaptchaValidationFn(promptSpy);
    expect(capturedValidationFn).toBeDefined();
    if (!capturedValidationFn) {
      throw new Error(
        'Validation function for reCAPTCHA site key was not captured',
      );
    }
    const result = capturedValidationFn('invalid-key');
    expect(result).toBe('Invalid reCAPTCHA site key. Please try again.');
  });
});
