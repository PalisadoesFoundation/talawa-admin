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
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { Form } from 'react-bootstrap';
import { errorHandler } from 'utils/errorHandler';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import {
  RecurringEventMutationType,
  recurringEventMutationOptions,
} from 'utils/recurrenceUtils';

export interface InterfaceEventListCardProps {
  userRole?: string;
  key: string;
  id: string;
  eventLocation: string;
  eventName: string;
  eventDescription: string;
  regDate: string;
  regEndDate: string;
  startTime: string | undefined;
  endTime: string | undefined;
  allDay: boolean;
  recurring: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  registrants?: {
    _id: string;
  }[];
  creator?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
}

enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

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
  const { orgId } = useParams();
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }
  const navigate = useNavigate();
  const { getItem } = useLocalStorage();
  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    location: '',
    regDate: '',
    regEndDate: '',
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

  useEffect(() => {
    setFormState({
      title: props.eventName,
      eventdescrip: props.eventDescription,
      location: props.eventLocation,
      regDate: props.regDate,
      regEndDate: props.regEndDate,
      startTime: props.startTime?.split('.')[0] || '08:00:00',
      endTime: props.endTime?.split('.')[0] || '18:00:00',
    });

    setAllDayChecked(props.allDay);
    setRecurringChecked(props.recurring);
    setPublicChecked(props.isPublic);
    setRegistrableChecked(props.isRegisterable);
  }, []);

  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);
  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);
  const userId = getItem('userId');

  const isInitiallyRegistered = props?.registrants?.some(
    (registrant) => registrant._id === userId,
  );

  const [registerEventMutation] = useMutation(REGISTER_EVENT);
  const [isRegistered, setIsRegistered] = React.useState(isInitiallyRegistered);

  const [recurringEventDeleteType, setRecurringEventDeleteType] =
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

    if (new Date(formState.regEndDate) < new Date(formState.regDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const { data } = await updateEvent({
        variables: {
          id: props.id,
          title: formState.title,
          description: formState.eventdescrip,
          isPublic: publicchecked,
          recurring: recurringchecked,
          isRegisterable: registrablechecked,
          allDay: alldaychecked,
          location: formState.location,
          startDate: formState.regDate,
          endDate: formState.regEndDate,
          startTime: !alldaychecked ? formState.startTime + 'Z' : null,
          endTime: !alldaychecked ? formState.endTime + 'Z' : null,
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

  const registerEventHandler = async (): Promise<void> => {
    if (!isRegistered) {
      try {
        const { data } = await registerEventMutation({
          variables: {
            eventId: props.id,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setIsRegistered(true);
          toast.success(`Successfully registered for ${props.eventName}`);
        }
      } catch (error: unknown) {
        /* istanbul ignore next */
        toast.error(error);
      }
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
          backgroundColor: '#d9d9d9',
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
      <Modal show={eventmodalisOpen} centered dialogClassName="" scrollable>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            variant="danger"
            onClick={hideViewModal}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p className={styles.preview}>{t('eventTitle')}</p>
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
                !(props.creator?._id === userId) && props.userRole === Role.USER
              }
            />
            <p className={styles.preview}>{t('description')}</p>
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
                !(props.creator?._id === userId) && props.userRole === Role.USER
              }
            />
            <p className={styles.preview}>{t('location')}</p>
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
                !(props.creator?._id === userId) && props.userRole === Role.USER
              }
            />
            <div className={styles.datediv}>
              <div className={styles.startDate}>
                <p className={styles.preview}>{t('regDate')}</p>
                <Form.Control
                  type="date"
                  id="eventregDate"
                  autoComplete="off"
                  data-testid="updateregDate"
                  required
                  value={formState.regDate}
                  onChange={(e): void => {
                    setFormState({
                      ...formState,
                      regDate: e.target.value,
                    });
                  }}
                  disabled={
                    !(props.creator?._id === userId) &&
                    props.userRole === Role.USER
                  }
                />
              </div>
              <div className={styles.endDate}>
                <p className={styles.preview}>{t('regEndDate')}</p>
                <Form.Control
                  type="date"
                  id="eventregEndDate"
                  autoComplete="off"
                  data-testid="updateregEndDate"
                  required
                  value={formState.regEndDate}
                  onChange={(e): void => {
                    setFormState({
                      ...formState,
                      regEndDate: e.target.value,
                    });
                  }}
                  disabled={
                    !(props.creator?._id === userId) &&
                    props.userRole === Role.USER
                  }
                />
              </div>
            </div>
            {!alldaychecked && (
              <div className={styles.datediv}>
                <div className={styles.startTime}>
                  <p className={styles.preview}>{t('startTime')}</p>
                  <Form.Control
                    id="startTime"
                    value={formState.startTime}
                    data-testid="updateStartTime"
                    onChange={(e): void =>
                      setFormState({
                        ...formState,
                        startTime: e.target.value,
                      })
                    }
                    disabled={
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
                    }
                  />
                </div>
                <div className={styles.endTime}>
                  <p className={styles.preview}>{t('endTime')}</p>
                  <Form.Control
                    id="endTime"
                    value={formState.endTime}
                    data-testid="updateEndTime"
                    onChange={(e): void =>
                      setFormState({
                        ...formState,
                        endTime: e.target.value,
                      })
                    }
                    disabled={
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
                    }
                  />
                </div>
              </div>
            )}
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
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
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
                    }
                  />
                </div>
                <div className={styles.dispflex}>
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
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
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
                    onChange={(): void => {
                      setPublicChecked(!publicchecked);
                    }}
                    disabled={
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
                    }
                  />
                </div>
                <div className={styles.dispflex}>
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
                      !(props.creator?._id === userId) &&
                      props.userRole === Role.USER
                    }
                  />
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <form onSubmit={updateEventHandler}>
          <Modal.Footer>
            {(props.userRole !== Role.USER ||
              props.creator?._id === userId) && (
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
            {(props.userRole !== Role.USER ||
              props.creator?._id === userId) && (
              <Button
                type="submit"
                variant="success"
                className={styles.icon}
                data-testid="updatePostBtn"
              >
                {t('editEvent')}
              </Button>
            )}
            {(props.userRole !== Role.USER ||
              props.creator?._id === userId) && (
              <Button
                variant="danger"
                data-testid="deleteEventModalBtn"
                className={styles.icon}
                onClick={toggleDeleteModal}
              >
                {t('deleteEvent')}
              </Button>
            )}
            {props.userRole === Role.USER &&
              !(props.creator?._id === userId) &&
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
                  {t('registerEvent')}
                </Button>
              ))}
          </Modal.Footer>
        </form>
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
    </>
  );
}
export {};
export default eventListCard;
