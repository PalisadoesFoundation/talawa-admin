import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from './EventDashboard.module.css';
import { useTranslation } from 'react-i18next';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import { Edit } from '@mui/icons-material';
import EventListCardModals from 'components/EventListCard/EventListCardModals';
import type { InterfaceEventListCardProps } from 'components/EventListCard/EventListCard';
import { formatDate } from 'utils/dateFormatter';

const EventDashboard = (props: { eventId: string }): JSX.Element => {
  const { eventId } = props;
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventManagement',
  });
  const { t: tList } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });

  const { t: tCommon } = useTranslation('common');
  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { id: eventId },
    },
  );

  if (eventInfoLoading) {
    return <Loader />;
  }

  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    return `${hours}:${minutes}`;
  }

  const showViewModal = (): void => {
    setEventModalIsOpen(true);
  };

  const hideViewModal = (): void => {
    setEventModalIsOpen(false);
  };

  const eventListCardProps: InterfaceEventListCardProps = {
    userRole: '',
    key: eventData.event._id,
    id: eventData.event._id,
    eventLocation: eventData.event.location,
    eventName: eventData.event.title,
    eventDescription: eventData.event.description,
    startDate: eventData.event.startDate,
    endDate: eventData.event.endDate,
    startTime: eventData.event.startTime,
    endTime: eventData.event.endTime,
    allDay: eventData.event.allDay,
    recurring: eventData.event.recurring,
    recurrenceRule: eventData.event.recurrenceRule,
    isRecurringEventException: eventData.event.isRecurringEventException,
    isPublic: eventData.event.isPublic,
    isRegisterable: eventData.event.isRegisterable,
    registrants: eventData.event.attendees,
    creator: eventData.event.creator,
  };
  console.log(eventData);

  return (
    <div className="">
      <Row className="">
        <EventListCardModals
          eventListCardProps={eventListCardProps}
          eventModalIsOpen={eventModalIsOpen}
          hideViewModal={hideViewModal}
          t={tList}
          tCommon={tCommon}
        />
        {/* <div className='border-1 border-top'></div> */}
        <div className="d-flex px-6 ">
          <div className={`${styles.ctacards}`}>
            <img src="/images/svg/attendees.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b>{eventData.event.attendees.length}</b>
              </h1>
              <span>No of Registrations</span>
            </div>
          </div>
          <div className={`${styles.ctacards}`}>
            <img src="/images/svg/attendees.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b>{eventData.event.attendees.length}</b>
              </h1>
              <span>No of Attendees</span>
            </div>
          </div>
          <div className={`${styles.ctacards}`}>
            <img src="/images/svg/feedback.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b>4/5</b>
              </h1>
              <span>Average Feedback</span>
            </div>
          </div>
        </div>
        <Col>
          <div className={styles.eventContainer}>
            <div className={styles.eventDetailsBox}>
              <button
                className="btn btn-light rounded-circle position-absolute end-0 me-3 p-1 mt-2"
                onClick={showViewModal}
              >
                <Edit fontSize="medium" />
              </button>
              <h3 className={styles.titlename}></h3>

              <p className={styles.description}>
                {eventData.event.description}
              </p>
              <p className={styles.toporgloc}>
                <b>Location:</b> <span>{eventData.event.location}</span>
              </p>
              <p className={styles.toporgloc}>
                <b>Registrants:</b>{' '}
                <span>{eventData.event.attendees.length}</span>
              </p>
              <p className={`${styles.toporgloc} d-flex`}>
                <b>Recurring Event:</b>{' '}
                <span>
                  {eventData.event.recurring ? (
                    <p className="text-success ml-2"> Active</p>
                  ) : (
                    <p className="text-success ml-2"> Inactive</p>
                  )}
                </span>
              </p>
            </div>
            <div></div>
            <div className={styles.time}>
              <p>
                <b className={styles.startTime}>
                  {eventData.event.startTime !== null
                    ? `${formatTime(eventData.event.startTime)}`
                    : ``}
                </b>{' '}
                <span className={styles.startDate}>
                  {formatDate(eventData.event.startDate)}{' '}
                </span>
              </p>
              <p className={styles.to}>{t('to')}</p>
              <p>
                <b className={styles.endTime}>
                  {' '}
                  {eventData.event.endTime !== null
                    ? `${formatTime(eventData.event.endTime)}`
                    : ``}
                </b>{' '}
                <span className={styles.endDate}>
                  {formatDate(eventData.event.endDate)}{' '}
                </span>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EventDashboard;
