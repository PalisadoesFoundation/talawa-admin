/**
 * A test utility React component that simulates an asynchronous operation.
 *
 * @remarks
 * Renders "Loading" initially, then "Loaded" after a short delay.
 * Useful for testing async behavior in React components.
 *
 * @returns The rendered async component.
 */
import React from 'react';

const AsyncComponent = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 0);
  }, []);

  return (
    <div data-testid="async-component">{loaded ? 'Loaded' : 'Loading'}</div>
  );
};

export default AsyncComponent;
