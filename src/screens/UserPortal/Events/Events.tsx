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
import styles from './Events.module.css';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export default function events(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEvents',
  });
  const { t: tCommon } = useTranslation('common');

  const { getItem } = useLocalStorage();

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
  const { orgId: organizationId } = useParams();

  const { data, refetch } = useQuery(ORGANIZATION_EVENTS_CONNECTION, {
    variables: {
      organization_id: organizationId,
      title_contains: '',
    },
  });

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: organizationId },
  });

  const [create] = useMutation(CREATE_EVENT_MUTATION);

  const userId = getItem('id') as string;

  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

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
        },
      });

      /* istanbul ignore next */
      if (createEventData) {
        toast.success(t('eventCreated'));
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
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const toggleCreateEventModal = (): void =>
    setCreateEventmodalisOpen(!createEventModal);

  const handleEventTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventTitle(event.target.value);
  };

  const handleEventLocationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventLocation(event.target.value);
  };

  const handleEventDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setEventDescription(event.target.value);
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setEvents(data.eventsByOrganizationConnection);
    }
  }, [data]);

  /* istanbul ignore next */
  const showInviteModal = (): void => {
    setCreateEventmodalisOpen(true);
  };
  /* istanbul ignore next */
  const handleChangeView = (item: string | null): void => {
    /*istanbul ignore next*/
    if (item) {
      setViewType(item as ViewType);
    }
  };

  return (
    <>
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
          <div className="mb-3">
            <h1>Events</h1>
          </div>
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
              <p className={styles.titlemodal}>{t('eventDetails')}</p>
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
                <div className={styles.datediv}>
                  <div>
                    <DatePicker
                      label={tCommon('startDate')}
                      className={styles.datebox}
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
                      className={styles.datebox}
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
                      className={styles.datebox}
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
                      className={styles.datebox}
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
                <div className={styles.checkboxdiv}>
                  <div className={styles.dispflex}>
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
                  <div className={styles.dispflex}>
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
                <div className={styles.checkboxdiv}>
                  <div className={styles.dispflex}>
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
                  <div className={styles.dispflex}>
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
                <Button
                  type="submit"
                  className={styles.greenregbtn}
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
