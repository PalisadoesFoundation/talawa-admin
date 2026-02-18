// Reusable types and shared styles for ReportingTable component
export const ROW_HEIGHT: number = 60;
export const PAGE_SIZE: number = 10;

/**
 * Shared sx/style object for DataGrid across the app.
 * Keep shape generic to avoid strict MUI theme coupling in the types package.
 */
export const dataGridStyle = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--row-background)',
  '& .MuiDataGrid-row': {
    backgroundColor: 'var(--row-background)',
    '&:focus-within': { outline: 'none' },
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'var(--row-background)' },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--row-background)',
  },
  '& .MuiDataGrid-cell:focus': { outline: 'none' },
  '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
};
