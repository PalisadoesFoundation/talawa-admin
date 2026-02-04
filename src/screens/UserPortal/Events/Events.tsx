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
 * - `EventForm`: Form component for event creation with validation.
 *
 * State:
 * - `currentMonth`: Current month for calendar display.
 * - `currentYear`: Current year for calendar display.
 * - `viewType`: Current calendar view type (e.g., month, week).
 * - `createEventModal`: Controls visibility of the event creation modal.
 * - `formResetKey`: Key used to reset the event form after successful creation.
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
dayjs.extend(utc);

export default function Events(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();


  const [viewType, setViewType] = React.useState<ViewType>(ViewType.MONTH);
  const createEventModal = useModalState();
  const { orgId: organizationId } = useParams();
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

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

      <EventCalendar
        viewType={viewType}
        eventData={events}
        refetchEvents={refetch}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        onMonthChange={(month, year) => {
          setCurrentMonth(month);
          setCurrentYear(year);
        }}
        currentMonth={currentMonth}
        currentYear={currentYear}
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
