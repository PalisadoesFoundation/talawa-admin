import React from 'react';
import AddOn from 'components/AddOn/AddOn';

// Validate Extras
function DummyPlugin(): JSX.Element {
  return (
    <AddOn>
      <div>Welcome to the Dummy Plugin!</div>
    </AddOn>
  );
}

DummyPlugin.defaultProps = {};

DummyPlugin.propTypes = {};

export default DummyPlugin;
