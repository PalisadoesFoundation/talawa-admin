import React from 'react';
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from './Dashboardcard.module.css';

const dashBoardCardLoading = (): JSX.Element => {
  return (
    <Card className="rounded-4" border="0">
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

export default dashBoardCardLoading;
