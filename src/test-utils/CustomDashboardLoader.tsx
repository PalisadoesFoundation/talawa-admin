import React from 'react';

/**
 * CustomDashboardLoader test utility component.
 *
 * Renders multiple placeholder items to emulate a dashboard
 * loading state for testing LoadingState custom loaders.
 *
 * @returns JSX.Element
 */
const CustomDashboardLoader = () => (
  <>
    {[...Array(6)].map((_, index) => (
      <div key={index} data-testid={`loader-${index}`} />
    ))}
  </>
);

export default CustomDashboardLoader;
