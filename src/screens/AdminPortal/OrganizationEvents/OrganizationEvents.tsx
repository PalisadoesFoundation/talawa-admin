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

import React, { useState, useEffect, useMemo, JSX } from 'react';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import styles from './OrganizationEvents.module.css';
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
import Toolbar from 'shared-components/Toolbar/Toolbar';
import { Button } from 'shared-components/Button';
import AddIcon from '@mui/icons-material/Add';
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
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
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

  const handleChangeView = (item: string | number): void => {
    setViewType(item as ViewType);
  };

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

  const isMonthView = viewType === ViewType.MONTH;

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

  const detailedFirst =
    viewType === ViewType.DAY ? 40 : viewType === ViewType.WEEK ? 80 : 120;

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
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
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
        <div className={styles.mainpageright}>
          <div className={styles.justifyspOrganizationEvents}>
            <Toolbar
              search={{
                placeholder: t('searchEventName'),
                onSearch: (value: string) => {
                  setSearchByName(value);
                },
                inputTestId: 'searchEvent',
                buttonTestId: 'searchButton',
              }}
              filters={[
                {
                  type: 'sort',
                  title: t('viewType'),
                  selected: viewType,
                  options: [
                    { label: t('selectMonth'), value: ViewType.MONTH },
                    { label: t('selectWeek'), value: ViewType.WEEK },
                    { label: t('selectDay'), value: ViewType.DAY },
                    { label: t('selectYear'), value: ViewType.YEAR },
                  ],
                  onChange: (value) => handleChangeView(value.toString()),
                  testIdPrefix: 'selectViewType',
                },
              ]}
              actions={
                <Button
                  variant="toolbar"
                  onClick={createEventModal.open}
                  data-testid="createEventModalBtn"
                  data-cy="createEventModalBtn"
                >
                  <AddIcon className={styles.addIconStyle} />
                  <span>{t('createEvent')}</span>
                </Button>
              }
            />
          </div>
        </div>
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
