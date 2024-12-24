import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface InterfaceTablePaginationActionsProps {
  count: number; // Total number of items
  page: number; // Current page index
  rowsPerPage: number; // Number of items per page
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number, // New page index to navigate to
  ) => void; // Callback function for page changes
}

/**
 * Pagination component for navigating between pages in a table.
 *
 * This component provides buttons to navigate to the first page, previous page,
 * next page, and last page of a table. The visibility and functionality of the
 * buttons are controlled based on the current page and the total number of items.
 *
 * @param  props - Component properties.
 * @returns The rendered component.
 */
function pagination(props: InterfaceTablePaginationActionsProps): JSX.Element {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  /**
   * Handles the event when the "First Page" button is clicked.
   * Navigates to the first page (page 0).
   *
   * @param event - The click event.
   */
  /* istanbul ignore next */
  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    onPageChange(event, 0);
  };

  /**
   * Handles the event when the "Previous Page" button is clicked.
   * Navigates to the previous page.
   *
   * @param event - The click event.
   */
  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    onPageChange(event, page - 1);
  };

  /**
   * Handles the event when the "Next Page" button is clicked.
   * Navigates to the next page.
   *
   * @param event - The click event.
   */

  /* istanbul ignore next */
  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    onPageChange(event, page + 1);
  };

  /**
   * Handles the event when the "Last Page" button is clicked.
   * Navigates to the last page.
   *
   * @param event - The click event.
   */
  /* istanbul ignore next */
  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        data-testid="firstPage"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        data-testid="previousPage"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        data-testid="nextPage"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        data-testid="lastPage"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default pagination;
