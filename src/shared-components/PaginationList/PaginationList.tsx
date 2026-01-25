/**
 * PaginationList component renders a responsive pagination control
 * using Material-UI's `TablePagination` component. It adapts its
 * layout based on the screen size, providing a compact view for
 * smaller screens and a detailed view for larger screens.
 *
 * @param props - Props for the component
 * @param count - Total number of items to paginate.
 * @param rowsPerPage - Number of rows displayed per page.
 * @param page - Current page index (zero-based).
 * @param onPageChange - Callback triggered when the page changes.
 * @param onRowsPerPageChange - Callback triggered when the rows per page value changes.
 * @returns JSX.Element
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
import { TablePagination, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Pagination from 'components/Pagination/Navigator/Pagination';
import styles from './PaginationList.module.css';
import type { InterfacePaginationListProps } from 'types/shared-components/PaginationList/interface';

const PaginationList = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}: InterfacePaginationListProps): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'paginationList',
  });

  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <>
      {isSmallScreen ? (
        <TablePagination
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className={styles.pagination}
          rowsPerPageOptions={[]}
          colSpan={5}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': t('rowsPerPage'),
            },
            native: true,
          }}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={Pagination}
          component="div"
        />
      ) : (
        <TablePagination
          className={styles.pagination}
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
              'aria-label': t('rowsPerPage'),
            },
            native: true,
          }}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          ActionsComponent={Pagination}
          labelRowsPerPage={t('rowsPerPage')}
          component="div"
        />
      )}
    </>
  );
};

export default PaginationList;
