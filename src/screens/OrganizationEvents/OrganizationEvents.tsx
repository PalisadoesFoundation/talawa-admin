/**
 * OrganizationEvents Component
 *
 * Main screen component for managing and viewing organization events.
 * Provides calendar views (Day, Month, Year) with event filtering based on user permissions.
 * Supports event creation, editing, and real-time updates through GraphQL subscriptions.
 *
 * Key Features:
 * - Multiple calendar view types (Day, Month, Year)
 * - Event caching by month to improve performance
 * - Role-based event visibility (Admin vs Regular users)
 * - Real-time event updates and synchronization
 * - Event creation modal integration
 *
 * @fileoverview Organization Events management screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import styles from '../../style/app-fixed.module.css';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import CreateEventModal from './CreateEventModal';

dayjs.extend(utc);

/**
 * GraphQL edge interface for paginated event results.
 * Represents a single event node with cursor for pagination.
 */
interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    location?: string | null;
    isPublic: boolean;
    isRegisterable: boolean;
    isRecurringEventTemplate?: boolean;
    baseEvent?: {
      id: string;
      name: string;
    } | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    attachments?: Array<{
      url: string;
      mimeType: string;
    }>;
    creator: {
      id: string;
      name: string;
    };
    organization: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  cursor: string;
}

/**
 * Enumeration of available calendar view types.
 * Determines how events are displayed in the calendar component.
 */
export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
  YEAR = 'Year View',
}

/**
 * OrganizationEvents functional component.
 *
 * Manages the main organization events screen with calendar views and event management.
 * Handles event fetching, caching, and display across different time periods.
 *
 * @returns JSX.Element - The rendered organization events screen
 *
 * @example
 * ```tsx
 * // Route usage
 * <Route path="/orgevents/:orgId" element={<OrganizationEvents />} />
 * ```
 */
function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { getItem } = useLocalStorage();

  document.title = t('title');

  // Modal and view state management
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  // Event caching system - stores events by month key to avoid repeated API calls
  const [eventsByMonth, setEventsByMonth] = useState<{
    [key: string]: InterfaceEvent[];
  }>({});

  // Currently displayed events - prevents blank screen during month transitions
  const [displayedEvents, setDisplayedEvents] = useState<InterfaceEvent[]>([]);

  /**
   * Opens the create event modal dialog.
   */
  const showInviteModal = (): void => setCreateEventmodalisOpen(true);

  /**
   * Closes the create event modal dialog.
   */
  const hideCreateEventModal = (): void => setCreateEventmodalisOpen(false);

  /**
   * Handles calendar view type changes (Day, Month, Year).
   * @param item - The selected view type string
   */
  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  /**
   * Generates a unique cache key for storing events by month and year.
   * @param month - Zero-based month index (0-11)
   * @param year - Full year number
   * @returns Cache key string in format "YYYY-M"
   */
  const getMonthKey = (month: number, year: number): string =>
    `${year}-${month}`;

  /**
   * Calculates the date range for a given month and year.
   * Returns ISO string dates for the start and end of the month in UTC.
   * @param month - Zero-based month index (0-11)
   * @param year - Full year number
   * @returns Object with startDate and endDate ISO strings
   */
  const getDateRange = (month: number, year: number) => {
    const startDate = dayjs
      .utc()
      .year(year)
      .month(month)
      .startOf('month')
      .toISOString();
    const endDate = dayjs
      .utc()
      .year(year)
      .month(month)
      .endOf('month')
      .toISOString();
    return { startDate, endDate };
  };

  const {
    data: orgData,
    loading: orgLoading,
    error: orgDataError,
  } = useQuery(GET_ORGANIZATION_DATA_PG, {
    variables: { id: currentUrl, first: 10, after: null },
    skip: !currentUrl,
  });

  // User authentication and role management
  const userId = getItem('id') as string;
  const storedRole = getItem('role') as string | null;
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  /**
   * Transforms GraphQL event data into the internal event interface format.
   * Converts GraphQL edge structure to flat event objects with proper date formatting.
   *
   * @param data - Raw GraphQL response data
   * @returns Array of transformed InterfaceEvent objects
   */
  const transformEvents = (data: any): InterfaceEvent[] => {
    if (!data?.organization?.events?.edges) return [];

    return data.organization.events.edges.map((edge: IEventEdge) => ({
      _id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description || '',
      startDate: dayjs(edge.node.startAt).format('YYYY-MM-DD'),
      endDate: dayjs(edge.node.endAt).format('YYYY-MM-DD'),
      startTime: edge.node.allDay
        ? undefined
        : dayjs(edge.node.startAt).format('HH:mm:ss'),
      endTime: edge.node.allDay
        ? undefined
        : dayjs(edge.node.endAt).format('HH:mm:ss'),
      allDay: edge.node.allDay,
      location: edge.node.location || '',
      isPublic: edge.node.isPublic,
      isRegisterable: edge.node.isRegisterable,
      isRecurringTemplate: edge.node.isRecurringEventTemplate,
      baseEventId: edge.node.baseEvent?.id || null,
      sequenceNumber: edge.node.sequenceNumber,
      totalCount: edge.node.totalCount,
      hasExceptions: edge.node.hasExceptions,
      progressLabel: edge.node.progressLabel,
      creator: {
        _id: edge.node.creator.id,
        name: edge.node.creator.name,
      },
      attendees: [],
    }));
  };

  const { startDate, endDate } = getDateRange(currentMonth, currentYear);

  const {
    loading,
    error: eventError,
    refetch,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 300,
      after: null,
      startDate,
      endDate,
      includeRecurring: true,
    },
    skip: !currentUrl,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const monthKey = getMonthKey(currentMonth, currentYear);
      const transformedEvents = transformEvents(data);

      // Update both cache and display state to prevent blank screens
      setEventsByMonth((prev) => ({
        ...prev,
        [monthKey]: transformedEvents,
      }));
      setDisplayedEvents(transformedEvents);
    },
  });

  /**
   * Handles calendar month/year navigation changes.
   * Implements smart caching - uses cached data immediately if available,
   * otherwise triggers a new API request.
   *
   * @param month - Target month (0-11)
   * @param year - Target year
   */
  const handleMonthChange = useCallback(
    (month: number, year: number): void => {
      const newMonthKey = getMonthKey(month, year);

      // Use cached events if available to prevent blank screen
      if (eventsByMonth[newMonthKey]) {
        setDisplayedEvents(eventsByMonth[newMonthKey]);
      }

      // Update state to trigger API fetch if needed
      setCurrentMonth(month);
      setCurrentYear(year);
    },
    [eventsByMonth],
  );

  /**
   * Refetches events for the current month and updates the display.
   * Used after event creation, editing, or deletion to sync with server state.
   *
   * @returns Promise resolving to the refetch result
   */
  const refetchEvents = useCallback(async () => {
    const result = await refetch();
    return result;
  }, [refetch]);

  /**
   * Handles authentication errors by redirecting to organization list.
   * Monitors both organization data and event query errors.
   */
  useEffect(() => {
    if (orgDataError || eventError) {
      if (
        orgDataError?.message?.includes('Unauthorized') ||
        eventError?.message?.includes('Authentication')
      ) {
        navigate('/orglist');
      }
    }
  }, [orgDataError, eventError, navigate]);

  if (orgLoading && !orgData) return <Loader />;

  return (
    <>
      <div className={styles.mainpageright}>
        <div className={styles.justifyspOrganizationEvents}>
          <EventHeader
            viewType={viewType}
            handleChangeView={handleChangeView}
            showInviteModal={showInviteModal}
          />
        </div>
      </div>
      <div style={{ position: 'relative', minHeight: '400px' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Loader size="sm" />
          </div>
        )}
        <EventCalendar
          eventData={displayedEvents}
          refetchEvents={refetchEvents}
          orgData={orgData?.organization}
          userId={userId}
          userRole={userRole}
          viewType={viewType}
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>

      <CreateEventModal
        isOpen={createEventmodalisOpen}
        onClose={hideCreateEventModal}
        onEventCreated={refetchEvents}
        currentUrl={currentUrl || ''}
      />
    </>
  );
}

export default organizationEvents;
