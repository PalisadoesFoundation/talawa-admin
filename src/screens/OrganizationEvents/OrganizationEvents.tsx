import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
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
import EventHeader from 'components/EventCalendar/EventHeader';

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
}

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [alldaychecked, setAllDayChecked] = React.useState(true);
  const [recurringchecked, setRecurringChecked] = React.useState(false);

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [registrablechecked, setRegistrableChecked] = React.useState(false);

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
    setEventModalIsOpen(true);
  };
  const hideInviteModal = (): void => {
    setEventModalIsOpen(false);
  };
  const handleChangeView = (item: any): void => {
    /*istanbul ignore next*/
    setViewType(item);
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
    },
  );

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const userId = getItem('id') as string;
  const userRole = getItem('UserType') as string;

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

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
          setFormState({
            title: '',
            eventdescrip: '',
            date: '',
            location: '',
            startTime: '08:00:00',
            endTime: '18:00:00',
          });
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
    if (error) {
      navigate('/orglist');
    }
  }, [error]);

  if (loading || loading2) {
    return <Loader />;
  }

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

      <Modal show={eventmodalisOpen} onHide={hideInviteModal}>
        <Modal.Header>
          <p className={styles.titlemodal}>{t('eventDetails')}</p>
          <Button
            variant="danger"
            onClick={hideInviteModal}
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
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('endDate')}
                  className={styles.datebox}
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
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflex}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  className="ms-2 mt-3"
                  id="allday"
                  type="checkbox"
                  checked={alldaychecked}
                  data-testid="alldayCheck"
                  onChange={(): void => setAllDayChecked(!alldaychecked)}
                />
              </div>
              <div className={styles.dispflex}>
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
                  id="ispublic"
                  type="checkbox"
                  data-testid="ispublicCheck"
                  checked={publicchecked}
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
              <div className={styles.dispflex}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className="ms-2 mt-3"
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
    </>
  );
}

export default organizationEvents;
