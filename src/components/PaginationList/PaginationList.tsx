import React from 'react';
import { Hidden, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Pagination from '../Pagination/Pagination';
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
/**
 * A component that provides pagination controls for a table.
 * It uses different pagination styles based on screen size.
 *
 * @param count - The total number of rows in the table.
 * @param rowsPerPage - The number of rows displayed per page.
 * @param page - The current page number.
 * @param onPageChange - Callback function to handle page changes.
 * @param onRowsPerPageChange - Callback function to handle changes in rows per page.
 */

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
