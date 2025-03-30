/**
 * A reusable `Loader` component that displays a spinner to indicate loading state.
 *
 * @remarks
 * This component uses the `react-bootstrap` Spinner for the loading animation
 * and applies custom styles from the `app-fixed.module.css` stylesheet.
 *
 * @param props - The properties to configure the Loader component.
 *
 * @property styles - Optional custom styles for the spinner wrapper.
 * Can be a `StyleSheet` object or a string representing CSS class names.
 * Defaults to the `spinner_wrapper` class from the imported stylesheet.
 *
 * @property size - Optional size of the spinner. Accepts:
 * - `'sm'` for a small spinner.
 * - `'lg'` for a large spinner.
 * - `'xl'` for an extra-large spinner.
 * Defaults to the `spinnerXl` class if no size is specified.
 *
 * @returns A JSX element containing a styled spinner.
 *
 * @example
 * ```tsx
 * import Loader from './Loader';
 *
 * const App = () => (
 *   <div>
 *     <Loader size="sm" />
 *     <Loader size="lg" styles="custom-spinner-class" />
 *   </div>
 * );
 * ```
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { Spinner } from 'react-bootstrap';

interface InterfaceLoaderProps {
  styles?: StyleSheet | string; // Custom styles for the spinner wrapper
  size?: 'sm' | 'lg' | 'xl'; // Size of the spinner
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
