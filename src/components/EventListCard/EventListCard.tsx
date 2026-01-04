/**
 * EventListCard component.
 *
 * This component represents a card that displays event details and allows users
 * to interact with it by opening a modal for more information. It uses translations
 * for localization and handles navigation based on the presence of an organization ID.
 *
 * @param props - The properties passed to the component.
 * @param title - The title of the event. Defaults to "Dogs Care" if not provided.
 * @param description - The description of the event.
 * @param date - The date of the event.
 * @param location - The location of the event.
 * @param refetchEvents - Optional callback function to refetch events.
 *
 * @returns A JSX element representing the event card and its associated modal.
 *
 * @remarks
 * - If the `orgId` parameter is missing from the URL, the user is redirected to the home page.
 * - Clicking on the card opens a modal with more details about the event.
 *
 * @example
 * ```tsx
 * <EventListCard
 *   title="Community Meetup"
 *   description="A meetup for the local community."
 *   date=dayjs().subtract(1, 'year').month(9).date(15).format('YYYY-MM-DD')
 *   location="Community Hall"
 *   refetchEvents={fetchEvents}
 * />
 * ```
 *
 */
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { Navigate, useParams } from 'react-router';
import EventListCardModals from './Modal/EventListCardModals';
import type { InterfaceEvent } from 'types/Event/interface';
/**
 * Props for the EventListCard component.
 */
interface IEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

function eventListCard(props: IEventListCard): JSX.Element {
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
            {props.name ? <>{props.name}</> : <>Dogs Care</>}
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
