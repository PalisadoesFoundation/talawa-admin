import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import dotenv from 'dotenv';
import fs from 'fs';
import { main, askAndSetRecaptcha, askAndSetLogErrors } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import inquirer from 'inquirer';
import { backupEnvFile } from './backupEnvFile/backupEnvFile';

vi.mock('./backupEnvFile/backupEnvFile', () => ({
  backupEnvFile: vi.fn().mockResolvedValue('path/to/backup'),
}));
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));
vi.mock('dotenv');
vi.mock('fs', () => {
  const readFile = vi.fn();
  const copyFileSync = vi.fn();

  return {
    default: {
      copyFileSync,
      promises: {
        readFile,
      },
    },
    copyFileSync,
    promises: {
      readFile,
    },
  };
});

vi.mock('./checkEnvFile/checkEnvFile');
vi.mock('./validateRecaptcha/validateRecaptcha');
vi.mock('./askAndSetDockerOption/askAndSetDockerOption', () => ({
  default: vi.fn(),
}));
vi.mock('./updateEnvFile/updateEnvFile', () => ({
  default: vi.fn(),
}));
vi.mock('./askAndUpdatePort/askAndUpdatePort', () => ({
  default: vi.fn(),
}));
vi.mock('./askForDocker/askForDocker');

describe('Talawa Admin Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // default flow: env file check passes
    vi.mocked(checkEnvFile).mockReturnValue(true);

    // default fs content says NO docker
    vi.mocked(fs.promises.readFile).mockResolvedValue('USE_DOCKER=NO');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO' });

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
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should call API setup with false when Docker is disabled', async () => {
    // Setup environment for NO Docker
    vi.mocked(fs.promises.readFile).mockResolvedValue('USE_DOCKER=NO');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(false);
  });

  it('should call API setup with true when Docker is enabled', async () => {
    // Setup environment for YES Docker
    vi.mocked(fs.promises.readFile).mockResolvedValue('USE_DOCKER=YES');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'YES' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(true);
  });

  it('should exit early when checkEnvFile returns false', async () => {
    vi.mocked(checkEnvFile).mockReturnValue(false);

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    // Should not proceed with setup
    expect(consoleSpy).toHaveBeenCalledWith(
      '❌ Environment file check failed. Please ensure .env exists.',
    );
    expect(exitMock).toHaveBeenCalledWith(1);
    expect(modifyEnvFile).not.toHaveBeenCalled();
    expect(askAndSetDockerOption).not.toHaveBeenCalled();
    expect(askAndUpdatePort).not.toHaveBeenCalled();
    expect(askAndUpdateTalawaApiUrl).not.toHaveBeenCalled();
  });

  it('should call askAndUpdateTalawaApiUrl when Docker is used and skip port setup', async () => {
    vi.mocked(fs.promises.readFile).mockResolvedValue('USE_DOCKER=YES');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'YES' });

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

  it('should restore from backup when setup fails and backupPath exists', async () => {
    const mockError = new Error('Setup failed');
    vi.mocked(backupEnvFile).mockResolvedValue('path/to/backup');
    vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

    const copyFileSyncSpy = vi
      .spyOn(fs, 'copyFileSync')
      .mockImplementation(() => undefined);
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(consoleSpy).toHaveBeenCalledWith(
      '🔄 Attempting to restore from backup...',
    );
    expect(copyFileSyncSpy).toHaveBeenCalledWith('path/to/backup', '.env');
    expect(consoleSpy).toHaveBeenCalledWith(
      '✅ Configuration restored from backup.',
    );
    expect(exitMock).toHaveBeenCalledWith(1);
  });

  it('should log error when backup restoration fails and notify manual restore needed', async () => {
    const mockError = new Error('Initial Setup Failure');
    vi.mocked(backupEnvFile).mockResolvedValue('path/to/backup');
    vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

    const restoreError = new Error('File system read-only');
    vi.spyOn(fs, 'copyFileSync').mockImplementation(() => {
      throw restoreError;
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '🔄 Attempting to restore from backup...',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Failed to restore backup:',
      restoreError,
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Manual restore needed. Backup location: path/to/backup',
      ),
    );
    expect(exitMock).toHaveBeenCalledWith(1);
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
    const { validateRecaptcha } =
      await import('./validateRecaptcha/validateRecaptcha');

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
    const { validateRecaptcha } =
      await import('./validateRecaptcha/validateRecaptcha');

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

  it('should rethrow ExitPromptError in askAndSetRecaptcha', async () => {
    const exitPromptError = new Error('User cancelled');
    (exitPromptError as { name: string }).name = 'ExitPromptError';

    vi.spyOn(inquirer, 'prompt').mockRejectedValueOnce(exitPromptError);

    await expect(askAndSetRecaptcha()).rejects.toThrow('User cancelled');
  });

  it('should handle non-Error objects thrown in askAndSetRecaptcha', async () => {
    const nonErrorObject = { message: 'Something went wrong' };

    vi.spyOn(inquirer, 'prompt').mockRejectedValueOnce(nonErrorObject);

    const localConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(askAndSetRecaptcha()).rejects.toThrow(
      'Failed to set up reCAPTCHA: [object Object]',
    );

    expect(localConsoleError).toHaveBeenCalledWith(
      'Error setting up reCAPTCHA:',
      nonErrorObject,
    );

    localConsoleError.mockRestore();
  });

  it('should call askAndSetLogErrors directly and set ALLOW_LOGS to NO when user opts out', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldLogErrors: false,
    });

    await askAndSetLogErrors();

    expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'NO');
  });

  it('should call askAndSetLogErrors directly and set ALLOW_LOGS to YES when user opts in', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldLogErrors: true,
    });

    await askAndSetLogErrors();

    expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
  });

  it('should handle errors when inquirer.prompt rejects in askAndSetLogErrors', async () => {
    const mockError = new Error('Prompt failure');

    vi.spyOn(inquirer, 'prompt').mockRejectedValueOnce(mockError);

    await expect(askAndSetLogErrors()).rejects.toThrow('Prompt failure');

    // Verify updateEnvFile was not called when prompt fails
    expect(updateEnvFile).not.toHaveBeenCalled();
  });

  it('should handle errors when updateEnvFile throws in askAndSetLogErrors', async () => {
    const mockError = new Error('Failed to update environment file');

    vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      shouldLogErrors: true,
    });

    vi.mocked(updateEnvFile).mockImplementationOnce(() => {
      throw mockError;
    });

    await expect(askAndSetLogErrors()).rejects.toThrow(
      'Failed to update environment file',
    );

    // Verify updateEnvFile was called before throwing
    expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
  });

  it('should handle SIGINT (CTRL+C) during setup and exit with code 130', async () => {
    let sigintHandler: (() => void) | undefined;

    // Capture the SIGINT handler when it's registered
    const onSpy = vi
      .spyOn(process, 'on')
      .mockImplementation((event, handler) => {
        if (event === 'SIGINT') {
          sigintHandler = handler as () => void;
        }
        return process;
      });

    const exitMock = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit called with code ${code}`);
    });

    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    // Mock to make main() hang after setting up SIGINT handler
    vi.mocked(askAndSetDockerOption).mockImplementationOnce(
      () => new Promise(() => {}), // Never resolves
    );

    // Start main (it will hang at askAndSetDockerOption)
    const mainPromise = main();

    // Wait for SIGINT handler to be registered
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Verify the handler was captured
    expect(sigintHandler).toBeDefined();

    // Call the SIGINT handler directly and expect it to throw
    expect(() => sigintHandler?.()).toThrow(
      'process.exit called with code 130',
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\n\n⚠️  Setup cancelled by user.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Configuration may be incomplete. Run setup again to complete.',
    );
    expect(exitMock).toHaveBeenCalledWith(130);

    // Clean up
    onSpy.mockRestore();
    consoleLogSpy.mockRestore();
    exitMock.mockRestore();

    // mainPromise will never resolve since askAndSetDockerOption hangs
    await Promise.race([
      mainPromise,
      new Promise((resolve) => setTimeout(resolve, 10)),
    ]);
  });

  it('should handle ExitPromptError in main and exit with code 130', async () => {
    const exitPromptError = new Error('User cancelled prompt');
    (exitPromptError as { name: string }).name = 'ExitPromptError';

    vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(exitPromptError);

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    await expect(main()).rejects.toThrow('process.exit called with code 130');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\n\n⚠️  Setup cancelled by user.',
    );
    expect(exitMock).toHaveBeenCalledWith(130);

    consoleLogSpy.mockRestore();
    exitMock.mockRestore();
  });

  it('should remove SIGINT listener after setup completes successfully', async () => {
    const removeListenerSpy = vi.spyOn(process, 'removeListener');

    vi.spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      'SIGINT',
      expect.any(Function),
    );

    removeListenerSpy.mockRestore();
  });

  it('should remove SIGINT listener even when an error occurs', async () => {
    const removeListenerSpy = vi.spyOn(process, 'removeListener');
    const mockError = new Error('Some error');

    vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

    const exitMock = vi
      .spyOn(process, 'exit')
      .mockImplementationOnce((code) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    await expect(main()).rejects.toThrow('process.exit called with code 1');

    expect(removeListenerSpy).toHaveBeenCalledWith(
      'SIGINT',
      expect.any(Function),
    );

    removeListenerSpy.mockRestore();
    exitMock.mockRestore();
  });
});
