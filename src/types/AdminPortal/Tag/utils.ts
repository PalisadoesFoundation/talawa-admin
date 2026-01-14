export const TAGS_QUERY_DATA_CHUNK_SIZE = 10;

export const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.1rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.1rem',
  },
  '& .MuiDataGrid-topContainer': {
    position: 'fixed',
    top: 290,
    zIndex: 1,
  },
  '& .MuiDataGrid-virtualScrollerContent': {
    marginTop: 6.5,
  },
  '& .MuiDataGrid-cell:focus': {
    outline: '2px solid #000',
    outlineOffset: '-2px',
  },
};
