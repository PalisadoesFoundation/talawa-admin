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
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import styles from './OrganizationEvents.module.css';
import {
  GET_ORGANIZATION_EVENTS_PG,
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
import PageHeader from 'shared-components/Navbar/Navbar';
import { Button } from 'shared-components/Button';
import AddIcon from '@mui/icons-material/Add';

// Define the type for an event edge
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

export enum ViewType {
  DAY = 'Day',
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
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [searchByName, setSearchByName] = useState('');
  const { orgId: currentUrl } = useParams();

  const showInviteModal = (): void => setCreateEventmodalisOpen(true);
  const hideCreateEventModal = (): void => setCreateEventmodalisOpen(false);

  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  const handleMonthChange = (month: number, year: number): void => {
    setCurrentMonth(month);
    setCurrentYear(year);
    // No manual refetch - let useQuery handle it automatically with cache-first policy
  };

  const {
    data: eventData,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 100,
      after: null,
      startDate: dayjs(new Date(currentYear, currentMonth, 1))
        .startOf('month')
        .toISOString(),
      endDate: dayjs(new Date(currentYear, currentMonth, 1))
        .endOf('month')
        .toISOString(),
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

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

  // Normalize event data for EventCalendar with proper typing
  const allEvents: InterfaceEvent[] = (
    eventData?.organization?.events?.edges || []
  ).map((edge: IEventEdge) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description || '',
    startAt: edge.node.startAt,
    endAt: edge.node.endAt,
    startTime: edge.node.allDay
      ? null
      : dayjs(edge.node.startAt).format('HH:mm:ss'),
    endTime: edge.node.allDay
      ? null
      : dayjs(edge.node.endAt).format('HH:mm:ss'),
    allDay: edge.node.allDay,
    location: edge.node.location || '',
    isPublic: edge.node.isPublic,
    isRegisterable: edge.node.isRegisterable,
    // Add recurring event information
    isRecurringEventTemplate: edge.node.isRecurringEventTemplate,
    baseEvent: edge.node.baseEvent,
    sequenceNumber: edge.node.sequenceNumber,
    totalCount: edge.node.totalCount,
    hasExceptions: edge.node.hasExceptions,
    progressLabel: edge.node.progressLabel,
    recurrenceDescription: edge.node.recurrenceDescription,
    recurrenceRule: edge.node.recurrenceRule,
    creator: {
      id: edge.node.creator.id,
      name: edge.node.creator.name,
    },
    attendees: [], // Adjust if attendees are added to schema
  }));

  // Filter events based on search term (case-insensitive search across name, description, and location)
  const events: InterfaceEvent[] = useMemo(() => {
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
        <div className={styles.mainpageright}>
          <div className={styles.justifyspOrganizationEvents}>
            <PageHeader
              search={{
                placeholder: t('searchEventName'),
                onSearch: (value: string) => {
                  setSearchByName(value);
                },
                inputTestId: 'searchEvent',
                buttonTestId: 'searchButton',
              }}
              sorting={[
                {
                  title: t('viewType'),
                  selected: viewType,
                  options: [
                    { label: ViewType.MONTH, value: ViewType.MONTH },
                    { label: ViewType.DAY, value: ViewType.DAY },
                    { label: ViewType.YEAR, value: ViewType.YEAR },
                  ],
                  onChange: (value) => handleChangeView(value.toString()),
                  testIdPrefix: 'selectViewType',
                },
              ]}
              showEventTypeFilter={true}
              actions={
                <Button
                  className={styles.dropdown}
                  onClick={showInviteModal}
                  data-testid="createEventModalBtn"
                  data-cy="createEventModalBtn"
                >
                  <div>
                    <AddIcon className={styles.addIconStyle} />
                    <span>{t('createEvent')}</span>
                  </div>
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
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />

        <CreateEventModal
          isOpen={createEventmodalisOpen}
          onClose={hideCreateEventModal}
          onEventCreated={refetchEvents}
          currentUrl={currentUrl || ''}
        />
      </>
    </LoadingState>
  );
}

export default organizationEvents;
