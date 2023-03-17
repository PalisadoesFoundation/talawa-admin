import React, { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import styles from './EventListCard.module.css';
import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

interface EventListCardProps {
  key: string;
  id: string;
  eventLocation: string;
  eventName: string;
  eventDescription: string;
  regDate: string;
  regEndDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurring: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
}
function EventListCard(props: EventListCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });

  const [alldaychecked, setAllDayChecked] = useState(true);
  const [recurringchecked, setRecurringChecked] = useState(false);
  const [publicchecked, setPublicChecked] = useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);
  const [formState, setFormState] = useState({
    title: '',
    eventdescrip: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });

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
  }, []);

  const [create] = useMutation(DELETE_EVENT_MUTATION);
  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION);

  const DeleteEvent = async () => {
    try {
      const { data } = await create({
        variables: {
          id: props.id,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Event deleted successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  const updateEventHandler = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          startTime: !alldaychecked ? formState.startTime + 'Z' : null,
          endTime: !alldaychecked ? formState.endTime + 'Z' : null,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success('Event updated successfully.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="">
        <div className={styles.cards}>
          <div className={styles.dispflex}>
            <h2>{props.eventName ? <>{props.eventName}</> : <>Dogs Care</>}</h2>
            <div className={styles.iconContainer}>
              <a
                data-testid="deleteEventModalBtn"
                className={`${styles.icon} mr-1`}
                data-toggle="modal"
                data-target={`#deleteEventModal${props.id}`}
              >
                <i className="fa fa-trash"></i>
              </a>
              <a
                data-testid="editEventModalBtn"
                className={styles.icon}
                data-toggle="modal"
                data-target={`#editEventModal${props.id}`}
              >
                <i className="fas fa-edit"></i>
              </a>
            </div>
          </div>
          {/* <p>
            {t('location')}:{' '}
            <span>
              {props.eventLocation ? <>{props.eventLocation}</> : <>India</>}
            </span>
          </p>
          <p>{props.eventDescription}</p>
          <p>
            {t('on')}: <span>{props.regDate}</span>
          </p>
          <p>
            {t('end')}: <span>{props.regEndDate}</span>
          </p> */}
        </div>
      </div>

      {/* delete modal */}
      <div
        className="modal fade"
        id={`deleteEventModal${props.id}`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`deleteEventModalLabel${props.id}`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id={`deleteEventModalLabel${props.id}`}
              >
                {t('deleteEvent')}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{t('deleteEventMsg')}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                {t('no')}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={DeleteEvent}
                data-testid="deleteEventBtn"
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id={`editEventModal${props.id}`}
        tabIndex={-1}
        aria-labelledby={`editEventModal${props.id}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`editEventModal${props.id}Label`}>
                {t('editEvent')}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={updateEventHandler}>
              <div className="modal-body">
                <label htmlFor="eventtitle">{t('eventTitle')}</label>
                <input
                  type="title"
                  id="eventitle"
                  autoComplete="off"
                  data-testid="updateTitle"
                  required
                  value={formState.title}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      title: e.target.value,
                    });
                  }}
                />
                <label htmlFor="eventdescrip">{t('description')}</label>
                <input
                  type="eventdescrip"
                  id="eventdescrip"
                  autoComplete="off"
                  data-testid="updateDescription"
                  required
                  value={formState.eventdescrip}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      eventdescrip: e.target.value,
                    });
                  }}
                />
                <label htmlFor="eventLocation">{t('location')}</label>
                <input
                  type="text"
                  id="eventLocation"
                  autoComplete="off"
                  data-testid="updateLocation"
                  required
                  value={formState.location}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      location: e.target.value,
                    });
                  }}
                />
                {!alldaychecked && (
                  <div className={styles.datediv}>
                    <div className="mr-3">
                      <label htmlFor="startTime">{t('startTime')}</label>
                      <input
                        id="startTime"
                        value={formState.startTime}
                        data-testid="updateStartTime"
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime">{t('endTime')}</label>
                      <input
                        id="endTime"
                        value={formState.endTime}
                        data-testid="updateEndTime"
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
                <div className={styles.checkboxdiv}>
                  <div className={styles.dispflex}>
                    <label htmlFor="allday">{t('allDay')}?</label>
                    <input
                      id="allday"
                      type="checkbox"
                      data-testid="updateAllDay"
                      defaultChecked={alldaychecked}
                      onChange={() => setAllDayChecked(!alldaychecked)}
                    />
                  </div>
                  <div className={styles.dispflex}>
                    <label htmlFor="recurring">{t('recurringEvent')}:</label>
                    <input
                      id="recurring"
                      type="checkbox"
                      data-testid="updateRecurring"
                      defaultChecked={recurringchecked}
                      onChange={() => setRecurringChecked(!recurringchecked)}
                    />
                  </div>
                </div>
                <div className={styles.checkboxdiv}>
                  <div className={styles.dispflex}>
                    <label htmlFor="ispublic">{t('isPublic')}?</label>
                    <input
                      id="ispublic"
                      type="checkbox"
                      data-testid="updateIsPublic"
                      defaultChecked={publicchecked}
                      onChange={() => setPublicChecked(!publicchecked)}
                    />
                  </div>
                  <div className={styles.dispflex}>
                    <label htmlFor="registrable">{t('isRegistrable')}?</label>
                    <input
                      id="registrable"
                      type="checkbox"
                      data-testid="updateRegistrable"
                      defaultChecked={registrablechecked}
                      onChange={() =>
                        setRegistrableChecked(!registrablechecked)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  {t('close')}
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  data-testid="updatePostBtn"
                >
                  {t('updatePost')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export {};
export default EventListCard;
