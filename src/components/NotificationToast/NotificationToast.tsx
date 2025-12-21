import React from 'react';
import type { Id, ToastContainerProps, ToastOptions } from 'react-toastify';
import { toast, ToastContainer } from 'react-toastify';
import i18n from 'utils/i18n';

import type {
  InterfaceNotificationToastHelpers,
  InterfaceNotificationToastI18nMessage,
  NotificationToastMessage,
  NotificationToastNamespace,
} from 'types/NotificationToast/interface';

const DEFAULT_NAMESPACE: NotificationToastNamespace = 'common';

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const DEFAULT_CONTAINER_PROPS: ToastContainerProps = {
  position: 'top-right',
  limit: 5,
  newestOnTop: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
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

  const { key, namespace, values } =
    message as InterfaceNotificationToastI18nMessage;
  const ns = namespace ?? DEFAULT_NAMESPACE;
  const tForNamespace = i18n.getFixedT(null, ns);
  return tForNamespace(key, values);
}

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
 */
export const NotificationToast: InterfaceNotificationToastHelpers = {
  success: (message, options) => showToast('success', message, options),
  error: (message, options) => showToast('error', message, options),
  warning: (message, options) => showToast('warning', message, options),
  info: (message, options) => showToast('info', message, options),
};

/**
 * NotificationToastContainer
 *
 * Wrapper for `ToastContainer` with project defaults. Consumers can override
 * any prop via `props`.
 */
export function NotificationToastContainer(
  props: ToastContainerProps,
): React.ReactElement {
  return <ToastContainer {...DEFAULT_CONTAINER_PROPS} {...props} />;
}
