/**
 * EventStatsWrapper Component
 *
 * This component serves as a wrapper for displaying event statistics. It includes a button
 * that toggles the visibility of the `EventStats` component, which provides detailed statistics
 * for a specific event.
 *
 * @param _id - The unique identifier of the event for which statistics are displayed.
 *
 * @returns A JSX element containing a button to view event statistics and the `EventStats` component.
 *
 * @remarks
 * - The `showModal` state is used to control the visibility of the `EventStats` component.
 * - The `Button` component triggers the display of the event statistics modal.
 * - The `EventStats` component is rendered conditionally based on the `showModal` state.
 *
 * @example
 * ```tsx
 * <EventStatsWrapper _id="12345" />
 * ```
 *
 * @component
 * @category Event Management
 * @subcategory Statistics
 *
 * @dependencies
 * - `react-bootstrap/Button`: For rendering the button to toggle the modal.
 * - `components/IconComponent`: For displaying an icon inside the button.
 * - `style/app-fixed.module.css`: For styling the button's icon wrapper.
 * - `./Statistics/EventStats`: The modal component that displays event statistics.
 */
import React, { useState } from 'react';
import { EventStats } from './Statistics/EventStats';
import Button from 'react-bootstrap/Button';
import IconComponent from 'components/IconComponent/IconComponent';
import styles from 'style/app-fixed.module.css';

export const EventStatsWrapper = ({ _id }: { _id: string }): JSX.Element => {
  // State to control the visibility of the EventStats component
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Button to open the event statistics view */}
      <Button
        variant="light"
        className="text-secondary"
        aria-label="checkInRegistrants"
        onClick={(): void => {
          setShowModal(true); // Show the EventStats component when button is clicked
        }}
      >
        <div className={styles.iconWrapper}>
          <IconComponent name="Event Stats" fill="var(--bs-secondary)" />
        </div>
        View Event Statistics
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
