/**
 * The `events` component is responsible for managing and displaying events for a user portal.
 * It includes functionality for creating, viewing, and managing events within an organization.
 *
 * @component
 * @returns {JSX.Element} The rendered events component.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and modals.
 * - Uses `dayjs` for date and time manipulation.
 * - Includes localization support via `react-i18next`.
 *
 * @dependencies
 * - `EventCalendar`: Displays events in a calendar view.
 * - `EventHeader`: Provides controls for calendar view and event creation.
 * - `DatePicker` and `TimePicker`: Used for selecting event dates and times.
 *
 * @state
 * - `events`: List of events fetched from the server.
 * - `eventTitle`, `eventDescription`, `eventLocation`: Input fields for event details.
 * - `startAt`, `endAt`: Start and end dates for the event.
 * - `startTime`, `endTime`: Start and end times for the event.
 * - `isPublic`, `isRegisterable`, `isRecurring`, `isAllDay`: Event configuration flags.
 * - `viewType`: Current calendar view type (e.g., month, week).
 * - `createEventModal`: Controls visibility of the event creation modal.
 * - `createChatCheck`: Determines if a chat should be created for the event.
 *
 * @methods
 * - `createEvent`: Handles the creation of a new event by submitting a GraphQL mutation.
 * - `toggleCreateEventModal`: Toggles the visibility of the event creation modal.
 * - `handleEventTitleChange`, `handleEventLocationChange`, `handleEventDescriptionChange`:
 *   Update respective state variables when input fields change.
 * - `handleChangeView`: Updates the calendar view type.
 *
 * @hooks
 * - `useQuery`: Fetches events and organization details.
 * - `useMutation`: Executes the event creation mutation.
 * - `useLocalStorage`: Retrieves user details from local storage.
 * - `useEffect`: Updates the event list when query data changes.
 *
 * @example
 * ```tsx
 * <Events />
 * ```
 */
import { useMutation, useQuery } from '@apollo/client';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATIONS_LIST,
  GET_ORGANIZATION_EVENTS_USER_PORTAL_PG,
} from 'GraphQl/Queries/Queries';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import type { IEventEdge } from 'types/Event/interface';
import styles from 'style/app-fixed.module.css';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export default function events(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  // State variables to manage event details and UI
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');
  const [startAt, setStartAt] = React.useState<Date | null>(new Date());
  const [endAt, setEndAt] = React.useState<Date | null>(new Date());
  const [isPublic, setIsPublic] = React.useState(true);
  const [isRegisterable, setIsRegisterable] = React.useState(true);
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [isAllDay, setIsAllDay] = React.useState(true);
  const [startTime, setStartTime] = React.useState('08:00:00');
  const [endTime, setEndTime] = React.useState('10:00:00');
  const [viewType, setViewType] = React.useState<ViewType>(ViewType.MONTH);
  const [createEventModal, setCreateEventmodalisOpen] = React.useState(false);
  const [createChatCheck, setCreateChatCheck] = React.useState(false);
  const { orgId: organizationId } = useParams();
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear(),
  );
  const onMonthChange = (month: number, year: number): void => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Query to fetch events for the organization
  const {
    data,
    error: eventDataError,
    refetch,
  } = useQuery(GET_ORGANIZATION_EVENTS_USER_PORTAL_PG, {
    variables: {
      id: organizationId,
      first: 150,
      after: null,
      startAt: dayjs(new Date(currentYear, currentMonth, 1))
        .startOf('month')
        .toISOString(),
      endAt: dayjs(new Date(currentYear, currentMonth, 1))
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
  const [create] = useMutation(CREATE_EVENT_MUTATION);

  // Get user details from local storage
  const userId = getItem('id') as string;

  const storedRole = getItem('role') as string | null;
  const userRole = storedRole === 'administrator' ? 'ADMINISTRATOR' : 'REGULAR';

  /**
   * Handles the form submission for creating a new event.
   *
   * @param e - The form submit event.
   * @returns A promise that resolves when the event is created.
   */
  const createEvent = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const startTimeParts = startTime.split(':');
      const endTimeParts = endTime.split(':');

      const input = {
        name: eventTitle,
        description: eventDescription,
        startAt: isAllDay
          ? dayjs(startAt).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          : dayjs(startAt)
              .hour(parseInt(startTimeParts[0]))
              .minute(parseInt(startTimeParts[1]))
              .second(parseInt(startTimeParts[2]))
              .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        endAt: isAllDay
          ? dayjs(endAt).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          : dayjs(endAt)
              .hour(parseInt(endTimeParts[0]))
              .minute(parseInt(endTimeParts[1]))
              .second(parseInt(endTimeParts[2]))
              .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        organizationId,
        allDay: isAllDay,
        location: eventLocation,
        isPublic,
        isRegisterable,
        // Note: recurrence and createChat might need to be handled differently
      };

      const { data: createEventData } = await create({
        variables: { input },
      });
      if (createEventData) {
        toast.success(t('eventCreated') as string);
        refetch();
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setStartAt(new Date());
        setEndAt(new Date());
        setStartTime('08:00:00');
        setEndTime('10:00:00');
      }
      setCreateEventmodalisOpen(false);
    } catch (error: unknown) {
      console.error('create event error', error);
      errorHandler(t, error);
    }
  };

  /**
   * Toggles the visibility of the event creation modal.
   *
   * @returns Void.
   */
  const toggleCreateEventModal = (): void =>
    setCreateEventmodalisOpen(!createEventModal);

  /**
   * Updates the event title state when the input changes.
   *
   * @param event - The input change event.
   * @returns Void.
   */
  const handleEventTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventTitle(event.target.value);
  };

  /**
   * Updates the event location state when the input changes.
   *
   * @param event - The input change event.
   * @returns Void.
   */
  const handleEventLocationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventLocation(event.target.value);
  };

  /**
   * Updates the event description state when the input changes.
   *
   * @param event - The input change event.
   * @returns Void.
   */
  const handleEventDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventDescription(event.target.value);
  };

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

      // For other errors (like empty results), just log them but don't redirect
      console.warn('Non-critical error in user events page:', {
        eventDataError: eventDataError.message,
      });
    }
  }, [eventDataError]);

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
      {/* <div className="mt-4"> */}
      <EventCalendar
        viewType={viewType}
        eventData={events}
        refetchEvents={refetch}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        onMonthChange={onMonthChange}
        currentMonth={currentMonth}
        currentYear={currentYear}
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
          <Form onSubmitCapture={createEvent}>
            <label htmlFor="eventtitle">{t('eventName')}</label>
            <Form.Control
              type="title"
              id="eventitle"
              placeholder={t('enterName')}
              autoComplete="off"
              required
              value={eventTitle}
              className={styles.inputField}
              onChange={handleEventTitleChange}
              data-testid="eventTitleInput"
            />
            <label htmlFor="eventdescrip">{tCommon('description')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              placeholder={t('enterDescription')}
              autoComplete="off"
              required
              value={eventDescription}
              className={styles.inputField}
              onChange={handleEventDescriptionChange}
              data-testid="eventDescriptionInput"
            />
            <label htmlFor="eventLocation">{tCommon('location')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              placeholder={tCommon('enterLocation')}
              autoComplete="off"
              required
              value={eventLocation}
              className={styles.inputField}
              onChange={handleEventLocationChange}
              data-testid="eventLocationInput"
            />
            <div className={styles.datedivEvents}>
              <div>
                <DatePicker
                  label={tCommon('startDate')}
                  className={styles.dateboxEvents}
                  value={dayjs(startAt)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setStartAt(date?.toDate());
                      setEndAt(date?.toDate());
                    }
                  }}
                  data-testid="eventStartAt"
                />
              </div>
              <div>
                <DatePicker
                  label={tCommon('endDate')}
                  className={styles.dateboxEvents}
                  value={dayjs(endAt)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEndAt(date?.toDate());
                    }
                  }}
                  minDate={dayjs(startAt)}
                  data-testid="eventEndAt"
                />
              </div>
            </div>
            <div className={styles.datediv}>
              <div className="mr-3">
                <TimePicker
                  label={tCommon('startTime')}
                  className={styles.dateboxEvents}
                  timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                  value={timeToDayJs(startTime)}
                  onChange={(time): void => {
                    if (time) {
                      setStartTime(time?.format('HH:mm:ss'));
                      setEndTime(time?.format('HH:mm:ss'));
                    }
                  }}
                  disabled={isAllDay}
                />
              </div>
              <div>
                <TimePicker
                  label={tCommon('endTime')}
                  className={styles.dateboxEvents}
                  timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                  value={timeToDayJs(endTime)}
                  onChange={(time): void => {
                    if (time) {
                      setEndTime(time?.format('HH:mm:ss'));
                    }
                  }}
                  minTime={timeToDayJs(startTime)}
                  disabled={isAllDay}
                />
              </div>
            </div>
            <div className={styles.checkboxdivEvents}>
              <div className={styles.dispflexEvents}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="allday"
                  type="checkbox"
                  checked={isAllDay}
                  data-testid="allDayEventCheck"
                  onChange={(): void => setIsAllDay(!isAllDay)}
                />
              </div>
              <div className={styles.dispflexEvents}>
                <label htmlFor="recurring">{t('recurring')}:</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="recurring"
                  type="checkbox"
                  checked={isRecurring}
                  data-testid="recurringEventCheck"
                  onChange={(): void => setIsRecurring(!isRecurring)}
                />
              </div>
            </div>
            <div className={styles.checkboxdivEvents}>
              <div className={styles.dispflexEvents}>
                <label htmlFor="ispublic">{t('publicEvent')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="ispublic"
                  type="checkbox"
                  checked={isPublic}
                  data-testid="publicEventCheck"
                  onChange={(): void => setIsPublic(!isPublic)}
                />
              </div>
              <div className={styles.dispflexEvents}>
                <label htmlFor="registrable">{t('registerable')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="registrable"
                  type="checkbox"
                  checked={isRegisterable}
                  data-testid="registerableEventCheck"
                  onChange={(): void => setIsRegisterable(!isRegisterable)}
                />
              </div>
            </div>
            <div>
              <div className={styles.dispflex}>
                <label htmlFor="createChat">{t('createChat')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="chat"
                  type="checkbox"
                  data-testid="createChatCheck"
                  checked={createChatCheck}
                  onChange={(): void => setCreateChatCheck(!createChatCheck)}
                />
              </div>
            </div>
            <Button
              type="submit"
              className={styles.addButton}
              value="createevent"
              data-testid="createEventBtn"
            >
              {t('createEvent')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* </div> */}
    </>
  );
}
