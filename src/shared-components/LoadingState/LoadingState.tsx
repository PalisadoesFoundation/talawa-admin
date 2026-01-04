/**
 * LoadingState Component
 *
 * A reusable component that provides consistent loading experiences across the application.
 * Supports full-screen spinner with overlay, inline loading indicators, and skeleton placeholders.
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
 *
 * // Skeleton loading (for initial content load)
 * <LoadingState isLoading={loading} variant="skeleton">
 *   <div>Content</div>
 * </LoadingState>
 * ```
 *
 * @remarks
 * - When loading, the spinner variant displays an overlay that blocks user interactions
 * - Skeleton variant shows animated placeholders suitable for initial content loading
 * - Includes proper accessibility attributes (role, aria-live, aria-label)
 * - Supports internationalization for aria-label
 */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import type { InterfaceLoadingStateProps } from 'types/shared-components/LoadingState/interface';
import TableLoader from 'components/TableLoader/TableLoader';

const LoadingState = ({
  isLoading,
  variant = 'spinner',
  size = 'xl',
  children,
  'data-testid': dataTestId = 'loading-state',
  tableHeaderTitles,
  noOfRows,
  skeletonRows = 5,
  skeletonCols = 4,
  customLoader,
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

  // Table variant: renders TableLoader
  if (variant === 'table') {
    return (
      <TableLoader
        noOfRows={noOfRows || 5}
        headerTitles={tableHeaderTitles}
        data-testid={dataTestId}
      />
    );
  }

  // Skeleton variant: renders skeleton-like rows
  if (variant === 'skeleton') {
    const safeRows = Math.max(0, skeletonRows);
    const safeCols = Math.max(0, skeletonCols);

    return (
      <div
        data-testid={dataTestId}
        className="w-100"
        role="status"
        aria-live="polite"
        aria-label={t('loading', { defaultValue: 'Loading' })}
      >
        {[...Array(safeRows)].map((_, rowIndex) => (
          <div key={rowIndex} className="d-flex mb-3 gap-3">
            {[...Array(safeCols)].map((_, colIndex) => (
              <div key={colIndex} className={`${styles.loadingItem} shimmer`} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Custom variant: renders user-provided custom loader
  if (variant === 'custom') {
    return (
      <div
        data-testid={dataTestId}
        role="status"
        aria-live="polite"
        aria-label={t('loading', { defaultValue: 'Loading' })}
      >
        {customLoader}
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
