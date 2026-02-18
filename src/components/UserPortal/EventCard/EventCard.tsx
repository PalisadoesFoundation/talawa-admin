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
import type { InterfaceEventCardProps } from 'types/UserPortal/EventCard/interface';
import { DUMMY_DATE_TIME_PREFIX, IDENTIFIER_USER_ID } from 'Constant/common';
import UserPortalCard from '../UserPortalCard/UserPortalCard';

/**
 * EventCard Component
 *
 * This component renders a card displaying details of an event, including its name, description,
 * location, start and end times, and the creator's name. It also provides functionality for users
 * to register for the event.
 *
 * @param id - Event identifier.
 * @param name - Event name.
 * @param description - Event description.
 * @param location - Event location.
 * @param startAt - Event start date (ISO string).
 * @param endAt - Event end date (ISO string).
 * @param startTime - Event start time (HH:mm:ss).
 * @param endTime - Event end time (HH:mm:ss).
 * @param creator - Event creator info.
 * @param attendees - Current attendee list.
 * @param isInviteOnly - Whether the event is invite-only.
 *
 * @remarks
 * - The component uses the `useTranslation` hook for internationalization.
 * - It retrieves the user ID from local storage to determine if the user is already registered for the event.
 * - The `useMutation` hook from Apollo Client is used to handle event registration.
 * - The `NotificationToast` utility is used to display success or error messages.
 *
 * Component
 *
 * @example
 * ```tsx
 * <EventCard
 *   id="event123"
 *   name="Community Meetup"
 *   description="A meetup for community members."
 *   location="Community Hall"
 *   startAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
 *   endAt={dayjs.utc().subtract(1, 'year').month(9).date(1).format('YYYY-MM-DD')}
 *   startTime="10:00:00"
 *   endTime="12:00:00"
 *   creator={{ name: "John Doe" }}
 *   attendees={[{ id: "user456" }]}
 *   isInviteOnly={false}
 * />
 * ```
 *
 * @returns JSX.Element - A styled card displaying event details and a registration button.
 *
 * Dependencies
 * - `@mui/icons-material` for icons.
 * - `dayjs` for date and time formatting.
 * - `shared-components/Button` for button UI.
 * - `@apollo/client` for GraphQL mutations.
 * - `NotificationToast` for notifications.
 * - `utils/useLocalstorage` for local storage handling.
 */
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
}: InterfaceEventCardProps): JSX.Element {
  // Extract the translation functions
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEventCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Get user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem(IDENTIFIER_USER_ID);

  // Create a full name for the event creator
  const creatorName = creator.name ?? t('unknownCreator');

  // Check if the user is initially registered for the event
  const isRegisteredFromProps = React.useMemo(
    () => attendees.some((attendee) => attendee.id === userId),
    [attendees, userId],
  );

  // Set up the mutation for registering for the event
  const [registerEventMutation, { loading }] = useMutation(REGISTER_EVENT);
  const [isRegisteredLocal, setIsRegisteredLocal] = React.useState(false);
  const isRegistered = isRegisteredLocal || isRegisteredFromProps;

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
          setIsRegisteredLocal(true);
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
    <UserPortalCard
      imageSlot={<CalendarMonthIcon className={styles.calendarIcon} />}
      actionsSlot={
        loading ? (
          <HourglassBottomIcon
            className={styles.loadingIcon}
            data-testid="loadingIcon"
          />
        ) : isRegistered ? (
          <Button
            size="sm"
            disabled
            aria-label={t('alreadyRegisteredAriaLabel')}
          >
            {t('alreadyRegistered')}
          </Button>
        ) : isInviteOnly ? (
          <Button size="sm" disabled aria-label={t('inviteOnlyEventAriaLabel')}>
            {tCommon('inviteOnlyEvent')}
          </Button>
        ) : (
          <Button size="sm" onClick={handleRegister}>
            {tCommon('register')}
          </Button>
        )
      }
      variant="standard"
      ariaLabel={t('eventCardAriaLabel', { name })}
      dataTestId="event-card"
      className={styles.mainContainer}
    >
      <div className={styles.orgName}>
        <b>{name}</b>
      </div>
      {description}
      <span>
        {`${tCommon('location')} `}
        <b>{location}</b>
      </span>
      <div className={styles.eventDetails}>
        {`${t('starts')} `}
        {startTime ? (
          <b data-testid="startTime">
            {dayjs(`${DUMMY_DATE_TIME_PREFIX}${startTime}`).format('h:mm:ss A')}
          </b>
        ) : null}
        <b> {dayjs(startAt).format('D MMMM YYYY')}</b>
      </div>
      <div className={styles.eventDetails}>
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
    </UserPortalCard>
  );
}

export default EventCard;
