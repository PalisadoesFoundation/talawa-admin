/**
 * EventCard Component
 *
 * This component renders a card displaying details of an event, including its name, description,
 * location, start and end times, and the creator's name. It also provides functionality for users
 * to register for the event.
 *
 * @param props - The event details passed as props, adhering to the `InterfaceEvent` type.
 *
 * @remarks
 * - The component uses the `useTranslation` hook for internationalization.
 * - It retrieves the user ID from local storage to determine if the user is already registered for the event.
 * - The `useMutation` hook from Apollo Client is used to handle event registration.
 * - The `react-toastify` library is used to display success or error messages.
 *
 * Component
 *
 * @example
 * ```tsx
 * <EventCard
 *   _id="event123"
 *   name="Community Meetup"
 *   description="A meetup for community members."
 *   location="Community Hall"
 *   startAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
 *   endAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
 *   startTime="10:00:00"
 *   endTime="12:00:00"
 *   creator={{ firstName: "John", lastName: "Doe" }}
 *   attendees={[{ _id: "user456" }]}
 * />
 * ```
 *
 * @returns JSX.Element - A styled card displaying event details and a registration button.
 *
 * Dependencies
 * - `@mui/icons-material` for icons.
 * - `dayjs` for date and time formatting.
 * - `react-bootstrap` for UI components.
 * - `@apollo/client` for GraphQL mutations.
 * - `react-toastify` for notifications.
 * - `utils/useLocalstorage` for local storage handling.
 */
import React from 'react';
import styles from './EventCard.module.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import Button from 'shared-components/Button';
import { useMutation } from '@apollo/client';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { REGISTER_EVENT } from 'GraphQl/Mutations/EventMutations';
import { useTranslation } from 'react-i18next';

import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { InterfaceEvent } from 'types/Event/interface';
import { DUMMY_DATE_TIME_PREFIX, IDENTIFIER_USER_ID } from 'Constant/common';

function EventCard({
  id,
  name,
  description,
  location,
  startAt,
  endAt,
  startTime,
  endTime,
  creator,
  attendees,
  isInviteOnly,
}: InterfaceEvent): JSX.Element {
  // Extract the translation functions
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEventCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Get user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem(IDENTIFIER_USER_ID);

  // Create a full name for the event creator
  const creatorName = creator.name;

  // Check if the user is initially registered for the event
  const isInitiallyRegistered = attendees.some(
    (attendee) => attendee.id === userId,
  );

  // Set up the mutation for registering for the event
  const [registerEventMutation, { loading }] = useMutation(REGISTER_EVENT);
  const [isRegistered, setIsRegistered] = React.useState(isInitiallyRegistered);

  /**
   * Handles registering for the event.
   * If the user is not already registered, sends a mutation request to register.
   * Displays a success or error message based on the result.
   */
  const handleRegister = async (): Promise<void> => {
    if (!isRegistered) {
      try {
        const { data } = await registerEventMutation({
          variables: {
            id,
          },
        });
        if (data) {
          setIsRegistered(true);
          NotificationToast.success(
            t('registeredSuccessfully', { eventName: name }),
          );
        }
      } catch (error) {
        NotificationToast.error(t('failedToRegister'));
        console.error('Failed to register for event:', error);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className={styles.orgName}>
          <b>{name}</b>
        </div>
        <div>
          <CalendarMonthIcon />
        </div>
      </div>
      {description}
      <span>
        {`${tCommon('location')} `}
        <b>{location}</b>
      </span>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('starts')} `}
        {startTime ? (
          <b data-testid="startTime">
            {dayjs(`${DUMMY_DATE_TIME_PREFIX}${startTime}`).format('h:mm:ss A')}
          </b>
        ) : null}
        <b> {dayjs(startAt).format('D MMMM YYYY')}</b>
      </div>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('ends')} `}
        {endTime ? (
          <b data-testid="endTime">
            {dayjs(`${DUMMY_DATE_TIME_PREFIX}${endTime}`).format('h:mm:ss A')}
          </b>
        ) : null}
        <b> {dayjs(endAt).format('D MMMM YYYY')}</b>
      </div>
      <span>
        {`${t('creator')} `}
        <b>{creatorName}</b>
      </span>

      <div className={`d-flex flex-row ${styles.eventActions}`}>
        {loading ? (
          <HourglassBottomIcon fontSize="small" data-testid="loadingIcon" />
        ) : isRegistered ? (
          <Button size="sm" disabled>
            {t('alreadyRegistered')}
          </Button>
        ) : isInviteOnly ? (
          <Button size="sm" disabled>
            {tCommon('inviteOnlyEvent')}
          </Button>
        ) : (
          <Button size="sm" onClick={handleRegister}>
            {tCommon('register')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
