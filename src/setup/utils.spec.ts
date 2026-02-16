import { describe, it, expect } from 'vitest';
import { isExitPromptError, ENV_KEYS } from './utils';

describe('isExitPromptError', () => {
  it('should return true when error has name "ExitPromptError"', () => {
    const error = new Error('User cancelled');
    (error as { name: string }).name = 'ExitPromptError';

    expect(isExitPromptError(error)).toBe(true);
  });

  it('should return true when error object has name "ExitPromptError"', () => {
    const error = { name: 'ExitPromptError', message: 'Cancelled' };

    expect(isExitPromptError(error)).toBe(true);
  });

  it('should return false when error is null', () => {
    expect(isExitPromptError(null)).toBe(false);
  });

  it('should return false when error is undefined', () => {
    expect(isExitPromptError(undefined)).toBe(false);
  });

  it('should return false when error is a string', () => {
    expect(isExitPromptError('ExitPromptError')).toBe(false);
  });

  it('should return false when error is a number', () => {
    expect(isExitPromptError(123)).toBe(false);
  });

  it('should return false when error is an object without name property', () => {
    const error = { message: 'Some error' };

    expect(isExitPromptError(error)).toBe(false);
  });

  it('should return false when error has a different name', () => {
    const error = new Error('Regular error');

    expect(isExitPromptError(error)).toBe(false);
  });

  it('should return false when error has name property with different value', () => {
    const error = { name: 'TypeError', message: 'Type error occurred' };

    expect(isExitPromptError(error)).toBe(false);
  });
});

describe('ENV_KEYS', () => {
  it('should have all expected environment variable keys', () => {
    expect(ENV_KEYS).toEqual({
      USE_RECAPTCHA: 'REACT_APP_USE_RECAPTCHA',
      RECAPTCHA_SITE_KEY: 'REACT_APP_RECAPTCHA_SITE_KEY',
      ALLOW_LOGS: 'ALLOW_LOGS',
      USE_DOCKER: 'USE_DOCKER',
      DOCKER_MODE: 'DOCKER_MODE',
      TALAWA_URL: 'REACT_APP_TALAWA_URL',
      BACKEND_WEBSOCKET_URL: 'REACT_APP_BACKEND_WEBSOCKET_URL',
      GOOGLE_CLIENT_ID: 'VITE_GOOGLE_CLIENT_ID',
      GOOGLE_REDIRECT_URI: 'VITE_GOOGLE_REDIRECT_URI',
      GITHUB_CLIENT_ID: 'VITE_GITHUB_CLIENT_ID',
      GITHUB_REDIRECT_URI: 'VITE_GITHUB_REDIRECT_URI',
    });
  });
});
