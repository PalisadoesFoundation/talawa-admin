import React from 'react';
import styles from './DummyPlugin.module.css';
import PropTypes from 'prop-types';
import AddOn from 'components/AddOn/AddOn';

// Validate Extras
function DummyPlugin(props: any): JSX.Element {
  return (
    <AddOn>
      <div>Welcome to the Dummy Plugin!</div>
    </AddOn>
  );
}

DummyPlugin.defaultProps = {};

DummyPlugin.propTypes = {};

export default DummyPlugin;
