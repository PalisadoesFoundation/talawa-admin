/**
 * Toast notification type definitions
 * Defines all types, interfaces, and enums for the unified toast notification system
 */

import { type ReactNode } from 'react';

/**
 * Available toast notification types
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading',
}

/**
 * Toast position on screen
 */
export enum ToastPosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right',
}

/**
 * Action button configuration for toast notifications
 */
export interface ToastAction {
  /**
   * Label to display on the action button
   */
  label: string;

  /**
   * Callback function when action is clicked
   */
  onClick: () => void | Promise<void>;

  /**
   * Optional custom styling for the action button
   */
  className?: string;

  /**
   * Whether to close the toast after action is clicked
   * @default true
   */
  closeOnClick?: boolean;
}

/**
 * Configuration options for displaying a toast notification
 */
export interface ToastOptions {
  /**
   * Type of toast notification
   * @default ToastType.INFO
   */
  type?: ToastType;

  /**
   * Duration in milliseconds before auto-dismiss
   * Set to 0 or false to disable auto-dismiss
   * @default 5000
   */
  duration?: number | false;

  /**
   * Position where toast appears on screen
   * @default ToastPosition.TOP_RIGHT
   */
  position?: ToastPosition;

  /**
   * Whether toast can be manually closed by user
   * @default true
   */
  closeable?: boolean;

  /**
   * Action buttons to display in the toast
   */
  actions?: ToastAction[];

  /**
   * Custom icon component or element
   */
  icon?: ReactNode;

  /**
   * Custom CSS class for the toast container
   */
  className?: string;

  /**
   * Unique identifier for the toast (prevents duplicates)
   */
  toastId?: string;

  /**
   * Whether to pause auto-dismiss on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Whether to pause auto-dismiss when window loses focus
   * @default true
   */
  pauseOnFocusLoss?: boolean;

  /**
   * Whether to show a progress bar
   * @default true
   */
  showProgressBar?: boolean;

  /**
   * Callback when toast is closed
   */
  onClose?: () => void;

  /**
   * Callback when toast is opened
   */
  onOpen?: () => void;

  /**
   * ARIA role for accessibility
   * @default 'alert'
   */
  role?: 'alert' | 'status';

  /**
   * ARIA live region type
   * @default 'polite'
   */
  ariaLive?: 'polite' | 'assertive' | 'off';
}

/**
 * Toast notification data structure
 */
export interface ToastNotification {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Message content to display
   */
  message: string | ReactNode;

  /**
   * Toast configuration options
   */
  options: ToastOptions;

  /**
   * Timestamp when toast was created
   */
  timestamp: number;
}

/**
 * Toast context value interface
 */
export interface ToastContextValue {
  /**
   * Show a success toast notification
   */
  showSuccess: (
    message: string | ReactNode,
    options?: Omit<ToastOptions, 'type'>,
  ) => string;

  /**
   * Show an error toast notification
   */
  showError: (
    message: string | ReactNode,
    options?: Omit<ToastOptions, 'type'>,
  ) => string;

  /**
   * Show a warning toast notification
   */
  showWarning: (
    message: string | ReactNode,
    options?: Omit<ToastOptions, 'type'>,
  ) => string;

  /**
   * Show an info toast notification
   */
  showInfo: (
    message: string | ReactNode,
    options?: Omit<ToastOptions, 'type'>,
  ) => string;

  /**
   * Show a loading toast notification
   */
  showLoading: (
    message: string | ReactNode,
    options?: Omit<ToastOptions, 'type'>,
  ) => string;

  /**
   * Show a custom toast notification with full control
   */
  showToast: (
    message: string | ReactNode,
    options?: ToastOptions,
  ) => string;

  /**
   * Dismiss a specific toast by ID
   */
  dismissToast: (toastId: string) => void;

  /**
   * Dismiss all active toasts
   */
  dismissAll: () => void;

  /**
   * Update an existing toast
   */
  updateToast: (
    toastId: string,
    message: string | ReactNode,
    options?: Partial<ToastOptions>,
  ) => void;

  /**
   * Check if a toast with given ID is active
   */
  isActive: (toastId: string) => boolean;
}
