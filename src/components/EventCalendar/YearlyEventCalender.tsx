import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import styles from './YearlyEventCalender.module.css';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface InterfaceEvent {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  startTime: string | undefined;
  endTime: string | undefined;
  allDay: boolean;
  recurring: boolean;
  registrants?: InterfaceIEventAttendees[];
  isPublic: boolean;
  isRegisterable: boolean;
}

interface InterfaceCalendarProps {
  eventData: InterfaceEvent[];
  orgData?: InterfaceIOrgList;
  userRole?: string;
  userId?: string;
  viewType?: ViewType;
}

enum Status {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

interface InterfaceIEventAttendees {
  userId: string;
  user?: string;
  status?: Status;
  createdAt?: Date;
}

interface InterfaceIOrgList {
  admins: { _id: string }[];
}
const Calendar: React.FC<InterfaceCalendarProps> = ({
  eventData,
  orgData,
  userRole,
  userId,
}) => {
  const [selectedDate] = useState<Date | null>(null);
  const weekdaysShorthand = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expandedY, setExpandedY] = useState<string | null>(null);

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
        const userAttending = event.registrants?.some(
          (data) => data.userId === userId,
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

  const handlePrevYear = (): void => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = (): void => {
    setCurrentYear(currentYear + 1);
  };

  const renderMonthDays = (): JSX.Element[] => {
    const renderedMonths: JSX.Element[] = [];

    for (let monthInx = 0; monthInx < 12; monthInx++) {
      const monthStart = new Date(currentYear, monthInx, 1);
      const monthEnd = new Date(currentYear, monthInx + 1, 0);

      const startDate = new Date(monthStart);
      const dayOfWeek = startDate.getDay();
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);

      const endDate = new Date(monthEnd);
      const endDayOfWeek = endDate.getDay();
      const diffEnd =
        endDate.getDate() + (7 - endDayOfWeek) - (endDayOfWeek === 0 ? 7 : 0);
      endDate.setDate(diffEnd);

      const days = [];
      let currentDate = startDate;
      while (currentDate <= endDate) {
        days.push(currentDate);
        currentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
        );
      }

      const renderedDays = days.map((date, dayIndex) => {
        const className = [
          date.toLocaleDateString() === today.toLocaleDateString()
            ? styles.day__today
            : '',
          date.getMonth() !== monthInx ? styles.day__outside : '',
          selectedDate?.getTime() === date.getTime()
            ? styles.day__selected
            : '',
          styles.day__yearly,
        ].join(' ');

        const eventsForCurrentDate = events?.filter((event) => {
          return dayjs(event.startDate).isSame(date, 'day');
        });

        const renderedEvents = eventsForCurrentDate?.map((event) => (
          <EventListCard
            key={event._id}
            id={event._id}
            eventLocation={event.location}
            eventName={event.title}
            eventDescription={event.description}
            regDate={event.startDate}
            regEndDate={event.endDate}
            startTime={event.startTime}
            endTime={event.endTime}
            allDay={event.allDay}
            recurring={event.recurring}
            isPublic={event.isPublic}
            isRegisterable={event.isRegisterable}
          />
        ));

        const toggleExpand = (index: string): void => {
          if (expandedY === index) {
            setExpandedY(null);
          } else {
            setExpandedY(index);
          }
        };

        return (
          <div
            key={`${monthInx}-${dayIndex}`}
            className={className}
            data-testid="day"
          >
            {date.getDate()}
            <div
              className={
                expandedY === `${monthInx}-${dayIndex}`
                  ? styles.expand_list_container
                  : ''
              }
            >
              <div
                className={
                  expandedY === `${monthInx}-${dayIndex}`
                    ? styles.expand_event_list
                    : styles.event_list
                }
              >
                {expandedY === `${monthInx}-${dayIndex}` && renderedEvents}
              </div>
              {renderedEvents && renderedEvents?.length > 0 && (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(`${monthInx}-${dayIndex}`)}
                >
                  {expandedY === `${monthInx}-${dayIndex}` ? (
                    <div className={styles.closebtn}>
                      <br />
                      <p>Close</p>
                    </div>
                  ) : (
                    <div className={styles.circularButton}></div>
                  )}
                </button>
              )}
              {renderedEvents && renderedEvents?.length == 0 && (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(`${monthInx}-${dayIndex}`)}
                >
                  {expandedY === `${monthInx}-${dayIndex}` ? (
                    <div className={styles.closebtn}>
                      <br />
                      <br />
                      No Event Available!
                      <br />
                      <p>Close</p>
                    </div>
                  ) : (
                    <div className={styles.circularButton}></div>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      });

      renderedMonths.push(
        <div className={styles.column} key={monthInx}>
          <div className={styles.card}>
            <h6 className={styles.cardHeader}>{months[monthInx]}</h6>
            <div className={styles.calendar__weekdays}>
              {weekdaysShorthand.map((weekday, index) => (
                <div key={index} className={styles.weekday__yearly}>
                  {weekday}
                </div>
              ))}
            </div>
            <div className={styles.calendar__days}>{renderedDays}</div>
          </div>
        </div>,
      );
    }

    return renderedMonths;
  };

  const renderYearlyCalendar = (): JSX.Element => {
    return (
      <div className={styles.yearlyCalendar}>
        <div className={styles.yearlyCalendarHeader}>
          <Button
            className={styles.button}
            onClick={handlePrevYear}
            data-testid="prevYear"
          >
            <ChevronLeft />
          </Button>
          <div className={styles.year}>{currentYear}</div>
          <Button
            className={styles.button}
            onClick={handleNextYear}
            data-testid="nextYear"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className={styles.row}>
          <div>{renderMonthDays()}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.yearlyCalender}>
        <div>{renderYearlyCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
