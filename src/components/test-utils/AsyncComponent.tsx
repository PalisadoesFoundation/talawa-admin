import React from 'react';

const AsyncComponent = () => {
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

export default AsyncComponent;
