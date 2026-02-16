import React, { useState, useEffect, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import styles from './WeeklyEventCalender.module.css';
import EventListCard from 'shared-components/EventListCard/EventListCard';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import type {
  InterfaceEvent,
  InterfaceCalendarProps,
  InterfaceIOrgList,
} from 'types/Event/interface';

export interface InterfaceWeeklyEventCalenderProps extends InterfaceCalendarProps {
  currentDate: Date;
}

const filterData = (
  data: InterfaceEvent[],
  organization?: InterfaceIOrgList,
  role?: string,
  uid?: string,
): InterfaceEvent[] => {
  if (!data) return [];

  if (!role || !uid) {
    return data.filter((event) => event.isPublic);
  }

  if (role === 'ADMINISTRATOR') {
    return data;
  }

  return data.filter((event) => {
    if (event.isPublic) return true;
    const isMember = organization?.members?.edges?.some(
      (edge) => edge.node.id === uid,
    );
    return isMember || false;
  });
};

const WeeklyEventCalender: React.FC<InterfaceWeeklyEventCalenderProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
  currentDate,
}) => {
  const { t: tErrors } = useTranslation('errors');

  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);

  // Helper to get week start (Sunday)
  const getWeekStart = React.useCallback((date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.setDate(diff));
  }, []);

  const [weekStart, setWeekStart] = useState(getWeekStart(currentDate));

  useEffect(() => {
    const newWeekStart = getWeekStart(currentDate);
    setWeekStart(newWeekStart);
  }, [currentDate, getWeekStart]);

  useEffect(() => {
    const filteredEvents = filterData(
      eventData || [],
      orgData,
      userRole,
      userId,
    );
    setEvents(filteredEvents);
  }, [eventData, orgData, userRole, userId]);

  // Generate 24-hour time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getEventStyle = (start: string, end: string) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const startHour = startDate.hour();
    const startMinute = startDate.minute();
    const durationMinutes = endDate.diff(startDate, 'minute');

    const top = (startHour + startMinute / 60) * 60; // 60px per hour
    const height = (durationMinutes / 60) * 60;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  const renderTimeColumn = (): JSX.Element => {
    return (
      <div className={styles.timeColumn}>
        <div className={styles.timeHeader}></div>
        {timeSlots.map((hour) => (
          <div key={hour} className={styles.timeSlot}>
            <span className={styles.timeLabel}>
              {dayjs().hour(hour).minute(0).format('h A')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const currentWeekStart = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(currentWeekStart);
      tempDate.setDate(currentWeekStart.getDate() + i);
      const dateKey = dayjs(tempDate).format('YYYY-MM-DD');

      const eventsForDate =
        events?.filter(
          (event) => dayjs(event.startAt).format('YYYY-MM-DD') === dateKey,
        ) || [];

      days.push(
        <div key={i} className={styles.dayColumn}>
          <div
            className={`${styles.dayHeader} ${
              dayjs(tempDate).isSame(dayjs(), 'day')
                ? styles.todayHighlight
                : ''
            }`}
          >
            <span className={styles.dayName}>
              {dayjs(tempDate).format('ddd')}
            </span>
            <span className={styles.dayDate}>
              {dayjs(tempDate).format('D')}
            </span>
          </div>
          <div className={styles.dayGrid}>
            {timeSlots.map((hour) => (
              <div key={hour} className={styles.gridCell}></div>
            ))}
            {eventsForDate.map((event) => (
              <div
                key={event.id}
                className={styles.eventContainer}
                style={getEventStyle(event.startAt, event.endAt)}
              >
                <EventListCard
                  key={event.id}
                  {...event}
                  refetchEvents={refetchEvents}
                  userRole={userRole}
                  userId={userId}
                />
              </div>
            ))}
          </div>
        </div>,
      );
    }
    return days;
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div className={styles.weeklyCalendar}>
        <div className={styles.calendarBody}>
          {renderTimeColumn()}
          <div className={styles.weekGrid}>{renderWeekDays()}</div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default WeeklyEventCalender;
