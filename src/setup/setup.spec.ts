import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import { main, askAndSetRecaptcha } from './setup';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile/checkEnvFile';
import { validateRecaptcha } from './validateRecaptcha/validateRecaptcha';
import askAndSetDockerOption from './askAndSetDockerOption/askAndSetDockerOption';
import { writeEnvParameter } from './updateEnvFile/updateEnvFile';
import askAndUpdatePort from './askAndUpdatePort/askAndUpdatePort';
import { askAndUpdateTalawaApiUrl } from './askForDocker/askForDocker';
import inquirer from 'inquirer';

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

    processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      // Don't throw an error, just mock the implementation
      return undefined as never;
    });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('main setup flow', () => {
    it('should complete setup successfully without Docker', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(checkEnvFile).toHaveBeenCalled();
      expect(modifyEnvFile).toHaveBeenCalled();
      expect(askAndSetDockerOption).toHaveBeenCalled();
      expect(askAndUpdatePort).toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '\nCongratulations! Talawa Admin has been successfully set up! 🥂🎉'
      );
    });

    it('should skip port and API URL setup when Docker is used', async () => {
      vi.mocked(fs.readFileSync).mockReturnValue('USE_DOCKER=YES');
      vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'YES' });

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ dockerApiUrl: 'http://host.docker.internal:4000/graphql' })
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(askAndUpdatePort).not.toHaveBeenCalled();
      expect(askAndUpdateTalawaApiUrl).not.toHaveBeenCalled();
      expect(writeEnvParameter).toHaveBeenCalledWith(
        'REACT_APP_DOCKER_TALAWA_URL',
        'http://host.docker.internal:4000/graphql',
        'Talawa API URL for Docker environment'
      );
    });

    it('should exit if env file check fails', async () => {
      vi.mocked(checkEnvFile).mockReturnValue(false);

      await main();

      expect(modifyEnvFile).not.toHaveBeenCalled();
      expect(askAndSetDockerOption).not.toHaveBeenCalled();
    });

    it('should handle errors during setup process', async () => {
      const mockError = new Error('Setup failed');
      vi.mocked(askAndSetDockerOption).mockRejectedValue(mockError);

      const processExitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await main();

      expect(consoleErrorSpy).toHaveBeenCalledWith('\n❌ Setup failed:', mockError);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('askAndSetRecaptcha', () => {
    it('should set up reCAPTCHA with valid key', async () => {
      const validKey = 'ss7BEe32HPoDKTPXQevFkVvpvPzGebE2kIRv1ok4';
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockResolvedValueOnce({ recaptchaSiteKeyInput: validKey });
      vi.mocked(validateRecaptcha).mockReturnValue(true);

      await askAndSetRecaptcha();

      expect(writeEnvParameter).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'yes',
        'Enable or disable reCAPTCHA protection'
      );
      expect(writeEnvParameter).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        validKey,
        'Your reCAPTCHA site key for frontend validation'
      );
    });

    it('should set empty values when user declines reCAPTCHA', async () => {
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({
        shouldUseRecaptcha: false,
      });

      await askAndSetRecaptcha();

      expect(writeEnvParameter).toHaveBeenCalledWith(
        'REACT_APP_USE_RECAPTCHA',
        'no',
        'Enable or disable reCAPTCHA protection'
      );
      expect(writeEnvParameter).toHaveBeenCalledWith(
        'REACT_APP_RECAPTCHA_SITE_KEY',
        '',
        'Your reCAPTCHA site key for frontend validation'
      );
    });

    it('should validate reCAPTCHA key and reject invalid keys', async () => {
      const invalidKey = 'invalid-key';
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: true })
        .mockImplementationOnce((questions) => {
          const question = Array.isArray(questions) ? questions[0] : questions;
          const validationResult = question.validate(invalidKey);
          expect(validationResult).toBe(
            'Invalid reCAPTCHA site key. Please try again.'
          );
          return Promise.resolve({ recaptchaSiteKeyInput: invalidKey });
        });
      vi.mocked(validateRecaptcha).mockReturnValue(false);

      await askAndSetRecaptcha();

      expect(validateRecaptcha).toHaveBeenCalledWith(invalidKey);
    });

    it('should handle errors during reCAPTCHA setup', async () => {
      const mockError = new Error('ReCAPTCHA setup failed');
      vi.mocked(inquirer.prompt).mockRejectedValue(mockError);

      await expect(askAndSetRecaptcha()).rejects.toThrow(
        'Failed to set up reCAPTCHA: ReCAPTCHA setup failed'
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting up reCAPTCHA:',
        mockError
      );
    });
  });

  describe('error logging setup', () => {
    it('should enable error logging when user opts in', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: true });

      await main();

      expect(writeEnvParameter).toHaveBeenCalledWith(
        'ALLOW_LOGS',
        'YES',
        'Enable or disable error logging in console'
      );
    });

    it('should disable error logging when user opts out', async () => {
      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(writeEnvParameter).toHaveBeenCalledWith(
        'ALLOW_LOGS',
        'NO',
        'Enable or disable error logging in console'
      );
    });
  });

  describe('file system operations', () => {
    it('should read and parse .env file correctly', async () => {
      const mockEnvContent = 'USE_DOCKER=NO\nPORT=3000';
      vi.mocked(fs.readFileSync).mockReturnValue(mockEnvContent);
      vi.mocked(dotenv.parse).mockReturnValue({ USE_DOCKER: 'NO', PORT: '3000' });

      vi.mocked(inquirer.prompt)
        .mockResolvedValueOnce({ shouldUseRecaptcha: false })
        .mockResolvedValueOnce({ shouldLogErrors: false });

      await main();

      expect(fs.readFileSync).toHaveBeenCalledWith('.env', 'utf8');
      expect(dotenv.parse).toHaveBeenCalledWith(mockEnvContent);
    });
  });
});