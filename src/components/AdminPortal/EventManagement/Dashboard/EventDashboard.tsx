/**
 * EventDashboard Component
 *
 * This component is responsible for rendering the event dashboard, which includes
 * event details, statistics, and modals for editing event information. It fetches
 * event data using the `EVENT_DETAILS` GraphQL query and displays it in a structured
 * layout using Bootstrap and custom styles.
 *
 * @param  props - Component properties.
 * @param eventId - The unique identifier of the event to be displayed.
 *
 * @returns  The rendered EventDashboard component.
 *
 * @remarks
 * - The component uses the `useQuery` hook from Apollo Client to fetch event data.
 * - It displays a loader while the event data is being fetched.
 * - The `EventListCardModals` component is used to handle modals for event editing.
 * - The `formatTime` and `formatDate` utility functions are used to format time and date values.
 *
 * @example
 * ```tsx
 * <EventDashboard eventId="12345" />
 * ```
 *
 */
// translation-check-keyPrefix: eventListCard
import React, { useState } from 'react';
import type { JSX } from 'react';
import { Col, Row } from 'react-bootstrap';
import styles from './EventDashboard.module.css';
import { useTranslation } from 'react-i18next';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Edit } from '@mui/icons-material';
import EventListCardModals from 'components/EventListCard/Modal/EventListCardModals';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import { formatDate } from 'utils/dateFormatter';
import useLocalStorage from 'utils/useLocalstorage';

const EventDashboard = (props: { eventId: string }): JSX.Element => {
  const { eventId } = props;
  const { t } = useTranslation(['translation', 'common']);
  const { t: tEventList } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });

  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);

  // Get user information from local storage, similar to OrganizationEvents
  const { getItem } = useLocalStorage();
  const userId = getItem('userId') || getItem('id');
  const storedRole = getItem('role') as string | null;

  // Determine user role based on stored role, similar to OrganizationEvents
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { eventId },
    },
  );

  const showViewModal = (): void => {
    setEventModalIsOpen(true);
  };

  const hideViewModal = (): void => {
    setEventModalIsOpen(false);
  };

  if (eventInfoLoading) {
    return (
      <LoadingState isLoading={eventInfoLoading} variant="spinner">
        <div />
      </LoadingState>
    );
  }

  if (!eventData || !eventData.event) {
    return <div data-testid="no-event">{tEventList('noEvent')}</div>;
  }

  const formatTimeFromDateTime = (dateTime: string): string => {
    if (!dateTime) return '08:00';

    const date = new Date(dateTime);

    // Check if date is valid - Invalid Date objects have NaN time value
    if (isNaN(date.getTime())) {
      return '08:00';
    }

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const eventListCardProps: InterfaceEvent = {
    userRole: userRole,
    key: eventData.event.id,
    id: eventData.event.id,
    location: eventData.event.location || '',
    name: eventData.event.name,
    description: eventData.event.description || '',
    startAt: eventData.event.startAt,
    endAt: eventData.event.endAt,
    // Fix: Extract actual time values instead of null
    startTime: eventData.event.allDay
      ? '00:00'
      : formatTimeFromDateTime(eventData.event.startAt),
    endTime: eventData.event.allDay
      ? '23:59'
      : formatTimeFromDateTime(eventData.event.endAt),
    allDay: eventData.event.allDay,
    isPublic: eventData.event.isPublic,
    isRegisterable: eventData.event.isRegisterable,
    isInviteOnly: eventData.event.isInviteOnly ?? false,
    attendees: [],
    creator: eventData.event.creator,
    userId: userId as string,
  };

  return (
    <div data-testid="event-dashboard">
      <Row className="">
        <EventListCardModals
          eventListCardProps={eventListCardProps}
          eventModalIsOpen={eventModalIsOpen}
          hideViewModal={hideViewModal}
          t={tEventList}
          tCommon={t}
        />
        <div className="d-flex px-6" data-testid="event-stats">
          {/* Attendees data not available in new query; adjust or remove */}
          <div
            className={`${styles.ctacards}`}
            data-testid="registrations-card"
          >
            <img src="/images/svg/attendees.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b data-testid="registrations-count">N/A</b>
              </h1>
              <span>{tEventList('noRegistrations')}</span>
            </div>
          </div>
          <div className={`${styles.ctacards}`} data-testid="attendees-card">
            <img src="/images/svg/attendees.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b data-testid="attendees-count">N/A</b>
              </h1>
              <span>{tEventList('noOfAttendees')}</span>
            </div>
          </div>
          <div className={`${styles.ctacards}`} data-testid="feedback-card">
            <img src="/images/svg/feedback.svg" alt="userImage" className="" />
            <div>
              <h1>
                <b data-testid="feedback-rating">N/A</b>
              </h1>
              <span>{tEventList('averageFeedback')}</span>
            </div>
          </div>
        </div>
        <Col>
          <div className={styles.eventContainer} data-testid="event-details">
            <div className={styles.eventDetailsBox}>
              <button
                className="btn btn-light rounded-circle position-absolute end-0 me-3 p-1 mt-2"
                onClick={showViewModal}
                data-testid="edit-event-button"
              >
                <Edit fontSize="medium" />
              </button>
              <h3 className={styles.titlename} data-testid="event-name">
                {eventData.event.name}
              </h3>
              <p className={styles.description} data-testid="event-description">
                {eventData.event.description}
              </p>
              <p className={styles.toporgloc} data-testid="event-location">
                <b>{tEventList('location')}:</b>
                <span>{eventData.event.location || 'N/A'}</span>
              </p>
              {/* Attendees not available; remove or adjust */}
              <p className={styles.toporgloc} data-testid="event-registrants">
                <b>{tEventList('registrants')}:</b> <span>N/A</span>
              </p>
            </div>
            <div className={styles.time} data-testid="event-time">
              <p>
                <b className={styles.startTime} data-testid="start-time">
                  {!eventData.event.allDay && eventData.event.startAt
                    ? formatTimeFromDateTime(eventData.event.startAt)
                    : ''}
                </b>{' '}
                <span className={styles.startDate} data-testid="start-date">
                  {eventData.event.startAt
                    ? formatDate(eventData.event.startAt)
                    : ''}{' '}
                </span>
              </p>
              <p className={styles.to}>{t('to')}</p>
              <p>
                <b className={styles.endTime} data-testid="end-time">
                  {!eventData.event.allDay && eventData.event.endAt
                    ? formatTimeFromDateTime(eventData.event.endAt)
                    : ''}
                </b>{' '}
                <span className={styles.endDate} data-testid="end-date">
                  {eventData.event.endAt
                    ? formatDate(eventData.event.endAt)
                    : ''}{' '}
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
