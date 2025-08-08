/**
 * A functional React component that provides pagination controls for navigating
 * through a table or list of items. It includes buttons for navigating to the
 * first, previous, next, and last pages.
 *
 * @param props - The properties required for the pagination component.
 * @param props.count - The total number of items in the dataset.
 * @param props.page - The current page index (zero-based).
 * @param props.rowsPerPage - The number of rows displayed per page.
 * @param props.onPageChange - A callback function triggered when the page changes.
 * It receives the click event and the new page index as arguments.
 *
 * @returns A JSX element containing the pagination controls.
 *
 * @remarks
 * - The component uses Material-UI's `IconButton` for the navigation buttons.
 * - The `useTheme` hook is used to determine the text direction (LTR or RTL),
 * which affects the icon orientation.
 *
 * @example
 * ```tsx
 * <Pagination
 *   count={100}
 *   page={2}
 *   rowsPerPage={10}
 *   onPageChange={(event, newPage) => console.log(newPage)}
 * />
 * ```
 *
 * @component
 * @category Pagination
 */
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface InterfaceTablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function pagination(props: InterfaceTablePaginationActionsProps): JSX.Element {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  /**
   * Handles the event when the "First Page" button is clicked.
   * Navigates to the first page (page 0).
   *
   * @param event - The click event.
   */
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
