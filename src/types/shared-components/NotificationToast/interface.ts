import type { Id, ToastContainerProps, ToastOptions } from 'react-toastify';

/**
 * Supported i18next namespaces in Talawa Admin.
 *
 * The app initializes i18n with `translation`, `errors`, and `common`, but this
 * type also allows custom namespaces for future expansion.
 */
export type NotificationToastNamespace =
  | 'translation'
  | 'errors'
  | 'common'
  | (string & {});

/**
 * i18n-backed toast message definition.
 */
export interface InterfaceNotificationToastI18nMessage {
  /**
   * The i18next key to translate.
   *
   * @example
   * 'sessionWarning'
   */
  key: string;

  /**
   * Optional i18next namespace to use for translation.
   *
   * Defaults to `'common'` when omitted.
   */
  namespace?: NotificationToastNamespace;

  /**
   * Optional interpolation values for i18next.
   */
  values?: Record<string, unknown>;
}

/**
 * A toast message can be a plain string or a translatable i18n key.
 */
export type NotificationToastMessage =
  | string
  | InterfaceNotificationToastI18nMessage;

/**
 * Promise toast messages for pending, success, and error states.
 */
export interface InterfacePromiseMessages {
  pending: NotificationToastMessage;
  success: NotificationToastMessage;
  error: NotificationToastMessage;
}

/**
 * Promisified function type.
 */
export type PromiseFunction<T = void> = () => Promise<T>;

/**
 * Reusable helper API exposed by `NotificationToast`.
 */
export interface InterfaceNotificationToastHelpers {
  /**
   * Show a success toast.
   */
  success: (message: NotificationToastMessage, options?: ToastOptions) => Id;

  /**
   * Show an error toast.
   */
  error: (message: NotificationToastMessage, options?: ToastOptions) => Id;

  /**
   * Show a warning toast.
   */
  warning: (message: NotificationToastMessage, options?: ToastOptions) => Id;

  /**
   * Show an info toast.
   */
  info: (message: NotificationToastMessage, options?: ToastOptions) => Id;

  /**
   * Dismiss all active toasts.
   */
  dismiss: () => void;

  /**
   * Show a promise toast with pending, success, and error states.
   */
  promise: <T = void>(
    promisifiedFunction: PromiseFunction<T>,
    messages: InterfacePromiseMessages,
    options?: ToastOptions,
  ) => Promise<T>;
}

/**
 * Props for the `NotificationToastContainer` wrapper component.
 */
export type NotificationToastContainerProps = ToastContainerProps;
