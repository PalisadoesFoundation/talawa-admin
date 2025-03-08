import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import styles from '../../../style/app-fixed.module.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
import HolidayCard from '../../HolidayCards/HolidayCard';
import { holidays, weekdays } from 'types/Event/utils';
import type {
  InterfaceEvent,
  InterfaceCalendarProps,
  InterfaceIOrgList,
} from 'types/Event/interface';
import { Role } from 'types/Event/interface';
import { type User } from 'types/User/type';

const Calendar: React.FC<InterfaceCalendarProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
}) => {
  const today = new Date();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date(today.setDate(today.getDate() - today.getDay()) 
  ));
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expanded, setExpanded] = useState<number>(-1);
  const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);

  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.screen.width);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filterData = (
    eventData: InterfaceEvent[],
    orgData?: InterfaceIOrgList,
    userRole?: string,
    userId?: string,
  ): InterfaceEvent[] => {
    const data: InterfaceEvent[] = [];
    if (userRole === Role.SUPERADMIN) return eventData;

    if (userRole === Role.ADMIN) {
      eventData?.forEach((event) => {
        if (event.isPublic) data.push(event);
        if (!event.isPublic) {
          const filteredOrg: boolean | undefined = orgData?.admins?.some(
            (data) => data._id === userId,
          );
          if (filteredOrg) {
            data.push(event);
          }
        }
      });
    } else {
      eventData?.forEach((event) => {
        if (event.isPublic) data.push(event);
        const userAttending = event.attendees?.some(
          (data) => data._id === userId,
        );
        if (userAttending) {
          data.push(event);
        }
      });
    }
    return data;
  };

  useEffect(() => {
    const data = filterData(eventData, orgData, userRole, userId);
    setEvents(data);
  }, [eventData, orgData, userRole, userId]);

  const goToPreviousWeek = (): void => {
    setCurrentWeekStart((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = (): void => {
    setCurrentWeekStart((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const handleTodayButton = (): void => {
    const today = new Date();
    setCurrentWeekStart(new Date(today.setDate(today.getDate() - today.getDay())));
  };

  const renderWeekDays = (): JSX.Element[] => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }

    return days.map((date, index) => {
      const toggleExpand = (index: number): void => {
        if (expanded === index) {
          setExpanded(-1);
        } else {
          setExpanded(index);
        }
      };

      const allEventsList: JSX.Element[] =
        events
          ?.filter((datas) => {
            if (datas.startDate === dayjs(date).format('YYYY-MM-DD'))
              return datas;
          })
          .map((datas: InterfaceEvent) => {
            const attendees: Partial<User>[] = [];
            datas.attendees?.forEach((attendee) => {
              const r = {
                _id: attendee._id,
              };
              attendees.push(r);
            });

            return (
              <EventListCard
                refetchEvents={refetchEvents}
                userRole={userRole}
                key={datas._id}
                _id={datas._id}
                location={datas.location}
                title={datas.title}
                description={datas.description}
                startDate={datas.startDate}
                endDate={datas.endDate}
                startTime={datas.startTime}
                endTime={datas.endTime}
                allDay={datas.allDay}
                recurring={datas.recurring}
                recurrenceRule={datas.recurrenceRule}
                isRecurringEventException={datas.isRecurringEventException}
                isPublic={datas.isPublic}
                isRegisterable={datas.isRegisterable}
                attendees={attendees}
                creator={datas.creator}
              />
            );
          }) || [];

      const holidayList: JSX.Element[] = holidays
        .filter((holiday) => holiday.date === dayjs(date).format('MM-DD'))
        .map((holiday) => {
          return <HolidayCard key={holiday.name} holidayName={holiday.name} />;
        });

      return (
        <div
          key={index}
          className={styles.day + ' ' + (allEventsList?.length > 0 && styles.day__events)}
          data-testid="day"
        >
          <div className={styles.day_header}>
            {weekdays[date.getDay()]} {date.getDate()}
          </div>
          <div
            className={expanded === index ? styles.expand_list_container : ''}
          >
            <div
              className={
                expanded === index
                  ? styles.expand_event_list
                  : styles.event_list
              }
            >
              <div>{holidayList}</div>
              {expanded === index
                ? allEventsList
                : holidayList?.length > 0
                  ? allEventsList?.slice(0, 1)
                  : allEventsList?.slice(0, 2)}
            </div>
            {(allEventsList?.length > 2 ||
              (windowWidth <= 700 && allEventsList?.length > 0)) && (
              <button
                className={styles.btn__more}
                data-testid="more"
                onClick={() => {
                  toggleExpand(index);
                }}
              >
                {expanded === index ? 'View less' : 'View all'}
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__header}>
        <div className={styles.calender_week}>
          <Button
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={goToPreviousWeek}
            data-testid="prevWeek"
          >
            <ChevronLeft />
          </Button>
          <div
            className={styles.calendar__header_week}
            data-testid="current-week"
          >
            {dayjs(currentWeekStart).format('MMM D')} -{' '}
            {dayjs(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6)).format('MMM D')}
          </div>
          <Button
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={goToNextWeek}
            data-testid="nextWeek"
          >
            <ChevronRight />
          </Button>
        </div>
        <div>
          <Button
            className={styles.weeklyEditButton}
            onClick={handleTodayButton}
            data-testid="today"
          >
            Today
          </Button>
        </div>
      </div>
      <div className={styles.calendar__week}>
        <div className={styles.calendar__weekdays}>
          {weekdays.map((weekday, index) => (
            <div key={index} className={styles.weekday}>
              {weekday}
            </div>
          ))}
        </div>
        <div className={styles.calendar__days}>{renderWeekDays()}</div>
      </div>
    </div>
  );
};

export default Calendar;