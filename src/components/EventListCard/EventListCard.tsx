/**
 * EventListCard component.
 *
 * This component represents a card that displays event details and allows users
 * to interact with it by opening a modal for more information. It uses translations
 * for localization and handles navigation based on the presence of an organization ID.
 *
 * @param props - EventListCard props (see IEventListCard). If `props.name` is missing, the header falls back to the localized `t('dogsCare')` label.
 *
 * @returns A JSX element representing the event card and its associated modal.
 *
 * @remarks
 * - If the `orgId` parameter is missing from the URL, the user is redirected to the home page.
 * - Clicking on the card opens a modal with more details about the event.
 *
 * @example
 * ```tsx
 *  <EventListCard
 *   name="Community Meetup"
 *   description="A meetup for the local community."
 *   startAt={dayjs().subtract(1, 'year').month(9).date(15).toISOString()}
 *   endAt={dayjs().subtract(1, 'year').month(9).date(15).add(2, 'hours').toISOString()}
 *   location="Community Hall"
 *   refetchEvents={fetchEvents}
 * />
 * ```
 *
 */
import React, { useState, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventListCard.module.css';
import { Navigate, useParams } from 'react-router';
import EventListCardModals from './Modal/EventListCardModals';
import type { IEventListCard } from 'types/Event/interface';
/**
 * Props for the EventListCard component.
 */

function EventListCard(props: IEventListCard): JSX.Element {
  const { name } = props;
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
            {name ? <>{name}</> : <>{t('dogsCare')}</>}
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

export default EventListCard;
