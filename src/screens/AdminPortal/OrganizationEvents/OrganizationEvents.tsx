/**
 * OrganizationEvents Component
 *
 * This component is responsible for rendering and managing the organization events page.
 * It includes functionalities for viewing events in different calendar views and creating new events.
 *
 * @returns The rendered OrganizationEvents component.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and `@mui/x-date-pickers` for date/time pickers.
 * - Supports multilingual translations using `react-i18next`.
 * - Handles event creation with validations.
 *
 * @example
 * ```tsx
 * <OrganizationEvents />
 * ```
 */

import React, { useState, useEffect, useMemo, type JSX } from 'react';
import styles from './OrganizationEvents.module.css';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_EVENTS_PREVIEW,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import CreateEventModal from './CreateEventModal';
import { Button } from 'shared-components/Button';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import SafeBreadcrumbs from 'shared-components/BreadcrumbsComponent/SafeBreadcrumbs';

// Define the type for an event edge
interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string | null;
    endAt: string | null;
    startDate?: string | null;
    endDate?: string | null;
    allDay: boolean;
    location?: string | null;
    isPublic: boolean;
    isRegisterable: boolean;
    isInviteOnly?: boolean;
    // Recurring event fields
    isRecurringEventTemplate?: boolean;
    baseEvent?: {
      id: string;
      name: string;
    } | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    // New recurrence description fields
    recurrenceDescription?: string | null;
    recurrenceRule?: InterfaceRecurrenceRule | null;
    // Attachments
    attachments?: Array<{
      url: string;
      mimeType: string;
    }>;
    creator?: {
      id: string;
      name: string;
    };
    attendees?: Array<{
      id: string;
      name: string;
    }>;
    organization?: {
      id: string;
      name: string;
    };
    createdAt?: string;
    updatedAt?: string;
  };
  cursor: string;
}

interface IEventsPreviewDay {
  date: string;
  totalCount: number;
  hasMore: boolean;
  events: IEventEdge['node'][];
}

export enum ViewType {
  DAY = 'Day',
  WEEK = 'Week View',
  MONTH = 'Month View',
  YEAR = 'Year View',
}

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { getItem } = useLocalStorage();

  useEffect(() => {
    document.title = t('title');
  }, [t]);
  const createEventModal = useModalState();
  const [viewType] = useState<ViewType>(ViewType.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDateOfMonth, setCurrentDateOfMonth] = useState(
    new Date().getDate(),
  );
  const [queryMonth, setQueryMonth] = useState(currentMonth);
  const [queryYear, setQueryYear] = useState(currentYear);
  const [queryCurrentDateOfMonth, setQueryCurrentDateOfMonth] =
    useState(currentDateOfMonth);
  const [searchByName, setSearchByName] = useState('');
  const [eventFilter, setEventFilter] = useState<
    'upcoming' | 'past' | 'recurring'
  >('upcoming');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('calendar');
  const [dayEventsResetKey, setDayEventsResetKey] = useState(0);
  const { orgId: currentUrl } = useParams();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQueryMonth(currentMonth);
      setQueryYear(currentYear);
      setQueryCurrentDateOfMonth(currentDateOfMonth);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMonth, currentYear, currentDateOfMonth]);

  const handleMonthChange = (month: number, year: number): void => {
    if (month === currentMonth && year === currentYear) {
      return;
    }

    const daysInTargetMonth = dayjs(new Date(year, month, 1)).daysInMonth();
    setCurrentDateOfMonth((prev) => Math.min(prev, daysInTargetMonth));
    setCurrentMonth(month);
    setCurrentYear(year);
    // No manual refetch - let useQuery handle variable updates.
  };

  const handleCurrentDateChange = (dayOfMonth: number): void => {
    setCurrentDateOfMonth(dayOfMonth);
  };

  // eventsPreview field doesn't exist in the API — always use the detailed events query
  const isMonthView = false;

  const effectiveQueryMonth = isMonthView ? queryMonth : currentMonth;
  const effectiveQueryYear = isMonthView ? queryYear : currentYear;
  const effectiveQueryCurrentDateOfMonth = isMonthView
    ? queryCurrentDateOfMonth
    : currentDateOfMonth;

  const monthStartDate = dayjs(
    new Date(effectiveQueryYear, effectiveQueryMonth, 1),
  )
    .startOf('month')
    .toISOString();
  const monthEndDate = dayjs(
    new Date(effectiveQueryYear, effectiveQueryMonth, 1),
  )
    .endOf('month')
    .toISOString();

  const currentViewDate = dayjs(
    new Date(
      effectiveQueryYear,
      effectiveQueryMonth,
      effectiveQueryCurrentDateOfMonth,
    ),
  );

  const { startDate, endDate } = useMemo(() => {
    if (viewType === ViewType.DAY) {
      return {
        startDate: currentViewDate.startOf('day').toISOString(),
        endDate: currentViewDate.endOf('day').toISOString(),
      };
    }

    if (viewType === ViewType.WEEK) {
      return {
        startDate: currentViewDate.startOf('week').toISOString(),
        endDate: currentViewDate.endOf('week').toISOString(),
      };
    }

    return {
      startDate: monthStartDate,
      endDate: monthEndDate,
    };
  }, [currentViewDate, monthEndDate, monthStartDate, viewType]);

  // API max is 100 per page
  const detailedFirst =
    viewType === ViewType.DAY ? 40 : viewType === ViewType.WEEK ? 80 : 100;

  const {
    data: monthPreviewData,
    error: monthPreviewError,
    refetch: refetchMonthPreviewEvents,
    loading: monthPreviewLoading,
    networkStatus: monthPreviewNetworkStatus,
  } = useQuery(GET_ORGANIZATION_EVENTS_PREVIEW, {
    variables: {
      id: currentUrl,
      startDate,
      endDate,
      includeRecurring: true,
      perDayLimit: 2,
    },
    skip: !isMonthView,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  const {
    data: detailedEventData,
    error: detailedEventError,
    refetch: refetchDetailedEvents,
    loading: detailedEventLoading,
    networkStatus: detailedNetworkStatus,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: detailedFirst,
      after: null,
      startDate,
      endDate,
      includeRecurring: true,
    },
    skip: isMonthView,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });

  const eventDataError = isMonthView ? monthPreviewError : detailedEventError;
  const eventLoading = isMonthView ? monthPreviewLoading : detailedEventLoading;
  const networkStatus = isMonthView
    ? monthPreviewNetworkStatus
    : detailedNetworkStatus;

  const refetchEvents = (): void => {
    const resetDayEventsCache = (): void => {
      setDayEventsResetKey((prev) => prev + 1);
    };

    if (isMonthView) {
      void refetchMonthPreviewEvents().finally(resetDayEventsCache);
      return;
    }
    void refetchDetailedEvents().finally(resetDayEventsCache);
  };

  const isMonthChangeDisabled =
    isMonthView &&
    eventLoading &&
    (networkStatus === NetworkStatus.loading ||
      networkStatus === NetworkStatus.setVariables);

  const {
    data: orgData,
    loading: orgLoading,
    error: orgDataError,
  } = useQuery(GET_ORGANIZATION_DATA_PG, {
    variables: {
      id: currentUrl,
      first: 10,
      after: null,
    },
  });

  const userId = getItem('id') as string;
  const storedRole = getItem('role') as string | null;
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  const mapNodeToEvent = (node: IEventEdge['node']): InterfaceEvent => {
    return {
      id: node.id,
      name: node.name,
      description: node.description || '',
      startAt: node.startAt,
      endAt: node.endAt,
      startDate: node.startDate,
      endDate: node.endDate,
      startTime: node.allDay
        ? null
        : node.startAt
          ? dayjs(node.startAt).format('HH:mm:ss')
          : null,
      endTime: node.allDay
        ? null
        : node.endAt
          ? dayjs(node.endAt).format('HH:mm:ss')
          : null,
      allDay: node.allDay,
      location: node.location || '',
      isPublic: node.isPublic,
      isRegisterable: node.isRegisterable,
      isRecurringEventTemplate: node.isRecurringEventTemplate,
      baseEvent: node.baseEvent,
      sequenceNumber: node.sequenceNumber,
      totalCount: node.totalCount,
      hasExceptions: node.hasExceptions,
      progressLabel: node.progressLabel,
      recurrenceDescription: node.recurrenceDescription,
      recurrenceRule: node.recurrenceRule,
      creator: {
        id: node.creator?.id || '',
        name: node.creator?.name || '',
      },
      attendees: node.attendees || [],
      isInviteOnly: Boolean(node.isInviteOnly),
    };
  };

  // Normalize event data for EventCalendar with proper typing
  const allEvents: InterfaceEvent[] = isMonthView
    ? (monthPreviewData?.organization?.eventsPreview || []).flatMap(
        (day: IEventsPreviewDay) =>
          (day.events || []).map((eventNode) => mapNodeToEvent(eventNode)),
      )
    : (detailedEventData?.organization?.events?.edges || []).map(
        (edge: IEventEdge) => mapNodeToEvent(edge.node),
      );

  const monthDayHasMoreMap: Record<string, boolean> = useMemo(() => {
    if (!isMonthView) {
      return {};
    }

    return (monthPreviewData?.organization?.eventsPreview || []).reduce(
      (acc: Record<string, boolean>, day: IEventsPreviewDay) => {
        acc[day.date] = day.hasMore;
        return acc;
      },
      {},
    );
  }, [isMonthView, monthPreviewData]);

  // Filter events based on search term (case-insensitive search across name, description, and location)
  const events: InterfaceEvent[] = useMemo(() => {
    if (isMonthView) {
      return allEvents;
    }

    if (!searchByName.trim()) {
      return allEvents;
    }
    const lowerSearchTerm = searchByName.toLowerCase();
    return allEvents.filter((event) => {
      const matchesName = event.name.toLowerCase().includes(lowerSearchTerm);
      const matchesDescription = event.description
        .toLowerCase()
        .includes(lowerSearchTerm);
      const matchesLocation = event.location
        .toLowerCase()
        .includes(lowerSearchTerm);
      return matchesName || matchesDescription || matchesLocation;
    });
  }, [allEvents, searchByName]);

  // Filter events based on the active tab (Upcoming/Past/Recurring)
  const filteredEvents: InterfaceEvent[] = useMemo(() => {
    if (eventFilter === 'upcoming') {
      return events.filter((event) => {
        const start = event.startAt
          ? dayjs(event.startAt)
          : event.startDate
            ? dayjs(event.startDate)
            : null;
        return start && start.isAfter(dayjs());
      });
    }
    if (eventFilter === 'past') {
      return events.filter((event) => {
        const start = event.startAt
          ? dayjs(event.startAt)
          : event.startDate
            ? dayjs(event.startDate)
            : null;
        return start && start.isBefore(dayjs());
      });
    }
    if (eventFilter === 'recurring') {
      return events.filter((event) => event.isRecurringEventTemplate);
    }
    return events;
  }, [events, eventFilter]);

  useEffect(() => {
    // Only navigate away for serious errors, not for empty results or month navigation
    if (eventDataError || orgDataError) {
      // Handle rate limiting errors more gracefully - check multiple variations
      const isRateLimitError =
        eventDataError?.message?.toLowerCase().includes('too many requests') ||
        eventDataError?.message?.toLowerCase().includes('rate limit') ||
        eventDataError?.message?.includes('Please try again later');

      if (isRateLimitError) {
        // Just suppress rate limit errors silently
        return;
      }

      // For other errors (like empty results), just log them but don't redirect
      console.warn('Non-critical error in events page:', {
        eventDataError: eventDataError?.message,
        orgDataError: orgDataError?.message,
      });
    }
  }, [eventDataError, orgDataError]);

  // Color palettes for event date strips
  const dateStripColors = [
    'linear-gradient(135deg, #3ecf8e, #15803d)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #a855f7, #7c3aed)',
    'linear-gradient(135deg, #f97316, #ea580c)',
    'linear-gradient(135deg, #6b7280, #4b5563)',
  ];

  return (
    <LoadingState isLoading={orgLoading} variant="spinner" size="lg">
      <>
        <SafeBreadcrumbs
          items={[
            {
              translationKey: 'organization',
              to: `/admin/orgdash/${currentUrl}`,
            },
            {
              translationKey: 'events',
              isCurrent: true,
            },
          ]}
        />
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">
              {t('title')} <span className="count-badge">{events.length}</span>
            </h1>
            <p className="page-subtitle">{t('searchEventName')}</p>
          </div>
          <div className="page-header-actions">
            <Button
              variant="toolbar"
              onClick={createEventModal.open}
              data-testid="createEventModalBtn"
              data-cy="createEventModalBtn"
              className="btn btn-primary"
            >
              + {t('createEvent')}
            </Button>
          </div>
        </div>

        <div className="tabs" role="tablist">
          <button
            className={`tab ${eventFilter === 'upcoming' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'upcoming'}
            onClick={() => setEventFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`tab ${eventFilter === 'past' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'past'}
            onClick={() => setEventFilter('past')}
          >
            Past
          </button>
          <button
            className={`tab ${eventFilter === 'recurring' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'recurring'}
            onClick={() => setEventFilter('recurring')}
          >
            Recurring
          </button>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'calendar' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('calendar')}
            data-testid="viewToggleCalendar"
          >
            Calendar View
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'cards' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('cards')}
            data-testid="viewToggleCards"
          >
            Card View
          </button>
        </div>

        <div className="toolbar">
          <div className="search-bar">
            <span className="search-icon">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search events..."
              aria-label="Search events"
              data-testid="searchEvent"
              value={searchByName}
              onChange={(e) => setSearchByName(e.target.value)}
            />
          </div>
        </div>

        {viewMode === 'cards' &&
          (eventLoading ? (
            <div className="empty-state">
              <p className="empty-state-text">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <p className="empty-state-title">No events found</p>
              <p className="empty-state-text">
                Try a different filter or create a new event.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredEvents.map((event, index) => {
                const start = event.startAt
                  ? dayjs(event.startAt)
                  : event.startDate
                    ? dayjs(event.startDate)
                    : null;
                const end = event.endAt
                  ? dayjs(event.endAt)
                  : event.endDate
                    ? dayjs(event.endDate)
                    : null;
                const monthLabel = start ? start.format('MMM') : '';
                const dayLabel = start ? start.format('DD') : '';
                const dateRange =
                  start && end
                    ? `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
                    : start
                      ? start.format('MMM D, YYYY')
                      : '';
                const colorIndex = index % dateStripColors.length;
                const attendeeCount = event.attendees?.length ?? 0;
                const isUpcoming =
                  start && start.isAfter(dayjs()) ? true : false;

                return (
                  <div className="event-card" key={event.id}>
                    <div
                      className="event-date-strip"
                      style={{
                        background: dateStripColors[colorIndex],
                      }}
                    >
                      <div className="month">{monthLabel}</div>
                      <div className="day">{dayLabel}</div>
                    </div>
                    <div className="event-card-body">
                      <div className="event-card-title">{event.name}</div>
                      <div className="event-card-detail">
                        <span className="event-card-detail-icon">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                        </span>{' '}
                        {dateRange}
                      </div>
                      {event.location && (
                        <div className="event-card-detail">
                          <span className="event-card-detail-icon">
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </span>{' '}
                          {event.location}
                        </div>
                      )}
                      <div className="event-card-footer">
                        <span className="attendee-badge">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              verticalAlign: '-2px',
                              marginRight: '2px',
                            }}
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>{' '}
                          {attendeeCount} attendees
                        </span>
                        <span
                          className={`badge ${isUpcoming ? 'badge-green' : 'badge-gray'}`}
                        >
                          {isUpcoming ? 'Upcoming' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {viewMode === 'calendar' && (
          <EventCalendar
            eventData={events}
            refetchEvents={refetchEvents}
            orgData={orgData?.organization}
            userId={userId}
            userRole={userRole}
            viewType={viewType}
            dayEventsResetKey={dayEventsResetKey}
            dayHasMoreMap={monthDayHasMoreMap}
            isMonthChangeDisabled={isMonthChangeDisabled}
            onMonthChange={handleMonthChange}
            onCurrentDateChange={handleCurrentDateChange}
            currentMonth={currentMonth}
            currentYear={currentYear}
            currentDateOfMonth={currentDateOfMonth}
          />
        )}

        <CreateEventModal
          isOpen={createEventModal.isOpen}
          onClose={createEventModal.close}
          onEventCreated={refetchEvents}
          currentUrl={currentUrl || ''}
        />
      </>
    </LoadingState>
  );
}

export default organizationEvents;
