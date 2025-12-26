import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isInviteOnlyEnabled } from './featureFlags';

describe('featureFlags', () => {
  // Store the original environment variable value
  const originalEnvValue = process.env.REACT_APP_ENABLE_INVITE_ONLY;

  beforeEach(() => {
    // Clear the environment variable before each test to ensure isolation
    delete process.env.REACT_APP_ENABLE_INVITE_ONLY;
  });

  afterEach(() => {
    // Restore the original environment variable value after each test
    if (originalEnvValue !== undefined) {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = originalEnvValue;
    } else {
      delete process.env.REACT_APP_ENABLE_INVITE_ONLY;
    }
    // Standard test isolation for this repo
    vi.clearAllMocks();
  });

  describe('isInviteOnlyEnabled', () => {
    it('should return true when REACT_APP_ENABLE_INVITE_ONLY is set to "true"', () => {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = 'true';
      expect(isInviteOnlyEnabled()).toBe(true);
    });

    it('should return false when REACT_APP_ENABLE_INVITE_ONLY is not set', () => {
      delete process.env.REACT_APP_ENABLE_INVITE_ONLY;
      expect(isInviteOnlyEnabled()).toBe(false);
    });

    it('should return false when REACT_APP_ENABLE_INVITE_ONLY is set to "false"', () => {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = 'false';
      expect(isInviteOnlyEnabled()).toBe(false);
    });

    it('should return false when REACT_APP_ENABLE_INVITE_ONLY is set to an empty string', () => {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = '';
      expect(isInviteOnlyEnabled()).toBe(false);
    });

    it('should return false when REACT_APP_ENABLE_INVITE_ONLY is set to "True" (case-sensitive)', () => {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = 'True';
      expect(isInviteOnlyEnabled()).toBe(false);
    });

    it('should return false when REACT_APP_ENABLE_INVITE_ONLY is set to "1"', () => {
      process.env.REACT_APP_ENABLE_INVITE_ONLY = '1';
      expect(isInviteOnlyEnabled()).toBe(false);
    });
  });
});
