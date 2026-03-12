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
  it('should contain OAuth-related environment variable keys', () => {
    expect(ENV_KEYS).toMatchObject({
      GOOGLE_CLIENT_ID: expect.any(String),
      GOOGLE_REDIRECT_URI: expect.any(String),
      GITHUB_CLIENT_ID: expect.any(String),
      GITHUB_REDIRECT_URI: expect.any(String),
    });
  });

  it('should contain core environment variable keys', () => {
    expect(ENV_KEYS).toMatchObject({
      USE_RECAPTCHA: expect.any(String),
      TALAWA_URL: expect.any(String),
      ALLOW_LOGS: expect.any(String),
    });
  });
});
