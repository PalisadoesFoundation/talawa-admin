/**
 * Component to display the events attended by a user.
 *
 * This component renders a card that lists all the events attended by a user.
 * If the user has not attended any events, a message indicating no events
 * attended is displayed. Each event is rendered using the `EventsAttendedByMember` component.
 *
 * @component
 * @param {InterfaceUser} props - The props for the component.
 * @param {Object} props.userDetails - The details of the user.
 * @param {string} props.userDetails.name - The full name of the user.
 * @param {string} props.userDetails.emailAddress - The email address of the user.
 * @param {string} props.userDetails.natalSex - The natal sex of the user.
 * @param {string} props.userDetails.createdAt - The account creation date of the user.
 * @param {string} props.userDetails.birthDate - The birth date of the user.
 * @param {string} props.userDetails.educationGrade - The education grade of the user.
 * @param {string} props.userDetails.employmentStatus - The employment status of the user.
 * @param {string} props.userDetails.maritalStatus - The marital status of the user.
 * @param {string} props.userDetails.addressLine1 - The primary address of the user.
 * @param {string} props.userDetails.state - The state of the user.
 * @param {string} props.userDetails.countryCode - The country code of the user.
 * @param {string} props.userDetails.avatarURL - The profile image URL of the user.
 * @param {Array<{id: string}>} props.userDetails.eventsAttended - The list of events attended by the user.
 * @param {(key: string) => string} props.t - The translation function for localization.
 *
 * @returns {React.FC} A React functional component that displays the events attended by the user.
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './common.module.css';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';

interface InterfaceUser {
  userDetails: {
    name: string;
    emailAddress: string;
    natalSex: string;
    createdAt?: string;
    birthDate: string | null;
    educationGrade: string;
    employmentStatus: string;
    maritalStatus: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    avatarURL: string;
    city: string;
    description: string;
    homePhoneNumber: string;
    mobilePhoneNumber: string;
    workPhoneNumber: string;
    naturalLanguageCode: string;
    postalCode: string;
    eventsAttended?: { id: string }[];
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
          userDetails.eventsAttended.map((event: { id: string }) => (
            <span data-testid="usereventsCard" key={event.id}>
              <EventsAttendedByMember eventsId={event.id} />
            </span>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default EventsAttendedByUser;
