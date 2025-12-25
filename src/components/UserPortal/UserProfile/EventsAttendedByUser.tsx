/**
 * Component to display the events attended by a user.
 *
 * This component renders a card that lists all the events attended by a user.
 * If the user has not attended any events, a message indicating no events
 * attended is displayed. Each event is rendered using the `EventsAttendedByMember` component.
 *
 * @component
 * @param {InterfaceEventsAttendedByUserProps} props - The props for the component.
 * @param {Object} props.userDetails - The details of the user.
 * @param {string} props.userDetails.firstName - The first name of the user.
 * @param {string} props.userDetails.lastName - The last name of the user.
 * @param {string} props.userDetails.createdAt - The account creation date of the user.
 * @param {string} props.userDetails.gender - The gender of the user.
 * @param {string} props.userDetails.email - The email address of the user.
 * @param {string} props.userDetails.phoneNumber - The phone number of the user.
 * @param {string} props.userDetails.birthDate - The birth date of the user.
 * @param {string} props.userDetails.grade - The grade of the user.
 * @param {string} props.userDetails.empStatus - The employment status of the user.
 * @param {string} props.userDetails.maritalStatus - The marital status of the user.
 * @param {string} props.userDetails.address - The address of the user.
 * @param {string} props.userDetails.state - The state of the user.
 * @param {string} props.userDetails.country - The country of the user.
 * @param {string} props.userDetails.image - The profile image of the user.
 * @param {Array<{_id: string}>} props.userDetails.eventsAttended - The list of events attended by the user.
 * @param {(key: string) => string} props.t - The translation function for localization.
 *
 * @returns {React.FC} A React functional component that displays the events attended by the user.
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './common.module.css';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import type { InterfaceEventsAttendedByUserProps } from 'types/UserPortal/UserProfile';
export const EventsAttendedByUser: React.FC<InterfaceEventsAttendedByUserProps> = ({
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
