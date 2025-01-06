import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app.module.css';
import { Navigate, useParams } from 'react-router-dom';
import EventListCardModals from './EventListCardModals';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

/**
 * Props for the EventListCard component.
 */
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

/**
 * Component that displays an event card with a modal for event details.
 *
 * @param props - The props for the EventListCard component.
 * @returns  The rendered EventListCard component.
 */
function eventListCard(props: InterfaceEventListCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });
  const { t: tCommon } = useTranslation('common');

  const [eventModalIsOpen, setEventModalIsOpen] = useState(false);

  const { orgId } = useParams();

  // Redirect to home if orgId is not present
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  /**
   * Opens the event modal.
   */
  const showViewModal = (): void => {
    setEventModalIsOpen(true);
  };

  /**
   * Closes the event modal.
   */
  const hideViewModal = (): void => {
    setEventModalIsOpen(false);
  };

  return (
    <>
      <div
        className={styles.cardsEventListCard}
        onClick={showViewModal}
        data-testid="card"
      >
        <div className={styles.dispflexEventListCard}>
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
        tCommon={tCommon}
      />
    </>
  );
}

export default eventListCard;
