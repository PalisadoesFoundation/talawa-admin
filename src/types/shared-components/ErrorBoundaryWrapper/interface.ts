import { ReactNode, ErrorInfo } from 'react';

/**
 * Props for ErrorBoundaryWrapper component
 *
 * ErrorBoundaryWrapper catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the entire app.
 *
 * **Key Features:**
 * - Catches render errors that try-catch cannot handle
 * - Provides default and custom fallback UI options
 * - Integrates with toast notification system
 * - Supports error recovery via reset mechanism
 * - Allows error logging/tracking integration
 *
 * @example
 * ```tsx
 * <ErrorBoundaryWrapper
 *   errorMessage={translatedErrorMessage}
 *   onError={(error, info) => logToService(error, info)}
 *   onReset={() => navigate('/dashboard')}
 * >
 *   <ComplexModal />
 * </ErrorBoundaryWrapper>
 * ```
 */
export interface InterfaceErrorBoundaryWrapperProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;

  /**
   * Custom fallback UI (JSX element) to display when an error occurs.
   * Takes precedence over default fallback but not over fallbackComponent.
   */
  fallback?: ReactNode;

  /**
   * Custom fallback component that receives error details and reset function.
   * Takes precedence over both default fallback and custom JSX fallback.
   * Receives error and onReset as props.
   */
  fallbackComponent?: React.ComponentType<InterfaceErrorFallbackProps>;

  /**
   * Custom error message to display in toast notification.
   * Falls back to error.message or 'An unexpected error occurred' if not provided.
   */
  errorMessage?: string;

  /**
   * Whether to show toast notification on error.
   * @default true
   */
  showToast?: boolean;

  /**
   * Callback invoked when an error is caught.
   * Useful for logging errors to external services (e.g., Sentry, LogRocket).
   * Receives the Error object and ErrorInfo containing component stack trace.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Callback invoked when user attempts to reset error state via the reset button.
   * Can be used to navigate away, refresh data, or perform cleanup operations.
   */
  onReset?: () => void;

  /**
   * Translated title text for default fallback UI.
   */
  fallbackTitle: string;

  /**
   * Translated fallback error message when error.message is unavailable.
   */
  fallbackErrorMessage: string;

  /**
   * Translated reset button text.
   */
  resetButtonText: string;

  /**
   * Translated aria-label for reset button (accessibility).
   */
  resetButtonAriaLabel: string;
}

/**
 * Internal state for ErrorBoundaryWrapper component.
 *
 * Tracks whether an error has occurred and stores error details for rendering
 * in the fallback UI.
 */
export interface InterfaceErrorBoundaryWrapperState {
  /** Whether an error has been caught */
  readonly hasError: boolean;
  /** The error that was caught */
  readonly error: Error | null;
  /** Additional error information including component stack. */
  readonly errorInfo: ErrorInfo | null;
}

/**
 * Props passed to custom fallback components.
 *
 * When using `fallbackComponent`, the component will receive these props
 * to render a custom error UI with access to error details and reset functionality.
 *
 * @example
 * ```tsx
 * const CustomErrorFallback = ({ error, onReset }: InterfaceErrorFallbackProps) => (
 *   <div>
 *     <h2>Custom Error UI</h2>
 *     <p>{error?.message}</p>
 *     <button onClick={onReset}>Retry</button>
 *   </div>
 * );
 * ```
 */
export interface InterfaceErrorFallbackProps {
  /** The error that was caught by the error boundary */
  error: Error | null;
  /** Function to reset the error boundary state and attempt to re-render children */
  onReset: () => void;
}
