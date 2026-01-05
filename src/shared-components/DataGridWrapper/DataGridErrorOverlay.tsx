/**
 * DataGridErrorOverlay Component
 *
 * A custom error overlay component for the DataGrid that displays error messages
 * in a consistent manner with other overlays (loading, empty state).
 *
 * @component
 * @category Shared Components
 */
import React from 'react';
import { Stack, Typography } from '@mui/material';
import IconComponent from 'components/IconComponent/IconComponent';

interface InterfaceDataGridErrorOverlayProps {
  /**
   * Error message to display (string or React component)
   */
  message: string | React.ReactNode;
}

/**
 * Error overlay component for DataGrid
 *
 * @param props - Component props
 * @returns A centered error message overlay with an error icon
 */
export function DataGridErrorOverlay({
  message,
}: InterfaceDataGridErrorOverlayProps): JSX.Element {
  // Convert message to string for aria-label if it's a ReactNode
  const ariaLabel = typeof message === 'string' ? message : 'Error occurred';

  return (
    <Stack
      height="100%"
      alignItems="center"
      justifyContent="center"
      spacing={2}
      padding={4}
      role="alert"
      aria-live="assertive"
      aria-label={ariaLabel}
      data-testid="data-grid-error-overlay"
    >
      {/* Error Icon */}
      <div data-testid="data-grid-error-icon">
        <IconComponent
          name="error"
          fill="var(--bs-danger)"
          width="48px"
          height="48px"
        />
      </div>

      {/* Error Message */}
      <Typography
        variant="h6"
        color="error"
        textAlign="center"
        data-testid="data-grid-error-message"
      >
        {message}
      </Typography>
    </Stack>
  );
}
