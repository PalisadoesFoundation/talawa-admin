/**
 * Toast Context and Provider
 * Centralized toast notification management using React Context
 */

import React, { createContext, useContext, useCallback } from 'react';
import {
  toast as toastify,
  type ToastOptions as ReactToastifyOptions,
} from 'react-toastify';
import type {
  ToastContextValue,
  ToastOptions,
  ToastType,
  ToastPosition,
} from './types';
import { CustomToast } from './CustomToast';
import type { ReactNode } from 'react';

/**
 * Create the Toast Context
 */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Map our toast position to react-toastify position
 */
const mapPosition = (
  position?: ToastPosition,
): ReactToastifyOptions['position'] => {
  return (position as ReactToastifyOptions['position']) || 'top-right';
};

/**
 * Props for ToastProvider component
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider component
 * Wraps the application to provide toast notification functionality
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  /**
   * Show a toast notification with custom options
   */
  const showToast = useCallback(
    (message: string | ReactNode, options?: ToastOptions): string => {
      const {
        type = 'info' as ToastType,
        duration = 5000,
        position = 'top-right' as ToastPosition,
        closeable = true,
        actions,
        icon,
        className,
        toastId,
        pauseOnHover = true,
        pauseOnFocusLoss = true,
        showProgressBar = true,
        onClose,
        onOpen,
        role = 'alert',
        ariaLive = 'polite',
      } = options || {};

      const toastOptions: ReactToastifyOptions = {
        position: mapPosition(position),
        autoClose: duration === false ? false : duration,
        hideProgressBar: !showProgressBar,
        closeOnClick: false, // We handle close with our custom component
        pauseOnHover,
        pauseOnFocusLoss,
        draggable: true,
        className,
        toastId: toastId || undefined,
        onClose,
        onOpen,
        role,
        // @ts-expect-error - react-toastify doesn't have this in types but it works
        ariaLive,
      };

      // Determine the toast type for react-toastify
      let toastifyMethod = toastify.info;
      switch (type) {
        case 'success':
          toastifyMethod = toastify.success;
          break;
        case 'error':
          toastifyMethod = toastify.error;
          break;
        case 'warning':
          toastifyMethod = toastify.warning;
          break;
        case 'info':
          toastifyMethod = toastify.info;
          break;
        case 'loading':
          toastifyMethod = toastify.info;
          break;
      }

      const toastContent = (
        <CustomToast
          type={type}
          message={message}
          actions={actions}
          closeable={closeable}
          customIcon={icon}
        />
      );

      const id = toastifyMethod(toastContent, toastOptions);
      return String(id);
    },
    [],
  );

  /**
   * Show a success toast
   */
  const showSuccess = useCallback(
    (message: string | ReactNode, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'success' as ToastType });
    },
    [showToast],
  );

  /**
   * Show an error toast
   */
  const showError = useCallback(
    (message: string | ReactNode, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'error' as ToastType });
    },
    [showToast],
  );

  /**
   * Show a warning toast
   */
  const showWarning = useCallback(
    (message: string | ReactNode, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'warning' as ToastType });
    },
    [showToast],
  );

  /**
   * Show an info toast
   */
  const showInfo = useCallback(
    (message: string | ReactNode, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, { ...options, type: 'info' as ToastType });
    },
    [showToast],
  );

  /**
   * Show a loading toast
   */
  const showLoading = useCallback(
    (message: string | ReactNode, options?: Omit<ToastOptions, 'type'>) => {
      return showToast(message, {
        ...options,
        type: 'loading' as ToastType,
        duration: false, // Loading toasts don't auto-dismiss
      });
    },
    [showToast],
  );

  /**
   * Dismiss a specific toast by ID
   */
  const dismissToast = useCallback((toastId: string) => {
    toastify.dismiss(toastId);
  }, []);

  /**
   * Dismiss all active toasts
   */
  const dismissAll = useCallback(() => {
    toastify.dismiss();
  }, []);

  /**
   * Update an existing toast
   */
  const updateToast = useCallback(
    (
      toastId: string,
      message: string | ReactNode,
      options?: Partial<ToastOptions>,
    ) => {
      const {
        type = 'info' as ToastType,
        duration,
        actions,
        icon,
        closeable = true,
      } = options || {};

      const toastContent = (
        <CustomToast
          type={type}
          message={message}
          actions={actions}
          closeable={closeable}
          customIcon={icon}
        />
      );

      toastify.update(toastId, {
        render: toastContent,
        autoClose: duration === false ? false : duration,
      });
    },
    [],
  );

  /**
   * Check if a toast is currently active
   */
  const isActive = useCallback((toastId: string): boolean => {
    return toastify.isActive(toastId);
  }, []);

  const value: ToastContextValue = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showToast,
    dismissToast,
    dismissAll,
    updateToast,
    isActive,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

/**
 * Custom hook to access toast functionality
 * @throws Error if used outside of ToastProvider
 * @returns Toast context value with all toast methods
 *
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.showSuccess('Operation completed!');
 * toast.showError('Something went wrong', {
 *   actions: [{
 *     label: 'Retry',
 *     onClick: () => retryOperation()
 *   }]
 * });
 * ```
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
