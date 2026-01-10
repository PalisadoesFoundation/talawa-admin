import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
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
 * @returns An array of JSX elements representing the skeleton loaders.
 */
export function AdvertisementSkeleton() {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tErrors } = useTranslation('errors');

  return [...Array(6)].map((_, index) => (
    <ErrorBoundaryWrapper
      key={index}
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div className={styles.itemCard} data-testid={`skeleton-${index + 1}`}>
        <div className={styles.loadingWrapper}>
          <div className={styles.innerContainer}>
            <div className={`${styles.orgImgContainer} shimmer`} />
            <div className={styles.content}>
              <h5 className="shimmer" title={t('name')}>
                <span className="visually-hidden">{t('loading')}</span>
              </h5>
            </div>
          </div>
          <div className={`shimmer ${styles.button}`} />
        </div>
      </div>
    </ErrorBoundaryWrapper>
  ));
}
