import React from 'react';
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from '../../style/app.module.css';

/** Dashboard card component is used to display the card with icon, title and count.
 * @param  icon - Icon for the card
 * @param  title - Title for the card
 * @param  count - Count for the card
 * @returns  Dashboard card component
 *
 */
const dashBoardCard = (props: {
  icon: React.ReactNode;
  title: string;
  count?: number;
}): JSX.Element => {
  const { icon, count, title } = props;
  return (
    <Card className="rounded-4" border="0">
      <Card.Body className={styles.cardBody}>
        <Row className="align-items-center">
          <Col sm={4}>
            <div className={styles.iconWrapper}>
              <div className={styles.themeOverlay} />
              {icon}
            </div>
          </Col>
          <Col sm={8} className={styles.textWrapper}>
            <span className={styles.primaryText}>{count ?? 0}</span>
            <span className={styles.secondaryText}>{title}</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default dashBoardCard;
