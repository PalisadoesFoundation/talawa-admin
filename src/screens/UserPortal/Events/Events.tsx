import { useMutation, useQuery } from '@apollo/client';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENTS_CONNECTION,
} from 'GraphQl/Queries/Queries';
import EventCalendar from 'components/EventCalendar/EventCalendar';
import EventHeader from 'components/EventCalendar/EventHeader';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './../../../style/app.module.css';

/**
 * Converts a time string to a Dayjs object.
 *
 * @param time - The time string to convert, in HH:mm:ss format.
 * @returns A Dayjs object representing the time.
 */
const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

/**
 * Component to manage and display events for an organization.
 *
 * This component allows users to view, create, and manage events within an organization.
 * It includes a calendar view, a form to create new events, and various filters and settings.
 *
 * @returns The JSX element for the events management interface.
 */
export default function events(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEvents',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

  // State variables to manage event details and UI
  const [events, setEvents] = React.useState([]);
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
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

  // Query to fetch events for the organization
  const { data, refetch } = useQuery(ORGANIZATION_EVENTS_CONNECTION, {
    variables: {
      organization_id: organizationId,
      title_contains: '',
    },
  });

  // Query to fetch organization details
  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: organizationId },
  });

  // Mutation to create a new event
  const [create] = useMutation(CREATE_EVENT_MUTATION);

  // Get user details from local storage
  const userId = getItem('id') as string;

  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

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
      const { data: createEventData } = await create({
        variables: {
          title: eventTitle,
          description: eventDescription,
          isPublic,
          recurring: isRecurring,
          isRegisterable: isRegisterable,
          organizationId,
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
          allDay: isAllDay,
          location: eventLocation,
          startTime: !isAllDay ? startTime + 'Z' : null,
          endTime: !isAllDay ? endTime + 'Z' : null,
          createChat: createChatCheck,
        },
      });

      /* istanbul ignore next */
      if (createEventData) {
        toast.success(t('eventCreated') as string);
        refetch();
        setEventTitle('');
        setEventDescription('');
        setEventLocation('');
        setStartDate(new Date());
        setEndDate(new Date());
        setStartTime('08:00:00');
        setEndTime('10:00:00');
      }
      setCreateEventmodalisOpen(false);
    } catch (error: unknown) {
      console.error('create event error', error);
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /**
   * Toggles the visibility of the event creation modal.
   *
   * @returns Void.
   */
  /* istanbul ignore next */
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

  // Update the list of events when the data from the query changes
  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setEvents(data.eventsByOrganizationConnection);
    }
  }, [data]);

  /**
   * Shows the modal for creating a new event.
   *
   * @returns Void.
   */
  /* istanbul ignore next */
  const showInviteModal = (): void => {
    setCreateEventmodalisOpen(true);
  };

  /**
   * Updates the calendar view type.
   *
   * @param item - The view type to set, or null to reset.
   * @returns Void.
   */
  /* istanbul ignore next */
  const handleChangeView = (item: string | null): void => {
    /*istanbul ignore next*/
    if (item) {
      setViewType(item as ViewType);
    }
  };

  return (
    <>
      <div className={`d-flex flex-row`}>
        <div className={`${styles.mainContainer}`}>
          <EventHeader
            viewType={viewType}
            showInviteModal={showInviteModal}
            handleChangeView={handleChangeView}
          />
          <div className="mt-4">
            <EventCalendar
              viewType={viewType}
              eventData={events}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
            />
          </div>
          <Modal show={createEventModal} onHide={toggleCreateEventModal}>
            <Modal.Header>
              <p className={styles.titlemodalEvents}>{t('eventDetails')}</p>
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
                <label htmlFor="eventtitle">{t('eventTitle')}</label>
                <Form.Control
                  type="title"
                  id="eventitle"
                  placeholder={t('enterTitle')}
                  autoComplete="off"
                  required
                  value={eventTitle}
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
                  onChange={handleEventLocationChange}
                  data-testid="eventLocationInput"
                />
                <div className={styles.datedivEvents}>
                  <div>
                    <DatePicker
                      label={tCommon('startDate')}
                      className={styles.dateboxEvents}
                      value={dayjs(startDate)}
                      onChange={(date: Dayjs | null): void => {
                        if (date) {
                          setStartDate(date?.toDate());
                          setEndDate(date?.toDate());
                        }
                      }}
                      data-testid="eventStartDate"
                    />
                  </div>
                  <div>
                    <DatePicker
                      label={tCommon('endDate')}
                      className={styles.dateboxEvents}
                      value={dayjs(endDate)}
                      onChange={(date: Dayjs | null): void => {
                        if (date) {
                          setEndDate(date?.toDate());
                        }
                      }}
                      minDate={dayjs(startDate)}
                      data-testid="eventEndDate"
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
                      className="ms-2 mt-3"
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
                      className="ms-2 mt-3"
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
                      className="ms-2 mt-3"
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
                      className="ms-2 mt-3"
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
                      className="me-4"
                      id="chat"
                      type="checkbox"
                      data-testid="createChatCheck"
                      checked={createChatCheck}
                      onChange={(): void =>
                        setCreateChatCheck(!createChatCheck)
                      }
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className={styles.blueregbtnEvents}
                  value="createevent"
                  data-testid="createEventBtn"
                >
                  {t('createEvent')}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
}
