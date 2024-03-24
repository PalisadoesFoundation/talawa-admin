import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Dropdown, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalendar/EventCalendar';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import styles from './OrganizationEvents.module.css';
import {
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router-dom';
import CustomRecurrenceModal from './CustomRecurrenceModal';
import {
  Frequency,
  Days,
  getRecurrenceRuleText,
  mondayToFriday,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState<boolean>(false);

  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);

  const [recurrenceRuleState, setRecurrenceRuleState] =
    useState<InterfaceRecurrenceRule>({
      frequency: Frequency.WEEKLY,
      weekDays: [Days[startDate.getDay()]],
      count: undefined,
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

  const showCreateEventModal = (): void => {
    setCreateEventmodalisOpen(true);
  };
  const hideCreateEventModal = (): void => {
    setCreateEventmodalisOpen(false);
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

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const userId = getItem('id') as string;
  const userRole = getItem('UserType') as string;

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

  const { frequency, weekDays, count } = recurrenceRuleState;
  const recurrenceRuleText = getRecurrenceRuleText(
    recurrenceRuleState,
    startDate,
    endDate,
  );

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
        const { data: createEventData } = await create({
          variables: {
            title: formState.title,
            description: formState.eventdescrip,
            isPublic: publicchecked,
            recurring: recurringchecked,
            isRegisterable: registrablechecked,
            organizationId: currentUrl,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
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
            weekDays:
              recurringchecked && frequency === Frequency.WEEKLY
                ? weekDays
                : undefined,
            count,
          },
        });

        if (createEventData) {
          toast.success(t('eventCreated'));
          refetch();
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
            frequency: Frequency.WEEKLY,
            weekDays: [Days[new Date().getDay()]],
            count: undefined,
          });
          setStartDate(new Date());
          setEndDate(null);
        }
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
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
        <div className={styles.justifysp}>
          <Button
            variant="success"
            className={styles.addbtn}
            onClick={showCreateEventModal}
            data-testid="createEventModalBtn"
          >
            <i className="fa fa-plus"></i> {t('addEvent')}
          </Button>
        </div>
      </div>
      <EventCalendar
        eventData={data?.eventsByOrganizationConnection}
        orgData={orgData}
        userRole={userRole}
        userId={userId}
      />

      {/* Create Event Modal */}
      <Modal show={createEventmodalisOpen} onHide={hideCreateEventModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            variant="danger"
            onClick={hideCreateEventModal}
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
                  onChange={(time): void => {
                    if (time) {
                      setFormState({
                        ...formState,
                        startTime: time?.format('HH:mm:ss'),
                        endTime:
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
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  className="me-4"
                  id="allday"
                  type="checkbox"
                  checked={alldaychecked}
                  data-testid="alldayCheck"
                  onChange={(): void => setAllDayChecked(!alldaychecked)}
                />
              </div>
              <div className={styles.dispflex}>
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  className="me-4"
                  id="ispublic"
                  type="checkbox"
                  data-testid="ispublicCheck"
                  checked={publicchecked}
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
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
            {recurringchecked && (
              <Dropdown drop="up" className="mt-2 d-inline-block w-100">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="py-2 border border-secondary-subtle rounded-2"
                  id="dropdown-basic"
                  data-testid="recurrenceOptions"
                >
                  {recurrenceRuleText.length > 45 ? (
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="right"
                      overlay={popover}
                    >
                      <span
                        className="fw-semibold"
                        data-testid="recurrenceRuleTextOverlay"
                      >
                        {`${recurrenceRuleText.substring(0, 45)}...`}
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <span className="fw-semibold">{recurrenceRuleText}</span>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="mb-2">
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.DAILY,
                      })
                    }
                    data-testid="dailyRecurrence"
                  >
                    <span className="fw-semibold text-secondary">
                      {getRecurrenceRuleText(
                        {
                          ...recurrenceRuleState,
                          frequency: Frequency.DAILY,
                        },
                        startDate,
                        endDate,
                      )}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.WEEKLY,
                        weekDays: [Days[startDate.getDay()]],
                      })
                    }
                    data-testid="weeklyRecurrence"
                  >
                    <span className="fw-semibold text-secondary">
                      {getRecurrenceRuleText(
                        {
                          ...recurrenceRuleState,
                          frequency: Frequency.WEEKLY,
                          weekDays: [Days[startDate.getDay()]],
                        },
                        startDate,
                        endDate,
                      )}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.MONTHLY,
                      })
                    }
                    data-testid="monthlyRecurrence"
                  >
                    <span className="fw-semibold text-secondary">
                      {getRecurrenceRuleText(
                        {
                          ...recurrenceRuleState,
                          frequency: Frequency.MONTHLY,
                        },
                        startDate,
                        endDate,
                      )}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.YEARLY,
                      })
                    }
                    data-testid="yearlyRecurrence"
                  >
                    <span className="fw-semibold text-secondary">
                      {getRecurrenceRuleText(
                        {
                          ...recurrenceRuleState,
                          frequency: Frequency.YEARLY,
                        },
                        startDate,
                        endDate,
                      )}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      setRecurrenceRuleState({
                        ...recurrenceRuleState,
                        frequency: Frequency.WEEKLY,
                        weekDays: mondayToFriday,
                      })
                    }
                    data-testid="mondayToFridayRecurrence"
                  >
                    <span className="fw-semibold text-secondary">
                      {getRecurrenceRuleText(
                        {
                          ...recurrenceRuleState,
                          frequency: Frequency.WEEKLY,
                          weekDays: mondayToFriday,
                        },
                        startDate,
                        endDate,
                      )}
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setCustomRecurrenceModalIsOpen(true)}
                    data-testid="customRecurrence"
                  >
                    <span className="fw-semibold text-body-tertiary">
                      Custom...
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
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

      {/* Custom Recurrence */}
      <CustomRecurrenceModal
        recurrenceRuleState={recurrenceRuleState}
        setRecurrenceRuleState={setRecurrenceRuleState}
        endDate={endDate}
        setEndDate={setEndDate}
        customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
        hideCustomRecurrenceModal={hideCustomRecurrenceModal}
        setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
        t={t}
      />
    </>
  );
}

export default organizationEvents;
