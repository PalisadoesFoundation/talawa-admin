import React from 'react';
import styles from 'style/app-fixed.module.css';

/**
 * AdvertisementSkeleton Component
 *
 * This component renders a skeleton loader for advertisements, typically used
 * as a placeholder while the actual advertisement data is being fetched or loaded.
 * It creates a list of 6 skeleton items, each styled to resemble the layout of an
 * advertisement card.
 *
 * Each skeleton item includes:
 * - A shimmering image container to represent the advertisement image.
 * - A shimmering title placeholder to represent the advertisement name.
 * - A shimmering button placeholder.
 *
 * The skeleton items are styled using CSS classes provided by the `styles` object,
 * and each item is uniquely identified with a `data-testid` attribute for testing purposes.
 *
 * @returns {JSX.Element[]} An array of JSX elements representing the skeleton loaders.
 */
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
