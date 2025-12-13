/**
 * Isolated tests for localStorage error handling in LeaveOrganization module.
 * These tests verify the catch blocks for userEmail and userId initialization.
 */
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

// Store original console.error
const originalConsoleError = console.error;

describe('LeaveOrganization localStorage error handling', () => {
  beforeEach(() => {
    // Reset modules to ensure fresh import
    vi.resetModules();
    // Mock console.error
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;

    vi.clearAllMocks();
  });

  test('userEmail defaults to empty string when localStorage throws error', async () => {
    // Mock getItem to throw for email
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn((prefix: string, key: string) => {
        if (key === 'email') {
          throw new Error('localStorage access denied');
        }
        return '12345'; // userId still works
      }),
    }));

    // Dynamically import the module after setting up the mock
    const { userEmail } = await import('./LeaveOrganization');

    expect(userEmail).toBe('');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error),
    );
  });

  test('userId defaults to empty string when localStorage throws error', async () => {
    // Mock getItem to throw for userId
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn((prefix: string, key: string) => {
        if (key === 'email') {
          return 'test@example.com';
        }
        if (key === 'userId') {
          throw new Error('localStorage access denied');
        }
        return null;
      }),
    }));

    // Dynamically import the module after setting up the mock
    const { userId } = await import('./LeaveOrganization');

    expect(userId).toBe('');
    expect(console.error).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error),
    );
  });

  test('both userEmail and userId default to empty string when localStorage throws error', async () => {
    // Mock getItem to always throw
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn(() => {
        throw new Error('localStorage access denied');
      }),
    }));

    // Dynamically import the module after setting up the mock
    const { userEmail, userId } = await import('./LeaveOrganization');

    expect(userEmail).toBe('');
    expect(userId).toBe('');
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('userEmail defaults to empty string when getItem returns null', async () => {
    // Mock getItem to return null for email (nullish coalescing branch)
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn((prefix: string, key: string) => {
        if (key === 'email') {
          return null;
        }
        return '12345'; // userId still works
      }),
    }));

    // Dynamically import the module after setting up the mock
    const { userEmail, userId } = await import('./LeaveOrganization');

    expect(userEmail).toBe('');
    expect(userId).toBe('12345');
  });

  test('userId defaults to empty string when getItem returns null', async () => {
    // Mock getItem to return null for userId (nullish coalescing branch)
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn((prefix: string, key: string) => {
        if (key === 'email') {
          return 'test@example.com';
        }
        if (key === 'userId') {
          return null;
        }
        return null;
      }),
    }));

    // Dynamically import the module after setting up the mock
    const { userEmail, userId } = await import('./LeaveOrganization');

    expect(userEmail).toBe('test@example.com');
    expect(userId).toBe('');
  });

  test('both userEmail and userId default to empty string when getItem returns undefined', async () => {
    // Mock getItem to return undefined (nullish coalescing branch)
    vi.doMock('utils/useLocalstorage', () => ({
      getItem: vi.fn(() => undefined),
    }));

    // Dynamically import the module after setting up the mock
    const { userEmail, userId } = await import('./LeaveOrganization');

    expect(userEmail).toBe('');
    expect(userId).toBe('');
  });
});
