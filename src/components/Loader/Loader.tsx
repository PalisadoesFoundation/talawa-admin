import React from 'react';
import styles from './Loader.module.css';
import { Spinner } from 'react-bootstrap';

interface InterfaceLoaderProps {
  styles?: StyleSheet | string; // Custom styles for the spinner wrapper
  size?: 'sm' | 'lg' | 'xl'; // Size of the spinner
}

/**
 * Loader component for displaying a loading spinner.
 *
 * @param styles - Optional custom styles for the spinner wrapper.
 * @param size - Size of the spinner. Can be 'sm', 'lg', or 'xl'.
 * @returns JSX element for a loading spinner.
 */
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
