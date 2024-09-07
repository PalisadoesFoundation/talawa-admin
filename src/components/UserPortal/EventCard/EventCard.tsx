import React from 'react';
import styles from './EventCard.module.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { REGISTER_EVENT } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';

import useLocalStorage from 'utils/useLocalstorage';

interface InterfaceEventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isRegisterable: boolean;
  isPublic: boolean;
  endTime: string;
  startTime: string;
  recurring: boolean;
  allDay: boolean;
  creator: {
    firstName: string;
    lastName: string;
    id: string;
  };
  registrants: {
    id: string;
  }[];
}

/**
 * Displays information about an event and provides an option to register for it.
 *
 * Shows the event's title, description, location, start and end dates and times,
 * creator's name, and registration status. Includes a button to register for the event
 * if the user is not already registered.
 *
 * @param props - The properties for the event card.
 * @param id - The unique identifier of the event.
 * @param title - The title of the event.
 * @param description - A description of the event.
 * @param location - The location where the event will take place.
 * @param startDate - The start date of the event in ISO format.
 * @param endDate - The end date of the event in ISO format.
 * @param isRegisterable - Indicates if the event can be registered for.
 * @param isPublic - Indicates if the event is public.
 * @param endTime - The end time of the event in HH:mm:ss format.
 * @param startTime - The start time of the event in HH:mm:ss format.
 * @param recurring - Indicates if the event is recurring.
 * @param allDay - Indicates if the event lasts all day.
 * @param creator - The creator of the event with their name and ID.
 * @param registrants - A list of registrants with their IDs.
 *
 * @returns The event card component.
 */
function eventCard(props: InterfaceEventCardProps): JSX.Element {
  // Extract the translation functions
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEventCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Get user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Create a full name for the event creator
  const creatorName = `${props.creator.firstName} ${props.creator.lastName}`;

  // Check if the user is initially registered for the event
  const isInitiallyRegistered = props.registrants.some(
    (registrant) => registrant.id === userId,
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
            eventId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setIsRegistered(true);
          toast.success(`Successfully registered for ${props.title}`);
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        toast.error(error as string);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className={styles.orgName}>
          <b>{props.title}</b>
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
        <b> {dayjs(props.startDate).format("D MMMM 'YY")}</b>
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
        <b> {dayjs(props.endDate).format("D MMMM 'YY")}</b>
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
