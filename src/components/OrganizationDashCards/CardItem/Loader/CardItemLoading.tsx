/**
 * A React functional component that renders a loading placeholder
 * for a card item. This component is used to indicate that the
 * content of a card item is being loaded.
 *
 * @returns A JSX element representing the loading state
 * of a card item.
 *
 * @remarks
 * - The component uses CSS classes from `app-fixed.module.css` to
 *   style the loading placeholder.
 * - The `shimmer` and `rounded` classes are applied to create a
 *   visual effect for the loading state.
 * - The `themeOverlay` class is used to style the icon wrapper
 *   during the loading state.
 */
import React from 'react';
import styles from './CardItemLoading.module.css';
import { useTranslation } from 'react-i18next';

const CardItemLoading = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'cardItem' });
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
          style={{ height: '1.5rem' }}
        >
          {t('loadingPlaceholder')}
        </span>
      </div>
    </>
  );
};

export default CardItemLoading;
