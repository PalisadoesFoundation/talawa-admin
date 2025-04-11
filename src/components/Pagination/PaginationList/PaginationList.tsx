/**
 * PaginationList component renders a responsive pagination control
 * using Material-UI's `TablePagination` component. It adapts its
 * layout based on the screen size, providing a compact view for
 * smaller screens and a detailed view for larger screens.
 *
 * @component
 * @param {number} count - Total number of items to paginate.
 * @param {number} rowsPerPage - Number of rows displayed per page.
 * @param {number} page - Current page index (zero-based).
 * @param {(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void} onPageChange - Callback triggered when the page changes.
 * @param {(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} onRowsPerPageChange - Callback triggered when the rows per page value changes.
 *
 * @remarks
 * - The component uses the `useTranslation` hook to support internationalization.
 * - It conditionally renders different layouts for small and large screens using Material-UI's `Hidden` component.
 * - The `Pagination` component is used as a custom `ActionsComponent` for navigation controls.
 *
 * @example
 * ```tsx
 * <PaginationList
 *   count={100}
 *   rowsPerPage={10}
 *   page={0}
 *   onPageChange={(event, newPage) => console.log(newPage)}
 *   onRowsPerPageChange={(event) => console.log(event.target.value)}
 * />
 * ```
 */
import React from 'react';
import { Hidden, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Pagination from '../Navigator/Pagination';
import './PaginationList.css';

interface InterfacePropsInterface {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const PaginationList = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}: InterfacePropsInterface): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'paginationList',
  });

  return (
    <>
      <Hidden smUp>
        <TablePagination
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          rowsPerPageOptions={[]}
          colSpan={5}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={Pagination}
        />
      </Hidden>
      <Hidden smDown initialWidth={'lg'}>
        <TablePagination
          rowsPerPageOptions={[
            5,
            10,
            30,
            { label: t('all'), value: Number.MAX_SAFE_INTEGER },
          ]}
          data-testid={'table-pagination'}
          colSpan={4}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={Pagination}
          labelRowsPerPage={t('rowsPerPage')}
        />
      </Hidden>
    </>
  );
};

export default PaginationList;
