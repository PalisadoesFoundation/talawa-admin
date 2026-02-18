import { renderHook, cleanup } from '@testing-library/react';
import type { TFunction } from 'i18next';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useAuthNotifications } from './useAuthNotifications';
import type { InterfaceToastConfig } from './useAuthNotifications';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(() => 'mock-toast-id'),
    error: vi.fn(() => 'mock-toast-id'),
  },
}));

const mockTranslations: Record<string, string> = {
  loginSuccess: 'Welcome!',
  signupSuccess: 'Registration successful!',
  authError: 'Authentication error',
  networkError: 'Network error',
};

const mockT = vi.fn((key: string, opts?: Record<string, unknown>) => {
  if (key === 'loginSuccessWithName' && opts?.name) {
    return `Welcome, ${opts.name}!`;
  }
  return mockTranslations[key] ?? key;
}) as unknown as TFunction;

describe('useAuthNotifications', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('default configuration', () => {
    it('should use default duration of 3000 and position top-right', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showLoginSuccess();

      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.any(String),
        { autoClose: 3000, position: 'top-right' },
      );
    });
  });

  describe('custom configuration', () => {
    it('should use custom duration and position', () => {
      const config: InterfaceToastConfig = {
        duration: 5000,
        position: 'top-center',
      };
      const { result } = renderHook(() => useAuthNotifications(mockT, config));

      result.current.showSignupSuccess();

      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.any(String),
        { autoClose: 5000, position: 'top-center' },
      );
    });

    it('should allow partial config overrides', () => {
      const config: InterfaceToastConfig = { duration: 1000 };
      const { result } = renderHook(() => useAuthNotifications(mockT, config));

      result.current.showNetworkError();

      expect(NotificationToast.error).toHaveBeenCalledWith(expect.any(String), {
        autoClose: 1000,
        position: 'top-right',
      });
    });
  });

  describe('showLoginSuccess', () => {
    it('should show translated welcome message with name when provided', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showLoginSuccess('John');

      expect(mockT).toHaveBeenCalledWith('loginSuccessWithName', {
        name: 'John',
      });
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Welcome, John!',
        expect.any(Object),
      );
    });

    it('should show generic welcome message when no name is provided', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showLoginSuccess();

      expect(mockT).toHaveBeenCalledWith('loginSuccess');
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Welcome!',
        expect.any(Object),
      );
    });

    it('should show generic welcome message when name is undefined', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showLoginSuccess(undefined);

      expect(mockT).toHaveBeenCalledWith('loginSuccess');
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Welcome!',
        expect.any(Object),
      );
    });
  });

  describe('showSignupSuccess', () => {
    it('should show translated registration success message', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showSignupSuccess();

      expect(mockT).toHaveBeenCalledWith('signupSuccess');
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Registration successful!',
        expect.any(Object),
      );
    });
  });

  describe('showValidationError', () => {
    it('should show field name and validation message', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showValidationError('Email', 'is required');

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Email: is required',
        expect.any(Object),
      );
    });

    it('should format different field and message combinations', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showValidationError(
        'Password',
        'must be at least 8 characters',
      );

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Password: must be at least 8 characters',
        expect.any(Object),
      );
    });
  });

  describe('showAuthError', () => {
    it('should show generic translated message with safe suffix from Error object', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error('Invalid credentials');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(mockT).toHaveBeenCalledWith('authError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error: Invalid credentials',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should show translated fallback when error has empty message', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error('');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(mockT).toHaveBeenCalledWith('authError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should show fallback when error message is only whitespace', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error('   ');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should truncate long error messages to 120 characters', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const longMessage = 'Something went wrong '.repeat(10).trim();
      const error = new Error(longMessage);
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(NotificationToast.error).toHaveBeenCalledWith(
        `Authentication error: ${longMessage.slice(0, 120)}...`,
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should not surface sensitive error details in toast message', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error('authorization: Bearer secret-token-value');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(mockT).toHaveBeenCalledWith('authError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should show fallback when error message contains a JWT token', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error(
        'token rejected: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      );
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(mockT).toHaveBeenCalledWith('authError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });

    it('should show fallback when error message contains a long hex token', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));
      const error = new Error(
        'lookup failed for key deadbeefdeadbeefdeadbeefdeadbeef',
      );
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      result.current.showAuthError(error);

      expect(mockT).toHaveBeenCalledWith('authError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Authentication error',
        expect.any(Object),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Authentication error:',
        error,
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('showNetworkError', () => {
    it('should show translated network error message', () => {
      const { result } = renderHook(() => useAuthNotifications(mockT));

      result.current.showNetworkError();

      expect(mockT).toHaveBeenCalledWith('networkError');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Network error',
        expect.any(Object),
      );
    });
  });
});
