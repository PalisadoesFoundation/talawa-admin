import React from 'react';
import type { Id, ToastContainerProps, ToastOptions } from 'react-toastify';
import { toast, ToastContainer } from 'react-toastify';
import styles from './NotificationToast.module.css';
import i18n from 'utils/i18n';

import type {
  InterfaceNotificationToastHelpers,
  NotificationToastMessage,
  NotificationToastNamespace,
  InterfacePromiseMessages,
  PromiseFunction,
  NotificationToastContainerProps,
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
  className: styles.notificationContainer,
};

/**
 * Convert a `NotificationToastMessage` to a string.
 *
 * If an i18n object is provided, we translate using `i18n.getFixedT()` so this
 * is safe to call from non-React modules (no hooks required).
 *
 * @param message - The message to resolve. Can be a plain string or an i18n key object with key, namespace, and interpolation values.
 * @returns The resolved message string.
 */
function resolveNotificationToastMessage(
  message: NotificationToastMessage,
): string {
  if (typeof message === 'string') return message;

  const { key, namespace, values } = message;
  const ns = namespace ?? DEFAULT_NAMESPACE;
  const tForNamespace = i18n.getFixedT(null, ns);
  return tForNamespace(key, values);
}

/**
 * Show a toast of the given variant using standardized defaults and overrides.
 *
 * Resolves the message via `resolveNotificationToastMessage` and merges options
 * with `DEFAULT_TOAST_OPTIONS`.
 *
 * @param variant - The toast type: 'success', 'error', 'warning', or 'info'.
 * @param message - The message to display. Can be a string or i18n key object.
 * @param options - Optional ToastOptions to override DEFAULT_TOAST_OPTIONS.
 * @returns The toast ID returned by react-toastify.
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
 * Show a promise toast with pending, success, and error states.
 *
 * @param promisifiedFunction - The async function to execute.
 * @param messages - Messages for pending, success, and error states.
 * @param options - Optional ToastOptions to override DEFAULT_TOAST_OPTIONS.
 * @returns Promise that resolves when the function completes.
 */
function showPromise<T = void>(
  promisifiedFunction: PromiseFunction<T>,
  messages: InterfacePromiseMessages,
  options?: ToastOptions,
): Promise<T> {
  const mergedOptions: ToastOptions = { ...DEFAULT_TOAST_OPTIONS, ...options };
  const resolvedPendingMessage = resolveNotificationToastMessage(
    messages.pending,
  );
  const resolvedSuccessMessage = resolveNotificationToastMessage(
    messages.success,
  );
  const resolvedErrorMessage = resolveNotificationToastMessage(messages.error);
  return toast.promise(
    promisifiedFunction,
    {
      pending: resolvedPendingMessage,
      error: resolvedErrorMessage,
      success: resolvedSuccessMessage,
    },
    mergedOptions,
  ) as Promise<T>;
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
 * NotificationToast.error(\{ key: 'unknownError', namespace: 'errors' \});
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
  promise: <T = void,>(
    promisifiedFunction: PromiseFunction<T>,
    messages: InterfacePromiseMessages,
    options?: ToastOptions,
  ) => showPromise<T>(promisifiedFunction, messages, options),
};

/**
 * NotificationToastContainer
 *
 * Wrapper for `ToastContainer` with project defaults. Consumers can override
 * any prop via `props`.
 *
 * @param props - Optional ToastContainerProps to override DEFAULT_CONTAINER_PROPS
 * @returns React.ReactElement rendering ToastContainer with merged props
 */
export function NotificationToastContainer(
  props: NotificationToastContainerProps = {},
): React.ReactElement {
  const combinedClassName = [DEFAULT_CONTAINER_PROPS.className, props.className]
    .filter(Boolean)
    .join(' ');

  return (
    <ToastContainer
      {...DEFAULT_CONTAINER_PROPS}
      {...props}
      className={combinedClassName}
    />
  );
}
