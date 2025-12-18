import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopletabUserEventsProps } from 'types/PeopleTab/interface';

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
  return (
    <div className={styles.peopleTabUserEventContainer}>
      {/* Time section */}
      <div className={styles.peopleTabUserEventTimeWrapper}>
        <div className={styles.peopleTabUserEventTime}>
          {startTime && <p className={styles.timeText}>{startTime}</p>}
          <p className={styles.timeSeparator}>TO</p>
          {endTime && <p className={styles.timeText}>{endTime}</p>}
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
            <p className={styles.eventDescription}>{eventDescription}</p>

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
