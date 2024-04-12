import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from './EventListCard.module.css';
import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { Form } from 'react-bootstrap';
import { errorHandler } from 'utils/errorHandler';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getItem } from 'utils/useLocalstorage';
import {
  type InterfaceRecurrenceRule,
  RecurringEventMutationType,
  recurringEventMutationOptions,
} from 'utils/recurrenceUtils';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export interface InterfaceEventListCardProps {
  key: string;
  id: string;
  eventLocation: string;
  eventName: string;
  eventDescription: string;
  startDate: string;
  endDate: string;
  startTime: string | undefined;
  endTime: string | undefined;
  allDay: boolean;
  recurring: boolean;
  recurrenceRule: InterfaceRecurrenceRule | null;
  isRecurringEventException: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
}

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

function eventListCard(props: InterfaceEventListCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);
  const [alldaychecked, setAllDayChecked] = useState(true);
  const [recurringchecked, setRecurringChecked] = useState(false);
  const [publicchecked, setPublicChecked] = useState(true);
  const [registrablechecked, setRegistrableChecked] = useState(false);
  const [eventDeleteModalIsOpen, setEventDeleteModalIsOpen] = useState(false);
  const [eventUpdateModalIsOpen, setEventUpdateModalIsOpen] = useState(false);
  const [eventStartDate, setEventStartDate] = useState(new Date());
  const [eventEndDate, setEventEndDate] = useState<Date | null>(new Date());

  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }
  const navigate = useNavigate();
  const adminFor = getItem('AdminFor', 'admin');
  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });
  const showViewModal = (): void => {
    setEventModalIsOpen(true);
  };
  const hideViewModal = (): void => {
    setEventModalIsOpen(false);
  };

  const toggleDeleteModal = (): void => {
    setEventDeleteModalIsOpen(!eventDeleteModalIsOpen);
  };

  const toggleUpdateModel = (): void => {
    setEventUpdateModalIsOpen(!eventUpdateModalIsOpen);
  };

  useEffect(() => {
    setFormState({
      title: props.eventName,
      eventdescrip: props.eventDescription,
      location: props.eventLocation,
      startTime: props.startTime?.split('.')[0] || '08:00:00',
      endTime: props.endTime?.split('.')[0] || '18:00:00',
    });

    setAllDayChecked(props.allDay);
    setRecurringChecked(props.recurring);
    setPublicChecked(props.isPublic);
    setRegistrableChecked(props.isRegisterable);
    setEventStartDate(new Date(props.startDate));
    setEventEndDate(new Date(props.endDate));
  }, []);

  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);
  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);
  const [recurringEventDeleteType, setRecurringEventDeleteType] =
    useState<RecurringEventMutationType>(
      RecurringEventMutationType.ThisInstance,
    );

  const [recurringEventUpdateType, setRecurringEventUpdateType] =
    useState<RecurringEventMutationType>(
      RecurringEventMutationType.ThisInstance,
    );

  const deleteEventHandler = async (): Promise<void> => {
    try {
      const { data } = await deleteEvent({
        variables: {
          id: props.id,
          recurringEventDeleteType: props.recurring
            ? recurringEventDeleteType
            : undefined,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('eventDeleted'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const updateEventHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await updateEvent({
        variables: {
          id: props.id,
          title: formState.title,
          description: formState.eventdescrip,
          isPublic: publicchecked,
          recurring: recurringchecked,
          recurringEventUpdateType: recurringchecked
            ? recurringEventUpdateType
            : undefined,
          isRegisterable: registrablechecked,
          allDay: alldaychecked,
          startDate: dayjs(eventStartDate).format('YYYY-MM-DD'),
          endDate: eventEndDate
            ? dayjs(eventEndDate).format('YYYY-MM-DD')
            : /* istanbul ignore next */ recurringchecked
              ? undefined
              : dayjs(eventStartDate).format('YYYY-MM-DD'),
          location: formState.location,
          startTime: !alldaychecked ? formState.startTime + 'Z' : undefined,
          endTime: !alldaychecked ? formState.endTime + 'Z' : undefined,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('eventUpdated'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const openEventDashboard = (): void => {
    navigate(`/event/${orgId}/${props.id}`);
  };

  return (
    <>
      <div
        className={styles.cards}
        style={{
          backgroundColor: adminFor ? '#a8d5ff' : '#d9d9d9',
        }}
        onClick={showViewModal}
        data-testid="card"
      >
        <div className={styles.dispflex}>
          <h2 className={styles.eventtitle}>
            {props.eventName ? <>{props.eventName}</> : <>Dogs Care</>}
          </h2>
        </div>
      </div>
      {/* preview modal */}
      <Modal show={eventmodalisOpen} centered>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            onClick={hideViewModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <p className={styles.preview}>
                {t('eventTitle')}:{' '}
                <span className={styles.view}>
                  {props.eventName ? (
                    <>
                      {props.eventName.length > 100 ? (
                        <>{props.eventName.substring(0, 100)}...</>
                      ) : (
                        <>{props.eventName}</>
                      )}
                    </>
                  ) : (
                    <>Dogs Care</>
                  )}
                </span>
              </p>
              <p className={styles.preview}>
                {t('location')}:
                <span className={styles.view}>
                  {props.eventLocation ? (
                    <>{props.eventLocation}</>
                  ) : (
                    <>India</>
                  )}
                </span>
              </p>
              <p className={styles.preview}>
                {t('description')}:{' '}
                <span className={styles.view}>
                  {props.eventDescription && props.eventDescription.length > 256
                    ? props.eventDescription.substring(0, 256) + '...'
                    : props.eventDescription}
                </span>
              </p>
              <p className={styles.preview}>
                {t('on')}:{' '}
                <span className={styles.view}>{props.startDate}</span>
              </p>
              <p className={styles.preview}>
                {t('end')}: <span className={styles.view}>{props.endDate}</span>
              </p>
              <Button
                className={styles.customButton}
                variant="success"
                onClick={openEventDashboard}
                data-testid="showEventDashboardBtn"
              >
                {' '}
                Show Event Dashboard{' '}
              </Button>
            </div>
            <div className={styles.iconContainer}>
              <Button
                size="sm"
                data-testid="editEventModalBtn"
                className={styles.icon}
                onClick={toggleUpdateModel}
              >
                {' '}
                <i className="fas fa-edit"></i>
              </Button>
              <Button
                size="sm"
                data-testid="deleteEventModalBtn"
                className={styles.icon}
                onClick={toggleDeleteModal}
              >
                {' '}
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* delete modal */}
      <Modal
        size="sm"
        id={`deleteEventModal${props.id}`}
        show={eventDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            className="text-white"
            id={`deleteEventModalLabel${props.id}`}
          >
            {t('deleteEvent')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!props.recurring && t('deleteEventMsg')}
          {props.recurring && (
            <>
              <Form className="mt-3">
                {recurringEventMutationOptions.map((option, index) => (
                  <div key={index} className="my-0 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`radio-${index}`}
                      label={t(
                        option.charAt(0).toLowerCase() + option.slice(1),
                      )}
                      name="recurringEventDeleteType"
                      value={option}
                      onChange={(e) =>
                        setRecurringEventDeleteType(
                          e.target.value as RecurringEventMutationType,
                        )
                      }
                      defaultChecked={option === recurringEventDeleteType}
                      data-testid={`${option}`}
                    />
                  </div>
                ))}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="EventDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteEventHandler}
            data-testid="deleteEventBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        id={`editEventModal${props.id}`}
        show={eventUpdateModalIsOpen}
        onHide={toggleUpdateModel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            id={`editEventModal${props.id}Label`}
            className="text-white"
          >
            {' '}
            {t('editEvent')}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={updateEventHandler}>
          <Modal.Body>
            <label htmlFor="eventtitle">{t('eventTitle')}</label>
            <Form.Control
              type="title"
              id="eventitle"
              className="mb-3"
              autoComplete="off"
              data-testid="updateTitle"
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
              className="mb-3"
              autoComplete="off"
              data-testid="updateDescription"
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
              className="mb-3"
              autoComplete="off"
              data-testid="updateLocation"
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
                  value={dayjs(eventStartDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEventStartDate(date?.toDate());
                      setEventEndDate(
                        eventEndDate &&
                          (eventEndDate < date?.toDate()
                            ? date?.toDate()
                            : eventEndDate),
                      );
                      // setRecurrenceRuleState({
                      //   ...recurrenceRuleState,
                      //   weekDays: [Days[date?.toDate().getDay()]],
                      //   weekDayOccurenceInMonth: weekDayOccurenceInMonth
                      //     ? getWeekDayOccurenceInMonth(date?.toDate())
                      //     : undefined,
                      // });
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('endDate')}
                  className={styles.datebox}
                  value={dayjs(eventEndDate ?? eventStartDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEventEndDate(date?.toDate());
                    }
                  }}
                  minDate={dayjs(eventStartDate)}
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
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="allday">{t('allDay')}?</label>
                  <Form.Switch
                    id="allday"
                    type="checkbox"
                    data-testid="updateAllDay"
                    checked={alldaychecked}
                    onChange={(): void => setAllDayChecked(!alldaychecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="recurring">{t('recurringEvent')}:</label>
                  <Form.Switch
                    id="recurring"
                    type="checkbox"
                    data-testid="updateRecurring"
                    checked={recurringchecked}
                    onChange={(): void =>
                      setRecurringChecked(!recurringchecked)
                    }
                  />
                </div>
              </div>
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="ispublic">{t('isPublic')}?</label>
                  <Form.Switch
                    id="ispublic"
                    type="checkbox"
                    data-testid="updateIsPublic"
                    checked={publicchecked}
                    onChange={(): void => setPublicChecked(!publicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="registrable">{t('isRegistrable')}?</label>
                  <Form.Switch
                    id="registrable"
                    type="checkbox"
                    data-testid="updateRegistrable"
                    checked={registrablechecked}
                    onChange={(): void =>
                      setRegistrableChecked(!registrablechecked)
                    }
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              data-testid="EventUpdateModalCloseBtn"
              onClick={toggleUpdateModel}
            >
              {t('close')}
            </Button>
            <Button
              type="submit"
              className="btn btn-success"
              data-testid="updateEventBtn"
            >
              {t('editEvent')}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
export {};
export default eventListCard;
