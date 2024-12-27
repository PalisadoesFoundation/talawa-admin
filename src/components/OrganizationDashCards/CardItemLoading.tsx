import React from 'react';
import styles from '../../style/app.module.css';

/**
 * CardItemLoading component is a loading state for the card item. It is used when the data is being fetched.
 * @returns JSX.Element
 */
const CardItemLoading = (): JSX.Element => {
  return (
    <>
      <div
        className={`${styles.cardItem} border-bottom`}
        data-testid="cardItemLoading"
      >
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

export default CardItemLoading;
