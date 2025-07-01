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
 *
 * @remarks
 * Dependencies:
 * - `EventCalendar`: Displays events in a calendar view.
 * - `EventHeader`: Provides controls for changing calendar views and opening the event creation modal.
 * - `Loader`: Displays a loading spinner during data fetching.
 *
 * State:
 * - `createEventmodalisOpen` (boolean): Controls the visibility of the event creation modal.
 * - `startDate`, `endDate` (Date): Start and end dates for the event.
 * - `viewType` (ViewType): Current calendar view type (Day, Month, Year).
 * - `formState` (object): Stores form input values for event creation.
 *
 * Queries:
 * - `ORGANIZATION_EVENT_CONNECTION_LIST`: Fetches events for the organization.
 * - `ORGANIZATIONS_LIST`: Fetches organization details.
 *
 * Mutations:
 * - `CREATE_EVENT_MUTATION`: Creates a new event with the provided details.
 *
 * Hooks:
 * - `useQuery`: Fetches data for events and organization details.
 * - `useMutation`: Handles event creation.
 * - `useLocalStorage`: Retrieves user-related data from local storage.
 * - `useParams`, `useNavigate`: Manages routing and navigation.
 *
 * Error Handling:
 * - Displays toast notifications for validation errors and success messages.
 * - Redirects to the organization list page if event data fetching fails.
 */
import React, { useState, useEffect, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import styles from '../../style/app-fixed.module.css';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';

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
    creator: {
      id: string;
      name: string;
    };
  };
  cursor: string;
}

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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [alldaychecked, setAllDayChecked] = useState(true);
  const [publicchecked, setPublicChecked] = useState(true);
  const [registrablechecked, setRegistrableChecked] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    eventdescrip: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  const showInviteModal = (): void => setCreateEventmodalisOpen(true);
  const hideCreateEventModal = (): void => setCreateEventmodalisOpen(false);
  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  const {
    data: eventData,
    loading: eventLoading,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 10,
      after: null,
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
      first: 10, // For members pagination
      after: null,
    },
  });

  const userId = getItem('id') as string;
  const storedRole = getItem('role') as string | null;
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  const [create, { loading: createLoading }] = useMutation(
    CREATE_EVENT_MUTATION,
  );

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
    creator: {
      _id: edge.node.creator.id,
      name: edge.node.creator.name,
    },
    attendees: [], // Adjust if attendees are added to schema
  }));

  const createEvent = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (
      formState.name.trim().length > 0 &&
      formState.eventdescrip.trim().length > 0 &&
      formState.location.trim().length > 0
    ) {
      try {
        const startTimeParts = formState.startTime.split(':');
        const endTimeParts = formState.endTime.split(':');

        const input = {
          name: formState.name,
          description: formState.eventdescrip,
          startAt: alldaychecked
            ? dayjs(startDate).startOf('day').toISOString()
            : dayjs(startDate)
                .hour(parseInt(startTimeParts[0]))
                .minute(parseInt(startTimeParts[1]))
                .second(parseInt(startTimeParts[2]))
                .toISOString(),
          endAt: alldaychecked
            ? dayjs(endDate).endOf('day').toISOString()
            : dayjs(endDate)
                .hour(parseInt(endTimeParts[0]))
                .minute(parseInt(endTimeParts[1]))
                .second(parseInt(endTimeParts[2]))
                .toISOString(),
          organizationId: currentUrl,
          allDay: alldaychecked,
          location: formState.location,
          isPublic: publicchecked,
          isRegisterable: registrablechecked,
        };

        const { data: createEventData } = await create({
          variables: { input },
        });

        if (createEventData) {
          toast.success(t('eventCreated') as string);
          refetchEvents();
          hideCreateEventModal();
          setFormState({
            name: '',
            eventdescrip: '',
            location: '',
            startTime: '08:00:00',
            endTime: '18:00:00',
          });
          setStartDate(new Date());
          setEndDate(new Date());
          setAllDayChecked(true);
          setPublicChecked(true);
          setRegistrableChecked(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          errorHandler(t, error);
        }
      }
    } else {
      if (formState.name.trim().length === 0)
        toast.warning('Name can not be blank!');
      if (formState.eventdescrip.trim().length === 0)
        toast.warning('Description can not be blank!');
      if (formState.location.trim().length === 0)
        toast.warning('Location can not be blank!');
    }
  };

  useEffect(() => {
    if (eventDataError || orgDataError) navigate('/orglist');
  }, [eventDataError, orgDataError]);

  if (eventLoading || orgLoading || createLoading) return <Loader />;

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
          <Form onSubmit={createEvent}>
            <label htmlFor="eventName">{t('eventName')}</label>
            <Form.Control
              type="title"
              id="eventitle"
              placeholder={t('enterName')}
              autoComplete="off"
              required
              value={formState.name}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, name: e.target.value });
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
              className={styles.inputField}
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
                      setStartDate(date.toDate());
                      setEndDate(
                        endDate < date.toDate() ? date.toDate() : endDate,
                      );
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
                    if (date) setEndDate(date.toDate());
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
                          startTime: time.format('HH:mm:ss'),
                          endTime:
                            timeToDayJs(formState.endTime) < time
                              ? time.format('HH:mm:ss')
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
                          endTime: time.format('HH:mm:ss'),
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
                  checked={publicchecked}
                  data-testid="ispublicCheck"
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="registrable"
                  type="checkbox"
                  checked={registrablechecked}
                  data-testid="registrableCheck"
                  onChange={(): void =>
                    setRegistrableChecked(!registrablechecked)
                  }
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
    </>
  );
}

export default organizationEvents;
