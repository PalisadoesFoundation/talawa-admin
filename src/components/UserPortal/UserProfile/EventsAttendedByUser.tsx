import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './common.module.css';
import EventsAttendedByMember from 'components/MemberDetail/EventsAttendedByMember';
/**
 * Component to display events attended by a user in card format
 * @param userDetails - User information including attended events
 * @param t - Translation function
 * @returns Card component containing list of attended events
 */
interface InterfaceUser {
  userDetails: {
    firstName: string;
    lastName: string;
    createdAt: string;
    gender: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    grade: string;
    empStatus: string;
    maritalStatus: string;
    address: string;
    state: string;
    country: string;
    image: string;
    eventsAttended: { _id: string }[];
  };
  t: (key: string) => string;
}
export const EventsAttendedByUser: React.FC<InterfaceUser> = ({
  userDetails,
  t,
}) => {
  return (
    <Card border="0" className="rounded-4 mb-4">
      <div className={`${styles.cardHeader}`}>
        <div className={`${styles.cardTitle}`}>{t('eventAttended')}</div>
      </div>
      <Card.Body className={`${styles.cardBody} ${styles.scrollableCardBody}`}>
        {!userDetails.eventsAttended?.length ? (
          <div className={styles.emptyContainer}>
            <h6>{t('noeventsAttended')}</h6>
          </div>
        ) : (
          userDetails.eventsAttended.map((event: { _id: string }) => (
            <span data-testid="usereventsCard" key={event._id}>
              <EventsAttendedByMember eventsId={event._id} />
            </span>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default EventsAttendedByUser;
