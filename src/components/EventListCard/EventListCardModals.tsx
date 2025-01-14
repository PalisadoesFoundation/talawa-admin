import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Popover } from 'react-bootstrap';
import styles from '../../style/app.module.css';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { InterfaceEventListCardProps } from './EventListCard';
import {
  type InterfaceRecurrenceRuleState,
  type RecurringEventMutationType,
  Days,
  Frequency,
  allInstances,
  getRecurrenceRuleText,
  getWeekDayOccurenceInMonth,
  recurringEventMutationOptions,
  thisAndFollowingInstances,
  thisInstance,
  haveInstanceDatesChanged,
  hasRecurrenceRuleChanged,
} from 'utils/recurrenceUtils';
import useLocalStorage from 'utils/useLocalstorage';
import RecurrenceOptions from 'components/RecurrenceOptions/RecurrenceOptions';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DELETE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

/**
 * Converts a time string to a Dayjs object representing the current date with the specified time.
 * @param time - A string representing the time in 'HH:mm:ss' format.
 * @returns A Dayjs object with the current date and specified time.
 */
const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

/**
 * Properties for the `EventListCardModals` component.
 * eventListCardProps - The properties of the event list card.
 * eventModalIsOpen - Boolean indicating if the event modal is open.
 * hideViewModal - Function to hide the event modal.
 * t - Function for translation of text.
 * tCommon - Function for translation of common text.
 */
interface InterfaceEventListCardModalProps {
  eventListCardProps: InterfaceEventListCardProps;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * The `EventListCardModals` component displays the modals related to events, such as viewing,
 * updating, and deleting events.
 * @param props - The properties for the component.
 * @returns A JSX element containing the event modals.
 */
function EventListCardModals({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  t,
  tCommon,
}: InterfaceEventListCardModalProps): JSX.Element {
  const { refetchEvents } = eventListCardProps;

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [alldaychecked, setAllDayChecked] = useState(eventListCardProps.allDay);
  const [recurringchecked, setRecurringChecked] = useState(
    eventListCardProps.recurring,
  );
  const [publicchecked, setPublicChecked] = useState(
    eventListCardProps.isPublic,
  );
  const [registrablechecked, setRegistrableChecked] = useState(
    eventListCardProps.isRegisterable,
  );
  const [eventDeleteModalIsOpen, setEventDeleteModalIsOpen] = useState(false);
  const [recurringEventUpdateModalIsOpen, setRecurringEventUpdateModalIsOpen] =
    useState(false);
  const [eventStartDate, setEventStartDate] = useState(
    new Date(eventListCardProps.startDate),
  );
  const [eventEndDate, setEventEndDate] = useState(
    new Date(eventListCardProps.endDate),
  );

  const [recurrenceRuleState, setRecurrenceRuleState] =
    useState<InterfaceRecurrenceRuleState>({
      recurrenceStartDate: eventStartDate,
      recurrenceEndDate: null,
      frequency: Frequency.WEEKLY,
      weekDays: [Days[eventStartDate.getDay()]],
      interval: 1,
      count: undefined,
      weekDayOccurenceInMonth: undefined,
    });

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

  const [formState, setFormState] = useState({
    title: eventListCardProps.eventName,
    eventdescrip: eventListCardProps.eventDescription,
    location: eventListCardProps.eventLocation,
    startTime: eventListCardProps.startTime?.split('.')[0] || '08:00:00',
    endTime: eventListCardProps.endTime?.split('.')[0] || '08:00:00',
  });

  const [recurringEventDeleteType, setRecurringEventDeleteType] =
    useState<RecurringEventMutationType>(thisInstance);

  const [recurringEventUpdateType, setRecurringEventUpdateType] =
    useState<RecurringEventMutationType>(thisInstance);

  const [recurringEventUpdateOptions, setRecurringEventUpdateOptions] =
    useState<RecurringEventMutationType[]>([
      thisInstance,
      thisAndFollowingInstances,
      allInstances,
    ]);

  const [
    shouldShowRecurringEventUpdateOptions,
    setShouldShowRecurringEventUpdateOptions,
  ] = useState(true);

  useEffect(() => {
    if (eventModalIsOpen) {
      if (eventListCardProps.recurrenceRule) {
        // get the recurrence rule
        const { recurrenceRule } = eventListCardProps;

        // set the recurrence rule state
        setRecurrenceRuleState({
          recurrenceStartDate: new Date(recurrenceRule.recurrenceStartDate),
          recurrenceEndDate: recurrenceRule.recurrenceEndDate
            ? new Date(recurrenceRule.recurrenceEndDate)
            : null,
          frequency: recurrenceRule.frequency,
          weekDays: recurrenceRule.weekDays,
          interval: recurrenceRule.interval,
          count: recurrenceRule.count ?? undefined,
          weekDayOccurenceInMonth:
            recurrenceRule.weekDayOccurenceInMonth ?? undefined,
        });
      }
    }
  }, [eventModalIsOpen]);

  // a state to specify whether the recurrence rule has changed
  const [recurrenceRuleChanged, setRecurrenceRuleChanged] = useState(false);

  // a state to specify whether the instance's startDate or endDate has changed
  const [instanceDatesChanged, setInstanceDatesChanged] = useState(false);

  // the `recurrenceRuleChanged` & `instanceDatesChanged` are required,
  // because we will provide recurring event update options based on them, i.e.:
  //   - if the `instanceDatesChanged` is true, we'll not provide the option to update "allInstances"
  //   - if the `recurrenceRuleChanged` is true, we'll not provide the option to update "thisInstance"
  //   - if both are true, we'll only provide the option to update "thisAndFollowingInstances"
  // updating recurring events is not very straightforward,
  // find more info on the approach in this doc https://docs.talawa.io/docs/functionalities/recurring-events

  useEffect(() => {
    setInstanceDatesChanged(
      haveInstanceDatesChanged(
        eventListCardProps.startDate,
        eventListCardProps.endDate,
        dayjs(eventStartDate).format('YYYY-MM-DD'), // convert to date string
        dayjs(eventEndDate).format('YYYY-MM-DD'), // convert to date string
      ),
    );
    setRecurrenceRuleChanged(
      hasRecurrenceRuleChanged(
        eventListCardProps.recurrenceRule,
        recurrenceRuleState,
      ),
    );
  }, [eventStartDate, eventEndDate, recurrenceRuleState]);

  useEffect(() => {
    if (instanceDatesChanged) {
      setRecurringEventUpdateType(thisInstance);
      setRecurringEventUpdateOptions([thisInstance, thisAndFollowingInstances]);
      setShouldShowRecurringEventUpdateOptions(true);
    }

    if (recurrenceRuleChanged) {
      setRecurringEventUpdateType(thisAndFollowingInstances);
      setRecurringEventUpdateOptions([thisAndFollowingInstances, allInstances]);
      setShouldShowRecurringEventUpdateOptions(true);
    }

    if (recurrenceRuleChanged && instanceDatesChanged) {
      setRecurringEventUpdateType(thisAndFollowingInstances);
      setShouldShowRecurringEventUpdateOptions(false);
    }

    if (!recurrenceRuleChanged && !instanceDatesChanged) {
      setRecurringEventUpdateType(thisInstance);
      setRecurringEventUpdateOptions([
        thisInstance,
        thisAndFollowingInstances,
        allInstances,
      ]);
      setShouldShowRecurringEventUpdateOptions(true);
    }
  }, [recurrenceRuleChanged, instanceDatesChanged]);

  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);

  const updateEventHandler = async (): Promise<void> => {
    try {
      const { data } = await updateEvent({
        variables: {
          id: eventListCardProps.id,
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
          endDate: dayjs(eventEndDate).format('YYYY-MM-DD'),
          location: formState.location,
          startTime: !alldaychecked ? formState.startTime : undefined,
          endTime: !alldaychecked ? formState.endTime : undefined,
          recurrenceStartDate: recurringchecked
            ? recurringEventUpdateType === thisAndFollowingInstances &&
              (instanceDatesChanged || recurrenceRuleChanged)
              ? dayjs(eventStartDate).format('YYYY-MM-DD')
              : dayjs(recurrenceStartDate).format('YYYY-MM-DD')
            : undefined,
          recurrenceEndDate: recurringchecked
            ? recurrenceEndDate
              ? dayjs(recurrenceEndDate).format('YYYY-MM-DD')
              : null
            : undefined,
          frequency: recurringchecked ? frequency : undefined,
          weekDays:
            recurringchecked &&
            (frequency === Frequency.WEEKLY ||
              (frequency === Frequency.MONTHLY && weekDayOccurenceInMonth))
              ? weekDays
              : undefined,
          interval: recurringchecked ? interval : undefined,
          count: recurringchecked ? count : undefined,
          weekDayOccurenceInMonth: recurringchecked
            ? weekDayOccurenceInMonth
            : undefined,
        },
      });

      if (data) {
        toast.success(t('eventUpdated') as string);
        setRecurringEventUpdateModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleEventUpdate = async (): Promise<void> => {
    if (!eventListCardProps.recurring) {
      await updateEventHandler();
    } else {
      if (shouldShowRecurringEventUpdateOptions) {
        setRecurringEventUpdateModalIsOpen(true);
      } else {
        await updateEventHandler();
      }
    }
  };

  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);

  const deleteEventHandler = async (): Promise<void> => {
    try {
      const { data } = await deleteEvent({
        variables: {
          id: eventListCardProps.id,
          recurringEventDeleteType: eventListCardProps.recurring
            ? recurringEventDeleteType
            : undefined,
        },
      });

      if (data) {
        toast.success(t('eventDeleted') as string);
        setEventDeleteModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const toggleDeleteModal = (): void => {
    setEventDeleteModalIsOpen(!eventDeleteModalIsOpen);
  };

  const isInitiallyRegistered = eventListCardProps?.registrants?.some(
    (registrant) => registrant._id === userId,
  );
  const [registerEventMutation] = useMutation(REGISTER_EVENT);
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered);

  const registerEventHandler = async (): Promise<void> => {
    if (!isRegistered) {
      try {
        const { data } = await registerEventMutation({
          variables: {
            eventId: eventListCardProps.id,
          },
        });

        if (data) {
          toast.success(
            `Successfully registered for ${eventListCardProps.eventName}`,
          );
          setIsRegistered(true);
          hideViewModal();
        }
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    }
  };

  const toggleRecurringEventUpdateModal = (): void => {
    setRecurringEventUpdateModalIsOpen(!recurringEventUpdateModalIsOpen);
  };

  const openEventDashboard = (): void => {
    const userPath = eventListCardProps.userRole === Role.USER ? 'user/' : '';
    console.log(`/${userPath}event/${orgId}/${eventListCardProps.id}`);
    navigate(`/${userPath}event/${orgId}/${eventListCardProps.id}`);
  };

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
      {/* preview modal */}
      <Modal show={eventModalIsOpen} centered dialogClassName="" scrollable>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            variant="danger"
            onClick={hideViewModal}
            data-testid="eventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p className={styles.previewEventListCardModals}>
              {t('eventTitle')}
            </p>
            <Form.Control
              type="title"
              id="eventitle"
              className="mb-3"
              autoComplete="off"
              data-testid="updateTitle"
              required
              value={
                formState.title.length > 100
                  ? formState.title.substring(0, 100) + '...'
                  : formState.title
              }
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  title: e.target.value,
                });
              }}
              disabled={
                !(eventListCardProps.creator?._id === userId) &&
                eventListCardProps.userRole === Role.USER
              }
            />
            <p className={styles.previewEventListCardModals}>
              {tCommon('description')}
            </p>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              className="mb-3"
              autoComplete="off"
              data-testid="updateDescription"
              required
              value={
                formState.eventdescrip.length > 256
                  ? formState.eventdescrip.substring(0, 256) + '...'
                  : formState.eventdescrip
              }
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  eventdescrip: e.target.value,
                });
              }}
              disabled={
                !(eventListCardProps.creator?._id === userId) &&
                eventListCardProps.userRole === Role.USER
              }
            />
            <p className={styles.previewEventListCardModals}>
              {tCommon('location')}
            </p>
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
              disabled={
                !(eventListCardProps.creator?._id === userId) &&
                eventListCardProps.userRole === Role.USER
              }
            />
            <div className={styles.datediv}>
              <div>
                <DatePicker
                  label={tCommon('startDate')}
                  className={styles.datebox}
                  value={dayjs(eventStartDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEventStartDate(date?.toDate());
                      setEventEndDate(
                        eventEndDate < date?.toDate()
                          ? date?.toDate()
                          : eventEndDate,
                      );
                      if (!eventListCardProps.recurring) {
                        setRecurrenceRuleState({
                          ...recurrenceRuleState,
                          recurrenceStartDate: date?.toDate(),
                          weekDays: [Days[date?.toDate().getDay()]],
                          weekDayOccurenceInMonth: weekDayOccurenceInMonth
                            ? getWeekDayOccurenceInMonth(date?.toDate())
                            : undefined,
                        });
                      }
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={tCommon('endDate')}
                  className={styles.datebox}
                  value={dayjs(eventEndDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setEventEndDate(date?.toDate());
                    }
                  }}
                  minDate={dayjs(eventStartDate)}
                />
              </div>
            </div>
            {!alldaychecked && (
              <div className={styles.datediv}>
                <div>
                  <TimePicker
                    label={tCommon('startTime')}
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
            )}
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxdivEventListCardModals}>
                <div className={styles.dispflexEventListCardModals}>
                  <label htmlFor="allday">{t('allDay')}?</label>
                  <Form.Switch
                    id="allday"
                    type="checkbox"
                    data-testid="updateAllDay"
                    checked={alldaychecked}
                    onChange={(): void => {
                      setAllDayChecked(!alldaychecked);
                    }}
                    disabled={
                      !(eventListCardProps.creator?._id === userId) &&
                      eventListCardProps.userRole === Role.USER
                    }
                  />
                </div>
                <div className={styles.dispflexEventListCardModals}>
                  <label htmlFor="recurring">{t('recurringEvent')}:</label>
                  <Form.Switch
                    id="recurring"
                    type="checkbox"
                    data-testid="updateRecurring"
                    checked={recurringchecked}
                    onChange={(): void => {
                      setRecurringChecked(!recurringchecked);
                    }}
                    disabled={
                      !(eventListCardProps.creator?._id === userId) &&
                      eventListCardProps.userRole === Role.USER
                    }
                  />
                </div>
              </div>
              <div className={styles.checkboxdivEventListCardModals}>
                <div className={styles.dispflexEventListCardModals}>
                  <label htmlFor="ispublic">{t('isPublic')}?</label>
                  <Form.Switch
                    id="ispublic"
                    type="checkbox"
                    data-testid="updateIsPublic"
                    checked={publicchecked}
                    onChange={(): void => {
                      setPublicChecked(!publicchecked);
                    }}
                    disabled={
                      !(eventListCardProps.creator?._id === userId) &&
                      eventListCardProps.userRole === Role.USER
                    }
                  />
                </div>
                <div className={styles.dispflexEventListCardModals}>
                  <label htmlFor="registrable">{t('isRegistrable')}?</label>
                  <Form.Switch
                    id="registrable"
                    type="checkbox"
                    data-testid="updateRegistrable"
                    checked={registrablechecked}
                    onChange={(): void => {
                      setRegistrableChecked(!registrablechecked);
                    }}
                    disabled={
                      !(eventListCardProps.creator?._id === userId) &&
                      eventListCardProps.userRole === Role.USER
                    }
                  />
                </div>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {(eventListCardProps.userRole !== Role.USER ||
            eventListCardProps.creator?._id === userId) && (
            <Button
              variant="success"
              onClick={openEventDashboard}
              data-testid="showEventDashboardBtn"
              className={styles.icon}
            >
              {' '}
              Show Event Dashboard{' '}
            </Button>
          )}
          {(eventListCardProps.userRole !== Role.USER ||
            eventListCardProps.creator?._id === userId) && (
            <Button
              variant="success"
              className={styles.icon}
              data-testid="updateEventBtn"
              onClick={handleEventUpdate}
            >
              {t('editEvent')}
            </Button>
          )}
          {(eventListCardProps.userRole !== Role.USER ||
            eventListCardProps.creator?._id === userId) && (
            <Button
              variant="danger"
              data-testid="deleteEventModalBtn"
              className={styles.icon}
              onClick={toggleDeleteModal}
            >
              {t('deleteEvent')}
            </Button>
          )}
          {eventListCardProps.userRole === Role.USER &&
            !(eventListCardProps.creator?._id === userId) &&
            (isRegistered ? (
              <Button
                className={styles.customButton}
                variant="success"
                disabled
              >
                {t('alreadyRegistered')}
              </Button>
            ) : (
              <Button
                className={styles.customButton}
                variant="success"
                onClick={registerEventHandler}
                data-testid="registerEventBtn"
              >
                {tCommon('register')}
              </Button>
            ))}
        </Modal.Footer>
      </Modal>

      {/* recurring event update options modal */}
      <Modal
        size="sm"
        id={`recurringEventUpdateOptions${eventListCardProps.id}`}
        show={recurringEventUpdateModalIsOpen}
        onHide={toggleRecurringEventUpdateModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            className="text-white"
            id={`recurringEventUpdateOptionsLabel${eventListCardProps.id}`}
          >
            {t('editEvent')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mt-3">
            {recurringEventUpdateOptions.map((option, index) => (
              <div key={index} className="my-0 d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id={`radio-${index}`}
                  label={t(option)}
                  name="recurringEventUpdateType"
                  value={option}
                  onChange={(e) =>
                    setRecurringEventUpdateType(
                      e.target.value as RecurringEventMutationType,
                    )
                  }
                  defaultChecked={option === recurringEventUpdateType}
                  data-testid={`update-${option}`}
                />
              </div>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleRecurringEventUpdateModal}
            data-testid="eventUpdateOptionsModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={updateEventHandler}
            data-testid="recurringEventUpdateOptionSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* delete modal */}
      <Modal
        size="sm"
        id={`deleteEventModal${eventListCardProps.id}`}
        show={eventDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title
            className="text-white"
            id={`deleteEventModalLabel${eventListCardProps.id}`}
          >
            {t('deleteEvent')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!eventListCardProps.recurring && t('deleteEventMsg')}
          {eventListCardProps.recurring && (
            <>
              <Form className="mt-3">
                {recurringEventMutationOptions.map((option, index) => (
                  <div key={index} className="my-0 d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      id={`radio-${index}`}
                      label={t(option)}
                      name="recurringEventDeleteType"
                      value={option}
                      onChange={(e) =>
                        setRecurringEventDeleteType(
                          e.target.value as RecurringEventMutationType,
                        )
                      }
                      defaultChecked={option === recurringEventDeleteType}
                      data-testid={`delete-${option}`}
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
            data-testid="eventDeleteModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteEventHandler}
            data-testid="deleteEventBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EventListCardModals;
