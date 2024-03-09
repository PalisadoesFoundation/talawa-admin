import React from 'react';
import styles from './EventCard.module.css';
import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import { REGISTER_EVENT } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';

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
  const userId = localStorage.getItem('userId');
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
      <p className={styles.titlemodal}>{t('eventDetails')}</p>
      <div className={styles.divStyle}>
        {t('eventTitle')}:
        <input
          className={styles.instyle}
          value={
            props.title && props.title.length > 100
              ? props.title.substring(0, 100) + '...'
              : props.title
          }
        />
      </div>
      <div className={styles.divStyle}>
        {t('eventDescription')}:{' '}
        <textarea
          rows={1}
          className={styles.instyle}
          value={props.description}
        />
      </div>
      <div className={styles.divStyle}>
        {t('location')}
        <input className={styles.instyle} value={props.location} />
      </div>
      <div className={styles.divStyle}>
        {t('creator')}
        <input className={styles.instyle} value={creatorName} />
      </div>
      <div className={styles.divStyle2}>
        <div className={styles.divStyle}>
          {t('on')}
          <input className={styles.instyle} value={props.startDate} />
        </div>
        <div className={styles.divStyle}>
          {t('end')}: <input className={styles.instyle} value={props.endDate} />
        </div>
      </div>
      <div className={`d-flex flex-row ${styles.eventActions}`}>
        {loading ? (
          <HourglassBottomIcon fontSize="small" />
        ) : isRegistered ? (
          <Button
            style={{ width: '90%', height: '2.75rem', margin: '0.5rem' }}
            size="sm"
            disabled
          >
            {t('alreadyRegistered')}
          </Button>
        ) : (
          <Button
            style={{ width: '90%', height: '2.75rem', margin: '0.5rem' }}
            size="sm"
            onClick={handleRegister}
          >
            {t('register')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default eventCard;
