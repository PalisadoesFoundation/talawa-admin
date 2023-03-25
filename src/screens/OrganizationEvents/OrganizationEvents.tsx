import React, { ChangeEvent, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Form } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Calendar from 'components/EventCalendar/Calendar';

import styles from './OrganizationEvents.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import {
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { RootState } from 'state/reducers';
import debounce from 'utils/debounce';
import dayjs from 'dayjs';

function OrganizationEvents(): JSX.Element {
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

  const showInviteModal = () => {
    setEventModalIsOpen(true);
  };
  const hideInviteModal = () => {
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

  const [create, { loading: loading_2 }] = useMutation(CREATE_EVENT_MUTATION);

  const CreateEvent = async (e: ChangeEvent<HTMLFormElement>) => {
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
        toast.success('Congratulations! The Event is created.');
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
      if (error.message === 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  if (loading || loading_2) {
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

  const handleSearchByTitle = (e: any) => {
    const { value } = e.target;
    const filterData = {
      organization_id: currentUrl,
      title_contains: value,
    };
    refetch(filterData);
  };
  const handleSearchByDescription = (e: any) => {
    const { value } = e.target;
    const filterData = {
      organization_id: currentUrl,
      description_contains: value,
    };
    refetch(filterData);
  };
  const handleSearchByLocation = (e: any) => {
    const { value } = e.target;
    const filterData = {
      organization_id: currentUrl,
      location_contains: value,
    };
    refetch(filterData);
  };

  const debouncedHandleSearchByTitle = debounce(handleSearchByTitle);
  const debouncedHandleSearchByDescription = debounce(
    handleSearchByDescription
  );
  const debouncedHandleSearchByLocation = debounce(handleSearchByLocation);

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('filterByTitle')}</h6>
              <input
                type="name"
                id="searchTitle"
                placeholder={t('enterFilter')}
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByTitle}
                data-testid="serachByTitle"
              />
              <h6 className={styles.searchtitle}>{t('filterByLocation')}</h6>
              <input
                type="name"
                id="searchlocation"
                placeholder={t('enterFilter')}
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByLocation}
                data-testid="searchByLocation"
              />
              <h6 className={styles.searchtitle}>{t('filterByDescription')}</h6>
              <input
                type="name"
                id="searchDescription"
                placeholder={t('enterFilter')}
                autoComplete="off"
                required
                onChange={debouncedHandleSearchByDescription}
                data-testid="serachByDescription"
              />
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
          <Calendar
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
            <Form onSubmitCapture={CreateEvent}>
              <label htmlFor="eventtitle">{t('eventTitle')}</label>
              <input
                type="title"
                id="eventitle"
                placeholder={t('enterTitle')}
                autoComplete="off"
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
                placeholder={t('enterDescrip')}
                autoComplete="off"
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
                placeholder={t('eventLocation')}
                autoComplete="off"
                required
                value={formState.location}
                onChange={(e) => {
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
                    onChange={(date: Date | null) => setStartDate(date)}
                    placeholderText={t('startDate')}
                  />
                </div>
                <div>
                  <label htmlFor="enddate">{t('endDate')}</label>
                  <DatePicker
                    className={styles.datebox}
                    id="enddate"
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
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
                      placeholder={t('endTime')}
                      value={formState.endTime}
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
                    checked={alldaychecked}
                    data-testid="alldayCheck"
                    onChange={() => setAllDayChecked(!alldaychecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="recurring">{t('recurringEvent')}:</label>
                  <input
                    id="recurring"
                    type="checkbox"
                    data-testid="recurringCheck"
                    checked={recurringchecked}
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
                    data-testid="ispublicCheck"
                    checked={publicchecked}
                    onChange={() => setPublicChecked(!publicchecked)}
                  />
                </div>
                <div className={styles.dispflex}>
                  <label htmlFor="registrable">{t('isRegistrable')}?</label>
                  <input
                    id="registrable"
                    type="checkbox"
                    data-testid="registrableCheck"
                    checked={registrablechecked}
                    onChange={() => setRegistrableChecked(!registrablechecked)}
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

export default OrganizationEvents;
