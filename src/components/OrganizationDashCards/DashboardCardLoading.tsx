import React from 'react';
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from '../../style/app.module.css';

/**
 * Dashboard card loading component is a loading state for the dashboard card. It is used when the data is being fetched.
 * @returns JSX.Element
 */
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
              className={`${styles.primaryText} shimmer rounded w-75 mb-2`}
              style={{
                height: '1.75rem',
              }}
            />
            <span
              className={`${styles.secondaryText} shimmer rounded`}
              style={{
                height: '1.25rem',
              }}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DashBoardCardLoading;
