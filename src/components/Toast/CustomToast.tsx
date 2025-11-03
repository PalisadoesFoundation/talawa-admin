/**
 * Custom Toast Component
 * Provides reusable toast components with consistent styling and action buttons
 */

import React from 'react';
import type { ToastAction } from './types';
import styles from './Toast.module.css';
import {
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Close,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

/**
 * Props for the CustomToast component
 */
interface CustomToastProps {
  /**
   * Type of toast notification
   */
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';

  /**
   * Message content to display
   */
  message: string | React.ReactNode;

  /**
   * Action buttons to display
   */
  actions?: ToastAction[];

  /**
   * Whether toast can be manually closed
   */
  closeable?: boolean;

  /**
   * Custom icon to display (overrides default type icon)
   */
  customIcon?: React.ReactNode;

  /**
   * Function to close the toast (from react-toastify)
   */
  closeToast?: () => void;

  /**
   * Toast props from react-toastify (optional)
   */
  toastProps?: any;

  /**
   * Additional data (optional)
   */
  data?: any;
}

/**
 * Get the default icon for a toast type
 */
const getIconForType = (type: CustomToastProps['type']): React.ReactNode => {
  switch (type) {
    case 'success':
      return <CheckCircle className={styles.toastIcon} />;
    case 'error':
      return <ErrorIcon className={styles.toastIcon} />;
    case 'warning':
      return <Warning className={styles.toastIcon} />;
    case 'info':
      return <Info className={styles.toastIcon} />;
    case 'loading':
      return <CircularProgress size={20} className={styles.toastIcon} />;
    default:
      return <Info className={styles.toastIcon} />;
  }
};

/**
 * CustomToast component - renders a styled toast notification
 * with optional action buttons and consistent theming
 */
export const CustomToast: React.FC<CustomToastProps> = ({
  type,
  message,
  actions,
  closeable = true,
  customIcon,
  closeToast,
}) => {
  const handleActionClick = async (action: ToastAction): Promise<void> => {
    try {
      await action.onClick();
      if (action.closeOnClick !== false && closeToast) {
        closeToast();
      }
    } catch (error) {
      console.error('Toast action failed:', error);
    }
  };

  return (
    <div className={`${styles.customToast} ${styles[`toast-${type}`]}`}>
      <div className={styles.toastContent}>
        <div className={styles.toastIconWrapper}>
          {customIcon || getIconForType(type)}
        </div>
        <div className={styles.toastMessage}>{message}</div>
        {closeable && closeToast && (
          <button
            className={styles.toastCloseButton}
            onClick={closeToast}
            aria-label="Close notification"
            type="button"
          >
            <Close fontSize="small" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      {actions && actions.length > 0 && (
        <div className={styles.toastActions}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={`${styles.toastActionButton} ${action.className || ''}`}
              onClick={() => void handleActionClick(action)}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomToast;
