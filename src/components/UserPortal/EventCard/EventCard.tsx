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
import useLocalStorage from 'utils/useLocalStorage';

const { getItem } = useLocalStorage();

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

function eventCard(props: InterfaceEventCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEventCard',
  });
  const userId = getItem('userId');
  const creatorName = `${props.creator.firstName} ${props.creator.lastName}`;
  const isInitiallyRegistered = props.registrants.some(
    (registrant) => registrant.id === userId
  );

  const [registerEventMutation, { loading }] = useMutation(REGISTER_EVENT);
  const [isRegistered, setIsRegistered] = React.useState(isInitiallyRegistered);

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
      } catch (error: any) {
        /* istanbul ignore next */
        toast.error(error);
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
        {`${t('location')} `}
        <b>{props.location}</b>
      </span>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('starts')} `}
        {props.startTime ? (
          <b>{dayjs(`2015-03-04T${props.startTime}`).format('h:mm:ss A')}</b>
        ) : (
          <></>
        )}
        <b> {dayjs(props.startDate).format("D MMMM 'YY")}</b>
      </div>
      <div className={`d-flex flex-row ${styles.eventDetails}`}>
        {`${t('ends')} `}
        {props.endTime ? (
          <b>{dayjs(`2015-03-04T${props.endTime}`).format('h:mm:ss A')}</b>
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
            {t('register')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default eventCard;
