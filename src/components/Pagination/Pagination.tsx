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
<<<<<<< HEAD
    newPage: number,
=======
    newPage: number
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ) => void;
}

function pagination(props: InterfaceTablePaginationActionsProps): JSX.Element {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  /* istanbul ignore next */
  const handleFirstPageButtonClick = (
<<<<<<< HEAD
    event: React.MouseEvent<HTMLButtonElement>,
=======
    event: React.MouseEvent<HTMLButtonElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): void => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
<<<<<<< HEAD
    event: React.MouseEvent<HTMLButtonElement>,
=======
    event: React.MouseEvent<HTMLButtonElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): void => {
    onPageChange(event, page - 1);
  };

  /* istanbul ignore next */
  const handleNextButtonClick = (
<<<<<<< HEAD
    event: React.MouseEvent<HTMLButtonElement>,
=======
    event: React.MouseEvent<HTMLButtonElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): void => {
    onPageChange(event, page + 1);
  };

  /* istanbul ignore next */
  const handleLastPageButtonClick = (
<<<<<<< HEAD
    event: React.MouseEvent<HTMLButtonElement>,
=======
    event: React.MouseEvent<HTMLButtonElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
