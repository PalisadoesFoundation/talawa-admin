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
 * - `toggleCreateEventModal`: Toggles the visibility of the event creation modal.
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
import React from 'react';
import BaseModal from 'shared-components/BaseModal/BaseModal';
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

import type { IDateRangePreset } from 'types/shared-components/DateRangePicker/interface';

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
        label: tCommon('userEvents.presetToday'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().endOf('day').toDate(),
        }),
      },
      {
        key: 'thisWeek',
        label: tCommon('userEvents.presetThisWeek'),
        getRange: () => ({
          startDate: dayjs().startOf('week').toDate(),
          endDate: dayjs().endOf('week').toDate(),
        }),
      },
      {
        key: 'thisMonth',
        label: tCommon('userEvents.presetThisMonth'),
        getRange: () => ({
          startDate: dayjs().startOf('month').toDate(),
          endDate: dayjs().endOf('month').toDate(),
        }),
      },
      {
        key: 'next7Days',
        label: tCommon('userEvents.presetNext7Days'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().add(7, 'days').endOf('day').toDate(),
        }),
      },
      {
        key: 'next30Days',
        label: tCommon('userEvents.presetNext30Days'),
        getRange: () => ({
          startDate: dayjs().startOf('day').toDate(),
          endDate: dayjs().add(30, 'days').endOf('day').toDate(),
        }),
      },
      {
        key: 'nextMonth',
        label: tCommon('userEvents.presetNextMonth'),
        getRange: () => ({
          startDate: dayjs().add(1, 'month').startOf('month').toDate(),
          endDate: dayjs().add(1, 'month').endOf('month').toDate(),
        }),
      },
    ],
    [tCommon],
  );

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
<<<<<<< HEAD
      <BaseModal
        show={createEventModal}
        onHide={toggleCreateEventModal}
        title={t('eventDetails')}
        dataTestId="createEventModal"
      >
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
      </BaseModal>
=======
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
>>>>>>> a6ae6c4b3a0 (fix(events): show proper event title label for members)

      {/* </div> */}
    </>
  );
}
