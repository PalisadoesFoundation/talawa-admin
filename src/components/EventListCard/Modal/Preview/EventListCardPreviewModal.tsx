/**
 * PreviewModal Component
 *
 * This component renders a modal for previewing and editing event details.
 * It provides functionality to view, update, and manage event properties such as
 * name, description, location, date, time, and visibility settings.
 *
 * @param  props - The props for the PreviewModal component.
 * @param eventModalIsOpen - Determines if the modal is open.
 * @param hideViewModal - Function to close the modal.
 * @param toggleDeleteModal - Function to toggle the delete confirmation modal.
 * @param t - Translation function for event-specific strings.
 * @param tCommon - Translation function for common strings.
 * @param isRegistered - Indicates if the user is registered for the event.
 * @param userId - The ID of the current user.
 * @param eventStartDate - The start date of the event.
 * @param eventEndDate - The end date of the event.
 * @param setEventStartDate - Function to update the event start date.
 * @param setEventEndDate - Function to update the event end date.
 * @param alldaychecked - Indicates if the event is an all-day event.
 * @param setAllDayChecked - Function to toggle the all-day event setting.
 * @param publicchecked - Indicates if the event is public.
 * @param setPublicChecked - Function to toggle the public event setting.
 * @param registrablechecked - Indicates if the event is registrable.
 * @param setRegistrableChecked - Function to toggle the registrable event setting.
 * @param formState - The state of the form fields.
 * @param setFormState - Function to update the form state.
 * @param registerEventHandler - Function to handle event registration.
 * @param handleEventUpdate - Function to handle event updates.
 * @param openEventDashboard - Function to navigate to the event dashboard.
 *
 * @returns A modal for previewing and managing event details.
 */
import React from 'react';
import { Button, Form, Modal, Dropdown } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  Frequency,
  WeekDays,
  InterfaceRecurrenceRule,
} from 'utils/recurrenceUtils/recurrenceTypes';
import { createDefaultRecurrenceRule } from 'utils/recurrenceUtils/recurrenceUtilityFunctions';
import CustomRecurrenceModal from 'screens/OrganizationEvents/CustomRecurrenceModal';

import type { InterfacePreviewEventModalProps } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';

const PreviewModal: React.FC<InterfacePreviewEventModalProps> = ({
  eventListCardProps,
  eventModalIsOpen,
  hideViewModal,
  toggleDeleteModal,
  t,
  tCommon,
  isRegistered,
  userId,
  eventStartDate,
  eventEndDate,
  setEventStartDate,
  setEventEndDate,
  alldaychecked,
  setAllDayChecked,
  publicchecked,
  setPublicChecked,
  registrablechecked,
  setRegistrableChecked,
  formState,
  setFormState,
  registerEventHandler,
  handleEventUpdate,
  openEventDashboard,
  recurrence,
  setRecurrence,
  customRecurrenceModalIsOpen,
  setCustomRecurrenceModalIsOpen,
}) => {
  const timeToDayJs = (time: string): Dayjs => {
    const dateTimeString = dayjs().format('YYYY-MM-DD') + ' ' + time;
    return dayjs(dateTimeString, { format: 'YYYY-MM-DD HH:mm:ss' });
  };

  // Check if the user has permission to edit the event
  const canEditEvent = eventListCardProps.creator?.id === userId;

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
    const eventDate = new Date(eventStartDate);
    const dayOfWeek = eventDate.getDay();
    const dayOfMonth = eventDate.getDate();
    const month = eventDate.getMonth();
    const dayName = getDayName(dayOfWeek);
    const monthName = getMonthName(month);

    return [
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
      if (!recurrence) {
        setRecurrence(
          createDefaultRecurrenceRule(eventStartDate, Frequency.WEEKLY),
        );
      }
      setCustomRecurrenceModalIsOpen(true);
    } else {
      setRecurrence(option.value);
    }
  };

  const getCurrentRecurrenceLabel = (): string => {
    // If the user has interacted with the dropdown, show the selected recurrence
    if (recurrence) {
      const options = getRecurrenceOptions();
      const matchingOption = options.find((option) => {
        if (option.value === 'custom') return false;
        return JSON.stringify(option.value) === JSON.stringify(recurrence);
      });

      if (matchingOption) {
        return matchingOption.label;
      }

      // If no standard option matches, display the frequency of the custom rule.
      if (recurrence.frequency) {
        return (
          recurrence.frequency.charAt(0).toUpperCase() +
          recurrence.frequency.slice(1).toLowerCase()
        );
      }
    }

    // If the user has not interacted with the dropdown, show the original description
    if (eventListCardProps.recurrenceDescription) {
      return eventListCardProps.recurrenceDescription;
    }

    // Fallback for non-recurring events or events without a description
    return 'Select recurrence pattern';
  };

  // Check if this is a recurring event (either template or instance)
  const isRecurringEvent =
    eventListCardProps.isRecurringEventTemplate ||
    (!eventListCardProps.isRecurringEventTemplate &&
      !!eventListCardProps.baseEvent?.id);

  // For update purposes, allow recurrence changes on recurring instances
  const canChangeRecurrence = isRecurringEvent;

  return (
    <>
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
              {t('eventName')}
            </p>
            <Form.Control
              type="name"
              id="eventname"
              className={`mb-3 ${styles.inputField}`}
              autoComplete="off"
              data-testid="updateName"
              data-cy="updateName"
              required
              value={
                formState.name?.length > 100
                  ? formState.name.substring(0, 100) + '...'
                  : formState.name || ''
              }
              onChange={(e): void => {
                setFormState({ ...formState, name: e.target.value });
              }}
              disabled={!canEditEvent}
            />
            <p className={styles.previewEventListCardModals}>
              {tCommon('description')}
            </p>
            <Form.Control
              type="eventdescrip"
              id="eventdescrip"
              className={`mb-3 ${styles.inputField}`}
              autoComplete="off"
              data-testid="updateDescription"
              data-cy="updateDescription"
              required
              value={
                formState.eventdescrip?.length > 256
                  ? formState.eventdescrip.substring(0, 256) + '...'
                  : formState.eventdescrip || ''
              }
              onChange={(e): void => {
                setFormState({ ...formState, eventdescrip: e.target.value });
              }}
              disabled={!canEditEvent}
            />
            <p className={styles.previewEventListCardModals}>
              {tCommon('location')}
            </p>
            <Form.Control
              type="text"
              id="location"
              className={`mb-3 ${styles.inputField}`}
              autoComplete="off"
              data-testid="updateLocation"
              data-cy="updateLocation"
              required
              value={formState.location || ''}
              onChange={(e): void => {
                setFormState({ ...formState, location: e.target.value });
              }}
              disabled={!canEditEvent}
            />
            <div className={styles.datediv}>
              <div>
                <DatePicker
                  label={tCommon('startDate')}
                  className={styles.datebox}
                  value={dayjs(eventStartDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      const newStartDate = date.toDate();
                      setEventStartDate(newStartDate);
                      // Auto-adjust end date if it's before the new start date
                      if (eventEndDate < newStartDate) {
                        setEventEndDate(newStartDate);
                      }
                    }
                  }}
                  disabled={!canEditEvent}
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
                  disabled={!canEditEvent}
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
                    disabled={alldaychecked || !canEditEvent}
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
                    disabled={alldaychecked || !canEditEvent}
                  />
                </div>
              </div>
            )}
            <div className={styles.checkboxdiv}>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="allday">{t('allDay')}?</label>
                <Form.Switch
                  id="allday"
                  type="checkbox"
                  data-testid="updateAllDay"
                  className={`me-4 ${styles.switch}`}
                  checked={alldaychecked}
                  onChange={(): void => {
                    setAllDayChecked(!alldaychecked);
                  }}
                  disabled={!canEditEvent}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="ispublic">{t('isPublic')}?</label>
                <Form.Switch
                  id="ispublic"
                  type="checkbox"
                  data-testid="updateIsPublic"
                  className={`me-4 ${styles.switch}`}
                  checked={publicchecked}
                  onChange={(): void => {
                    setPublicChecked(!publicchecked);
                  }}
                  disabled={!canEditEvent}
                />
              </div>
              <div className={styles.dispflexOrganizationEvents}>
                <label htmlFor="registrable">{t('isRegistrable')}?</label>
                <Form.Switch
                  id="registrable"
                  type="checkbox"
                  data-testid="updateRegistrable"
                  className={`me-4 ${styles.switch}`}
                  checked={registrablechecked}
                  onChange={(): void => {
                    setRegistrableChecked(!registrablechecked);
                  }}
                  disabled={!canEditEvent}
                />
              </div>
            </div>
            {canEditEvent && canChangeRecurrence && (
              <div className="mb-3">
                <Dropdown drop="down">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="recurrence-dropdown"
                    data-testid="recurrenceDropdown"
                    className={`${styles.dropdown}`}
                    disabled={!canEditEvent}
                  >
                    {getCurrentRecurrenceLabel()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
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
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {canEditEvent && (
            <Button
              variant="success"
              onClick={openEventDashboard}
              data-testid="showEventDashboardBtn"
              className={styles.addButton}
            >
              Show Event Dashboard
            </Button>
          )}
          {canEditEvent && (
            <Button
              variant="success"
              className={styles.addButton}
              data-testid="previewUpdateEventBtn"
              data-cy="previewUpdateEventBtn"
              onClick={handleEventUpdate}
            >
              {t('editEvent')}
            </Button>
          )}
          {canEditEvent && (
            <Button
              variant="danger"
              data-testid="deleteEventModalBtn"
              data-cy="deleteEventModalBtn"
              className={styles.removeButton}
              onClick={toggleDeleteModal}
            >
              {t('deleteEvent')}
            </Button>
          )}
          {eventListCardProps.userRole === UserRole.REGULAR &&
            !(eventListCardProps.creator?.id === userId) &&
            (isRegistered ? (
              <Button className={styles.addButton} variant="success" disabled>
                {t('alreadyRegistered')}
              </Button>
            ) : (
              <Button
                className={styles.addButton}
                variant="success"
                onClick={registerEventHandler}
                data-testid="registerEventBtn"
              >
                {tCommon('register')}
              </Button>
            ))}
        </Modal.Footer>
      </Modal>

      {recurrence && isRecurringEvent && (
        <CustomRecurrenceModal
          recurrenceRuleState={recurrence}
          setRecurrenceRuleState={(newRecurrence) => {
            if (typeof newRecurrence === 'function') {
              setRecurrence((prev) => (prev ? newRecurrence(prev) : null));
            } else {
              setRecurrence(newRecurrence);
            }
          }}
          endDate={eventEndDate}
          setEndDate={(date: React.SetStateAction<Date | null>) => {
            if (typeof date === 'function') {
              setEventEndDate((prev) => date(prev) || prev);
            } else {
              setEventEndDate(date || eventEndDate);
            }
          }}
          customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
          hideCustomRecurrenceModal={() =>
            setCustomRecurrenceModalIsOpen(false)
          }
          setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
          t={(key: string) => key} // Pass translation function if available
          startDate={eventStartDate}
        />
      )}
    </>
  );
};

export default PreviewModal;
