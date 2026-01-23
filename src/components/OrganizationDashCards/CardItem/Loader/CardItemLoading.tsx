/**
 * A React functional component that renders a loading placeholder
 * for a card item. This component is used to indicate that the
 * content of a card item is being loaded.
 *
 * @returns A JSX element representing the loading state of a card item.
 *
 * @remarks
 * - The component uses CSS classes from `app-fixed.module.css` to
 *   style the loading placeholder.
 * - The `shimmer` and `rounded` classes are applied to create a
 *   visual effect for the loading state.
 * - The `themeOverlay` class is used to style the icon wrapper
 *   during the loading state.
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
 *
 * @remarks
 * This component is primarily used in the `OrganizationDashCards`
 * section of the application to provide a consistent loading
 * experience for users.
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
          className={`${styles.title} shimmer rounded ${styles.titlePlaceholder}`}
        >
          &nbsp;
        </span>
      </div>
    </>
  );
};

export default CardItemLoading;
