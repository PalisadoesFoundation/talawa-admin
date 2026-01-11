/**
 * The `events` component is responsible for managing and displaying events for a user portal.
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
 * - `DatePicker` and `TimePicker`: Used for selecting event dates and times.
 *
 * State:
 * - `events`: List of events fetched from the server.
 * - `eventTitle`, `eventDescription`, `eventLocation`: Input fields for event details.
 * - `startAt`, `endAt`: Start and end dates for the event.
 * - `startTime`, `endTime`: Start and end times for the event.
 * - `isPublic`, `isRegisterable`, `isRecurring`, `isAllDay`: Event configuration flags.
 * - `viewType`: Current calendar view type (e.g., month, week).
 * - `createEventModal`: Controls visibility of the event creation modal.
 * - `createChatCheck`: Determines if a chat should be created for the event.
 *
 * Methods:
 * - `createEvent`: Handles the creation of a new event by submitting a GraphQL mutation.
 * - `toggleCreateEventModal`: Toggles the visibility of the event creation modal.
 * - `handleEventTitleChange`, `handleEventLocationChange`, `handleEventDescriptionChange`:
 *   Update respective state variables when input fields change.
 * - `handleChangeView`: Updates the calendar view type.
 *
 * Hooks:
 * - `useQuery`: Fetches events and organization details.
 * - `useMutation`: Executes the event creation mutation.
 * - `useLocalStorage`: Retrieves user details from local storage.
 * - `useEffect`: Updates the event list when query data changes.
 *
 * @returns The rendered events component.
 *
 * @example
 * ```tsx
 * <Events />
 * ```
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
import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import type { IEventEdge, ICreateEventInput } from 'types/Event/interface';
import styles from 'style/app-fixed.module.css';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import DateRangePicker from 'shared-components/DateRangePicker/DateRangePicker';

export default function Events(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  const [viewType, setViewType] = React.useState<ViewType>(ViewType.MONTH);
  const [createEventModal, setCreateEventmodalisOpen] = React.useState(false);
  const { orgId: organizationId } = useParams();
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate(),
  });

  const calendarMonth = React.useMemo(() => {
    if (!dateRange.startDate) return new Date().getMonth();
    return dayjs(dateRange.startDate).month();
  }, [dateRange.startDate]);

  const calendarYear = React.useMemo(() => {
    if (!dateRange.startDate) return new Date().getFullYear();
    return dayjs(dateRange.startDate).year();
  }, [dateRange.startDate]);

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
      startAt: dateRange.startDate
        ? dayjs(dateRange.startDate).startOf('day').toISOString()
        : null,
      endAt: dateRange.endDate
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
  const [create] = useMutation(CREATE_EVENT_MUTATION);

  // Get user details from local storage
  const userId = getItem('id') as string;

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

      const { data: createEventData } = await create({
        variables: { input },
      });
      if (createEventData) {
        NotificationToast.success(t('eventCreated') as string);
        refetch();
        setFormResetKey((prev) => prev + 1);
        setCreateEventmodalisOpen(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const toggleCreateEventModal = (): void =>
    setCreateEventmodalisOpen(!createEventModal);

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
      attendees: [], // Adjust if attendees are added to schema
    }),
  ); // Handle errors gracefully
  React.useEffect(() => {
    if (eventDataError) {
      // Handle rate limiting errors more gracefully - check multiple variations
      const isRateLimitError =
        eventDataError.message?.toLowerCase().includes('too many requests') ||
        eventDataError.message?.toLowerCase().includes('rate limit') ||
        eventDataError.message?.includes('Please try again later');

      if (isRateLimitError) {
        // Just suppress rate limit errors silently
        return;
      }

      // For other errors (like empty results), handle them properly
      errorHandler(t, eventDataError);
    }
  }, [eventDataError, t]);

  /**
   * Shows the modal for creating a new event.
   *
   * @returns Void.
   */

  const showInviteModal = (): void => {
    setCreateEventmodalisOpen(true);
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
      />

      {/* <div className="mt-4"> */}
      <EventCalendar
        viewType={viewType}
        eventData={events}
        refetchEvents={refetch}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        onMonthChange={() => {}}
        currentMonth={calendarMonth}
        currentYear={calendarYear}
      />
      {/* </div> */}
      <Modal show={createEventModal} onHide={toggleCreateEventModal}>
        <Modal.Header>
          <p className={styles.titlemodalOrganizationEvents}>
            {t('eventDetails')}
          </p>
          <Button
            variant="danger"
            onClick={toggleCreateEventModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            key={formResetKey}
            initialValues={defaultEventValues}
            onSubmit={handleCreateEvent}
            onCancel={toggleCreateEventModal}
            submitLabel={t('createEvent')}
            t={t}
            tCommon={tCommon}
            showCreateChat
            showRegisterable
            showPublicToggle
            showRecurrenceToggle
          />
        </Modal.Body>
      </Modal>

      {/* </div> */}
    </>
  );
}
