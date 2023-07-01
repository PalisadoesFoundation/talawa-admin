import React from 'react';
import styles from './Loader.module.css';
import { Spinner } from 'react-bootstrap';

const Loader = (): JSX.Element => {
  return (
    <>
      <div className={styles.spinner_wrapper} data-testid="spinner-wrapper">
        <Spinner
          className={styles.spinner}
          animation="border"
          variant="primary"
          data-testid="spinner"
        />
      </div>
    </>
  );
};

export default Loader;
