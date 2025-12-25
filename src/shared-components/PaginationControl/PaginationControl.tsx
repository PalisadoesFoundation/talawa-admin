/**
 * PaginationControl Component
 *
 * A reusable, accessible pagination control that standardizes pagination UX
 * across the Talawa Admin application. Replaces inconsistent pagination patterns
 * including MUI's paginationModel, onPaginationModelChange, and custom implementations.
 *
 * @example
 * Basic usage:
 * ```tsx
 * const [currentPage, setCurrentPage] = useState(1);
 * const [pageSize, setPageSize] = useState(25);
 *
 * <PaginationControl
 *   currentPage={currentPage}
 *   totalPages={Math.ceil(totalItems / pageSize)}
 *   pageSize={pageSize}
 *   totalItems={totalItems}
 *   onPageChange={setCurrentPage}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 *
 * @remarks
 * - Uses 1-based indexing (currentPage starts at 1, not 0)
 * - Fully keyboard accessible (Arrow keys, Home, End)
 * - Responsive design with mobile breakpoints
 * - Handles edge cases (empty data, single page, partial last page)
 * - WCAG 2.1 Level AA compliant
 *
 * @param props - Component props
 * @returns JSX.Element representing the pagination control
 *
 * @see {@link InterfacePaginationControlProps} for prop details
 * @see {@link https://github.com/PalisadoesFoundation/talawa-admin/issues/5293} for implementation details
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfacePaginationControlProps } from '../../types/shared-components/PaginationControl/interface';
import styles from './PaginationControl.module.css';

export function PaginationControl({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: InterfacePaginationControlProps): JSX.Element {
  const { t } = useTranslation();

  // Calculate navigation states
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  // Calculate item range for display
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowLeft':
        if (canPrev) {
          event.preventDefault();
          onPageChange(currentPage - 1);
        }
        break;
      case 'ArrowRight':
        if (canNext) {
          event.preventDefault();
          onPageChange(currentPage + 1);
        }
        break;
      case 'Home':
        if (canPrev) {
          event.preventDefault();
          onPageChange(1);
        }
        break;
      case 'End':
        if (canNext) {
          event.preventDefault();
          onPageChange(totalPages);
        }
        break;
      default:
        break;
    }
  };

  // Handle empty state
  if (totalItems === 0) {
    return (
      <div
        className={styles.paginationContainer}
        role="navigation"
        aria-label={t('pagination.label')}
      >
        <span className={styles.emptyState}>{t('pagination.noItems')}</span>
      </div>
    );
  }

  return (
    <div
      className={styles.paginationContainer}
      role="navigation"
      aria-label={t('pagination.label')}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* First Page Button */}
      <button
        className={styles.navButton}
        onClick={() => onPageChange(1)}
        disabled={!canPrev || disabled}
        aria-label={t('pagination.first')}
        title={t('pagination.goToFirst')}
        type="button"
        data-testid="firstPageButton"
      >
        <span aria-hidden="true">«</span>
      </button>

      {/* Previous Page Button */}
      <button
        className={styles.navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrev || disabled}
        aria-label={t('pagination.previous')}
        title={t('pagination.goToPrevious')}
        type="button"
        data-testid="previousPageButton"
      >
        <span aria-hidden="true">‹</span>
      </button>

      {/* Current Page Display */}
      <span className={styles.pageInfo} aria-live="polite">
        {t('pagination.pageInfo', {
          currentPage,
          totalPages,
        })}
      </span>

      {/* Next Page Button */}
      <button
        className={styles.navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNext || disabled}
        aria-label={t('pagination.next')}
        title={t('pagination.goToNext')}
        type="button"
        data-testid="nextPageButton"
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Last Page Button */}
      <button
        className={styles.navButton}
        onClick={() => onPageChange(totalPages)}
        disabled={!canNext || disabled}
        aria-label={t('pagination.last')}
        title={t('pagination.goToLast')}
        type="button"
        data-testid="lastPageButton"
      >
        <span aria-hidden="true">»</span>
      </button>

      {/* Rows Per Page Selector */}
      <label className={styles.pageSizeLabel}>
        {t('pagination.rowsPerPage')}
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          aria-label={t('pagination.rowsPerPage')}
          data-testid="pageSizeSelect"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {/* Item Range Display */}
      <span className={styles.itemRange}>
        {t('pagination.showing', {
          startItem,
          endItem,
          totalItems,
        })}
      </span>
    </div>
  );
}
