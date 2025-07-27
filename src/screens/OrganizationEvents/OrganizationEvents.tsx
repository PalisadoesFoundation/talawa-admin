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
import { debounce } from '@mui/material';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import styles from '../../style/app-fixed.module.css';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import CreateEventModal from './CreateEventModal';

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

  document.title = t('title');
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [debouncedMonth, setDebouncedMonth] = useState(new Date().getMonth());
  const [debouncedYear, setDebouncedYear] = useState(new Date().getFullYear());
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  const showInviteModal = (): void => setCreateEventmodalisOpen(true);
  const hideCreateEventModal = (): void => setCreateEventmodalisOpen(false);

  // Debounced functions for month/year changes
  const debouncedSetMonth = useMemo(
    () => debounce((month: number) => setDebouncedMonth(month), 300),
    [],
  );

  const debouncedSetYear = useMemo(
    () => debounce((year: number) => setDebouncedYear(year), 300),
    [],
  );
  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  const handleMonthChange = (month: number, year: number): void => {
    setCurrentMonth(month);
    setCurrentYear(year);
    debouncedSetMonth(month);
    debouncedSetYear(year);
  };

  const {
    data: eventData,
    loading: eventLoading,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 50,
      after: null,
      startDate: dayjs(new Date(debouncedYear, debouncedMonth, 1))
        .startOf('month')
        .toISOString(),
      endDate: dayjs(new Date(debouncedYear, debouncedMonth, 1))
        .endOf('month')
        .toISOString(),
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
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
  const events: InterfaceEvent[] = (
    eventData?.organization?.events?.edges || []
  ).map((edge: IEventEdge) => ({
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
    // Add recurring event information
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
    attendees: [], // Adjust if attendees are added to schema
  }));

  useEffect(() => {
    if (eventDataError || orgDataError) navigate('/orglist');
  }, [eventDataError, orgDataError]);

  if (eventLoading || orgLoading) return <Loader />;

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
  );
}

export default organizationEvents;
