import { vi, describe, test, expect, beforeEach } from 'vitest';
import { getItem } from 'utils/useLocalstorage';

// Mock useLocalstorage before importing the component
vi.mock('utils/useLocalstorage', () => ({
  getItem: vi.fn(),
}));

// Mock React Router
vi.mock('react-router', () => ({
  useParams: vi.fn(() => ({ orgId: 'test-org-id' })),
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mock Apollo Client
vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
  useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
}));

describe('LeaveOrganization Module-Level Exports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  test('userEmail handles localStorage error and returns empty string', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Make getItem throw an error
    vi.mocked(getItem).mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Dynamically import to trigger the IIFE with our mock
    const module = await import('./LeaveOrganization');
    
    // Verify it returned empty string on error
    expect(module.userEmail).toBe('');
    
    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test('userId handles localStorage error and returns empty string', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Make getItem throw an error for userId specifically
    vi.mocked(getItem).mockImplementation((prefix: string, key: string) => {
      if (key === 'userId') {
        throw new Error('localStorage error');
      }
      return 'test@example.com';
    });

    // Dynamically import to trigger the IIFE with our mock
    const module = await import('./LeaveOrganization');
    
    // Verify it returned empty string on error
    expect(module.userId).toBe('');
    
    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test('userEmail returns email from localStorage when available', async () => {
    vi.mocked(getItem).mockImplementation((prefix: string, key: string) => {
      if (key === 'email') return 'user@example.com';
      if (key === 'userId') return '12345';
      return null;
    });

    const module = await import('./LeaveOrganization');
    
    expect(module.userEmail).toBe('user@example.com');
  });

  test('userId returns userId from localStorage when available', async () => {
    vi.mocked(getItem).mockImplementation((prefix: string, key: string) => {
      if (key === 'email') return 'user@example.com';
      if (key === 'userId') return '12345';
      return null;
    });

    const module = await import('./LeaveOrganization');
    
    expect(module.userId).toBe('12345');
  });

  test('userEmail handles null return from getItem', async () => {
    vi.mocked(getItem).mockImplementation(() => null);

    const module = await import('./LeaveOrganization');
    
    expect(module.userEmail).toBe('');
  });

  test('userId handles null return from getItem', async () => {
    vi.mocked(getItem).mockImplementation(() => null);

    const module = await import('./LeaveOrganization');
    
    expect(module.userId).toBe('');
  });
});