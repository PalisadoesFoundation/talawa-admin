import React from 'react';
import styles from './Loader.module.css';
import { Spinner } from 'react-bootstrap';

interface InterfaceLoaderProps {
  styles?: StyleSheet | string;
  size?: 'sm' | 'lg' | 'xl';
}

const Loader = (props: InterfaceLoaderProps): JSX.Element => {
  return (
    <>
      <div
        className={`${props?.styles ?? styles.spinner_wrapper}`}
        data-testid="spinner-wrapper"
      >
        <Spinner
          className={`
           ${
             props?.size == 'sm'
               ? styles.spinnerSm
               : props?.size == 'lg'
               ? styles.spinnerLg
               : styles.spinnerXl
           }
          `}
          animation="border"
          variant="primary"
          data-testid="spinner"
        />
      </div>
    </>
  );
};

export default Loader;
