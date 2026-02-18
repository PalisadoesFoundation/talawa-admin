import React from 'react';

/**
 * ComplexLoader test utility component.
 *
 * Simulates a skeleton style loader with multiple shimmer
 * elements to verify layout and rendering behavior.
 *
 * @returns JSX.Element
 */
const ComplexLoader = () => (
  <div data-testid="complex-loader">
    <div className="shimmer" data-testid="skeleton-1" />
    <div className="shimmer" data-testid="skeleton-2" />
    <div className="shimmer" data-testid="skeleton-3" />
  </div>
);

export default ComplexLoader;
