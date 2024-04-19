import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventListCard.module.css';
import { Navigate, useParams } from 'react-router-dom';
import EventListCardModals from './EventListCardModals';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

export interface InterfaceEventListCardProps {
  refetchEvents?: () => void;
  userRole?: string;
  key: string;
  id: string;
  eventLocation: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  recurring: boolean;
  recurrenceRule: InterfaceRecurrenceRule | null;
  isRecurringEventException: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  registrants?: {
    _id: string;
  }[];
  creator?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
}

function eventListCard(props: InterfaceEventListCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });

  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);

  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const showViewModal = (): void => {
    setEventModalIsOpen(true);
  };

  const hideViewModal = (): void => {
    setEventModalIsOpen(false);
  };

  return (
    <>
      <div
        className={styles.cards}
        style={{
          backgroundColor: '#d9d9d9',
        }}
        onClick={showViewModal}
        data-testid="card"
      >
        <div className={styles.dispflex}>
          <h2 className={styles.eventtitle}>
            {props.eventName ? <>{props.eventName}</> : <>Dogs Care</>}
          </h2>
        </div>
      </div>

      <EventListCardModals
        eventListCardProps={props}
        eventModalIsOpen={eventModalIsOpen}
        hideViewModal={hideViewModal}
        t={t}
      />
    </>
  );
}
export {};
export default eventListCard;
