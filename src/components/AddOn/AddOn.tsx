import React from 'react';
import PropTypes from 'prop-types';

interface InterfaceAddOnProps {
  extras: any;
  name: string;
  children: any;
}

// Validate Extras
function addOn({ children }: InterfaceAddOnProps): JSX.Element {
  return (
    <>
      <div className="plugin-container" data-testid="pluginContainer">
        {children}
      </div>
    </>
  );
}

addOn.defaultProps = {
  extras: {},
  name: '',
  children: null,
};

addOn.propTypes = {
  extras: PropTypes.shape({
    components: PropTypes.shape({}),
    actions: PropTypes.shape({}),
  }),
  name: PropTypes.string,
  children: PropTypes.any,
};

export default addOn;
