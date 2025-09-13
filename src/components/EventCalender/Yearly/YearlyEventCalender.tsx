/**
 * Yearly Event Calendar Component
 *
 * This component renders a yearly calendar view with events displayed
 * for each day. It allows navigation between years and provides
 * functionality to expand and view events for specific days.
 *
 * @param  props - The props for the calendar component.
 * @param eventData - Array of event data to display.
 * @param refetchEvents - Function to refetch events.
 * @param orgData - Organization data for filtering events.
 * @param userRole - Role of the user for access control.
 * @param userId - ID of the user for filtering events they are attending.
 *
 * @returns JSX.Element The rendered yearly calendar component.
 */

import React, { useEffect, useState, type JSX } from 'react';
import dayjs from 'dayjs';
import Button from 'react-bootstrap/Button';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import EventListCard from 'components/EventListCard/EventListCard';
import {
  type InterfaceEvent,
  type InterfaceCalendarProps,
  type InterfaceIOrgList,
  UserRole,
} from 'types/Event/interface';
import styles from '../../../style/app-fixed.module.css';

const Calendar: React.FC<InterfaceCalendarProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
}) => {
  const today = new Date();

  // Use earliest valid event year if available; otherwise current year
  const [currentYear, setCurrentYear] = useState(() => {
    if (!Array.isArray(eventData) || eventData.length === 0) {
      return today.getFullYear();
    }
    const years = eventData
      .map((e) => dayjs(e.startDate))
      .filter((d) => d.isValid())
      .map((d) => d.year());
    return years.length ? Math.min(...years) : today.getFullYear();
  });

  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expandedY, setExpandedY] = useState<string | null>(null);

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

  /**
   * Filters events based on user role, organization data, and user ID.
   *
   * Rules:
   * - ADMINISTRATOR: sees all events (uid not required)
   * - No role or no uid: sees public events only
   * - REGULAR: sees public events; if org member, also sees private events
   */
  const isUserMemberOfOrg = (
    org: InterfaceIOrgList | undefined,
    uid: string | undefined,
  ): boolean => {
    if (!org || !uid) return false;
    const anyOrg = org as any;

    // Direct check for the test case structure
    if (anyOrg?.members?.edges) {
      // Check both id and _id fields in member edges
      const isMember = anyOrg.members.edges.some((edge: any) => {
        const node = edge?.node;
        return node?.id === uid || node?._id === uid;
      });

      if (isMember) return true;
    }

    const buckets: any[] = [];

    const collect = (arr?: any) => Array.isArray(arr) && buckets.push(arr);

    // Common shapes
    collect(anyOrg?.members?.edges?.map?.((e: any) => e?.node));
    collect(anyOrg?.members?.edges?.map?.((e: any) => e?.node?.user));
    collect(anyOrg?.members?.nodes);
    collect(anyOrg?.members);

    // Nested org
    collect(anyOrg?.organization?.members?.edges?.map?.((e: any) => e?.node));
    collect(
      anyOrg?.organization?.members?.edges?.map?.((e: any) => e?.node?.user),
    );
    collect(anyOrg?.organization?.members?.nodes);
    collect(anyOrg?.organization?.members);

    // Connection variants / fallbacks
    collect(anyOrg?.membersConnection?.edges?.map?.((e: any) => e?.node));
    collect(anyOrg?.userMemberships?.edges?.map?.((e: any) => e?.node?.user));
    collect(anyOrg?.users);
    collect(anyOrg?.organization?.users);

    const all = buckets.flat().filter(Boolean);
    return isUidInCandidates(all, uid);
  };

  const isUidInCandidates = (candidates: any[], uid: string): boolean => {
    return candidates.some((item) => {
      if (!item) return false;
      return item.id === uid || item._id === uid;
    });
  };

  const filterData = (
    list: InterfaceEvent[],
    org?: InterfaceIOrgList,
    role?: UserRole,
    uid?: string,
  ): InterfaceEvent[] => {
    if (!Array.isArray(list) || list.length === 0) return [];

    // Admins see everything
    if (role === UserRole.ADMINISTRATOR) return list;

    // Missing role or uid -> only public
    if (!role || !uid) return list.filter((e) => !!e.isPublic);

    // Regular users: allow private if the user is a member of the org
    const isMember = isUserMemberOfOrg(org, uid);

    return list.filter((e) => e.isPublic || isMember);
  };

  useEffect(() => {
    const filtered = filterData(
      eventData,
      orgData,
      typeof userRole === 'string'
        ? userRole === 'ADMINISTRATOR'
          ? UserRole.ADMINISTRATOR
          : UserRole.REGULAR
        : (userRole as UserRole | undefined),
      userId,
    );
    setEvents(filtered);
  }, [eventData, orgData, userRole, userId]);

  const handlePrevYear = (): void => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = (): void => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const renderMonthDays = (): JSX.Element[] => {
    const renderedMonths: JSX.Element[] = [];

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      const monthStart = new Date(currentYear, monthIdx, 1);
      const monthEnd = new Date(currentYear, monthIdx + 1, 0);

      // grid Monday..Sunday
      const startDate = new Date(monthStart);
      const dayOfWeek = startDate.getDay(); // 0..6 (Sun..Sat)
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);

      const endDate = new Date(monthEnd);
      const endDayOfWeek = endDate.getDay();
      const diffEnd =
        endDate.getDate() + (6 - endDayOfWeek) + (endDayOfWeek === 0 ? 1 : 0);
      endDate.setDate(diffEnd);

      const days: Date[] = [];
      const cursor = new Date(startDate);
      while (cursor <= endDate) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }

      const renderedDays = days.map((date, dayIdx) => {
        const isToday =
          date.toLocaleDateString() === today.toLocaleDateString();
        const isOutsideMonth = date.getMonth() !== monthIdx;
        const className = [
          isToday ? styles.day__today : '',
          isOutsideMonth ? styles.day__outside : '',
          styles.day__yearly,
        ].join(' ');

        // Filter events for this date
        const dateStr = dayjs(date).format('YYYY-MM-DD');
        const eventsForDate =
          events?.filter((event) => {
            const eventDateStr = dayjs(event.startDate).format('YYYY-MM-DD');
            return eventDateStr === dateStr;
          }) || [];

        const toggleExpand = (index: string): void => {
          setExpandedY((prev) => (prev === index ? null : index));
        };

        const renderedEvents = eventsForDate.map((event) => (
          <EventListCard
            refetchEvents={refetchEvents}
            userRole={userRole}
            key={event._id}
            _id={event._id}
            location={event.location}
            name={event.name}
            description={event.description}
            startDate={event.startDate}
            endDate={event.endDate}
            startTime={event.startTime}
            endTime={event.endTime}
            allDay={event.allDay}
            isPublic={event.isPublic}
            isRegisterable={event.isRegisterable}
            attendees={event.attendees || []}
            creator={event.creator}
            userId={userId}
          />
        ));

        const expandKey = `${monthIdx}-${dayIdx}`;
        const isExpanded = expandedY === expandKey;

        return (
          <div
            key={expandKey}
            className={`${className} ${eventsForDate.length > 0 ? styles.day__events : ''}`}
            data-testid="day"
          >
            {date.getDate()}

            <div className={isExpanded ? styles.expand_list_container : ''}>
              <div
                className={
                  isExpanded ? styles.expand_event_list : styles.event_list
                }
                data-testid={isExpanded ? 'expanded-event-list' : undefined}
              >
                {isExpanded && renderedEvents}
              </div>

              {eventsForDate.length > 0 ? (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(expandKey)}
                  data-testid={`expand-btn-${expandKey}`}
                >
                  {isExpanded ? (
                    <div className={styles.closebtnYearlyEventCalender}>
                      <br />
                      <p>Close</p>
                    </div>
                  ) : (
                    <div className={styles.circularButton}></div>
                  )}
                </button>
              ) : (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(expandKey)}
                  data-testid={`no-events-btn-${expandKey}`}
                >
                  {isExpanded ? (
                    <div className={styles.closebtnYearlyEventCalender}>
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
        <div className={styles.columnYearlyEventCalender} key={monthIdx}>
          <div className={styles.cardYearlyEventCalender}>
            <h6 className={styles.cardHeaderYearlyEventCalender}>
              {months[monthIdx]}
            </h6>
            <div className={styles.calendar__weekdays}>
              {weekdaysShorthand.map((weekday, idx) => (
                <div key={idx} className={styles.weekday__yearly}>
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
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={handlePrevYear}
            data-testid="prevYear"
          >
            <ChevronLeft />
          </Button>
          <div className={styles.year}>{currentYear}</div>
          <Button
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={handleNextYear}
            data-testid="nextYear"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className={styles.rowYearlyEventCalender}>{renderMonthDays()}</div>
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.yearlyCalender}>{renderYearlyCalendar()}</div>
    </div>
  );
};

export default Calendar;
