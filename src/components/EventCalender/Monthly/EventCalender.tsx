import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import Button from 'shared-components/Button';
import styles from './EventCalender.module.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { holidays, months, weekdays } from 'types/Event/utils';
import YearlyEventCalender from '../Yearly/YearlyEventCalender';
import type {
  InterfaceEvent,
  InterfaceCalendarProps,
} from 'types/Event/interface';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { filterEventData } from '../utils/filterEventData';
import CalendarInfoCards from './CalendarInfoCards';
import DayView from './DayView';
import MonthDays from './MonthDays';

const Calendar: React.FC<
  InterfaceCalendarProps & {
    onMonthChange: (month: number, year: number) => void;
    currentMonth: number;
    currentYear: number;
  }
> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
  viewType,
  onMonthChange,
  currentMonth,
  currentYear,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventCalendar' });
  const { t: tErrors } = useTranslation('errors');
  const [selectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date().getDate());
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);

  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.screen.width);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filteredEvents = filterEventData(
      eventData || [],
      orgData,
      userRole,
      userId,
    );
    setEvents(filteredEvents);
  }, [eventData, orgData, userRole, userId]);

  const handlePrevMonth = (): void => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const handleNextMonth = (): void => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const handlePrevDate = (): void => {
    if (currentDate > 1) {
      setCurrentDate(currentDate - 1);
    } else {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastDayOfPrevMonth = new Date(newYear, newMonth + 1, 0).getDate();
      setCurrentDate(lastDayOfPrevMonth);
      onMonthChange(newMonth, newYear);
    }
  };

  const handleNextDate = (): void => {
    const lastDayOfCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
    ).getDate();
    if (currentDate < lastDayOfCurrentMonth) {
      setCurrentDate(currentDate + 1);
    } else {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      setCurrentDate(1);
      onMonthChange(newMonth, newYear);
    }
  };

  const handleTodayButton = (): void => {
    const today = new Date();
    onMonthChange(today.getMonth(), today.getFullYear());
    setCurrentDate(today.getDate());
  };

  const filteredHolidays = useMemo(() => {
    return Array.isArray(holidays)
      ? holidays.filter((holiday) => {
          if (!holiday.date) {
            return false;
          }
          const holidayMonth = dayjs(holiday.date, 'MM-DD', true).month();
          return holidayMonth === currentMonth;
        })
      : [];
  }, [currentMonth]);

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div className={styles.calendar}>
        {viewType !== ViewType.YEAR && (
          <div className={styles.calendar__header}>
            <div className={styles.calender_month}>
              <div className={styles.navigation_buttons}>
                <Button
                  variant="outlined"
                  className={styles.buttonEventCalendar}
                  onClick={
                    viewType === ViewType.DAY ? handlePrevDate : handlePrevMonth
                  }
                  data-testid="prevmonthordate"
                >
                  <ChevronLeft />
                </Button>

                <div
                  className={styles.calendar__header_month}
                  data-testid="current-date"
                >
                  {viewType === ViewType.DAY
                    ? `${currentDate} ${months[currentMonth]} ${currentYear}`
                    : `${currentYear} ${months[currentMonth]}`}
                </div>

                <Button
                  variant="outlined"
                  className={styles.buttonEventCalendar}
                  onClick={
                    viewType === ViewType.DAY ? handleNextDate : handleNextMonth
                  }
                  data-testid="nextmonthordate"
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
            {viewType !== ViewType.MONTH && (
              <div>
                <Button
                  className={styles.editButton}
                  onClick={handleTodayButton}
                  data-testid="today"
                >
                  {t('today')}
                </Button>
              </div>
            )}
          </div>
        )}
        <div>
          {viewType === ViewType.MONTH ? (
            <>
              <div className={styles.calendar__weekdays}>
                {weekdays.map((weekday, index) => (
                  <div key={index} className={styles.weekday}>
                    {weekday}
                  </div>
                ))}
              </div>
              <div className={styles.calendar__days}>
                <MonthDays
                  events={events}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  refetchEvents={refetchEvents}
                  userRole={userRole}
                  userId={userId}
                  filteredHolidays={filteredHolidays}
                  windowWidth={windowWidth}
                  t={t}
                />
              </div>
              <CalendarInfoCards filteredHolidays={filteredHolidays} t={t} />
            </>
          ) : viewType === ViewType.YEAR ? (
            <YearlyEventCalender
              eventData={eventData}
              refetchEvents={refetchEvents}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
            />
          ) : (
            <div className={styles.calendar__hours}>
              <DayView
                events={events}
                currentYear={currentYear}
                currentMonth={currentMonth}
                currentDate={currentDate}
                refetchEvents={refetchEvents}
                userRole={userRole}
                filteredHolidays={filteredHolidays}
                windowWidth={windowWidth}
                t={t}
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Calendar;
