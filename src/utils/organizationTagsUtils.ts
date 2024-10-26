// This file will contain the utililities for organization tags

// This is the style object for mui's data grid used to list the data (tags and member data)
export const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.1rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.1rem',
  },
};

export const ADD_PEOPLE_TO_TAGS_QUERY_LIMIT = 7;
export const TAGS_QUERY_LIMIT = 10;

export type TagActionType = 'assignToTags' | 'removeFromTags';
