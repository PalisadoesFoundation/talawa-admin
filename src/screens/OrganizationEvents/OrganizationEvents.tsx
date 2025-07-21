/**
 * OrganizationEvents Component
 *
 * This component is responsible for rendering and managing the organization events page.
 * It includes functionalities for viewing events in different calendar views and creating new events.
 *
 * @returns The rendered OrganizationEvents component.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and `@mui/x-date-pickers` for date/time pickers.
 * - Supports multilingual translations using `react-i18next`.
 * - Handles event creation with validations.
 *
 * @example
 * ```tsx
 * <OrganizationEvents />
 * ```
 */

import React, { useState, useEffect, useMemo, JSX } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { debounce } from '@mui/material';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import styles from '../../style/app-fixed.module.css';
import CustomRecurrenceModal from './CustomRecurrenceModal';
import {
  Frequency,
  WeekDays,
  InterfaceRecurrenceRule,
  createDefaultRecurrenceRule,
  validateRecurrenceInput,
  formatRecurrenceForApi,
} from '../../utils/recurrenceUtils';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams, useNavigate } from 'react-router';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';

// Define the type for an event edge
interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    location?: string | null;
    isPublic: boolean;
    isRegisterable: boolean;
    // Recurring event fields
    isMaterialized?: boolean;
    isRecurringTemplate?: boolean;
    recurringEventId?: string | null;
    instanceStartTime?: string | null;
    baseEventId?: string | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    // Attachments
    attachments?: Array<{
      url: string;
      mimeType: string;
    }>;
    creator: {
      id: string;
      name: string;
    };
    organization: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  cursor: string;
}

const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month View',
  YEAR = 'Year View',
}

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();

  document.title = t('title');
  const [createEventmodalisOpen, setCreateEventmodalisOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [debouncedMonth, setDebouncedMonth] = useState(new Date().getMonth());
  const [debouncedYear, setDebouncedYear] = useState(new Date().getFullYear());
  const [alldaychecked, setAllDayChecked] = useState(true);
  const [publicchecked, setPublicChecked] = useState(true);
  const [registrablechecked, setRegistrableChecked] = useState(false);
  const [recurrence, setRecurrence] = useState<InterfaceRecurrenceRule | null>(
    null,
  );
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState(false);
  const [recurrenceDropdownOpen, setRecurrenceDropdownOpen] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    eventdescrip: '',
    location: '',
    startTime: '08:00:00',
    endTime: '18:00:00',
  });
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  const showInviteModal = (): void => setCreateEventmodalisOpen(true);
  const hideCreateEventModal = (): void => setCreateEventmodalisOpen(false);
  const showCustomRecurrenceModal = (): void =>
    setCustomRecurrenceModalIsOpen(true);
  const hideCustomRecurrenceModal = (): void =>
    setCustomRecurrenceModalIsOpen(false);

  // Helper functions for recurrence dropdown
  const getDayName = (dayIndex: number): string => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthIndex];
  };

  const getRecurrenceOptions = () => {
    const eventDate = new Date(startDate);
    const dayOfWeek = eventDate.getDay();
    const dayOfMonth = eventDate.getDate();
    const month = eventDate.getMonth();
    const dayName = getDayName(dayOfWeek);
    const monthName = getMonthName(month);

    return [
      {
        label: 'Does not repeat',
        value: null,
      },
      {
        label: 'Daily',
        value: createDefaultRecurrenceRule(eventDate, Frequency.DAILY),
      },
      {
        label: `Weekly on ${dayName}`,
        value: createDefaultRecurrenceRule(eventDate, Frequency.WEEKLY),
      },
      {
        label: `Monthly on day ${dayOfMonth}`,
        value: createDefaultRecurrenceRule(eventDate, Frequency.MONTHLY),
      },
      {
        label: `Annually on ${monthName} ${dayOfMonth}`,
        value: {
          frequency: Frequency.YEARLY,
          interval: 1,
          byMonth: [month + 1],
          byMonthDay: [dayOfMonth],
          never: true,
        },
      },
      {
        label: 'Every weekday (Monday to Friday)',
        value: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] as WeekDays[],
          never: true,
        },
      },
      {
        label: 'Custom...',
        value: 'custom',
      },
    ];
  };

  const handleRecurrenceSelect = (option: {
    label: string;
    value: InterfaceRecurrenceRule | 'custom' | null;
  }): void => {
    if (option.value === 'custom') {
      // Set a default recurrence and open custom modal
      if (!recurrence) {
        setRecurrence(createDefaultRecurrenceRule(startDate, Frequency.WEEKLY));
      }
      showCustomRecurrenceModal();
    } else {
      setRecurrence(option.value);
    }
    setRecurrenceDropdownOpen(false);
  };

  const getCurrentRecurrenceLabel = (): string => {
    if (!recurrence) return 'Does not repeat';

    const options = getRecurrenceOptions();
    const matchingOption = options.find((option) => {
      if (!option.value || option.value === 'custom') return false;
      return JSON.stringify(option.value) === JSON.stringify(recurrence);
    });

    return matchingOption ? matchingOption.label : 'Custom';
  };

  // Debounced functions for month/year changes
  const debouncedSetMonth = useMemo(
    () => debounce((month: number) => setDebouncedMonth(month), 300),
    [],
  );

  const debouncedSetYear = useMemo(
    () => debounce((year: number) => setDebouncedYear(year), 300),
    [],
  );
  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  const handleMonthChange = (month: number, year: number): void => {
    setCurrentMonth(month);
    setCurrentYear(year);
    debouncedSetMonth(month);
    debouncedSetYear(year);
  };

  const {
    data: eventData,
    loading: eventLoading,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 50,
      after: null,
      startDate: dayjs(new Date(debouncedYear, debouncedMonth, 1))
        .startOf('month')
        .toISOString(),
      endDate: dayjs(new Date(debouncedYear, debouncedMonth, 1))
        .endOf('month')
        .toISOString(),
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgData,
    loading: orgLoading,
    error: orgDataError,
  } = useQuery(GET_ORGANIZATION_DATA_PG, {
    variables: {
      id: currentUrl,
      first: 10, // For members pagination
      after: null,
    },
  });

  const userId = getItem('id') as string;
  const storedRole = getItem('role') as string | null;
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  const [create, { loading: createLoading }] = useMutation(
    CREATE_EVENT_MUTATION,
  );

  // Normalize event data for EventCalendar with proper typing
  const events: InterfaceEvent[] = (
    eventData?.organization?.events?.edges || []
  ).map((edge: IEventEdge) => ({
    _id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description || '',
    startDate: dayjs(edge.node.startAt).format('YYYY-MM-DD'),
    endDate: dayjs(edge.node.endAt).format('YYYY-MM-DD'),
    startTime: edge.node.allDay
      ? undefined
      : dayjs(edge.node.startAt).format('HH:mm:ss'),
    endTime: edge.node.allDay
      ? undefined
      : dayjs(edge.node.endAt).format('HH:mm:ss'),
    allDay: edge.node.allDay,
    location: edge.node.location || '',
    isPublic: edge.node.isPublic,
    isRegisterable: edge.node.isRegisterable,
    // Add recurring event information
    isMaterialized: edge.node.isMaterialized,
    isRecurringTemplate: edge.node.isRecurringTemplate,
    recurringEventId: edge.node.recurringEventId,
    instanceStartTime: edge.node.instanceStartTime,
    baseEventId: edge.node.baseEventId,
    sequenceNumber: edge.node.sequenceNumber,
    totalCount: edge.node.totalCount,
    hasExceptions: edge.node.hasExceptions,
    progressLabel: edge.node.progressLabel,
    creator: {
      _id: edge.node.creator.id,
      name: edge.node.creator.name,
    },
    attendees: [], // Adjust if attendees are added to schema
  }));

  const createEvent = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (
      formState.name.trim().length > 0 &&
      formState.eventdescrip.trim().length > 0 &&
      formState.location.trim().length > 0
    ) {
      try {
        const startTimeParts = formState.startTime.split(':');
        const endTimeParts = formState.endTime.split(':');

        let recurrenceInput;
        if (recurrence) {
          const { isValid, errors } = validateRecurrenceInput(
            recurrence,
            startDate,
          );
          if (!isValid) {
            toast.error(errors.join(', '));
            return;
          }
          recurrenceInput = formatRecurrenceForApi(recurrence);
        }

        const input = {
          name: formState.name,
          description: formState.eventdescrip,
          startAt: alldaychecked
            ? dayjs(startDate)
                .startOf('day')
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            : dayjs(startDate)
                .hour(parseInt(startTimeParts[0]))
                .minute(parseInt(startTimeParts[1]))
                .second(parseInt(startTimeParts[2]))
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          endAt: alldaychecked
            ? dayjs(endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            : dayjs(endDate)
                .hour(parseInt(endTimeParts[0]))
                .minute(parseInt(endTimeParts[1]))
                .second(parseInt(endTimeParts[2]))
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          organizationId: currentUrl,
          allDay: alldaychecked,
          location: formState.location,
          isPublic: publicchecked,
          isRegisterable: registrablechecked,
          recurrence: recurrenceInput,
        };

        const { data: createEventData } = await create({
          variables: { input },
        });

        if (createEventData) {
          toast.success(t('eventCreated') as string);
          refetchEvents();
          hideCreateEventModal();
          setFormState({
            name: '',
            eventdescrip: '',
            location: '',
            startTime: '08:00:00',
            endTime: '18:00:00',
          });
          setStartDate(new Date());
          setEndDate(new Date());
          setAllDayChecked(true);
          setPublicChecked(true);
          setRegistrableChecked(false);
          setRecurrence(null);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Event creation error:', error.message);
          console.error('Full error:', error);
          errorHandler(t, error);
        }
      }
    } else {
      if (formState.name.trim().length === 0)
        toast.warning('Name can not be blank!');
      if (formState.eventdescrip.trim().length === 0)
        toast.warning('Description can not be blank!');
      if (formState.location.trim().length === 0)
        toast.warning('Location can not be blank!');
    }
  };

  useEffect(() => {
    if (eventDataError || orgDataError) navigate('/orglist');
  }, [eventDataError, orgDataError]);

  if (eventLoading || orgLoading || createLoading) return <Loader />;

  return (
    <>
      <div className={styles.mainpageright}>
        <div className={styles.justifyspOrganizationEvents}>
          <EventHeader
            viewType={viewType}
            handleChangeView={handleChangeView}
            showInviteModal={showInviteModal}
          />
        </div>
      </div>
      <EventCalendar
        eventData={events}
        refetchEvents={refetchEvents}
        orgData={orgData?.organization}
        userId={userId}
        userRole={userRole}
        viewType={viewType}
        onMonthChange={handleMonthChange}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      {/* Create Event Modal */}
      <Modal show={createEventmodalisOpen} onHide={hideCreateEventModal}>
        <Modal.Header>
          <p className={styles.titlemodalOrganizationEvents}>
            {t('eventDetails')}
          </p>{' '}
          <Button
            variant="danger"
            onClick={hideCreateEventModal}
            className={styles.closeButtonOrganizationEvents}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createEvent}>
            <label htmlFor="eventName">{t('eventName')}</label>
            <Form.Control
              type="title"
              id="eventitle"
              placeholder={t('enterName')}
              data-testid="eventTitleInput"
              autoComplete="off"
              required
              value={formState.name}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, name: e.target.value });
              }}
            />
            <label htmlFor="eventdescrip">{tCommon('description')}</label>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              placeholder={t('enterDescrip')}
              data-testid="eventDescriptionInput"
              autoComplete="off"
              required
              value={formState.eventdescrip}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, eventdescrip: e.target.value });
              }}
            />
            <label htmlFor="eventLocation">{tCommon('enterLocation')}</label>
            <Form.Control
              type="text"
              id="eventLocation"
              placeholder={tCommon('enterLocation')}
              data-testid="eventLocationInput"
              autoComplete="off"
              required
              value={formState.location}
              className={styles.inputField}
              onChange={(e): void => {
                setFormState({ ...formState, location: e.target.value });
              }}
            />
            <div className={styles.datedivOrganizationEvents}>
              <div>
                <DatePicker
                  label={tCommon('startDate')}
                  className={styles.dateboxOrganizationEvents}
                  value={dayjs(startDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setStartDate(date.toDate());
                      setEndDate(
                        !endDate || endDate < date.toDate()
                          ? date.toDate()
                          : endDate,
                      );
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={tCommon('endDate')}
                  className={styles.dateboxOrganizationEvents}
                  value={dayjs(endDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) setEndDate(date.toDate());
                  }}
                  minDate={dayjs(startDate)}
                />
              </div>
            </div>
            {!alldaychecked && (
              <div className={styles.datediv}>
                <div className="mr-3">
                  <TimePicker
                    label={tCommon('startTime')}
                    className={styles.dateboxOrganizationEvents}
                    timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                    value={timeToDayJs(formState.startTime)}
                    onChange={(time): void => {
                      if (time) {
                        setFormState({
                          ...formState,
                          startTime: time.format('HH:mm:ss'),
                          endTime:
                            timeToDayJs(formState.endTime) < time
                              ? time.format('HH:mm:ss')
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
                    className={styles.dateboxOrganizationEvents}
                    timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                    value={timeToDayJs(formState.endTime)}
                    onChange={(time): void => {
                      if (time) {
                        setFormState({
                          ...formState,
                          endTime: time.format('HH:mm:ss'),
                        });
                      }
                    }}
                    minTime={timeToDayJs(formState.startTime)}
                    disabled={alldaychecked}
                  />
                </div>
              </div>
            )}
            {/* Recurrence Section */}
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="allday"
                  type="checkbox"
                  checked={alldaychecked}
                  data-testid="alldayCheck"
                  onChange={(): void => setAllDayChecked(!alldaychecked)}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="ispublic"
                  type="checkbox"
                  checked={publicchecked}
                  data-testid="ispublicCheck"
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  className={`me-4 ${styles.switch}`}
                  id="registrable"
                  type="checkbox"
                  checked={registrablechecked}
                  data-testid="registrableCheck"
                  onChange={(): void =>
                    setRegistrableChecked(!registrablechecked)
                  }
                />
              </div>
            </div>
            <div>
              <Dropdown
                show={recurrenceDropdownOpen}
                onToggle={setRecurrenceDropdownOpen}
              >
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="recurrence-dropdown"
                  data-testid="recurrenceDropdown"
                  className={`${styles.dropdown}`}
                >
                  {getCurrentRecurrenceLabel()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {getRecurrenceOptions().map((option, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() =>
                        handleRecurrenceSelect({
                          ...option,
                          value: option.value as
                            | InterfaceRecurrenceRule
                            | 'custom'
                            | null,
                        })
                      }
                      data-testid={`recurrenceOption-${index}`}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Button
              type="submit"
              className={styles.addButton}
              value="createevent"
              data-testid="createEventBtn"
            >
              {t('createEvent')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Custom Recurrence Modal */}
      {recurrence && (
        <CustomRecurrenceModal
          recurrenceRuleState={recurrence}
          setRecurrenceRuleState={(newRecurrence) => {
            if (typeof newRecurrence === 'function') {
              setRecurrence((prev) => (prev ? newRecurrence(prev) : null));
            } else {
              setRecurrence(newRecurrence);
            }
          }}
          endDate={endDate}
          setEndDate={setEndDate}
          customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
          hideCustomRecurrenceModal={hideCustomRecurrenceModal}
          setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
          t={t}
          startDate={startDate}
        />
      )}
    </>
  );
}

export default organizationEvents;
