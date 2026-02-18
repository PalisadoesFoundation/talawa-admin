import React from 'react';

const ComplexLoader = () => (
  <div data-testid="complex-loader">
    <div className="shimmer" data-testid="skeleton-1" />
    <div className="shimmer" data-testid="skeleton-2" />
    <div className="shimmer" data-testid="skeleton-3" />
  </div>
);

export default ComplexLoader;
