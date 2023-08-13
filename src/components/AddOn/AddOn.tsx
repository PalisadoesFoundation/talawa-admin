import React from 'react';
import PropTypes from 'prop-types';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/reducers';

interface InterfaceAddOnProps {
  extras: any;
  name: string;
  children: any;
}

// Validate Extras
function addOn({ children }: InterfaceAddOnProps): JSX.Element {
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;
  return (
    <>
      <AdminNavbar />
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
