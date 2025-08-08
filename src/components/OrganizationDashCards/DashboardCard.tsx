/**
 * A functional React component that renders a dashboard card with an icon, title, and optional count.
 * This component is styled using Bootstrap and custom CSS modules.
 *
 * @param props - The properties object for the component.
 * @param props.icon - A React node representing the icon to be displayed on the card.
 * @param props.title - A string representing the title text to be displayed on the card.
 * @param props.count - An optional number representing the count to be displayed on the card. Defaults to 0 if not provided.
 *
 * @returns A JSX.Element representing the dashboard card.
 *
 * @remarks
 * - The component uses Bootstrap's `Card`, `Row`, and `Col` components for layout.
 * - Custom styles are applied using the `app-fixed.module.css` CSS module.
 *
 * @example
 * ```tsx
 * import DashboardCard from './DashboardCard';
 * import { FaUsers } from 'react-icons/fa';
 *
 * <DashboardCard
 *   icon={<FaUsers />}
 *   title="Users"
 *   count={42}
 * />
 * ```
 *
 * @file This file defines the `DashboardCard` component used in the Talawa Admin project.
 */
import React from 'react';
import { Card, Row } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import styles from 'style/app-fixed.module.css';

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
