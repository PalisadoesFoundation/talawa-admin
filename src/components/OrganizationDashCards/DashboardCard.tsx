import React from 'react';
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from 'style/app-fixed.module.css';

/**
 * Dashboard card component is used to display the card with icon, title and count.
 * @param  icon - Icon for the card
 * @param  title - Title for the card
 * @param  count - Count for the card
 * @returns Dashboard card component
 */
const dashBoardCard = (props: {
  icon: React.ReactNode;
  title: string;
  count?: number;
}): JSX.Element => {
  const { icon, count, title } = props;
  return (
    <Card className={`${styles.cardBodyMainDiv}`}>
      <Card.Body className={styles.cardBody}>
        <Row className={`${styles.cardBodymain}`}>
          <Col xs="auto" className={`${styles.iconCol}`}>
            <div className={`${styles.cardbodyIcon}`}>{icon}</div>
          </Col>
          <Col className={`${styles.contentCol}`}>
            <span className={`${styles.cardBodyNumber}`}>{count ?? 0}</span>
            <span className={styles.cardBodySecondaryText}>{title}</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default dashBoardCard;
