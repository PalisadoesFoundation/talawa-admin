import React from 'react';

/**
 * A test utility component that simulates an asynchronous operation.
 * Initially renders with "Loading" text, then changes to "Loaded" after a brief delay.
 *
 * @example
 * ```tsx
 * render(
 *   <AsyncComponent />
 * );
 * // Initially shows "Loading"
 * // After delay shows "Loaded"
 * ```
 *
 * @returns A div element that displays either "Loading" or "Loaded"
 */
export const AsyncComponent = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Simulate async operation
    setTimeout(() => {
      setLoaded(true);
    }, 0);
  }, []);

  return (
    <div data-testid="async-component">{loaded ? 'Loaded' : 'Loading'}</div>
  );
};
