import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import { MdChevronRight, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import styles from '../../style/app.module.css';
/**
 * Card component to display individual event attendance information
 * Shows event details including title, date, location and organization
 * @param orgId - Organization ID
 * @param eventId - Event ID
 * @param startdate - Event start date
 * @param title - Event title
 * @param location - Event location
 * @returns Card component with formatted event information
 */
export interface InterfaceCardItem {
  title: string;
  time?: string;
  startdate?: string;
  creator?: string;
  location?: string;
  eventId?: string;
  orgId?: string;
}

const EventAttendedCard = (props: InterfaceCardItem): JSX.Element => {
  const { title, startdate, location, orgId, eventId } = props;

  return (
    <Card
      className={`${styles['border-0']} ${styles['py-1']} ${styles['rounded-0']}`}
      data-testid="EventsAttendedCard"
    >
      <Card.Body className={styles['p-1']}>
        <Row className={`${styles.row} ${styles['align-items-center']}`}>
          <Col
            xs={3}
            md={2}
            className={`${styles['text-center']} ${styles.rowChild}`}
          >
            <div className={styles['text-secondary']}>
              {startdate && dayjs(startdate).isValid() ? (
                <>
                  <div className={`${styles['fs-6']} ${styles['fw-normal']}`}>
                    {dayjs(startdate).format('MMM').toUpperCase()}
                  </div>
                  <div className={`${styles['fs-1']} ${styles['fw-semibold']}`}>
                    {dayjs(startdate).format('D')}
                  </div>
                </>
              ) : (
                /*istanbul ignore next*/
                <div className={`${styles['fs-6']} ${styles['fw-normal']}`}>
                  Date N/A
                </div>
              )}
            </div>
          </Col>
          <Col xs={7} md={9} className={`${styles['mb-3']} ${styles.rowChild}`}>
            <h5 className={styles['mb-1']}>{title}</h5>
            <p
              className={`${styles['text-muted']} ${styles['mb-0']} ${styles['small']}`}
            >
              <MdLocationOn
                className={styles['text-action']}
                size={20}
                data-testid="LocationOnIcon"
              />
              {location}
            </p>
          </Col>
          <Col
            xs={2}
            md={1}
            className={`${styles['text-end']} ${styles.rowChild}`}
          >
            <Link to={`/event/${orgId}/${eventId}`} state={{ id: eventId }}>
              <MdChevronRight
                className={styles['text-action']}
                size={20}
                data-testid="ChevronRightIcon"
              />
            </Link>
          </Col>
        </Row>
      </Card.Body>
      <div className={`${styles['border-top']} ${styles['border-1']}`}></div>
    </Card>
  );
};

export default EventAttendedCard;
