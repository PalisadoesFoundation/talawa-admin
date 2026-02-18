import React from 'react';

const CustomDashboardLoader = () => (
  <>
    {[...Array(6)].map((_, index) => (
      <div key={index} data-testid={`loader-${index}`} />
    ))}
  </>
);

export default CustomDashboardLoader;
