/**
 * DataTableTable component for rendering the core table structure.
 *
 * Handles rendering of table headers with sorting indicators, row data with
 * selection checkboxes, action cells, and loading states for pagination.
 *
 * @typeParam T - The type of data for each row
 */

import React from 'react';
import Table from 'react-bootstrap/Table';
import type {
  IColumnDef,
  InterfaceDataTableTableProps,
} from 'types/shared-components/DataTable/interface';
import { renderHeader, renderCellValue, getCellValue } from './utils';
import { ActionsCell } from './cells/ActionsCell';
import styles from './DataTableTable.module.css';
import { LoadingMoreRows } from './LoadingMoreRows';

/**
 * Helper function to safely render a cell value using the column's render function
 * or fallback to the default renderCellValue.
 *
 * @param col - Column definition potentially with a custom render function
 * @param val - The cell value extracted from the row
 * @param row - The row data for context
 * @returns Rendered cell content or null
 */
function renderCell<T>(
  col: IColumnDef<T, unknown>,
  val: unknown,
  row: T,
): React.ReactNode {
  if (col.render) {
    // The render function is defined with (value: TValue, row: T) => ReactNode
    // We pass the extracted value and row; TypeScript validates at definition time
    return col.render(val, row);
  }
  return renderCellValue(val);
}

/**
 * DataTableTable component for rendering the core table structure.
 *
 * Renders the HTML table with headers, rows, selection checkboxes, sorting indicators,
 * and action cells. Handles user interactions for sorting, row selection, and displays
 * loading states during pagination. Includes sorting UI, selection controls, and action cells.
 *
 * @param props - The component props (`InterfaceDataTableTableProps<T>`):
 *   Table structure (columns, sortedRows, ariaLabel, tableClassNames)
 *   Sorting (activeSortBy, activeSortDir, handleHeaderClick)
 *   Selection (effectiveSelectable, currentSelection, toggleRowSelection, headerCheckboxRef, selectAllOnPage, someSelectedOnPage, allSelectedOnPage)
 *   Rendering (renderRow, getKey, startIndex)
 *   Actions (hasRowActions, effectiveRowActions)
 *   Loading (loadingMore, skeletonRows, ariaBusy)
 *   Utilities (tCommon)
 * @returns The rendered table JSX element with headers, rows, and optional loading indicators
 */
export function DataTableTable<T>({
  ariaLabel,
  ariaBusy,
  tableClassNames,
  columns,
  effectiveSelectable,
  hasRowActions,
  headerCheckboxRef,
  someSelectedOnPage,
  allSelectedOnPage,
  selectAllOnPage,
  activeSortBy,
  activeSortDir,
  handleHeaderClick,
  sortedRows,
  startIndex,
  getKey,
  currentSelection,
  toggleRowSelection,
  tCommon,
  renderRow,
  effectiveRowActions,
  loadingMore,
  skeletonRows,
}: InterfaceDataTableTableProps<T>) {
  return (
    <Table
      striped
      hover
      responsive
      className={tableClassNames}
      data-testid="datatable"
      aria-busy={ariaBusy}
    >
      {ariaLabel && (
        <caption className={styles.visuallyHidden}>{ariaLabel}</caption>
      )}
      <thead>
        <tr>
          {effectiveSelectable && (
            <th scope="col" className={styles.selectCol}>
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                aria-label={tCommon('selectAllOnPage')}
                aria-checked={someSelectedOnPage ? 'mixed' : allSelectedOnPage}
                checked={allSelectedOnPage}
                onChange={(e) => selectAllOnPage(e.currentTarget.checked)}
                data-testid="select-all-checkbox"
              />
            </th>
          )}
          {columns.map((col) => {
            const isSortable = col.meta?.sortable !== false;
            const isActive = activeSortBy === col.id;
            const ariaSort: React.AriaAttributes['aria-sort'] = isActive
              ? activeSortDir === 'asc'
                ? 'ascending'
                : 'descending'
              : undefined;
            return (
              <th
                key={col.id}
                scope="col"
                aria-sort={ariaSort}
                className={isSortable ? styles.sortable : undefined}
                tabIndex={isSortable ? 0 : undefined}
                role={isSortable ? 'button' : undefined}
                onClick={isSortable ? () => handleHeaderClick(col) : undefined}
                onKeyDown={
                  isSortable
                    ? (e: React.KeyboardEvent<HTMLElement>) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleHeaderClick(col);
                        }
                      }
                    : undefined
                }
                style={col.meta?.width ? { width: col.meta.width } : undefined}
              >
                <span className={styles.headerInner}>
                  {renderHeader(col.header)}
                  {isSortable && (
                    <span
                      aria-hidden="true"
                      className={`${styles.sortIndicator} ${isActive ? styles.active : ''}`}
                    >
                      {isActive ? (activeSortDir === 'asc' ? '▲' : '▼') : '⇅'}
                    </span>
                  )}
                </span>
              </th>
            );
          })}
          {hasRowActions && (
            <th scope="col" className={styles.actionsCol}>
              {tCommon('actions')}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {renderRow
          ? sortedRows.map((row, idx) => (
              <React.Fragment key={getKey(row, startIndex + idx)}>
                {renderRow(row, idx)}
              </React.Fragment>
            ))
          : sortedRows.map((row, idx) => {
              const rowKeyValue = getKey(row, startIndex + idx);
              const isRowSelected = currentSelection.has(rowKeyValue);
              return (
                <tr
                  key={rowKeyValue}
                  data-testid={`datatable-row-${rowKeyValue}`}
                  data-selected={isRowSelected}
                >
                  {effectiveSelectable && (
                    <td className={styles.selectCol}>
                      <input
                        type="checkbox"
                        aria-label={tCommon('selectRow', {
                          rowKey: String(rowKeyValue),
                        })}
                        checked={isRowSelected}
                        onChange={() => toggleRowSelection(rowKeyValue)}
                        data-testid={`select-row-${rowKeyValue}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const val = getCellValue(row, col.accessor);
                    return (
                      <td key={col.id} data-testid={`datatable-cell-${col.id}`}>
                        {renderCell(col, val, row)}
                      </td>
                    );
                  })}
                  {hasRowActions && (
                    <td className={styles.actionsCol}>
                      <ActionsCell row={row} actions={effectiveRowActions} />
                    </td>
                  )}
                </tr>
              );
            })}

        {loadingMore && (
          <LoadingMoreRows
            columns={columns}
            effectiveSelectable={effectiveSelectable}
            hasRowActions={hasRowActions}
            skeletonRows={skeletonRows}
          />
        )}
      </tbody>
    </Table>
  );
}

export default DataTableTable;
