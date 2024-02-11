import React from 'react';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import EventCard from 'components/UserPortal/EventCard/EventCard';
import OrgScreen from 'components/UserPortal/OrgScreen/OrgScreen';
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import PaginationList from 'components/PaginationList/PaginationList';
import {
  ORGANIZATION_EVENTS_CONNECTION,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { SearchOutlined } from '@mui/icons-material';
import styles from './Events.module.css';
import { useTranslation } from 'react-i18next';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import getOrganizationId from 'utils/getOrganizationId';
import Modal from 'react-bootstrap/Modal';
import ReactDatePicker from 'react-datepicker';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import EventCalendar from 'components/EventCalendar/EventCalendar';
import useLocalStorage from 'utils/useLocalstorage';

interface InterfaceEventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isRegisterable: boolean;
  isPublic: boolean;
  endTime: string;
  startTime: string;
  recurring: boolean;
  allDay: boolean;
  creator: {
    firstName: string;
    lastName: string;
    id: string;
  };
  registrants: {
    id: string;
  }[];
}

export default function events(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userEvents',
  });

  const { getItem } = useLocalStorage();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [events, setEvents] = React.useState([]);
  const [mode, setMode] = React.useState(0);
  const [showCreateEventModal, setShowCreateEventModal] = React.useState(false);
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [isPublic, setIsPublic] = React.useState(true);
  const [isRegisterable, setIsRegisterable] = React.useState(true);
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [isAllDay, setIsAllDay] = React.useState(true);
  const [startTime, setStartTime] = React.useState('08:00:00');
  const [endTime, setEndTime] = React.useState('10:00:00');

  const organizationId = getOrganizationId(window.location.href);

  const modes = [t('listView'), t('calendarView')];

  const { data, loading, refetch } = useQuery(ORGANIZATION_EVENTS_CONNECTION, {
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
  const userRole = getItem('UserType') as string;

  const createEvent = async (): Promise<void> => {
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
      setShowCreateEventModal(false);
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const toggleCreateEventModal = (): void =>
    setShowCreateEventModal(!showCreateEventModal);

  /* istanbul ignore next */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const newRowsPerPage = event.target.value;

    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

  const handleSearch = (value: string): void => {
    refetch({
      title_contains: value,
    });
    setPage(0);
  };
  const handleSearchByEnter = (e: any): void => {
    if (e.key === 'Enter') {
      const { value } = e.target;
      handleSearch(value);
    }
  };
  const handleSearchByBtnClick = (): void => {
    const value =
      (document.getElementById('searchEvents') as HTMLInputElement)?.value ||
      '';
    handleSearch(value);
  };

  const handleEventTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setEventTitle(event.target.value);
  };

  const handleEventLocationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setEventLocation(event.target.value);
  };

  const handleEventDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setEventDescription(event.target.value);
  };

  /* istanbul ignore next */
  const handleStartDateChange = (newDate: any): void => {
    setStartDate(newDate);
  };

  /* istanbul ignore next */
  const handleEndDateChange = (newDate: any): void => {
    setEndDate(newDate);
  };

  /* istanbul ignore next */
  React.useEffect(() => {
    if (data) {
      setEvents(data.eventsByOrganizationConnection);
    }
  }, [data]);

  return (
    <>
      <OrgScreen screenName="Events">
        <div className={`d-flex flex-row ${styles.containerHeight}`}>
          <div className={`${styles.colorLight} ${styles.mainContainer}`}>
            <div
              className={`d-flex flex-row justify-content-between flex-wrap ${styles.gap}`}
            >
              <InputGroup className={styles.maxWidth}>
                <Form.Control
                  id="searchEvents"
                  placeholder={t('search')}
                  type="text"
                  className={`${styles.borderNone} ${styles.backgroundWhite}`}
                  onKeyUp={handleSearchByEnter}
                  data-testid="searchInput"
                />
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                  style={{ cursor: 'pointer' }}
                  onClick={handleSearchByBtnClick}
                  data-testid="searchBtn"
                >
                  <SearchOutlined className={`${styles.colorWhite}`} />
                </InputGroup.Text>
              </InputGroup>
              <div className={styles.eventActionsContainer}>
                <Button
                  onClick={toggleCreateEventModal}
                  data-testid={`createEventModalBtn`}
                >
                  {t('createEvent')}
                </Button>
                <Dropdown drop="down-centered">
                  <Dropdown.Toggle
                    className={`${styles.colorPrimary} ${styles.borderNone}`}
                    variant="success"
                    id="dropdown-basic"
                    data-testid={`modeChangeBtn`}
                  >
                    {modes[mode]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {modes.map((value, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          data-testid={`modeBtn${index}`}
                          onClick={(): void => setMode(index)}
                        >
                          {value}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {mode === 0 && (
              <div
                className={`d-flex flex-column justify-content-between ${styles.content}`}
              >
                <div
                  className={`d-flex flex-column ${styles.gap} ${styles.paddingY}`}
                >
                  {loading ? (
                    <div className={`d-flex flex-row justify-content-center`}>
                      <HourglassBottomIcon /> <span>Loading...</span>
                    </div>
                  ) : (
                    <>
                      {events && events.length > 0 ? (
                        (rowsPerPage > 0
                          ? events.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : /* istanbul ignore next */
                            events
                        ).map((event: any) => {
                          const attendees: any = [];
                          event.attendees.forEach((attendee: any) => {
                            const r = {
                              id: attendee._id,
                            };

                            attendees.push(r);
                          });

                          const creator: any = {};
                          creator.firstName = event.creator.firstName;
                          creator.lastName = event.creator.lastName;
                          creator.id = event.creator._id;

                          const cardProps: InterfaceEventCardProps = {
                            id: event._id,
                            title: event.title,
                            description: event.description,
                            location: event.location,
                            startDate: event.startDate,
                            endDate: event.endDate,
                            isRegisterable: event.isRegisterable,
                            isPublic: event.isPublic,
                            endTime: event.endTime,
                            startTime: event.startTime,
                            recurring: event.recurring,
                            allDay: event.allDay,
                            registrants: attendees,
                            creator,
                          };

                          return <EventCard key={event._id} {...cardProps} />;
                        })
                      ) : (
                        <span>{t('nothingToShow')}</span>
                      )}
                    </>
                  )}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <PaginationList
                        count={
                          /* istanbul ignore next */
                          events ? events.length : 0
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {mode === 1 && (
              <div className="mt-4">
                <EventCalendar
                  eventData={events}
                  orgData={orgData}
                  userRole={userRole}
                  userId={userId}
                />
              </div>
            )}
          </div>
          <OrganizationSidebar />
          <Modal show={showCreateEventModal} onHide={toggleCreateEventModal}>
            <Modal.Header>
              <h5>{t('createEvent')}</h5>
              <Button variant="danger" onClick={toggleCreateEventModal}>
                <i className="fas fa-times"></i>
              </Button>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
              <InputGroup>
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                >
                  {t('eventTitle')}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Enter title"
                  type="text"
                  className={styles.borderNone}
                  value={eventTitle}
                  onChange={handleEventTitleChange}
                  data-testid="eventTitleInput"
                />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                >
                  {t('eventDescription')}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Enter description"
                  type="text"
                  className={styles.borderNone}
                  value={eventDescription}
                  onChange={handleEventDescriptionChange}
                  data-testid="eventDescriptionInput"
                />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text
                  className={`${styles.colorPrimary} ${styles.borderNone}`}
                >
                  {t('eventLocation')}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Enter location"
                  type="text"
                  className={styles.borderNone}
                  value={eventLocation}
                  onChange={handleEventLocationChange}
                  data-testid="eventLocationInput"
                />
              </InputGroup>
              <h6>{t('startDate')}</h6>
              <ReactDatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                className={styles.datePicker}
              />
              <h6>{t('endDate')}</h6>
              <ReactDatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                className={styles.datePicker}
              />
              <div className={styles.switches}>
                <div className={styles.switchContainer}>
                  <label htmlFor="publicEvent">{t('publicEvent')}</label>
                  <Form.Switch
                    className="ms-2"
                    type="checkbox"
                    checked={isPublic}
                    data-testid="publicEventCheck"
                    onChange={(): void => setIsPublic(!isPublic)}
                  />
                </div>

                <div className={styles.switchContainer}>
                  <label htmlFor="publicEvent">{t('registerable')}</label>
                  <Form.Switch
                    className="ms-2"
                    type="checkbox"
                    checked={isRegisterable}
                    data-testid="registerableEventCheck"
                    onChange={(): void => setIsRegisterable(!isRegisterable)}
                  />
                </div>

                <div className={styles.switchContainer}>
                  <label htmlFor="publicEvent">{t('recurring')}</label>
                  <Form.Switch
                    className="ms-2"
                    type="checkbox"
                    checked={isRecurring}
                    data-testid="recurringEventCheck"
                    onChange={(): void => setIsRecurring(!isRecurring)}
                  />
                </div>

                <div className={styles.switchContainer}>
                  <label htmlFor="publicEvent">{t('allDay')}</label>
                  <Form.Switch
                    className="ms-2"
                    type="checkbox"
                    checked={isAllDay}
                    data-testid="allDayEventCheck"
                    onChange={(): void => setIsAllDay(!isAllDay)}
                  />
                </div>

                {!isAllDay && (
                  <div className={styles.datediv}>
                    <div className="mr-3">
                      <label htmlFor="startTime">{t('startTime')}</label>
                      <Form.Control
                        id="startTime"
                        placeholder={t('startTime')}
                        value={startTime}
                        data-testid="startTimeEventInput"
                        onChange={
                          /* istanbul ignore next */
                          (e): void => setStartTime(e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime">{t('endTime')}</label>
                      <Form.Control
                        id="endTime"
                        placeholder={t('endTime')}
                        value={endTime}
                        data-testid="endTimeEventInput"
                        onChange={
                          /* istanbul ignore next */
                          (e): void => setEndTime(e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={toggleCreateEventModal}>
                {t('cancel')}
              </Button>
              <Button
                variant="success"
                onClick={createEvent}
                data-testid="createEventBtn"
              >
                {t('create')}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </OrgScreen>
    </>
  );
}
