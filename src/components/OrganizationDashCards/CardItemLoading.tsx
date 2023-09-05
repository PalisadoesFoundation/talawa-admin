import React from 'react';
import styles from './CardItem.module.css';

const cardItemLoading = (): JSX.Element => {
  return (
    <>
      <div className={`${styles.cardItem} border-bottom`}>
        <div className={`${styles.iconWrapper} me-3`}>
          <div className={styles.themeOverlay} />
        </div>
        <span
          className={`${styles.title} shimmer rounded`}
          style={{
            height: '1.5rem',
          }}
        >
          &nbsp;
        </span>
      </div>
    </>
  );
};

export default cardItemLoading;
