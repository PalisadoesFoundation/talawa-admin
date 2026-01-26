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
  IRowAction,
  SortDirection,
} from '../../types/shared-components/DataTable/interface';
import { renderHeader, renderCellValue, getCellValue } from './utils';
import { ActionsCell } from './cells/ActionsCell';
import styles from './DataTableTable.module.css';
import { LoadingMoreRows } from './LoadingMoreRows';

interface IDataTableTableProps<T> {
  ariaLabel?: string;
  ariaBusy?: boolean;
  tableClassNames: string;
  columns: Array<IColumnDef<T>>;
  effectiveSelectable: boolean;
  hasRowActions: boolean;
  headerCheckboxRef: React.RefObject<HTMLInputElement | null>;
  someSelectedOnPage: boolean;
  allSelectedOnPage: boolean;
  selectAllOnPage: (checked: boolean) => void;
  activeSortBy?: string;
  activeSortDir: SortDirection;
  handleHeaderClick: (col: IColumnDef<T>) => void;
  sortedRows: readonly T[];
  startIndex: number;
  getKey: (row: T, idx: number) => string | number;
  currentSelection: ReadonlySet<string | number>;
  toggleRowSelection: (key: string | number) => void;
  tCommon: (key: string, options?: Record<string, unknown>) => string;
  renderRow?: (row: T, index: number) => React.ReactNode;
  effectiveRowActions: ReadonlyArray<IRowAction<T>>;
  loadingMore: boolean;
  skeletonRows: number;
}

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
}: IDataTableTableProps<T>) {
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
            const isSortable = col.meta?.sortable === true;
            const isActive = activeSortBy === col.id;
            const ariaSort: React.AriaAttributes['aria-sort'] = isActive
              ? activeSortDir === 'asc'
                ? 'ascending'
                : 'descending'
              : 'none';
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
                        {col.render
                          ? col.render(val as never, row)
                          : renderCellValue(val)}
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
