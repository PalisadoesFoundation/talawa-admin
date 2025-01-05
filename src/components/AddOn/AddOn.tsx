import React from 'react';
import PropTypes from 'prop-types';

interface InterfaceAddOnProps {
  extras?: any;
  name?: string;
  children?: React.ReactNode;
}

/**
 * The AddOn component is used to wrap children within a plugin container.
 * It also accepts additional properties (`extras` and `name`) to allow for
 * extensibility and custom naming.
 *
 * @param props - The props for the AddOn component.
 * @param extras - Additional properties for the AddOn component.
 * @param name - The name for the AddOn component.
 * @param children - The child elements to be rendered within the AddOn component.
 *
 * @returns The JSX element representing the AddOn component.
 */
function AddOn({
  children = 'Default text',
  extras = {},
  name = '',
}: InterfaceAddOnProps): JSX.Element {
  return (
    <div className="plugin-container" data-testid="pluginContainer">
      {children}
    </div>
  );
}

// PropTypes validation for the AddOn component
AddOn.propTypes = {
  extras: PropTypes.shape({
    components: PropTypes.shape({}),
    actions: PropTypes.shape({}),
  }),
  name: PropTypes.string,
  children: PropTypes.node,
};

export default AddOn;
