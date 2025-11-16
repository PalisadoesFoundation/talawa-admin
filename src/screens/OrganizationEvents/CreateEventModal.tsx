import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import styles from '../../style/app-fixed.module.css';
import CustomRecurrenceModal from '../../screens/OrganizationEvents/CustomRecurrenceModal';
import {
  Frequency,
  WeekDays,
  InterfaceRecurrenceRule,
  createDefaultRecurrenceRule,
  validateRecurrenceInput,
  formatRecurrenceForApi,
} from '../../utils/recurrenceUtils';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { errorHandler } from 'utils/errorHandler';

/**
 * Converts a time string to a Dayjs object for the current date
 * @param time - Time string in HH:mm:ss format
 * @returns Dayjs object representing the time on today's date
 */
const timeToDayJs = (time: string): Dayjs => {
  const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
  return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
};

/**
 * Props interface for the CreateEventModal component
 */
interface ICreateEventModalProps {
  /** Whether the modal is currently open/visible */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Callback function triggered when an event is successfully created */
  onEventCreated: () => void;
  /** Current organization URL/ID for event creation */
  currentUrl: string;
}

/**
 * Modal component for creating new events in an organization
 *
 * Provides a comprehensive form interface for creating events with features including:
 * - Basic event details (name, description, location)
 * - Date and time selection with all-day option
 * - Event visibility and registration settings
 * - Recurring event configuration with multiple patterns
 * - Form validation and error handling
 *
 * @param props - Component props
 * @returns JSX element representing the create event modal
 */
const CreateEventModal: React.FC<ICreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  currentUrl,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
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

  const [create, { loading: createLoading }] = useMutation(
    CREATE_EVENT_MUTATION,
  );

  /**
   * Shows the custom recurrence configuration modal
   */
  const showCustomRecurrenceModal = (): void =>
    setCustomRecurrenceModalIsOpen(true);

  /**
   * Hides the custom recurrence configuration modal
   */
  const hideCustomRecurrenceModal = (): void =>
    setCustomRecurrenceModalIsOpen(false);

  /**
   * Gets the day name from a numeric day index
   * @param dayIndex - Day index (0 = Sunday, 1 = Monday, etc.)
   * @returns The full name of the day
   */
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

  /**
   * Gets the month name from a numeric month index
   * @param monthIndex - Month index (0 = January, 1 = February, etc.)
   * @returns The full name of the month
   */
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

  /**
   * Generates recurrence options based on the current start date
   * @returns Array of recurrence options with labels and values
   */
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

  /**
   * Handles selection of a recurrence option from the dropdown
   * @param option - Selected recurrence option with label and value
   */
  const handleRecurrenceSelect = (option: {
    label: string;
    value: InterfaceRecurrenceRule | 'custom' | null;
  }): void => {
    if (option.value === 'custom') {
      if (!recurrence) {
        setRecurrence(createDefaultRecurrenceRule(startDate, Frequency.WEEKLY));
      }
      showCustomRecurrenceModal();
    } else {
      setRecurrence(option.value);
    }
    setRecurrenceDropdownOpen(false);
  };

  /**
   * Gets the current recurrence label to display in the dropdown
   * @returns String label describing the current recurrence pattern
   */
  const getCurrentRecurrenceLabel = (): string => {
    if (!recurrence) return 'Does not repeat';

    const options = getRecurrenceOptions();
    const matchingOption = options.find((option) => {
      if (!option.value || option.value === 'custom') return false;
      return JSON.stringify(option.value) === JSON.stringify(recurrence);
    });

    return matchingOption ? matchingOption.label : 'Custom';
  };

  /**
   * Resets all form fields and state to their initial values
   */
  const resetForm = (): void => {
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
  };

  /**
   * Handles closing the modal by resetting form and calling onClose
   */
  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  /**
   * Handles form submission to create a new event
   * Validates form data, processes recurrence rules, and calls the GraphQL mutation
   * @param e - Form submission event
   */
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
          onEventCreated();
          resetForm();
          onClose();
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

  return (
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header>
          <p className={styles.titlemodalOrganizationEvents}>
            {t('eventDetails')}
          </p>
          <Button
            variant="danger"
            onClick={handleClose}
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
              data-cy="eventTitleInput"
              autoComplete="off"
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
              data-cy="eventDescriptionInput"
              autoComplete="off"
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
              data-cy="eventLocationInput"
              autoComplete="off"
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
                        const newEndTime = time.format('HH:mm:ss');
                        const currentStartTime = formState.startTime;
                        setFormState({
                          ...formState,
                          endTime: newEndTime,
                          startTime:
                            timeToDayJs(currentStartTime) > time
                              ? newEndTime
                              : currentStartTime,
                        });
                      }
                    }}
                    minTime={timeToDayJs(formState.startTime)}
                    disabled={alldaychecked}
                  />
                </div>
              </div>
            )}
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
              data-cy="createEventBtn"
              disabled={createLoading}
            >
              {t('createEvent')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
};

export default CreateEventModal;
