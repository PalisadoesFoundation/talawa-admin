/**
 * PeopleTabUserEvents Component
 *
 * A reusable component that displays user-related event information in the People Tab.
 * Shows event timing, dates, name, description, and an optional action button with an icon.
 *
 * @component
 *
 * @remarks
 * - Used to render individual events associated with a user.
 * - Supports displaying start and end times, start and end dates.
 * - Optional action button can be provided with an icon and label for user interactions.
 *
 * @example
 * ```tsx
 * <PeopleTabUserEvents
 *   startTime="10:00 AM"
 *   endTime="12:00 PM"
 *   startDate="2025-12-20"
 *   endDate="2025-12-20"
 *   eventName="Community Meetup"
 *   eventDescription="A session to discuss upcoming projects."
 *   actionIcon={<ArrowRightIcon />}
 *   actionName="View Details"
 * />
 * ```
 *
 * @param {string} [startTime] — Start time of the event.
 * @param {string} [endTime] — End time of the event.
 * @param {string} [startDate] — Start date of the event.
 * @param {string} [endDate] — End date of the event.
 * @param {string} [eventName] — Name/title of the event.
 * @param {string} [eventDescription] — Detailed description of the event.
 * @param {React.ReactNode} [actionIcon] — Optional icon to display in the action button.
 * @param {string} [actionName] — Optional label for the action button.
 *
 * @returns {JSX.Element} The rendered PeopleTabUserEvents component.
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopletabUserEventsProps } from 'types/PeopleTab/interface';
import { useTranslation } from 'react-i18next';

const PeopleTabUserEvents: React.FC<InterfacePeopletabUserEventsProps> = ({
  startTime,
  endTime,
  startDate,
  endDate,
  eventName,
  eventDescription,
  actionIcon,
  actionName,
}) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <div className={styles.peopleTabUserEventContainer}>
      {/* Time section */}
      <div className={styles.peopleTabUserEventTimeWrapper}>
        <div className={styles.peopleTabUserEventTime}>
          {startTime && (
            <p className={styles.peopleTabUserOrganizationEventPageTime}>
              {startTime}
            </p>
          )}
          <p className={styles.peopleTabUserOrganizationEventPageTimeSeparator}>
            {tCommon('to')}
          </p>
          {endTime && (
            <p className={styles.peopleTabUserOrganizationEventPageTime}>
              {endTime}
            </p>
          )}
        </div>

        <div className={styles.peopleTabUserEventDate}>
          {startDate && <p className={styles.dateText}>{startDate}</p>}
          {endDate && <p className={styles.dateText}>{endDate}</p>}
        </div>
      </div>

      {/* Event info */}
      <div className={styles.peopleTabUserEventInfo}>
        {eventName && <h4 className={styles.eventName}>{eventName}</h4>}
        {eventDescription && (
          <div>
            <p
              className={
                styles.peopleTabUserOrganizationEventPageEventDescription
              }
            >
              {eventDescription}
            </p>

            {actionName && (
              <div className={styles.peopleTabUserEventAction}>
                <button className={styles.peopleTabUserEventActionButton}>
                  {actionIcon && (
                    <span className={styles.actionIcon}>{actionIcon}</span>
                  )}
                  <span>{actionName}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeopleTabUserEvents;
