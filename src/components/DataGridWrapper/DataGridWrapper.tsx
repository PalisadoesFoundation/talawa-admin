/**
 * DataGridWrapper Component
 *
 * A wrapper around MUI DataGrid that applies consistent styling and behavior
 * across list/table screens (e.g. Organization Tags, Volunteer Groups, Organization People).
 * Ensures a uniform UI/UX for pagination and list rendering patterns.
 *
 * @component
 * @see docs/docs/docs/developer-resources/tables.md
 */

import React from 'react';
import { DataGrid, type DataGridProps } from '@mui/x-data-grid';

/** Default DataGrid styling shared across table screens (CSS variables from app theme) */
const defaultDataGridSx = {
  borderRadius: 'var(--table-head-radius)',
  backgroundColor: 'var(--grey-bg-color)',
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
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'var(--grey-bg-color)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: '2px solid #000',
    outlineOffset: '-2px',
  },
};

export interface InterfaceDataGridWrapperProps extends DataGridProps {
  /** Optional custom sx merged with default table styles */
  sx?: DataGridProps['sx'];
}

/**
 * Renders a DataGrid inside a datatable container with consistent styling.
 * Pass-through all DataGrid props; sx is merged with the default table theme.
 */
function DataGridWrapper({
  sx,
  ...dataGridProps
}: InterfaceDataGridWrapperProps): JSX.Element {
  const mergedSx =
    typeof sx === 'object' && sx !== null
      ? { ...defaultDataGridSx, ...sx }
      : defaultDataGridSx;

  return (
    <div className="datatable">
      <DataGrid {...dataGridProps} sx={mergedSx} />
    </div>
  );
}

export default DataGridWrapper;
