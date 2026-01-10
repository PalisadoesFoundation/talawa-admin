import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import { main, askAndSetRecaptcha, askAndSetLogErrors } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import updateEnvFile from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import { backupEnvFile } from './backupEnvFile/backupEnvFile';
import inquirer from 'inquirer';

// Define proper types for inquirer prompts
interface PromptQuestion {
  type: string;
  name: string;
  message: string;
  default?: boolean | string | number;
  validate?: (input: string) => boolean | string;
}

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
  let consoleLogSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(checkEnvFile).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=NO');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO' });
    vi.mocked(askAndSetDockerOption).mockResolvedValue(undefined);
    vi.mocked(askAndUpdatePort).mockResolvedValue(undefined);
    vi.mocked(askAndUpdateTalawaApiUrl).mockResolvedValue(undefined);
    vi.mocked(modifyEnvFile).mockImplementation(() => undefined);
    vi.mocked(updateEnvFile).mockImplementation(() => undefined);
    vi.mocked(validateRecaptcha).mockReturnValue(true);
    vi.mocked(backupEnvFile).mockResolvedValue(undefined);

    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`process.exit called with code ${code}`);
    }) as never);

    consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('main function', () => {
    it('should successfully complete setup with default options', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(checkEnvFile).toHaveBeenCalled();
      expect(backupEnvFile).toHaveBeenCalled();
      expect(modifyEnvFile).toHaveBeenCalled();
      expect(askAndSetDockerOption).toHaveBeenCalled();
      expect(askAndUpdatePort).toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalled();
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'NO',
      );
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

      expect(askAndUpdatePort).not.toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(true);
    });

    it('should handle error logging setup when user opts in', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: true });

      await main();

      expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
    });

    it('should handle errors during setup process (and call process.exit(1))', async () => {
      const mockError = new Error('Setup failed');
      vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        mockError,
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should return early when checkEnvFile returns false', async () => {
      vi.mocked(checkEnvFile).mockReturnValue(false);
      await main();
      expect(modifyEnvFile).not.toHaveBeenCalled();
      expect(askAndSetDockerOption).not.toHaveBeenCalled();
      expect(backupEnvFile).not.toHaveBeenCalled();
    });

    it('should display welcome and success messages', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Welcome to the Talawa Admin setup! 🚀',
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉',
      );
    });

    it('should display error support message when setup fails', async () => {
      const mockError = new Error('Setup failed');
      vi.mocked(askAndSetDockerOption).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '\nPlease try again or contact support if the issue persists.',
      );
    });

    it('should complete full setup flow with Docker=NO and all options enabled', async () => {
      vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=NO');
      vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO' });
      vi.mocked(validateRecaptcha).mockReturnValue(true);

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'test-recaptcha-key' })
        .mockResolvedValueOnce({ shouldLogErrors: true });

      await main();

      expect(askAndUpdatePort).toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(false);
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'YES',
      );
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        'test-recaptcha-key',
      );
      expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
    });

    it('should complete full setup flow with Docker=YES and all options enabled', async () => {
      vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=YES');
      vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'YES' });
      vi.mocked(validateRecaptcha).mockReturnValue(true);

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'test-recaptcha-key' })
        .mockResolvedValueOnce({ shouldLogErrors: true });

      await main();

      expect(askAndUpdatePort).not.toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(true);
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'YES',
      );
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        'test-recaptcha-key',
      );
      expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
    });

    it('should handle errors during backupEnvFile', async () => {
      const mockError = new Error('Backup failed');
      vi.mocked(backupEnvFile).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        mockError,
      );
    });

    it('should handle errors during modifyEnvFile', async () => {
      const mockError = new Error('Modify env failed');
      vi.mocked(modifyEnvFile).mockImplementation(() => {
        throw mockError;
      });

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        mockError,
      );

      // Verify subsequent steps were not executed due to early error
      expect(askAndSetDockerOption).not.toHaveBeenCalled();
    });

    it('should handle errors during askAndUpdatePort', async () => {
      const mockError = new Error('Port update failed');
      vi.mocked(askAndUpdatePort).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        mockError,
      );
    });

    it('should handle errors during askAndUpdateTalawaApiUrl', async () => {
      const mockError = new Error('API URL update failed');
      vi.mocked(askAndUpdateTalawaApiUrl).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        mockError,
      );
    });

    it('should handle errors during askAndSetRecaptcha in main flow', async () => {
      const mockError = new Error('Recaptcha setup failed in main');
      vi.mocked(inquirer.prompt).mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '\n❌ Setup failed:',
        expect.any(Error),
      );
    });

    it('should handle errors during askAndSetLogErrors in main flow', async () => {
      const mockError = new Error('Log errors setup failed in main');
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockRejectedValueOnce(mockError);

      await expect(main()).rejects.toThrow('process.exit called with code 1');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('askAndSetRecaptcha function', () => {
    it('should handle reCAPTCHA setup when user opts in with valid key', async () => {
      const mockValidKey = 'valid-key';
      vi.mocked(validateRecaptcha).mockReturnValue(true);

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

    it('should handle reCAPTCHA setup when user opts out', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldUseRecaptcha: false,
      });

      await askAndSetRecaptcha();

      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'NO',
      );
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        '',
      );

      // Ensure we didn't prompt for the site key
      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during reCAPTCHA setup and propagate a helpful message', async () => {
      const mockError = new Error('ReCAPTCHA setup failed');
      vi.mocked(inquirer.prompt).mockRejectedValueOnce(mockError);

      await expect(askAndSetRecaptcha()).rejects.toThrow(
        'Failed to set up reCAPTCHA: ReCAPTCHA setup failed',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting up reCAPTCHA:',
        mockError,
      );
    });

    it('should pass validation config to inquirer prompt for reCAPTCHA', async () => {
      const mockValidKey = 'valid-recaptcha-key';

      vi.mocked(validateRecaptcha).mockReturnValue(true);

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: mockValidKey });

      await askAndSetRecaptcha();

      // Verify the second prompt call structure with proper typing
      const secondPromptCall = vi.mocked(inquirer.prompt).mock.calls[1][0] as
        | PromptQuestion
        | PromptQuestion[];
      const questions = Array.isArray(secondPromptCall)
        ? secondPromptCall
        : [secondPromptCall];

      expect(questions[0]).toHaveProperty('validate');
      expect(typeof questions[0].validate).toBe('function');

      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'YES',
      );
      expect(updateEnvFile).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        mockValidKey,
      );
    });

    it('should have validation function that returns error message for invalid key', async () => {
      // Call the function to trigger prompt setup
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'test-key' });

      await askAndSetRecaptcha();

      // Get the prompt config with proper typing
      const promptCall = vi.mocked(inquirer.prompt).mock.calls[1][0] as
        | PromptQuestion
        | PromptQuestion[];
      const questions = Array.isArray(promptCall) ? promptCall : [promptCall];
      const validateFn = questions[0].validate;

      // Explicitly assert validateFn is defined
      expect(validateFn).toBeDefined();

      // Test validation with invalid key
      vi.mocked(validateRecaptcha).mockReturnValue(false);
      const result = validateFn!('invalid-key');
      expect(result).toBe('Invalid reCAPTCHA site key. Please try again.');
    });

    it('should have validation function that returns true for valid key', async () => {
      // Call the function to trigger prompt setup
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: 'test-key' });

      await askAndSetRecaptcha();

      // Get the prompt config with proper typing
      const promptCall = vi.mocked(inquirer.prompt).mock.calls[1][0] as
        | PromptQuestion
        | PromptQuestion[];
      const questions = Array.isArray(promptCall) ? promptCall : [promptCall];
      const validateFn = questions[0].validate;

      // Explicitly assert validateFn is defined
      expect(validateFn).toBeDefined();

      // Test validation with valid key
      vi.mocked(validateRecaptcha).mockReturnValue(true);
      const result = validateFn!('valid-key');
      expect(result).toBe(true);
    });

    it('should handle errors during the second prompt (site key input)', async () => {
      const mockError = new Error('Site key input failed');

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockRejectedValueOnce(mockError);

      await expect(askAndSetRecaptcha()).rejects.toThrow(
        'Failed to set up reCAPTCHA: Site key input failed',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting up reCAPTCHA:',
        mockError,
      );
    });

    it('should handle updateEnvFile errors gracefully', async () => {
      const mockError = new Error('Update env failed');
      vi.mocked(updateEnvFile).mockImplementation(() => {
        throw mockError;
      });

      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldUseRecaptcha: false,
      });

      await expect(askAndSetRecaptcha()).rejects.toThrow(
        'Failed to set up reCAPTCHA: Update env failed',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting up reCAPTCHA:',
        mockError,
      );
    });
  });

  describe('askAndSetLogErrors function', () => {
    it('should handle askAndSetLogErrors when user opts out', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldLogErrors: false,
      });
      await askAndSetLogErrors();
      expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'NO');
    });

    it('should handle askAndSetLogErrors when user opts in', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldLogErrors: true,
      });
      await askAndSetLogErrors();
      expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'YES');
    });

    it('should handle errors in askAndSetLogErrors', async () => {
      const mockError = new Error('Logging setup failed');
      vi.mocked(inquirer.prompt).mockRejectedValueOnce(mockError);
      await expect(askAndSetLogErrors()).rejects.toThrow(
        'Logging setup failed',
      );
    });

    it('should handle updateEnvFile errors in askAndSetLogErrors', async () => {
      const mockError = new Error('Update env failed');
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldLogErrors: true,
      });
      vi.mocked(updateEnvFile).mockImplementation(() => {
        throw mockError;
      });

      await expect(askAndSetLogErrors()).rejects.toThrow('Update env failed');
    });

    it('should pass correct prompt configuration to inquirer', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldLogErrors: true,
      });

      await askAndSetLogErrors();

      const promptCall = vi.mocked(inquirer.prompt).mock.calls[0][0];

      expect(promptCall).toMatchObject({
        type: 'confirm',
        name: 'shouldLogErrors',
        message:
          'Would you like to log Compiletime and Runtime errors in the console?',
        default: true,
      });
    });
  });

  describe('Module execution', () => {
    it('should export all required functions', () => {
      expect(typeof main).toBe('function');
      expect(typeof askAndSetRecaptcha).toBe('function');
      expect(typeof askAndSetLogErrors).toBe('function');
    });

    it('should not have side effects on import', () => {
      // Clear all mocks to reset any calls that might have happened
      vi.clearAllMocks();

      // Assert that setup functions haven't been called before explicit invocation
      expect(checkEnvFile).not.toHaveBeenCalled();
      expect(backupEnvFile).not.toHaveBeenCalled();
      expect(modifyEnvFile).not.toHaveBeenCalled();
      expect(askAndSetDockerOption).not.toHaveBeenCalled();

      // Verify exports are available
      expect(main).toBeDefined();
      expect(askAndSetRecaptcha).toBeDefined();
      expect(askAndSetLogErrors).toBeDefined();
    });
  });

  describe('Edge cases and integration scenarios', () => {
    it('should handle empty env config gracefully', async () => {
      vi.mocked(dotenv.parse).mockReturnValue({});

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(askAndUpdatePort).toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(false);
    });

    it('should handle malformed env file content', async () => {
      vi.mocked(fs.readFileSync).mockReturnValue(
        'INVALID_CONTENT_WITHOUT_DOCKER',
      );
      vi.mocked(dotenv.parse).mockReturnValue({});

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(askAndUpdatePort).toHaveBeenCalled();
    });

    it('should handle case-sensitive Docker flag (lowercase "yes")', async () => {
      vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=yes');
      vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'yes' });

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      // Should treat as false since it is not exactly "YES"
      expect(askAndUpdatePort).toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalledWith(false);
    });
  });
});
