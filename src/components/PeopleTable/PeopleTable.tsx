import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSlots,
  GridRowsProp,
} from '@mui/x-data-grid';
import styles from './PeopleTable.module.css';

interface IPeopleTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading: boolean;
  rowCount: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  pageSizeOptions?: number[];
  slots?: Partial<GridSlots>;
}

const PeopleTable: React.FC<IPeopleTableProps> = ({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [5, 10, 20],
  slots,
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
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        getRowId={(row) => row._id || row.id}
        disableRowSelectionOnClick
        autoHeight
        slots={slots}
        disableColumnMenu
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--tableHeader-bg)',
            color: 'var(--tableHeader-color)',
            fontSize: 'var(--font-size-header)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: 'var(--tablerow-bg-color)',
            '&:focus-within': {
              outline: '2px solid #000',
              outlineOffset: '-2px',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'var(--grey-bg-color)',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
};

export default PeopleTable;
