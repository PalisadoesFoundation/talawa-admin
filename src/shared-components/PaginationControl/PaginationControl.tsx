/**
 * PaginationControl: A keyboard-accessible, ARIA-compliant pagination control
 * with page navigation buttons, a current-page indicator, a rows-per-page
 * selector, and a "Showing X–Y of Z" summary.
 *
 * @remarks
 * - All page values are 1-indexed (page 1 = first page).
 * - Arrow-Left / Arrow-Right keyboard shortcuts change the page when the
 *   component is not disabled, unless focus is inside a form element.
 * - The component is fully controlled: callers own `currentPage` and
 *   `pageSize` state and must update them via the callbacks.
 *
 * @example
 * ```tsx
 * const [page, setPage] = React.useState(1);
 * const [size, setSize] = React.useState(10);
 *
 * <PaginationControl
 *   currentPage={page}
 *   totalPages={Math.ceil(totalItems / size)}
 *   pageSize={size}
 *   totalItems={totalItems}
 *   onPageChange={setPage}
 *   onPageSizeChange={(s) => { setSize(s); setPage(1); }}
 * />
 * ```
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import styles from './PaginationControl.module.css';
import type { IPaginationControlProps } from 'types/shared-components/PaginationControl/interface';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * PaginationControl renders a full-featured pagination bar.
 *
 * @param currentPage - Current active page (1-indexed).
 * @param totalPages - Total number of pages.
 * @param pageSize - Number of items per page.
 * @param totalItems - Total number of items across all pages.
 * @param pageSizeOptions - Selectable page-size values. Defaults to [10, 25, 50, 100].
 * @param onPageChange - Called with the new page number when navigation occurs.
 * @param onPageSizeChange - Called with the new page size when the selector changes.
 * @param disabled - Disables all controls (e.g. during a loading state).
 * @returns React.JSX.Element
 */
export function PaginationControl({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  enableJumpToPage = false,
  onJumpToPage,
}: IPaginationControlProps) {
  const { t: tCommon } = useTranslation('common');
  const paginationRef = useRef<HTMLElement>(null);

  // Clamp safeguards (mirrors DataTable/Pagination.tsx defensive pattern)
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const safeTotalItems = Math.max(0, totalItems);

  // Local state for the jump-to-page input string
  const [jumpInput, setJumpInput] = useState(safePage.toString());

  // Sync input state when parent-driven page changes occur
  useEffect(() => {
    setJumpInput(safePage.toString());
  }, [safePage]);

  const canPrev = safePage > 1;
  const canNext = safePage < safeTotalPages;

  const startItem = safeTotalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, safeTotalItems);

  const goTo = useCallback(
    (page: number) => {
      if (!disabled) onPageChange(page);
    },
    [disabled, onPageChange],
  );

  // Arrow-key keyboard navigation - scoped to the component
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>): void => {
      if (disabled) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && canPrev) goTo(safePage - 1);
      if (e.key === 'ArrowRight' && canNext) goTo(safePage + 1);
    },
    [disabled, canPrev, canNext, safePage, goTo],
  );

  const handleJumpToPage = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (disabled) return;
    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter')
      return;

    const value = parseInt(jumpInput, 10);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(1, value), safeTotalPages);
      if (onJumpToPage) {
        onJumpToPage(clampedValue);
      } else {
        goTo(clampedValue);
      }
      // Sync state with clamped value to ensure visibility matches action
      setJumpInput(clampedValue.toString());
    } else {
      // Revert to current page on invalid input
      setJumpInput(safePage.toString());
    }
  };

  return (
    <nav
      ref={paginationRef}
      className={styles.paginationWrap}
      aria-label={tCommon('paginationControl')}
      data-testid="pagination-control"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation buttons */}
      <div className={styles.navGroup}>
        <Button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(1)}
          disabled={!canPrev || disabled}
          aria-label={tCommon('paginationFirstLabel')}
          data-testid="pagination-first"
        >
          {tCommon('paginationFirst')}
        </Button>

        <Button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(safePage - 1)}
          disabled={!canPrev || disabled}
          aria-label={tCommon('paginationPrevLabel')}
          data-testid="pagination-prev"
        >
          {tCommon('paginationPreviousChar')}
        </Button>

        <span
          className={styles.pageInfo}
          aria-live="polite"
          aria-atomic="true"
          data-testid="pagination-page-info"
        >
          {tCommon('paginationPageOf', {
            page: safePage,
            total: safeTotalPages,
          })}
        </span>

        <Button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(safePage + 1)}
          disabled={!canNext || disabled}
          aria-label={tCommon('paginationNextLabel')}
          data-testid="pagination-next"
        >
          {tCommon('paginationNextChar')}
        </Button>

        <Button
          type="button"
          className={styles.pageBtn}
          onClick={() => goTo(safeTotalPages)}
          disabled={!canNext || disabled}
          aria-label={tCommon('paginationLastLabel')}
          data-testid="pagination-last"
        >
          {tCommon('paginationLast')}
        </Button>
      </div>

      {/* Rows per page selector */}
      <label className={styles.pageSizeLabel}>
        {tCommon('paginationRowsPerPage')}
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={disabled}
          data-testid="pagination-page-size"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      {/* Summary */}
      <span className={styles.rangeInfo} data-testid="pagination-range">
        {tCommon('paginationShowing', {
          start: startItem,
          end: endItem,
          total: safeTotalItems,
        })}
      </span>

      {/* Jump to page */}
      {enableJumpToPage && (
        <label className={styles.pageSizeLabel}>
          {tCommon('jumpToPage') || 'Jump to page'}
          <input
            type="number"
            min={1}
            max={safeTotalPages}
            className={`${styles.pageSizeSelect} ${styles.jumpToPageInput}`}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            disabled={disabled}
            onBlur={handleJumpToPage}
            onKeyDown={handleJumpToPage}
            aria-label={tCommon('jumpToPage') || 'Jump to page'}
            data-testid="pagination-jump"
          />
        </label>
      )}
    </nav>
  );
}

export default PaginationControl;
