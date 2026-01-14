/**
 * ErrorBoundaryWrapper - error boundary for React components
 * (don't catch errors in event handlers, async code, SSR, or inside the boundary itself)
 *
 * Catches JavaScript errors in child components, logs them, and displays
 * a fallback UI instead of crashing the entire component tree.
 *
 * **Key Features:**
 * - Catches render errors that try-catch cannot handle
 * - Provides default and custom fallback UI options
 * - Integrates with toast notification system
 * - Supports error recovery via reset mechanism
 * - Allows error logging/tracking integration
 *
 * **Accessibility:**
 * - Fallback UI is keyboard accessible
 * - Screen reader friendly error messages
 * - Clear recovery actions
 *
 * @example
 * // Basic usage with default fallback
 * <ErrorBoundaryWrapper>
 *   <YourComponent />
 * </ErrorBoundaryWrapper>
 *
 * @example
 * // With custom error message and logging
 * <ErrorBoundaryWrapper
 *   errorMessage={translatedErrorMessage}
 *   onError={(error, info) => logToService(error, info)}
 *   onReset={() => navigate('/dashboard')}
 * >
 *   <ComplexModal />
 * </ErrorBoundaryWrapper>
 *
 * @example
 * // With custom fallback component
 * <ErrorBoundaryWrapper fallbackComponent={CustomModalError}>
 *   <Modal>...</Modal>
 * </ErrorBoundaryWrapper>
 */

import React, { ReactNode, ErrorInfo } from 'react';
import type {
  InterfaceErrorBoundaryWrapperProps,
  InterfaceErrorBoundaryWrapperState,
} from 'types/shared-components/ErrorBoundaryWrapper/interface';
import styles from './ErrorBoundaryWrapper.module.css';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

export class ErrorBoundaryWrapper extends React.Component<
  InterfaceErrorBoundaryWrapperProps,
  InterfaceErrorBoundaryWrapperState
> {
  // Initialize error boundary state
  constructor(props: InterfaceErrorBoundaryWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This lifecycle method is called during the render phase (to change UI)
   */
  static getDerivedStateFromError(
    error: Error,
  ): Partial<InterfaceErrorBoundaryWrapperState> {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details after an error has been caught
   * This lifecycle method is called during the commit phase (to log/ report)
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, showToast = true, errorMessage } = this.props;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Show toast notification
    if (showToast) {
      const message =
        errorMessage || error.message || 'An unexpected error occurred';
      NotificationToast.error(message);
    }

    // Call custom error handler (e.g., for error tracking services)
    if (onError) {
      onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({ errorInfo });
  }

  /**
   * Reset error boundary state to recover from error
   */
  handleReset = (): void => {
    const { onReset } = this.props;

    // setState is used in all methods other than constructor
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (onReset) {
      onReset();
    }
  };

  // Render precedence:
  // 1. Custom fallback component
  // 2. Custom fallback JSX
  // 3. Default fallback UI
  render(): ReactNode {
    const { hasError, error } = this.state;
    const {
      children,
      fallback,
      fallbackComponent: FallbackComponent,
      fallbackTitle,
      fallbackErrorMessage,
      resetButtonText,
      resetButtonAriaLabel,
    } = this.props;

    if (hasError) {
      // Custom fallback component with error details
      if (FallbackComponent) {
        return <FallbackComponent error={error} onReset={this.handleReset} />;
      }

      // Simple fallback JSX
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div
          className={styles.errorBoundaryFallback}
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary-fallback"
        >
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>{fallbackTitle}</h3>
            <p className={styles.errorMessage}>
              {error?.message || fallbackErrorMessage}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className={styles.resetButton}
              aria-label={resetButtonAriaLabel}
            >
              {resetButtonText}
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
