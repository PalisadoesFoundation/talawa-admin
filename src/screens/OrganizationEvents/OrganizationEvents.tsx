<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Popover } from 'react-bootstrap';
=======
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalendar/EventCalendar';
<<<<<<< HEAD
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
=======
import Calendar from 'react-calendar';
import './calendar.css';

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import styles from './OrganizationEvents.module.css';
import {
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
<<<<<<< HEAD
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router-dom';
import EventHeader from 'components/EventCalendar/EventHeader';
import CustomRecurrenceModal from 'components/RecurrenceOptions/CustomRecurrenceModal';
import {
  Frequency,
  Days,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import RecurrenceOptions from 'components/RecurrenceOptions/RecurrenceOptions';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
}
=======
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

<<<<<<< HEAD
  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
=======
  document.title = t('title');
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);

<<<<<<< HEAD
  const [recurrenceRuleState, setRecurrenceRuleState] =
    useState<InterfaceRecurrenceRule>({
      frequency: Frequency.WEEKLY,
      weekDays: [Days[startDate.getDay()]],
      interval: 1,
      count: undefined,
      weekDayOccurenceInMonth: undefined,
    });

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    date: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });
<<<<<<< HEAD
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  const showInviteModal = (): void => {
    setCreateEventmodalisOpen(true);
  };
  const hideCreateEventModal = (): void => {
    setCreateEventmodalisOpen(false);
  };
  const handleChangeView = (item: ViewType): void => {
    /*istanbul ignore next*/
    setViewType(item);
  };

  const hideCustomRecurrenceModal = (): void => {
    setCustomRecurrenceModalIsOpen(false);
  };

  const {
    data,
    loading,
    error: eventDataError,
    refetch,
  } = useQuery(ORGANIZATION_EVENT_CONNECTION_LIST, {
    variables: {
      organization_id: currentUrl,
      title_contains: '',
      description_contains: '',
      location_contains: '',
    },
  });
=======
  const currentUrl = window.location.href.split('=')[1];

  const showInviteModal = (): void => {
    setEventModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setEventModalIsOpen(false);
  };

  const { data, loading, error, refetch } = useQuery(
    ORGANIZATION_EVENT_CONNECTION_LIST,
    {
      variables: {
        organization_id: currentUrl,
        title_contains: '',
        description_contains: '',
        location_contains: '',
      },
    }
  );
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

<<<<<<< HEAD
  const userId = getItem('id') as string;
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

  const { frequency, weekDays, interval, count, weekDayOccurenceInMonth } =
    recurrenceRuleState;
  const recurrenceRuleText = getRecurrenceRuleText(
    recurrenceRuleState,
    startDate,
    endDate,
  );

  const createEvent = async (
    e: React.ChangeEvent<HTMLFormElement>,
=======
  const userId = localStorage.getItem('id') as string;
  const userRole = localStorage.getItem('UserType') as string;

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

  const createEvent = async (
    e: ChangeEvent<HTMLFormElement>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ): Promise<void> => {
    e.preventDefault();
    if (
      formState.title.trim().length > 0 &&
      formState.eventdescrip.trim().length > 0 &&
      formState.location.trim().length > 0
    ) {
      try {
        const { data: createEventData } = await create({
          variables: {
            title: formState.title,
            description: formState.eventdescrip,
            isPublic: publicchecked,
            recurring: recurringchecked,
            isRegisterable: registrablechecked,
            organizationId: currentUrl,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
<<<<<<< HEAD
            endDate: endDate
              ? dayjs(endDate).format('YYYY-MM-DD')
              : /* istanbul ignore next */ recurringchecked
                ? undefined
                : dayjs(startDate).format('YYYY-MM-DD'),
            allDay: alldaychecked,
            location: formState.location,
            startTime: !alldaychecked ? formState.startTime + 'Z' : undefined,
            endTime: !alldaychecked ? formState.endTime + 'Z' : undefined,
            frequency: recurringchecked ? frequency : undefined,
            weekDays: recurringchecked ? weekDays : undefined,
            interval: recurringchecked ? interval : undefined,
            count: recurringchecked ? count : undefined,
            weekDayOccurenceInMonth: recurringchecked
              ? weekDayOccurenceInMonth
              : undefined,
          },
        });

        if (createEventData) {
          toast.success(t('eventCreated'));
          refetch();
          hideCreateEventModal();
=======
            endDate: dayjs(endDate).format('YYYY-MM-DD'),
            allDay: alldaychecked,
            location: formState.location,
            startTime: !alldaychecked ? formState.startTime + 'Z' : null,
            endTime: !alldaychecked ? formState.endTime + 'Z' : null,
          },
        });

        /* istanbul ignore next */
        if (createEventData) {
          toast.success(t('eventCreated'));
          refetch();
          hideInviteModal();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          setFormState({
            title: '',
            eventdescrip: '',
            date: '',
            location: '',
            startTime: '08:00:00',
            endTime: '18:00:00',
          });
<<<<<<< HEAD
          setRecurringChecked(false);
          setRecurrenceRuleState({
            frequency: Frequency.WEEKLY,
            weekDays: [Days[new Date().getDay()]],
            interval: 1,
            count: undefined,
            weekDayOccurenceInMonth: undefined,
          });
          setStartDate(new Date());
          setEndDate(null);
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        if (error instanceof Error) {
          console.log(error.message);
          errorHandler(t, error);
        }
=======
        }
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
  useEffect(() => {
    if (eventDataError) {
      navigate('/orglist');
    }
  }, [eventDataError]);

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  if (loading || loading2) {
    return <Loader />;
  }

<<<<<<< HEAD
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
        <div className={styles.justifysp}>
          <EventHeader
            viewType={viewType}
            handleChangeView={handleChangeView}
            showInviteModal={showInviteModal}
          />
        </div>
      </div>
      <EventCalendar
        eventData={data?.eventsByOrganizationConnection}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
        viewType={viewType}
      />

      {/* Create Event Modal */}
      <Modal show={createEventmodalisOpen} onHide={hideCreateEventModal}>
=======
  /* istanbul ignore next */
  if (error) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */

  return (
    <>
      <OrganizationScreen screenName="Events" title={t('title')}>
        <Row>
          <Col sm={3}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarsticky}>
                <h6 className={styles.searchtitle}>Search Date</h6>
                <Calendar />
              </div>
            </div>
          </Col>
          <Col sm={8}>
            <div className={styles.mainpageright}>
              <Row className={styles.justifysp}>
                <p className={styles.logintitle}>{t('events')}</p>
                <Button
                  variant="success"
                  className={styles.addbtn}
                  onClick={showInviteModal}
                  data-testid="createEventModalBtn"
                >
                  <i className="fa fa-plus"></i> {t('addEvent')}
                </Button>
              </Row>
            </div>
            <EventCalendar
              eventData={data?.eventsByOrganizationConnection}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
            />
          </Col>
        </Row>
      </OrganizationScreen>

      <Modal show={eventmodalisOpen} onHide={hideInviteModal}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            variant="danger"
<<<<<<< HEAD
            onClick={hideCreateEventModal}
=======
            onClick={hideInviteModal}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  title: e.target.value,
                });
              }}
            />
            <label htmlFor="eventdescrip">{t('description')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              placeholder={t('enterDescrip')}
              autoComplete="off"
              required
              value={formState.eventdescrip}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  eventdescrip: e.target.value,
                });
              }}
            />
            <label htmlFor="eventLocation">{t('location')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              placeholder={t('eventLocation')}
              autoComplete="off"
              required
              value={formState.location}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  location: e.target.value,
                });
              }}
            />
            <div className={styles.datediv}>
              <div>
<<<<<<< HEAD
                <DatePicker
                  label={t('startDate')}
                  className={styles.datebox}
                  value={dayjs(startDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setStartDate(date?.toDate());
                      setEndDate(
                        endDate &&
                          (endDate < date?.toDate() ? date?.toDate() : endDate),
                      );
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        weekDays: [Days[date?.toDate().getDay()]],
                        weekDayOccurenceInMonth: getWeekDayOccurenceInMonth(
                          date?.toDate(),
                        ),
                      });
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('endDate')}
                  className={styles.datebox}
                  value={dayjs(endDate ?? startDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEndDate(date?.toDate());
                    }
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
            </div>
            <div className={styles.datediv}>
              <div className="mr-3">
                <TimePicker
                  label={t('startTime')}
                  className={styles.datebox}
                  timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                  value={timeToDayJs(formState.startTime)}
                  /*istanbul ignore next*/
                  onChange={(time): void => {
                    if (time) {
                      setFormState({
                        ...formState,
                        startTime: time?.format('HH:mm:ss'),
                        endTime:
                          /*istanbul ignore next*/
                          timeToDayJs(formState.endTime) < time
                            ? /* istanbul ignore next */ time?.format(
                                'HH:mm:ss',
                              )
                            : formState.endTime,
                      });
                    }
                  }}
                  disabled={alldaychecked}
                />
              </div>
              <div>
                <TimePicker
                  label={t('endTime')}
                  className={styles.datebox}
                  timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                  /*istanbul ignore next*/
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
=======
                <label htmlFor="startdate">{t('startDate')}</label>
                <DatePicker
                  className={styles.datebox}
                  id="startdate"
                  selected={startDate}
                  onChange={(date: Date | null): void => setStartDate(date)}
                  placeholderText={t('startDate')}
                />
              </div>
              <div>
                <label htmlFor="enddate">{t('endDate')}</label>
                <DatePicker
                  className={styles.datebox}
                  id="enddate"
                  selected={endDate}
                  onChange={(date: Date | null): void => setEndDate(date)}
                  placeholderText={t('endDate')}
                />
              </div>
            </div>
            {!alldaychecked && (
              <div className={styles.datediv}>
                <div className="mr-3">
                  <label htmlFor="startTime">{t('startTime')}</label>
                  <Form.Control
                    id="startTime"
                    placeholder={t('startTime')}
                    value={formState.startTime}
                    onChange={(e): void =>
                      setFormState({
                        ...formState,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="endTime">{t('endTime')}</label>
                  <Form.Control
                    id="endTime"
                    placeholder={t('endTime')}
                    value={formState.endTime}
                    onChange={(e): void =>
                      setFormState({
                        ...formState,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
<<<<<<< HEAD
                  className="me-4"
=======
                  className="ms-2 mt-3"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  id="allday"
                  type="checkbox"
                  checked={alldaychecked}
                  data-testid="alldayCheck"
                  onChange={(): void => setAllDayChecked(!alldaychecked)}
                />
              </div>
              <div className={styles.dispflex}>
<<<<<<< HEAD
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  className="me-4"
=======
                <label htmlFor="recurring">{t('recurringEvent')}:</label>
                <Form.Switch
                  className="ms-2 mt-3"
                  id="recurring"
                  type="checkbox"
                  data-testid="recurringCheck"
                  checked={recurringchecked}
                  onChange={(): void => setRecurringChecked(!recurringchecked)}
                />
              </div>
            </div>
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  className="ms-2 mt-3"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  id="ispublic"
                  type="checkbox"
                  data-testid="ispublicCheck"
                  checked={publicchecked}
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
<<<<<<< HEAD
            </div>
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="recurring">{t('recurringEvent')}?</label>
                <Form.Switch
                  className="me-4"
                  id="recurring"
                  type="checkbox"
                  data-testid="recurringCheck"
                  checked={recurringchecked}
                  onChange={(): void => {
                    setRecurringChecked(!recurringchecked);
                  }}
                />
              </div>
              <div className={styles.dispflex}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className="me-4"
=======
              <div className={styles.dispflex}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className="ms-2 mt-3"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD

            {recurringchecked && (
              <RecurrenceOptions
                recurrenceRuleState={recurrenceRuleState}
                recurrenceRuleText={recurrenceRuleText}
                setRecurrenceRuleState={setRecurrenceRuleState}
                startDate={startDate}
                endDate={endDate}
                setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
                popover={popover}
              />
            )}

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD

      {/* Custom Recurrence */}
      <CustomRecurrenceModal
        recurrenceRuleState={recurrenceRuleState}
        recurrenceRuleText={recurrenceRuleText}
        setRecurrenceRuleState={setRecurrenceRuleState}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
        hideCustomRecurrenceModal={hideCustomRecurrenceModal}
        setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
        t={t}
      />
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    </>
  );
}

export default organizationEvents;
