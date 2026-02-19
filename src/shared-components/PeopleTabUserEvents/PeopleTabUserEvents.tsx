/**
 * PeopleTabUserEvents component.
 *
 * A reusable component used in the People tab to display
 * event-related information associated with a user.
 *
 * It shows event timing, dates, name, description,
 * and an optional action button with an icon and label.
 *
 * @remarks
 * - Used to render individual user-related events
 * - Supports start and end times and dates
 * - Optional action button for user interactions
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
 * @param startTime - Optional start time of the event
 * @param endTime - Optional end time of the event
 * @param startDate - Optional start date of the event
 * @param endDate - Optional end date of the event
 * @param eventName - Optional name or title of the event
 * @param eventDescription - Optional detailed description of the event
 * @param actionIcon - Optional icon displayed in the action button
 * @param actionName - Optional label for the action button
 *
 * @returns The rendered PeopleTabUserEvents component
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
