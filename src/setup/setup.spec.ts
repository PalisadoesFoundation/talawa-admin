import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import { main, askAndSetRecaptcha } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
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

    vi.mocked(checkEnvFile).mockReturnValue(true);

    vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=no');

    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'no' });

    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit called with code ${code}`);
    });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should successfully complete setup with default options', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(checkEnvFile).toHaveBeenCalled();
    expect(modifyEnvFile).toHaveBeenCalled();
    expect(askAndSetDockerOption).toHaveBeenCalled();
    expect(askAndUpdatePort).toHaveBeenCalled();
    expect(askAndUpdateTalawaApiUrl).toHaveBeenCalled();
  });

  it('should skip port and API URL setup when Docker is used', async () => {
    vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=yes');
    vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'yes' });

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    await main();

    expect(askAndUpdatePort).not.toHaveBeenCalled();
    expect(askAndUpdateTalawaApiUrl).not.toHaveBeenCalled();
  });

  it('should handle error logging setup when user opts in', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: true });

    await main();

    expect(updateEnvFile).toHaveBeenCalledWith('ALLOW_LOGS', 'yes');
  });

  it('should exit if env file check fails', async () => {
    vi.mocked(checkEnvFile).mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, 'error');

    await main();

    expect(modifyEnvFile).not.toHaveBeenCalled();
    expect(askAndSetDockerOption).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should handle errors during setup process', async () => {
    const mockError = new Error('Setup failed');

    vi.mocked(askAndSetDockerOption).mockRejectedValue(mockError);

    const consoleSpy = vi.spyOn(console, 'error');

    const processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    await main();

    expect(consoleSpy).toHaveBeenCalledWith('\n❌ Setup failed:', mockError);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle file system operations correctly', async () => {
    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: false })
      .mockResolvedValueOnce({ shouldLogErrors: false });

    const mockEnvContent = 'MOCK_ENV_CONTENT';

    vi.mocked(fs.readFileSync).mockReturnValue(mockEnvContent);

    await main();

    expect(fs.readFileSync).toHaveBeenCalledWith('.env', 'utf8');
    expect(dotenv.parse).toHaveBeenCalledWith(mockEnvContent);
  });
  it('should handle user opting out of reCAPTCHA setup', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldUseRecaptcha: false,
    });

    await askAndSetRecaptcha();

    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    // When user opts out, we explicitly write 'no' to REACT_APP_USE_RECAPTCHA
    expect(updateEnvFile).toHaveBeenCalledWith('REACT_APP_USE_RECAPTCHA', 'no');
    expect(validateRecaptcha).not.toHaveBeenCalled();
  });

  it('should validate reCAPTCHA key input', async () => {
    const mockInvalidKey = 'invalid-key';

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: true })
      .mockImplementationOnce((questions) => {
        const question = Array.isArray(questions) ? questions[0] : questions;

        const validationResult = question.validate(mockInvalidKey);

        expect(validationResult).toBe(
          'Invalid reCAPTCHA site key. Please try again.',
        );
        return Object.assign(
          Promise.resolve({ recaptchaSiteKeyInput: mockInvalidKey }),
        );
      });

    vi.mocked(validateRecaptcha).mockReturnValue(false);

    await askAndSetRecaptcha();

    expect(validateRecaptcha).toHaveBeenCalledWith(mockInvalidKey);
  });

  it('should set reCAPTCHA site key and enable flag when valid key provided', async () => {
    const mockKey = 'valid-key-123';

    vi.mocked(inquirer.prompt)
      .mockResolvedValueOnce({ shouldUseRecaptcha: true })
      .mockResolvedValueOnce({ recaptchaSiteKeyInput: mockKey });

    vi.mocked(validateRecaptcha).mockReturnValue(true);

    await askAndSetRecaptcha();

    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_RECAPTCHA_SITE_KEY',
      mockKey,
    );
    expect(updateEnvFile).toHaveBeenCalledWith(
      'REACT_APP_USE_RECAPTCHA',
      'yes',
    );
  });

  it('should handle errors during reCAPTCHA setup', async () => {
    const mockError = new Error('ReCAPTCHA setup failed');

    vi.mocked(inquirer.prompt).mockRejectedValue(mockError);

    await expect(askAndSetRecaptcha()).rejects.toThrow(
      'Failed to set up reCAPTCHA: ReCAPTCHA setup failed',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error setting up reCAPTCHA:',
      mockError,
    );
    expect(updateEnvFile).not.toHaveBeenCalled();
  });
});
