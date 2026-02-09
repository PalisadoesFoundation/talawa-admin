/**
 * Reusable ErrorPanel component for displaying error messages with retry functionality.
 *
 * Features:
 * - Displays error icon (WarningAmberRounded)
 * - Shows custom message and error details with optional sanitization
 * - Provides retry button with accessibility support
 * - Follows ARIA best practices (role="alert", aria-live="assertive")
 * - Prevents sensitive information disclosure via error message sanitization
 *
 * @param props - ErrorPanel component props
 * @returns JSX.Element - The rendered error panel
 */
import React, { useMemo } from 'react';
import { WarningAmberRounded } from '@mui/icons-material';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import styles from './ErrorPanel.module.css';

// Constants for error message sanitization
const ERROR_MESSAGE_MAX_LENGTH = 200;
const SENSITIVE_PATTERNS = [
  /(?:api[_-]?key|token|password|authorization|bearer)\s*[:=]\s*[^\s]+/gi,
  /\/home\/[^\s]+/g,
  /\/Users\/[^\s]+/g,
  /C:\\Users\\[^\s]+/g,
];

/**
 * Sanitizes error message by removing sensitive patterns and truncating.
 * Pure helper function for sanitizing error messages before display.
 * @param errorMessage - The raw error message to sanitize
 * @returns Sanitized error message safe for display
 */
function sanitizeErrorMessage(errorMessage: string): string {
  if (!errorMessage) {
    return '';
  }
  let sanitized = errorMessage;

  // Apply all sensitive pattern replacements
  SENSITIVE_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Truncate if too long
  if (sanitized.length > ERROR_MESSAGE_MAX_LENGTH) {
    return sanitized.substring(0, ERROR_MESSAGE_MAX_LENGTH) + '...';
  }

  return sanitized;
}
export interface InterfaceErrorPanelProps {
  /**
   * The main error message to display (can be a string or React node)
   */
  message: string | React.ReactNode;

  /**
   * The error object containing additional error details
   */
  error: Error | null;

  /**
   * Callback function to retry the failed operation
   */
  onRetry: () => void;

  /**
   * Test ID for the error message container (defaults to 'errorMsg')
   */
  testId?: string;

  /**
   * Additional CSS class name for the container
   */
  className?: string;

  /**
   * ARIA role for accessibility (role="alert" implies aria-live="assertive", defaults to 'alert')
   */
  role?: 'alert' | 'status' | 'log' | 'marquee' | 'timer';

  /**
   * ARIA live region setting (only used when role is not 'alert', defaults to 'assertive')
   */
  ariaLive?: 'off' | 'polite' | 'assertive';

  /**
   * ARIA label for the retry button (only set if different from button text)
   */
  retryAriaLabel?: string;

  /**
   * Whether to show raw error details (for development/debugging)
   * When false, displays a sanitized/truncated message instead (defaults to false)
   */
  showErrorDetails?: boolean;
}

/**
 * ErrorPanel component that displays error information with a retry button.
 * Sanitizes sensitive information from error messages and logs full errors to console.
 */
const ErrorPanel: React.FC<InterfaceErrorPanelProps> = ({
  message,
  error,
  onRetry,
  testId = 'errorMsg',
  className = '',
  role = 'alert',
  ariaLive = 'assertive',
  retryAriaLabel,
  showErrorDetails = false,
}) => {
  const { t: tCommon } = useTranslation('common');

  // Log full error to console for debugging purposes
  React.useEffect(() => {
    if (error && process.env.NODE_ENV !== 'production') {
      console.error('ErrorPanel error:', error);
    }
  }, [error]);
  // Memoize derived values
  const {
    retryButtonLabel,
    displayErrorMessage,
    ariaLabelProps,
    ariaLiveProps,
    containerClassName,
  } = useMemo(() => {
    const label = tCommon('retry');
    const customLabel = retryAriaLabel || label;
    const isCustomLabel = customLabel !== label;

    const displayMsg = showErrorDetails
      ? error?.message
      : error
        ? sanitizeErrorMessage(error.message ?? '')
        : null;

    return {
      retryButtonLabel: label,
      displayErrorMessage: displayMsg,
      ariaLabelProps: isCustomLabel ? { 'aria-label': customLabel } : {},
      ariaLiveProps: role !== 'alert' ? { 'aria-live': ariaLive } : {},
      containerClassName:
        `${styles.container} bg-white rounded-4 my-3 ${className}`.trim(),
    };
  }, [
    tCommon,
    retryAriaLabel,
    showErrorDetails,
    error,
    role,
    ariaLive,
    className,
  ]);

  return (
    <div className={containerClassName} role={role} {...ariaLiveProps}>
      <div className={styles.message} data-testid={testId}>
        <WarningAmberRounded className={styles.errorIcon} />
        <h6 className="fw-bold text-danger text-center">
          {message}
          {displayErrorMessage && (
            <>
              <br />
              {displayErrorMessage}
            </>
          )}
        </h6>
        <div className="text-center mt-3">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onRetry}
            {...ariaLabelProps}
          >
            {retryButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPanel;
