/**
 * EventStatsWrapper Component
 *
 * This component serves as a wrapper for displaying event statistics. It includes a button
 * that toggles the visibility of the EventStats component, which provides detailed statistics
 * for a specific event.
 *
 * @param props - Component props containing _id, the unique identifier of the event.
 * @returns A JSX element containing a button to view event statistics and the EventStats component.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventStats } from './Statistics/EventStats';
import Button from 'shared-components/Button/Button';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from './EventStatsWrapper.module.css';
import type { InterfaceEventStatsWrapperProps } from 'types/AdminPortal/EventStatsWrapper/interface';

export const EventStatsWrapper = ({
  _id,
}: InterfaceEventStatsWrapperProps): JSX.Element => {
  // State to control the visibility of the EventStats component
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation('common');

  return (
    <>
      {/* Button to open the event statistics view */}
      <Button
        variant="light"
        className="text-secondary"
        aria-label={t('viewEventStatistics')}
        onClick={(): void => {
          setShowModal(true); // Show the EventStats component when button is clicked
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Event Stats" fill="var(--bs-secondary)" />
        </div>
        {t('viewEventStatistics')}
      </Button>

      {/* Render the EventStats component if showModal is true */}
      <EventStats
        show={showModal}
        handleClose={(): void => setShowModal(false)} // Hide the EventStats component when closed
        key={_id || 'eventStatsDetails'} // Use _id as key for the component
        eventId={_id}
      />
    </>
  );
};
