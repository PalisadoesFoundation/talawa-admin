/**
 * OrganizationEvents Component
 *
 * This component is responsible for rendering and managing the organization events page.
 * It includes functionalities for viewing events in different calendar views, creating new events,
 * and managing event recurrence options.
 *
 * @component
 * @returns {JSX.Element} The rendered OrganizationEvents component.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and `@mui/x-date-pickers` for date/time pickers.
 * - Supports multilingual translations using `react-i18next`.
 * - Handles event creation with recurrence options and validations.
 *
 * @example
 * ```tsx
 * <OrganizationEvents />
 * ```
 *
 * @dependencies
 * - `EventCalendar`: Displays events in a calendar view.
 * - `EventHeader`: Provides controls for changing calendar views and opening the event creation modal.
 * - `RecurrenceOptions`: Manages recurrence rule configurations for events.
 * - `Loader`: Displays a loading spinner during data fetching.
 *
 * @state
 * - `createEventmodalisOpen` (boolean): Controls the visibility of the event creation modal.
 * - `startDate`, `endDate` (Date): Start and end dates for the event.
 * - `viewType` (ViewType): Current calendar view type (Day, Month, Year).
 * - `formState` (object): Stores form input values for event creation.
 * - `recurrenceRuleState` (InterfaceRecurrenceRuleState): Stores recurrence rule configurations.
 *
 * @queries
 * - `ORGANIZATION_EVENT_CONNECTION_LIST`: Fetches events for the organization.
 * - `ORGANIZATIONS_LIST`: Fetches organization details.
 *
 * @mutations
 * - `CREATE_EVENT_MUTATION`: Creates a new event with the provided details.
 *
 * @hooks
 * - `useQuery`: Fetches data for events and organization details.
 * - `useMutation`: Handles event creation.
 * - `useLocalStorage`: Retrieves user-related data from local storage.
 * - `useParams`, `useNavigate`: Manages routing and navigation.
 *
 * @errorHandling
 * - Displays toast notifications for validation errors and success messages.
 * - Redirects to the organization list page if event data fetching fails.
 */
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Popover } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import styles from 'style/app.module.css';
import {
  GET_EVENTS_BY_ORGANIZATION_PG,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router-dom';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import {
  Frequency,
  Days,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRuleState } from 'utils/recurrenceUtils';
import RecurrenceOptions from 'components/RecurrenceOptions/RecurrenceOptions';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
  YEAR = 'Year View',
}

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);
  const [createChatCheck, setCreateChatCheck] = React.useState(false);

  const [recurrenceRuleState, setRecurrenceRuleState] =
    useState<InterfaceRecurrenceRuleState>({
      recurrenceStartDate: startDate,
      recurrenceEndDate: null,
      frequency: Frequency.WEEKLY,
      weekDays: [Days[startDate.getDay()]],
      interval: 1,
      count: undefined,
      weekDayOccurenceInMonth: undefined,
    });

  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    date: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  const showInviteModal = (): void => {
    setCreateEventmodalisOpen(true);
  };
  const hideCreateEventModal = (): void => {
    setCreateEventmodalisOpen(false);
  };
  const handleChangeView = (item: string | null): void => {
    if (item) {
      setViewType(item as ViewType);
    }
  };

  const {
    data,
    loading,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_EVENTS_BY_ORGANIZATION_PG, {
    variables: {
      orgId: currentUrl,
      first: 32,
    },
  });

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const userId = getItem('id') as string;
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor') as string[];
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

  const {
    recurrenceStartDate,
    recurrenceEndDate,
    frequency,
    weekDays,
    interval,
    count,
    weekDayOccurenceInMonth,
  } = recurrenceRuleState;

  const recurrenceRuleText = getRecurrenceRuleText(recurrenceRuleState);

  const createEvent = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (
      formState.title.trim().length > 0 &&
      formState.eventdescrip.trim().length > 0 &&
      formState.location.trim().length > 0
    ) {
      try {
        // Format dates as ISO strings with proper time
        const startDateTime = alldaychecked
          ? `${dayjs(startDate).format('YYYY-MM-DD')}T00:00:00Z`
          : `${dayjs(startDate).format('YYYY-MM-DD')}T${formState.startTime}Z`;

        const endDateTime = alldaychecked
          ? `${dayjs(endDate).format('YYYY-MM-DD')}T23:59:59Z`
          : `${dayjs(endDate).format('YYYY-MM-DD')}T${formState.endTime}Z`;

        // Use only the fields supported by the API schema
        const { data: createEventData } = await create({
          variables: {
            input: {
              name: formState.title,
              description: formState.eventdescrip,
              startAt: startDateTime,
              endAt: endDateTime,
              organizationId: currentUrl,
            },
          },
        });

        if (createEventData) {
          toast.success(t('eventCreated') as string);
          refetchEvents();
          hideCreateEventModal();
          setFormState({
            title: '',
            eventdescrip: '',
            date: '',
            location: '',
            startTime: '08:00:00',
            endTime: '18:00:00',
          });
          setRecurringChecked(false);
          setRecurrenceRuleState({
            recurrenceStartDate: new Date(),
            recurrenceEndDate: null,
            frequency: Frequency.WEEKLY,
            weekDays: [Days[new Date().getDay()]],
            interval: 1,
            count: undefined,
            weekDayOccurenceInMonth: undefined,
          });
          setStartDate(new Date());
          setEndDate(new Date());
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errorHandler(t, error);
        }
      }
    }
    if (formState.title.trim().length === 0) {
      toast.warning('Title can not be blank!');
    }
    if (formState.eventdescrip.trim().length === 0) {
      toast.warning('Description can not be blank!');
    }
    if (formState.location.trim().length === 0) {
      toast.warning('Location can not be blank!');
    }
  };

  useEffect(() => {
    if (eventDataError) {
      navigate('/orglist');
    }
  }, [eventDataError]);

  if (loading || loading2) {
    return <Loader />;
  }

  const popover = (
    <Popover
      id={`popover-recurrenceRuleText`}
      data-testid={`popover-recurrenceRuleText`}
    >
      <Popover.Body>{recurrenceRuleText}</Popover.Body>
    </Popover>
  );

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
        eventData={
          data?.organization?.events?.edges?.map((edge) => ({
            _id: edge.node.id,
            title: edge.node.name,
            description: edge.node.description,
            startDate: edge.node.startAt?.split('T')[0] || '', // Convert ISO to date string
            endDate: edge.node.endAt?.split('T')[0] || '',
            // Extract venue name from the venues connection or use empty string if not available
            location: edge.node.venues?.edges?.node?.name || '',
            // Provide default values for missing fields
            allDay: true, // Default to true
            isPublic: true, // Default to true
            isRegisterable: false,
            recurring: false,
            attendees: [],
          })) || []
        }
        refetchEvents={refetchEvents}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        viewType={viewType}
      />

      {/* Create Event Modal */}
      <Modal show={createEventmodalisOpen} onHide={hideCreateEventModal}>
        <Modal.Header>
          <p className={styles.titlemodalOrganizationEvents}>
            {t('eventDetails')}
          </p>
          <Button
            variant="danger"
            onClick={hideCreateEventModal}
            className={styles.closeButtonOrganizationEvents}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createEvent}>
            <label htmlFor="eventtitle">{t('eventTitle')}</label>
            <Form.Control
              type="title"
              id="eventitle"
              placeholder={t('enterTitle')}
              autoComplete="off"
              required
              value={formState.title}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, title: e.target.value });
              }}
            />
            <label htmlFor="eventdescrip">{tCommon('description')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              placeholder={t('enterDescrip')}
              autoComplete="off"
              required
              value={formState.eventdescrip}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, eventdescrip: e.target.value });
              }}
            />
            <label htmlFor="eventLocation">{tCommon('enterLocation')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              placeholder={tCommon('enterLocation')}
              autoComplete="off"
              required
              value={formState.location}
              onChange={(e): void => {
                setFormState({ ...formState, location: e.target.value });
              }}
            />
            <div className={styles.datedivOrganizationEvents}>
              <div>
                <DatePicker
                  label={tCommon('startDate')}
                  className={styles.dateboxOrganizationEvents}
                  value={dayjs(startDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setStartDate(date?.toDate());
                      setEndDate(
                        endDate < date?.toDate() ? date?.toDate() : endDate,
                      );
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        recurrenceStartDate: date?.toDate(),
                        weekDays: [Days[date?.toDate().getDay()]],
                        weekDayOccurenceInMonth: weekDayOccurenceInMonth
                          ? getWeekDayOccurenceInMonth(date?.toDate())
                          : undefined,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={tCommon('endDate')}
                  className={styles.dateboxOrganizationEvents}
                  value={dayjs(endDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEndDate(date?.toDate());
                    }
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
            </div>
            {!alldaychecked && (
              <div className={styles.datedivOrganizationEvents}>
                <div className="mr-3">
                  <TimePicker
                    label={tCommon('startTime')}
                    className={styles.dateboxOrganizationEvents}
                    timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                    value={timeToDayJs(formState.startTime)}
                    onChange={(time): void => {
                      if (time) {
                        setFormState({
                          ...formState,
                          startTime: time?.format('HH:mm:ss'),
                          endTime:
                            timeToDayJs(formState.endTime) < time
                              ? time?.format('HH:mm:ss')
                              : formState.endTime,
                        });
                      }
                    }}
                    disabled={alldaychecked}
                  />
                </div>
                <div>
                  <TimePicker
                    label={tCommon('endTime')}
                    className={styles.dateboxOrganizationEvents}
                    timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                    value={timeToDayJs(formState.endTime)}
                    onChange={(time): void => {
                      if (time) {
                        setFormState({
                          ...formState,
                          endTime: time?.format('HH:mm:ss'),
                        });
                      }
                    }}
                    minTime={timeToDayJs(formState.startTime)}
                    disabled={alldaychecked}
                  />
                </div>
              </div>
            )}
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="allday"
                  type="checkbox"
                  checked={alldaychecked}
                  data-testid="alldayCheck"
                  onChange={(): void => setAllDayChecked(!alldaychecked)}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="ispublic"
                  type="checkbox"
                  data-testid="ispublicCheck"
                  checked={publicchecked}
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
            </div>
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="recurring">{t('recurringEvent')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="recurring"
                  type="checkbox"
                  data-testid="recurringCheck"
                  checked={recurringchecked}
                  onChange={(): void => {
                    setRecurringChecked(!recurringchecked);
                  }}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="registrable"
                  type="checkbox"
                  data-testid="registrableCheck"
                  checked={registrablechecked}
                  onChange={(): void =>
                    setRegistrableChecked(!registrablechecked)
                  }
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
                  data-testid="createChat"
                  checked={createChatCheck}
                  onChange={(): void => setCreateChatCheck(!createChatCheck)}
                />
              </div>
            </div>

            {/* Recurrence Options */}
            {recurringchecked && (
              <RecurrenceOptions
                recurrenceRuleState={recurrenceRuleState}
                recurrenceRuleText={recurrenceRuleText}
                setRecurrenceRuleState={setRecurrenceRuleState}
                popover={popover}
                t={t}
                tCommon={tCommon}
              />
            )}

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
    </>
  );
}

export default organizationEvents;
