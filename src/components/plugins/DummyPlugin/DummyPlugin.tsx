import React from 'react';
import AddOn from 'components/AddOn/AddOn';

// Validate Extras
function dummyPlugin(): JSX.Element {
  return (
    <AddOn>
      <div>Welcome to the Dummy Plugin!</div>
    </AddOn>
  );
}

dummyPlugin.defaultProps = {};

dummyPlugin.propTypes = {};

export default dummyPlugin;
