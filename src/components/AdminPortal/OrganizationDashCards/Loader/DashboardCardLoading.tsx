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
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from './DashboardCardLoading.module.css';

const DashBoardCardLoading = (): JSX.Element => {
  return (
    <Card className="rounded-4" border="0" data-testid="Card">
      <Card.Body className={styles.cardBody}>
        <Row className="align-items-center">
          <Col sm={4}>
            <div className={styles.iconWrapper}>
              <div className={styles.themeOverlay} />
            </div>
          </Col>
          <Col sm={8} className={styles.textWrapper}>
            <span
              className={`${styles.primaryText} ${styles.shimmer1} shimmer rounded w-75 mb-2`}
            />
            <span
              className={`${styles.secondaryText} ${styles.shimmer2} shimmer rounded`}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashBoardCardLoading;
