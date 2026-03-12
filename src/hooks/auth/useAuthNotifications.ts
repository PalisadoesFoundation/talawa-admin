import type { TFunction } from 'i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

const MAX_AUTH_ERROR_SUFFIX_LENGTH = 120;

const sanitizeAuthErrorSuffix = (message?: string): string => {
  if (!message) {
    return '';
  }

  const normalizedMessage = message.replace(/\s+/g, ' ').trim();
  if (!normalizedMessage) {
    return '';
  }

  const redactedMessage = normalizedMessage
    .replace(
      /\b(password|passwd|pwd|token|secret|api[-_\s]?key|authorization)\b\s*[:=]\s*[^,;\s]+/gi,
      '[redacted]',
    )
    .replace(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*(?=$|\s)/gi, '[redacted]')
    .replace(
      /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      '[redacted]',
    )
    .replace(/\b[A-Fa-f0-9]{32,}\b/g, '[redacted]')
    .replace(/\s+/g, ' ')
    .trim();

  if (!redactedMessage || redactedMessage.includes('[redacted]')) {
    return '';
  }

  if (redactedMessage.length <= MAX_AUTH_ERROR_SUFFIX_LENGTH) {
    return redactedMessage;
  }

  return `${redactedMessage.slice(0, MAX_AUTH_ERROR_SUFFIX_LENGTH)}...`;
};

/** Configuration for auth toast display options. */
export interface InterfaceToastConfig {
  /** Auto-close duration in milliseconds. Defaults to 3000. */
  duration?: number;
  /** Toast position on screen. Defaults to 'top-right'. */
  position?: 'top-right' | 'top-center' | 'bottom-right';
}

/**
 * Hook providing standardized toast notifications for auth flows with i18n support.
 *
 * Uses the `use` prefix to follow the auth hooks naming convention (`useRegistration`,
 * `useAuthNotifications`, etc.).
 *
 * @param t - Translation function from useTranslation
 * @param config - Optional toast display configuration
 */
export function useAuthNotifications(
  t: TFunction,
  config: InterfaceToastConfig = {},
) {
  const { duration = 3000, position = 'top-right' } = config;
  const options = { autoClose: duration, position } as const;

  const showLoginSuccess = (name?: string) => {
    const message = name
      ? t('loginSuccessWithName', { name })
      : t('loginSuccess');
    return NotificationToast.success(message, options);
  };

  const showSignupSuccess = () =>
    NotificationToast.success(t('signupSuccess'), options);

  const showValidationError = (field: string, message: string) =>
    NotificationToast.error(`${field}: ${message}`, options);

  const showAuthError = (error: Error) => {
    console.error('Authentication error:', error);
    const baseMessage = t('authError');
    const sanitizedSuffix = sanitizeAuthErrorSuffix(error.message);
    const messageToDisplay = sanitizedSuffix
      ? `${baseMessage}: ${sanitizedSuffix}`
      : baseMessage;

    return NotificationToast.error(messageToDisplay, options);
  };

  const showNetworkError = () =>
    NotificationToast.error(t('networkError'), options);

  return {
    showLoginSuccess,
    showSignupSuccess,
    showValidationError,
    showAuthError,
    showNetworkError,
  };
}
