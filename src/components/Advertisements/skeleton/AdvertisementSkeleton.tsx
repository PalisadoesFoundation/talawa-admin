import React from 'react';
import styles from 'style/app-fixed.module.css';

export function AdvertisementSkeleton() {
  return [...Array(6)].map((_, index) => (
    <div
      key={index}
      className={styles.itemCard}
      data-testid={`skeleton-${index + 1}`}
    >
      <div className={styles.loadingWrapper}>
        <div className={styles.innerContainer}>
          <div className={`${styles.orgImgContainer} shimmer`} />
          <div className={styles.content}>
            <h5 className="shimmer" title="Name">
              <span className="visually-hidden">Advertisement Loading</span>
            </h5>
          </div>
        </div>
        <div className={`shimmer ${styles.button}`} />
      </div>
    </div>
  ));
}
