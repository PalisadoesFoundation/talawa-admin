/**
 * The `Events` component is responsible for managing and displaying events for a user portal.
 * It includes functionality for creating, viewing, and managing events within an organization.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and modals.
 * - Uses `dayjs` for date and time manipulation.
 * - Includes localization support via `react-i18next`.
 *
 * Dependencies:
 * - `EventCalendar`: Displays events in a calendar view.
 * - `EventHeader`: Provides controls for calendar view and event creation.
 * - `DateRangePicker`: Used for selecting arbitrary event date ranges.
 * - `EventForm`: Form component for event creation with validation.
 *
 * State:
 * - `dateRange`: Selected date range with `startDate` and `endDate` controlling event queries.
 * - `viewType`: Current calendar view type (e.g., month, week).
 * - `createEventModal`: Controls visibility of the event creation modal.
 * - `formResetKey`: Key used to reset the event form after successful creation.
 * Computed Values:
 * - `calendarMonth`: Derived from `dateRange.startDate` for calendar display.
 * - `calendarYear`: Derived from `dateRange.startDate` for calendar display.
 *
 * Methods:
 * - `handleCreateEvent`: Handles the creation of a new event by submitting a GraphQL mutation.
 * - `closeCreateEventModal`: Closes the event creation modal.
 * - `showInviteModal`: Opens the event creation modal.
 * - `handleChangeView`: Updates the calendar view type.
 *
 * Hooks:
 * - `useQuery`: Fetches events and organization details.
 * - `useMutation`: Executes the event creation mutation.
 * - `useLocalStorage`: Retrieves user details from local storage.
 * - `useEffect`: Handles error logging for event query failures (rate-limit aware).
 *
 * @returns The rendered events component.
 *
 * @example
 * ```tsx
 * // Returns current month/year
 * const { month, year } = computeCalendarFromStartDate(null);
 *
 * // Returns June 2025 (month = 5)
 * const { month, year } = computeCalendarFromStartDate(new Date(2025, 5, 15));
 * ```
 * <Events />
 *
 */
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import {
  ORGANIZATIONS_LIST,
  GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
} from 'GraphQl/Queries/Queries';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';

import {
  CRUDModalTemplate,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import type { IEventEdge, ICreateEventInput } from 'types/Event/interface';
import styles from './Events.module.css';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import DateRangePicker from 'shared-components/DateRangePicker/DateRangePicker';

import type { IDateRangePreset } from 'types/shared-components/DateRangePicker/interface';
dayjs.extend(utc);

export function computeCalendarFromStartDate(
  startDate: Date | null,
  refDate: Date = new Date(),
): {
  month: number;
  year: number;
} {
  if (!startDate) {
    const now = dayjs(refDate);
    return {
      month: now.month(),
      year: now.year(),
    };
  }

  const d = dayjs(startDate);
  return {
    month: d.month(),
    year: d.year(),
  };
}

export default function Events(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  // Define date presets using translations (inside component to access t)
  const datePresets: IDateRangePreset[] = React.useMemo(
    () => [
      {
        key: 'today',
        label: t('presetToday'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        }),
      },
      {
        key: 'thisWeek',
        label: t('presetThisWeek'),
        getRange: () => ({
          startDate: dayjs().startOf('week').toDate(),
          endDate: dayjs().endOf('week').toDate(),
        }),
      },
      {
        key: 'thisMonth',
        label: t('presetThisMonth'),
        getRange: () => ({
          startDate: dayjs().startOf('month').toDate(),
          endDate: dayjs().endOf('month').toDate(),
        }),
      },
      {
        key: 'next7Days',
        label: t('presetNext7Days'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().add(7, 'days').endOf('day').toDate(),
        }),
      },
      {
        key: 'next30Days',
        label: t('presetNext30Days'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().add(30, 'days').endOf('day').toDate(),
        }),
      },
      {
        key: 'nextMonth',
        label: t('presetNextMonth'),
        getRange: () => ({
          startDate: dayjs().add(1, 'month').startOf('month').toDate(),
          endDate: dayjs().add(1, 'month').endOf('month').toDate(),
        }),
      },
    ],
    [t],
  );

  const [viewType, setViewType] = React.useState<ViewType>(ViewType.MONTH);
  const createEventModal = useModalState();
  const { orgId: organizationId } = useParams();
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate(),
  });
  // Defensive fallback: startDate is typed as nullable, but is always initialized
  // and cannot be set to null via DateRangePicker in normal usage.
  // Kept for future-proofing; null handling is covered at the utility level
  // (computeCalendarFromStartDate) to avoid unrealistic UI scenarios.
  const { month: calendarMonth, year: calendarYear } = React.useMemo(
    () => computeCalendarFromStartDate(dateRange.startDate, new Date()),
    [dateRange.startDate],
  );

  // Query to fetch events for the organization
  const {
    data,
    error: eventDataError,
    refetch,
  } = useQuery(GET_ORGANIZATION_EVENTS_USER_PORTAL_PG, {
    variables: {
      id: organizationId,
      first: 100,
      after: null,
      startDate: dateRange.startDate
        ? dayjs(dateRange.startDate).startOf('day').toISOString()
        : null,
      endDate: dateRange.endDate
        ? dayjs(dateRange.endDate).endOf('day').toISOString()
        : null,
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Query to fetch organization details
  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: organizationId },
  });

  // Mutation to create a new event
  const [create] = useMutation(CREATE_EVENT_MUTATION, {
    errorPolicy: 'all',
  });

  // Get user details from local storage
  // Get user details from local storage
  const userId = (getItem('userId') || getItem('id') || '') as string;

  const storedRole = getItem('role') as string | null;
  const userRole = storedRole === 'administrator' ? 'ADMINISTRATOR' : 'REGULAR';

  const defaultEventValues = React.useMemo<IEventFormValues>(
    () => ({
      name: '',
      description: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '08:00:00',
      endTime: '10:00:00',
      allDay: true,
      isPublic: false,
      isInviteOnly: true,
      isRegisterable: true,
      recurrenceRule: null,
      createChat: false,
    }),
    [],
  );
  const [formResetKey, setFormResetKey] = React.useState(0);

  const handleCreateEvent = async (
    payload: IEventFormSubmitPayload,
  ): Promise<void> => {
    try {
      const recurrenceInput = payload.recurrenceRule
        ? formatRecurrenceForPayload(payload.recurrenceRule, payload.startDate)
        : undefined;

      // Build input object with shared typed interface
      const input: ICreateEventInput = {
        name: payload.name,
        startAt: payload.startAtISO,
        endAt: payload.endAtISO,
        organizationId,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
        isInviteOnly: payload.isInviteOnly,
        ...(payload.description && { description: payload.description }),
        ...(payload.location && { location: payload.location }),
        ...(recurrenceInput && { recurrence: recurrenceInput }),
      };

      const { data: createEventData, errors } = await create({
        variables: { input },
      });

      // Handle partial success: prioritize data over errors
      // If createEventData exists, treat as success even if errors are present
      // This handles GraphQL partial success scenarios where mutation succeeds
      // but some non-critical fields may have issues
      if (createEventData) {
        NotificationToast.success(t('eventCreated') as string);
        try {
          await refetch();
        } catch {
          // Refetch failure is non-critical, suppressing error
        }
        setFormResetKey((prev) => prev + 1);
        createEventModal.close();
      } else if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const closeCreateEventModal = (): void => createEventModal.close();

  // Normalize event data for EventCalendar with proper typing
  const events = (data?.organization?.events?.edges || []).map(
    (edge: IEventEdge) => ({
      id: edge.node.id || '',

      name: edge.node.name || '',
      description: edge.node.description || '',
      startAt: dayjs.utc(edge.node.startAt).format('YYYY-MM-DD'),
      endAt: dayjs.utc(edge.node.endAt).format('YYYY-MM-DD'),
      startTime: edge.node.allDay
        ? null
        : dayjs.utc(edge.node.startAt).format('HH:mm:ss'),
      endTime: edge.node.allDay
        ? null
        : dayjs.utc(edge.node.endAt).format('HH:mm:ss'),
      allDay: edge.node.allDay,
      location: edge.node.location || '',
      isPublic: edge.node.isPublic,
      isRegisterable: edge.node.isRegisterable,
      isInviteOnly: edge.node.isInviteOnly,
      // Add recurring event information
      isRecurringEventTemplate: edge.node.isRecurringEventTemplate,
      baseEvent: edge.node.baseEvent,
      sequenceNumber: edge.node.sequenceNumber,
      totalCount: edge.node.totalCount,
      hasExceptions: edge.node.hasExceptions,
      progressLabel: edge.node.progressLabel,
      recurrenceDescription: edge.node.recurrenceDescription,
      recurrenceRule: edge.node.recurrenceRule,
      creator: edge.node.creator || {
        id: '',
        name: '',
      },
      attendees: edge.node.attendees || [],
    }),
  ); // Handle errors gracefully
  React.useEffect(() => {
    if (eventDataError) {
      // Check if we have valid data (partial data scenario)
      const hasData =
        Array.isArray(data?.organization?.events?.edges) &&
        data.organization.events.edges.length > 0;

      // Handle rate limiting and auth errors
      const errorMessage = eventDataError.message?.toLowerCase() || '';
      const isRateLimitError =
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate limit') ||
        eventDataError.message?.includes('Please try again later');
      const isAuthError = errorMessage.includes('not authorized');

      // Suppress rate limit errors or auth errors if we have partial data
      if (isRateLimitError || (isAuthError && hasData)) {
        return;
      }

      // For other errors (like empty results), handle them properly
      errorHandler(t, eventDataError);
    }
  }, [eventDataError, data, t]);

  /**
   * Shows the modal for creating a new event.
   *
   * @returns Void.
   */

  const showInviteModal = (): void => {
    createEventModal.open();
  };

  /**
   * Updates the calendar view type.
   *
   * @param item - The view type to set, or null to reset.
   * @returns Void.
   */
  const handleChangeView = (item: string | null): void => {
    if (item) {
      setViewType(item as ViewType);
    }
  };

  return (
    <>
      {/* <div className={`d-flex flex-row`}> */}
      <div className={styles.mainpageright}>
        <div className={`${styles.justifyspOrganizationEvents}`}>
          <EventHeader
            viewType={viewType}
            showInviteModal={showInviteModal}
            handleChangeView={handleChangeView}
          />
        </div>
      </div>

      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        dataTestId="events-date-range"
        showPresets
        presets={datePresets}
      />

      {/* <div className="mt-4"> */}
      <EventCalendar
        viewType={viewType}
        eventData={events}
        refetchEvents={refetch}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        onMonthChange={(month, year) => {
          // month assumed 0-indexed (align with Date.getMonth / dayjs().month()).
          const start = dayjs(new Date(year, month, 1))
            .startOf('month')
            .toDate();
          const end = dayjs(new Date(year, month, 1))
            .endOf('month')
            .toDate();
          setDateRange({ startDate: start, endDate: end });
        }}
        currentMonth={calendarMonth}
        currentYear={calendarYear}
      />
      {/* </div> */}
      <CRUDModalTemplate
        open={createEventModal.isOpen}
        onClose={closeCreateEventModal}
        title={t('eventDetails')}
        data-testid="createEventModal"
        showFooter={false}
      >
        <EventForm
          key={formResetKey}
          initialValues={defaultEventValues}
          onSubmit={handleCreateEvent}
          onCancel={closeCreateEventModal}
          submitLabel={t('createEvent')}
          t={t}
          tCommon={tCommon}
          showCreateChat
          showRegisterable
          showPublicToggle
          showRecurrenceToggle
        />
      </CRUDModalTemplate>

      {/* </div> */}
    </>
  );
}
