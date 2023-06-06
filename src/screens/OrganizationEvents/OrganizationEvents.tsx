import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalendar/EventCalendar';
import Calendar from 'react-calendar';
import './calendar.css';

import styles from './OrganizationEvents.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import {
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import type { RootState } from 'state/reducers';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  document.title = t('title');
  const [eventmodalisOpen, setEventModalIsOpen] = useState(false);

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

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
  const currentUrl = window.location.href.split('=')[1];

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

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

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const userId = localStorage.getItem('id') as string;
  const userRole = localStorage.getItem('UserType') as string;

  const [create, { loading: loading2 }] = useMutation(CREATE_EVENT_MUTATION);

  const createEvent = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { data } = await create({
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
      if (data) {
        toast.success(t('eventCreated'));
        refetch();
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
  };

  if (loading || loading2) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign('/orglist');
  }

  /* istanbul ignore next */

  return (
    <>
      <AdminNavbar targets={targets} url1={configUrl} />
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
      <Modal
        isOpen={eventmodalisOpen}
        style={{
          overlay: { backgroundColor: 'grey' },
        }}
        className={styles.modalbody}
        ariaHideApp={false}
      >
        <section id={styles.grid_wrapper}>
          <div className={styles.form_wrapper}>
            <div className={styles.flexdir}>
              <p className={styles.titlemodal}>{t('eventDetails')}</p>
              <a
                onClick={hideInviteModal}
                className={styles.cancel}
                data-testid="createEventModalCloseBtn"
              >
                <i className="fa fa-times"></i>
              </a>
            </div>
            <Form onSubmitCapture={createEvent}>
              <label htmlFor="eventtitle">{t('eventTitle')}</label>
              <input
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
              <input
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
              <input
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
                    <input
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
                    <input
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
              <div className={styles.checkboxdiv}>
                <div className={styles.dispflex}>
                  <label htmlFor="allday">{t('allDay')}?</label>
                  <input
                    id="allday"
                    type="checkbox"
                    checked={alldaychecked}
                    data-testid="alldayCheck"
                    onChange={(): void => setAllDayChecked(!alldaychecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="recurring">{t('recurringEvent')}:</label>
                  <input
                    id="recurring"
                    type="checkbox"
                    data-testid="recurringCheck"
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
                  <input
                    id="ispublic"
                    type="checkbox"
                    data-testid="ispublicCheck"
                    checked={publicchecked}
                    onChange={(): void => setPublicChecked(!publicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="registrable">{t('isRegistrable')}?</label>
                  <input
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
              <button
                type="submit"
                className={styles.greenregbtn}
                value="createevent"
                data-testid="createEventBtn"
              >
                {t('createEvent')}
              </button>
            </Form>
          </div>
        </section>
      </Modal>
    </>
  );
}

export default organizationEvents;
