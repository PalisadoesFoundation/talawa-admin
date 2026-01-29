import React from 'react';

/**
 * InterfacePaginationListProps
 * Interface for PaginationList component props
 */
export interface InterfacePaginationListProps {
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
