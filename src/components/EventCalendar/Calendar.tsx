import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurring: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
}
interface CalendarProps {
  eventData: Event[];
}
const Calendar: React.FC<CalendarProps> = ({ eventData }) => {
  const [selectedDate] = useState<Date | null>(null);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  const renderDays = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      monthStart.getDate() - monthStart.getDay()
    );
    const endDate = new Date(
      monthEnd.getFullYear(),
      monthEnd.getMonth(),
      monthEnd.getDate() + (6 - monthEnd.getDay())
    );
    const days = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      days.push(currentDate);
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
    }
    return days.map((date, index) => {
      const className = [
        'day',
        date.getMonth() !== currentMonth ? 'day--outside' : '',
        selectedDate && selectedDate.getTime() === date.getTime()
          ? 'day--selected'
          : '',
      ].join(' ');
      return (
        <div
          style={{
            paddingBottom: '4rem',
            paddingLeft: '0.3rem',
            paddingRight: '0.3rem',
            backgroundColor: 'white',
            border: '1px solid #707070',
            color: '#707070',
          }}
          key={index}
          className={className}
          data-testid="day"
        >
          {date.getDate()}
          <div className={styles.list_box}>
            {eventData
              .filter((datas) => {
                if (datas.startDate == dayjs(date).format('YYYY-MM-DD'))
                  return datas;
              })

              .map((datas: Event) => {
                return (
                  <EventListCard
                    key={datas._id}
                    id={datas._id}
                    eventLocation={datas.location}
                    eventName={datas.title}
                    eventDescription={datas.description}
                    regDate={datas.startDate}
                    regEndDate={datas.endDate}
                    startTime={datas.startTime}
                    endTime={datas.endTime}
                    allDay={datas.allDay}
                    recurring={datas.recurring}
                    isPublic={datas.isPublic}
                    isRegisterable={datas.isRegisterable}
                  />
                );
              })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__header}>
        <button className={styles.button} onClick={handlePrevMonth}>
          {'<'}
        </button>
        <div
          className={styles.calendar__header_month}
          data-testid="current-date"
        >
          {months[currentMonth]} {currentYear}
        </div>
        <button className={styles.button} onClick={handleNextMonth}>
          {'>'}
        </button>
      </div>

      <div className={styles.calendar__weekdays}>
        {weekdays.map((weekday, index) => (
          <div key={index} className={styles.weekday}>
            {weekday}
          </div>
        ))}
      </div>
      <div className={styles.calendar__days}>{renderDays()}</div>
    </div>
  );
};

export default Calendar;
