import type { TFunction } from 'i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

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

  const showAuthError = (error: Error) =>
    NotificationToast.error(error.message || t('authError'), options);

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
