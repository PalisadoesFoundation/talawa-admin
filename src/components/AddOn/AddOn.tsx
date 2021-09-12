import React from 'react';
import styles from './AddOn.module.css';
import PropTypes from 'prop-types';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';

interface AddOnProps {
  extras: any;
  name: string;
  children: any;
}

// Validate Extras
function AddOn({ extras, name, children }: AddOnProps): JSX.Element {
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;
  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      {children}
    </>
  );
}

AddOn.defaultProps = {
  extras: {},
  name: '',
  children: null,
};

AddOn.propTypes = {
  extras: PropTypes.shape({
    components: PropTypes.shape({}),
    actions: PropTypes.shape({}),
  }),
  name: PropTypes.string,
  children: PropTypes.any,
};

export default AddOn;
