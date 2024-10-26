import React from 'react';
import AddOn from 'components/AddOn/AddOn';

/**
 * A dummy plugin component that renders a welcome message inside an `AddOn` component.
 *
 * This component is used for demonstration or testing purposes and does not have any
 * additional functionality or properties.
 *
 * @returns JSX.Element - Renders the `AddOn` component containing a welcome message.
 */
function DummyPlugin(): JSX.Element {
  return (
    <AddOn>
      <div>Welcome to the Dummy Plugin!</div>
    </AddOn>
  );
}

export default DummyPlugin;
