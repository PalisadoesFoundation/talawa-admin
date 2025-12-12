import React from 'react';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { IPeopleTableProps } from '../../types/PeopleTable/interface';
import styles from './PeopleTable.module.css';

/**
 * PeopleTable Component
 *
 * A reusable component that renders a data grid for displaying a list of people.
 * It wraps the MUI DataGrid component and provides standard styling and pagination handling.
 *
 * @component
 * @param {IPeopleTableProps} props - The props for the PeopleTable component.
 * @returns {JSX.Element} The rendered PeopleTable component.
 */

const PeopleTable: React.FC<IPeopleTableProps> = ({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 20],
  slots,
  paginationMeta,
  getRowId,
}) => {
  return (
    <div className={styles.tableContainer}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        paginationMode="server"
        paginationMeta={paginationMeta}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        getRowId={
          getRowId ||
          ((row) => {
            const id = row._id || row.id;
            if (!id) {
              throw new Error(
                'PeopleTable: Row is missing a unique identifier (_id or id).',
              );
            }
            return id;
          })
        }
        disableRowSelectionOnClick
        autoHeight
        slots={slots}
        disableColumnMenu
        sx={(theme) => ({
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--tableHeader-bg)',
            color: 'var(--tableHeader-color)',
            fontSize: 'var(--font-size-header)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: 'var(--tablerow-bg-color)',
            '&:focus-within': {
              outline: `2px solid ${theme.palette.text.primary}`,
              outlineOffset: '-2px',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'var(--grey-bg-color)',
            boxShadow: `0 0 0 1px ${alpha(theme.palette.text.primary, 0.1)}`,
          },
        })}
      />
    </div>
  );
};

export default PeopleTable;
