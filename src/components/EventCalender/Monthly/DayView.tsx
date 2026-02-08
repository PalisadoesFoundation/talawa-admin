import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { JSX } from 'react';
import styles from './EventCalender.module.css';
import { months } from 'types/Event/utils';
import type { InterfaceEvent } from 'types/Event/interface';

interface Holiday {
  name: string;
  date: string;
  month: string;
}

interface DayViewProps {
  events: InterfaceEvent[] | null;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  refetchEvents?: () => void;
  userRole?: string;
  filteredHolidays: Holiday[];
  windowWidth: number;
  t: (key: string) => string;
}

const DayView: React.FC<DayViewProps> = ({
  events,
  currentYear,
  currentMonth,
  currentDate,
  refetchEvents,
  userRole,
  filteredHolidays,
  windowWidth,
  t,
}) => {
  const [expanded, setExpanded] = useState<number>(-1);

  const timezoneString = `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${String(
    Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60),
  ).padStart(
    2,
    '0',
  )}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, '0')}`;

  const toggleExpand = (index: number): void => {
    if (expanded === index) setExpanded(-1);
    else setExpanded(index);
  };

  const currentDateEvents =
    events?.filter((datas) => {
      const currDate = new Date(currentYear, currentMonth, currentDate);
      return (
        dayjs(datas.startAt).format('YYYY-MM-DD') ===
        dayjs(currDate).format('YYYY-MM-DD')
      );
    }) || [];

  const allDayEventsList: JSX.Element[] = currentDateEvents.map(
    (datas: InterfaceEvent) => (
      <EventListCard
        refetchEvents={refetchEvents}
        userRole={userRole}
        key={datas.id}
        id={datas.id}
        location={datas.location}
        name={datas.name}
        description={datas.description}
        startAt={datas.startAt}
        endAt={datas.endAt}
        startTime={datas.startTime}
        endTime={datas.endTime}
        allDay={datas.allDay}
        isPublic={datas.isPublic}
        isRegisterable={datas.isRegisterable}
        isInviteOnly={Boolean(datas.isInviteOnly)}
        isRecurringEventTemplate={datas.isRecurringEventTemplate}
        baseEvent={datas.baseEvent}
        sequenceNumber={datas.sequenceNumber}
        totalCount={datas.totalCount}
        hasExceptions={datas.hasExceptions}
        progressLabel={datas.progressLabel}
        recurrenceDescription={datas.recurrenceDescription}
        recurrenceRule={datas.recurrenceRule}
        creator={datas.creator}
        attendees={datas.attendees}
      />
    ),
  );

  const shouldShowViewMore =
    allDayEventsList.length > 2 ||
    (windowWidth <= 700 && allDayEventsList.length > 0);

  const handleExpandClick: () => void = () => {
    toggleExpand(-100);
  };

  return (
    <>
      <div className={styles.calendar_hour_block} data-testid="hour">
        <div className={styles.calendar_hour_text_container}>
          <p className={styles.calendar_timezone_text}>{timezoneString}</p>
        </div>
        <div className={styles.dummyWidth}></div>
        <div
          className={
            allDayEventsList?.length > 0
              ? styles.event_list_parent_current
              : styles.event_list_parent
          }
        >
          <div
            className={
              expanded === -100
                ? styles.expand_list_container
                : styles.list_container
            }
          >
            <div
              className={
                expanded === -100
                  ? styles.expand_event_list
                  : styles.event_list_hour
              }
            >
              {Array.isArray(allDayEventsList) &&
              allDayEventsList.length > 0 ? (
                expanded === -100 ? (
                  allDayEventsList
                ) : (
                  allDayEventsList.slice(0, 2)
                )
              ) : (
                <p className={styles.no_events_message}>
                  {t('noEventsAvailable')}
                </p>
              )}
            </div>
            {Array.isArray(allDayEventsList) && shouldShowViewMore && (
              <button
                className={styles.btn__more}
                onClick={handleExpandClick}
                data-testid="view-more-button"
              >
                {expanded === -100 ? 'View less' : 'View all'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.calendar_infocards}>
        <div
          className={styles.holidays_card}
          role="region"
          aria-label={t('holidays')}
        >
          <h3 className={styles.card_title}>{t('holidays')}</h3>
          <ul className={styles.card_list}>
            {filteredHolidays.map((holiday, index) => (
              <li className={styles.card_list_item} key={index}>
                <span className={styles.holiday_date}>
                  {months[parseInt(holiday.date.slice(0, 2), 10) - 1]}{' '}
                  {holiday.date.slice(3)}
                </span>
                <span className={styles.holiday_name}>{holiday.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={styles.events_card}
          role="region"
          aria-label={t('events')}
        >
          <h3 className={styles.card_title}>{t('events')}</h3>
          <div className={styles.legend}>
            <div className={styles.eventsLegend} data-testid="events-legend">
              <span
                className={styles.organizationIndicator}
                data-testid="org-indicator"
              ></span>
              <span className={styles.legendText}>
                {t('eventsCreatedByOrganization')}
              </span>
            </div>
            <div
              className={styles.list_container_holidays}
              data-testid="holidays-list"
            >
              <span
                className={styles.holidayIndicator}
                data-testid="holiday-indicator"
              ></span>
              <span className={styles.holidayText}>{t('holidays')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DayView;
