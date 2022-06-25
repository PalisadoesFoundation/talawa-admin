import React from 'react';
import { Hidden, TablePagination } from '@mui/material';

import Pagination from '../Pagination/Pagination';

interface PropsInterface {
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

const PaginationList = (props: PropsInterface) => {
  return (
    <>
      <Hidden smUp>
        <TablePagination
          rowsPerPageOptions={[]}
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
        />
      </Hidden>
      <Hidden smDown>
        <TablePagination
          rowsPerPageOptions={[5, 10, 30, { label: 'All', value: -1 }]}
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
        />
      </Hidden>
    </>
  );
};

export default PaginationList;
