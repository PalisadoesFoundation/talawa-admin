import React from 'react';
import type { Id, ToastContainerProps, ToastOptions } from 'react-toastify';
import { toast, ToastContainer } from 'react-toastify';
import i18n from 'utils/i18n';

import type {
  InterfaceNotificationToastHelpers,
  NotificationToastMessage,
  NotificationToastNamespace,
} from 'types/shared-components/NotificationToast/interface';

const DEFAULT_NAMESPACE: NotificationToastNamespace = 'common';

const SHARED_DEFAULTS = {
  position: 'top-right' as const,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  ...SHARED_DEFAULTS,
  autoClose: 5000,
};

const DEFAULT_CONTAINER_PROPS: ToastContainerProps = {
  ...SHARED_DEFAULTS,
  limit: 5,
  newestOnTop: false,
  theme: 'colored',
};

/**
 * Convert a `NotificationToastMessage` to a string.
 *
 * If an i18n object is provided, we translate using `i18n.getFixedT()` so this
 * is safe to call from non-React modules (no hooks required).
 */
function resolveNotificationToastMessage(message: NotificationToastMessage) {
  if (typeof message === 'string') return message;

  const { key, namespace, values } = message;
  const ns = namespace ?? DEFAULT_NAMESPACE;
  const tForNamespace = i18n.getFixedT(null, ns);
  return tForNamespace(key, values);
}

/**
 * Show a toast of the given variant using standardized defaults and overrides.
 */
function showToast(
  variant: 'success' | 'error' | 'warning' | 'info',
  message: NotificationToastMessage,
  options?: ToastOptions,
): Id {
  const resolved = resolveNotificationToastMessage(message);
  const mergedOptions: ToastOptions = { ...DEFAULT_TOAST_OPTIONS, ...options };
  return toast[variant](resolved, mergedOptions);
}

/**
 * NotificationToast
 *
 * A small wrapper around `react-toastify` that standardizes toast defaults and
 * supports translating messages with an explicit i18n namespace.
 *
 * @example
 * NotificationToast.success('Saved');
 *
 * @example
 * NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
 *
 * @example
 * NotificationToast.dismiss(); // Dismiss all active toasts
 */
export const NotificationToast: InterfaceNotificationToastHelpers = {
  success: (message, options) => showToast('success', message, options),
  error: (message, options) => showToast('error', message, options),
  warning: (message, options) => showToast('warning', message, options),
  info: (message, options) => showToast('info', message, options),
  dismiss: () => toast.dismiss(),
};

/**
 * NotificationToastContainer
 *
 * Wrapper for `ToastContainer` with project defaults. Consumers can override
 * any prop via `props`.
 */
export function NotificationToastContainer(
  props: ToastContainerProps = {},
): React.ReactElement {
  return <ToastContainer {...DEFAULT_CONTAINER_PROPS} {...props} />;
}
