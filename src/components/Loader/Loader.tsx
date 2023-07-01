import React from 'react';
import styles from './Loader.module.css';

const Loader = (): JSX.Element => {
  return (
    <>
      <div className={styles.loader} data-bs-theme="light"></div>
    </>
  );
};

export default Loader;
