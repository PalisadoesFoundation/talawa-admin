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
    newPage: number
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PaginationList = (props: InterfacePropsInterface): JSX.Element => {
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
          count={props.count}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={props.onPageChange}
          onRowsPerPageChange={props.onRowsPerPageChange}
          ActionsComponent={Pagination}
        />
      </Hidden>
      <Hidden smDown initialWidth={'lg'}>
        <TablePagination
          rowsPerPageOptions={[
            -1,
            5,
            10,
            30,
            { label: t('all'), value: Number.MAX_SAFE_INTEGER },
          ]}
          data-testid={'table-pagination'}
          colSpan={4}
          count={props.count}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={props.onPageChange}
          onRowsPerPageChange={props.onRowsPerPageChange}
          ActionsComponent={Pagination}
          labelRowsPerPage={t('rowsPerPage')}
        />
      </Hidden>
    </>
  );
};

export default PaginationList;
