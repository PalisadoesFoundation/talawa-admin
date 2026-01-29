/**
 * A React functional component that renders a loading placeholder
 * for a card item. This component is used to indicate that the
 * content of a card item is being loaded.
 *
 * @returns A JSX element representing the loading state of a card item.
 *
 * @remarks
 * - Styling comes from `CardItemLoading.module.css`, which composes
 *   shared styles from `app-fixed.module.css`.
 * - The `shimmer` and `rounded` classes are applied to create a
 *   visual effect for the loading state.
 * - The `themeOverlay` class is used to style the icon wrapper
 *   during the loading state.
 * - This component is primarily used in the `OrganizationDashCards`
 *   section of the application to provide a consistent loading
 *   experience for users.
 *
 * @example
 * ```tsx
 * import CardItemLoading from './CardItemLoading';
 *
 * const App = () => (
 *   <div>
 *     <CardItemLoading />
 *   </div>
 * );
 * ```
 */
import React from 'react';
import styles from './CardItemLoading.module.css';

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
          aria-hidden="true"
          className={`${styles.title} shimmer rounded ${styles.titlePlaceholder}`}
        />
      </div>
    </>
  );
};

export default CardItemLoading;
