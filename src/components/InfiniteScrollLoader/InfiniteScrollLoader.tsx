import React from 'react';
import styles from './InfiniteScrollLoader.module.css';

/**
 * A Loader for infinite scroll.
 */

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
