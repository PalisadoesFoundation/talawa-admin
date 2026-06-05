/**
 * DashBoardCardLoading Component
 *
 * This component renders a loading placeholder for a dashboard card.
 * It is designed to provide a visual indication of loading content
 * while the actual data is being fetched or processed.
 *
 * The component uses Bootstrap's `Card`, `Row`, and `Col` components
 * for layout and styling, along with custom CSS classes for additional
 * styling and shimmer effects.
 *
 * @returns A React functional component that displays
 * a skeleton loader for a dashboard card.
 *
 * @remarks
 * - The `styles` object contains CSS modules for custom styling.
 * - The shimmer effect is applied to the placeholder text using
 *   the `shimmer` class.
 * - The component is fully responsive and adapts to different screen sizes.
 *
 * @example
 * ```tsx
 * import DashBoardCardLoading from './DashboardCardLoading';
 *
 * const App = () => (
 *   <div>
 *     <DashBoardCardLoading />
 *   </div>
 * );
 *
 * export default App;
 * ```
 *
 */
import React from 'react';
import styles from './DashboardCardLoading.module.css';

const DashBoardCardLoading = (): JSX.Element => {
  return (
    <div style={{ borderRadius: '1rem', border: 'none' }} data-testid="Card">
      <div className={styles.cardBody}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '0 0 33.33%' }}>
            <div className={styles.iconWrapper}>
              <div className={styles.themeOverlay} />
            </div>
          </div>
          <div style={{ flex: '0 0 66.67%' }} className={styles.textWrapper}>
            <span
              className={`${styles.primaryText} ${styles.shimmer1} shimmer`}
              style={{
                borderRadius: '0.25rem',
                width: '75%',
                marginBottom: '0.5rem',
              }}
            />
            <span
              className={`${styles.secondaryText} ${styles.shimmer2} shimmer`}
              style={{ borderRadius: '0.25rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCardLoading;
