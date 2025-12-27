/**
 * LoadingState Component
 *
 * A reusable component that provides consistent loading experiences across the application.
 * Supports both full-screen spinner with overlay and inline loading indicators.
 *
 * @component
 * @example
 * ```tsx
 * // Full-screen loading
 * <LoadingState isLoading={loading} variant="spinner" size="lg">
 *   <Button onClick={handleClick}>Click me</Button>
 * </LoadingState>
 *
 * // Inline loading
 * <LoadingState isLoading={loading} variant="inline">
 *   <div>Content</div>
 * </LoadingState>
 * ```
 *
 * @remarks
 * - When loading, the spinner variant displays an overlay that blocks user interactions
 * - Includes proper accessibility attributes (role, aria-live, aria-label)
 * - Supports internationalization for aria-label
 */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import type { InterfaceLoadingStateProps } from 'types/shared-components/LoadingState/interface';

const LoadingState = ({
  isLoading,
  variant = 'spinner',
  size = 'xl',
  children,
  'data-testid': dataTestId = 'loading-state',
}: InterfaceLoadingStateProps): JSX.Element => {
  const { t } = useTranslation('common');

  // If not loading, just render children
  if (!isLoading) {
    return <>{children}</>;
  }

  // Inline variant: compact loading indicator
  if (variant === 'inline') {
    return (
      <div
        className={styles.spinner_wrapper}
        data-testid={dataTestId}
        role="status"
        aria-live="polite"
        aria-label={t('loading', { defaultValue: 'Loading' })}
      >
        <Spinner
          className={
            size === 'sm'
              ? styles.spinnerSm
              : size === 'lg'
                ? styles.spinnerLg
                : styles.spinnerXl
          }
          animation="border"
          variant="primary"
          data-testid="spinner"
        />
      </div>
    );
  }

  // Spinner variant: full-screen with overlay
  return (
    <div className={styles.loadingContainer} data-testid={dataTestId}>
      {/* Overlay to block interactions */}
      <div
        className={styles.loadingOverlay}
        role="status"
        aria-live="polite"
        aria-label={t('loading', { defaultValue: 'Loading' })}
      >
        <Spinner
          className={
            size === 'sm'
              ? styles.spinnerSm
              : size === 'lg'
                ? styles.spinnerLg
                : styles.spinnerXl
          }
          animation="border"
          variant="primary"
          data-testid="spinner"
        />
      </div>
      {/* Render children underneath overlay */}
      <div className={styles.loadingContent}>{children}</div>
    </div>
  );
};

export default LoadingState;
