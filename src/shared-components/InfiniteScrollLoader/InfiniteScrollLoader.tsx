/**
 * InfiniteScrollLoader Component
 *
 * This component renders a simple loader with a spinner, typically used
 * to indicate loading state during infinite scrolling or data fetching.
 *
 *
 * @returns A loader with a spinner.
 *
 * @remarks
 * - The loader is styled using CSS modules imported from `style/app-fixed.module.css`.
 * - The `data-testid` attributes are included for testing purposes.
 *
 * @example
 * ```tsx
 * import InfiniteScrollLoader from './InfiniteScrollLoader';
 *
 * const App = () => (
 *   <div>
 *     <InfiniteScrollLoader />
 *   </div>
 * );
 * ```
 *
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';

const InfiniteScrollLoader = (): JSX.Element => {
  return (
    <div data-testid="infiniteScrollLoader" className={styles.simpleLoader}>
      <div
        data-testid="infiniteScrollLoaderSpinner"
        className={styles.spinner}
      />
    </div>
  );
};

export default InfiniteScrollLoader;
