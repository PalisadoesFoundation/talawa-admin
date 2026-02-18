import React from 'react';
import type { IPaginationControlsProps } from '../../types/shared-components/DataTable/interface';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';

/**
 * PaginationControls component for navigating through paginated data.
 *
 * Type Safety: IPaginationControlsProps enforces number types for pageSize and totalItems.
 * TypeScript prevents string/unknown types at compile-time, so runtime Number.isFinite()
 * checks are defensive fallbacks only (should never receive strings from properly-typed callers).
 *
 * AUDIT RESULT: All call sites verified (DataTable.tsx only caller):
 * - pageSize: defaults to 10 (numeric), derived from props with number type
 * - totalItems: comes from (totalItems ?? data.length), both numeric
 * - No URL/form-based string-to-number coercion needed (type safety enforced)
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @param {number} totalItems - Total number of items across all pages
 * @param {Function} onPageChange - Callback function invoked when page changes
 * @returns {JSX.Element} Pagination navigation controls
 */
export function PaginationControls({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: IPaginationControlsProps) {
  const { t: tCommon } = useTranslation('common');

  const parsedTotalItems = Number.isFinite(totalItems) ? totalItems : 0;
  const parsedPageSize = Number.isFinite(pageSize) ? pageSize : 1;
  const safeTotalItems = Math.max(0, parsedTotalItems);
  const safePageSize = Math.max(1, Math.floor(parsedPageSize));
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startItem =
    safeTotalItems === 0 ? 0 : (safePage - 1) * safePageSize + 1;
  const endItem = Math.min(safePage * safePageSize, safeTotalItems);
  const prevDisabled = safePage <= 1;
  const nextDisabled = safePage >= totalPages;

  return (
    <div
      className={styles.paginationWrap}
      role="navigation"
      aria-label={tCommon('tablePagination')}
    >
      <button
        type="button"
        onClick={() => onPageChange(safePage - 1)}
        className={styles.pageBtn}
        disabled={prevDisabled}
        aria-label={tCommon('paginationPrevLabel')}
      >
        {tCommon('paginationPrev')}
      </button>

      <span className={styles.paginationRange} aria-live="polite">
        {startItem}–{endItem} of {safeTotalItems}
      </span>

      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => onPageChange(safePage + 1)}
        disabled={nextDisabled}
        aria-label={tCommon('paginationNextLabel')}
      >
        {tCommon('paginationNext')}
      </button>
    </div>
  );
}
