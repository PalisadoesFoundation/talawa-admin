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
 * @component
 *
 * @example
 * ```tsx
 * <EventCard
 *   _id="event123"
 *   name="Community Meetup"
 *   description="A meetup for community members."
 *   location="Community Hall"
 *   startDate="2023-10-01"
 *   endDate="2023-10-01"
 *   startTime="10:00:00"
 *   endTime="12:00:00"
 *   creator={{ firstName: "John", lastName: "Doe" }}
 *   attendees={[{ _id: "user456" }]}
 * />
 * ```
 *
 * @returns JSX.Element - A styled card displaying event details and a registration button.
 *
 * @dependencies
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
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { REGISTER_EVENT } from 'GraphQl/Mutations/EventMutations';
import { useTranslation } from 'react-i18next';

import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceEvent } from 'types/Event/interface';

function eventCard(props: InterfaceEvent): JSX.Element {
  // Extract the translation functions
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEventCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Get user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Create a full name for the event creator
  const creatorName = props.creator.name;

  // Check if the user is initially registered for the event
  const isInitiallyRegistered = props.attendees.some(
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
            id: props.id,
          },
        });
        if (data) {
          setIsRegistered(true);
          toast.success(`Successfully registered for ${props.name}`);
        }
      } catch (error) {
        toast.error(`Failed to register for the event`);
        toast.error(error as string);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className={styles.orgName}>
          <b>{props.name}</b>
        </div>
        <div>
          <CalendarMonthIcon />
        </div>
      </div>
      {props.description}
      <span>
        {`${tCommon('location')} `}
        <b>{props.location}</b>
      </span>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('starts')} `}
        {props.startTime ? (
          <b data-testid="startTime">
            {dayjs(`2015-03-04T${props.startTime}`).format('h:mm:ss A')}
          </b>
        ) : (
          <></>
        )}
        <b> {dayjs(props.startAt).format('D MMMM YYYY')}</b>
      </div>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('ends')} `}
        {props.endTime ? (
          <b data-testid="endTime">
            {dayjs(`2015-03-04T${props.endTime}`).format('h:mm:ss A')}
          </b>
        ) : (
          <></>
        )}{' '}
        <b> {dayjs(props.endAt).format('D MMMM YYYY')}</b>
      </div>
      <span>
        {`${t('creator')} `}
        <b>{creatorName}</b>
      </span>

      <div className={`d-flex flex-row ${styles.eventActions}`}>
        {loading ? (
          <HourglassBottomIcon fontSize="small" />
        ) : isRegistered ? (
          <Button size="sm" disabled>
            {t('alreadyRegistered')}
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

export default eventCard;
