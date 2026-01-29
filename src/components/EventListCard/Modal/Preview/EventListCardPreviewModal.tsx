/**
 * PreviewModal Component
 *
 * This component renders a modal for previewing and editing event details.
 * It provides functionality to view, update, and manage event properties such as
 * name, description, location, date, time, and visibility settings.
 *
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
 * @param allDayChecked - Indicates if the event is an all-day event.
 * @param setAllDayChecked - Function to toggle the all-day event setting.
 * @param publicChecked - Indicates if the event is public.
 * @param setPublicChecked - Function to toggle the public event setting.
 * @param registerableChecked - Indicates if the event is registrable.
 * @param setRegisterableChecked - Function to toggle the registrable event setting.
 * @param inviteOnlyChecked - Indicates if the event is invite-only.
 * @param setInviteOnlyChecked - Function to toggle the invite-only event setting.
 * @param formState - The state of the form fields.
 * @param setFormState - Function to update the form state.
 * @param registerEventHandler - Function to handle event registration.
 * @param handleEventUpdate - Function to handle event updates.
 * @param openEventDashboard - Function to navigate to the event dashboard.
 *
 * @returns A modal for previewing and managing event details.
 */
// translation-check-keyPrefix: eventListCard
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './EventListCardPreviewModal.module.css';
import DatePicker from 'shared-components/DatePicker/DatePicker';
import TimePicker from 'shared-components/TimePicker/TimePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  Frequency,
  WeekDays,
  InterfaceRecurrenceRule,
} from 'utils/recurrenceUtils/recurrenceTypes';
import { createDefaultRecurrenceRule } from 'utils/recurrenceUtils/recurrenceUtilityFunctions';
import CustomRecurrenceModal from 'screens/AdminPortal/OrganizationEvents/CustomRecurrenceModal';

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
  allDayChecked,
  setAllDayChecked,
  publicChecked,
  setPublicChecked,
  registerableChecked,
  setRegisterableChecked,

  inviteOnlyChecked,
  setInviteOnlyChecked,
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
    return dayjs(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
  };

  // Check if the user has permission to edit the event
  const canEditEvent =
    eventListCardProps.creator?.id === userId ||
    eventListCardProps.userRole === UserRole.ADMINISTRATOR;

  const getDayName = (dayIndex: number): string => {
    const days = [
      t('sunday'),
      t('monday'),
      t('tuesday'),
      t('wednesday'),
      t('thursday'),
      t('friday'),
      t('saturday'),
    ];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      t('january'),
      t('february'),
      t('march'),
      t('april'),
      t('may'),
      t('june'),
      t('july'),
      t('august'),
      t('september'),
      t('october'),
      t('november'),
      t('december'),
    ];
    return months[monthIndex];
  };

  const getRecurrenceOptions = (): Array<{
    label: string;
    value: InterfaceRecurrenceRule | 'custom';
  }> => {
    const eventDate = new Date(eventStartDate);
    const dayOfWeek = eventDate.getDay();
    const dayOfMonth = eventDate.getDate();
    const month = eventDate.getMonth();
    const dayName = getDayName(dayOfWeek);
    const monthName = getMonthName(month);

    return [
      {
        label: t('daily'),
        value: createDefaultRecurrenceRule(eventDate, Frequency.DAILY),
      },
      {
        label: t('weeklyOn', { day: dayName }),
        value: createDefaultRecurrenceRule(eventDate, Frequency.WEEKLY),
      },
      {
        label: t('monthlyOnDay', { day: dayOfMonth }),
        value: createDefaultRecurrenceRule(eventDate, Frequency.MONTHLY),
      },
      {
        label: t('annuallyOn', { month: monthName, day: dayOfMonth }),
        value: {
          frequency: Frequency.YEARLY,
          interval: 1,
          byMonth: [month + 1],
          byMonthDay: [dayOfMonth],
          never: true,
        },
      },
      {
        label: t('everyWeekday'),
        value: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] as WeekDays[],
          never: true,
        },
      },
      {
        label: t('customOption'),
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
        return t('customRecurrence');
      }
    }

    // If the user has not interacted with the dropdown, show the original description
    if (eventListCardProps.recurrenceDescription) {
      return eventListCardProps.recurrenceDescription;
    }

    // Fallback for non-recurring events or events without a description
    return t('selectRecurrencePattern');
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
      <BaseModal
        show={eventModalIsOpen}
        onHide={hideViewModal}
        title={t('eventDetails')}
        dataTestId="previewEventModal"
        footer={
          <>
            {canEditEvent && (
              <Button
                variant="success"
                onClick={openEventDashboard}
                data-testid="showEventDashboardBtn"
                className={styles.addButton}
                aria-label={t('showEventDashboard')}
              >
                {t('showEventDashboard')}
              </Button>
            )}
            {canEditEvent && (
              <Button
                variant="success"
                className={styles.addButton}
                data-testid="previewUpdateEventBtn"
                data-cy="previewUpdateEventBtn"
                onClick={handleEventUpdate}
                aria-label={t('editEvent')}
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
                aria-label={t('deleteEvent')}
              >
                {t('deleteEvent')}
              </Button>
            )}
            {eventListCardProps.isRegisterable &&
              eventListCardProps.userRole === UserRole.REGULAR &&
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
          </>
        }
        centered={true}
      >
        <div>
          {/* Event Name */}
          <FormTextField
            name="eventname"
            label={t('eventName')}
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
            onChange={(val) => setFormState({ ...formState, name: val })}
            disabled={!canEditEvent}
          />

          {/* Description */}
          <FormTextField
            name="eventdescrip"
            label={tCommon('description')}
            id="eventdescrip"
            className={`mb-3 ${styles.inputField}`}
            autoComplete="off"
            data-testid="updateDescription"
            data-cy="updateDescription"
            required
            value={
              formState.eventDescription?.length > 256
                ? formState.eventDescription.substring(0, 256) + '...'
                : formState.eventDescription || ''
            }
            onChange={(val) =>
              setFormState({ ...formState, eventDescription: val })
            }
            disabled={!canEditEvent}
          />

          {/* Location */}
          <FormTextField
            name="location"
            label={tCommon('location')}
            id="location"
            className={`mb-3 ${styles.inputField}`}
            autoComplete="off"
            data-testid="updateLocation"
            data-cy="updateLocation"
            required
            value={formState.location || ''}
            onChange={(val) => setFormState({ ...formState, location: val })}
            disabled={!canEditEvent}
          />

          {/* DatePickers & TimePickers */}
          <div className={styles.datediv}>
            <DatePicker
              label={tCommon('startDate')}
              className={styles.datebox}
              value={dayjs(eventStartDate)}
              data-testid="startDate"
              onChange={(date) => {
                if (date) {
                  const newStartDate = date.toDate();
                  setEventStartDate(newStartDate);
                  if (eventEndDate < newStartDate)
                    setEventEndDate(newStartDate);
                }
              }}
              disabled={!canEditEvent}
            />
            <DatePicker
              label={tCommon('endDate')}
              className={styles.datebox}
              value={dayjs(eventEndDate)}
              data-testid="endDate"
              onChange={(date) => date && setEventEndDate(date.toDate())}
              minDate={dayjs(eventStartDate)}
              disabled={!canEditEvent}
            />
          </div>

          {!allDayChecked && (
            <div className={styles.datediv}>
              <TimePicker
                label={tCommon('startTime')}
                className={styles.datebox}
                value={timeToDayJs(formState.startTime)}
                data-testid="startTime"
                onChange={(time) => {
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
                disabled={!canEditEvent}
              />
              <TimePicker
                label={tCommon('endTime')}
                className={styles.datebox}
                value={timeToDayJs(formState.endTime)}
                data-testid="endTime"
                onChange={(time) =>
                  time &&
                  setFormState({
                    ...formState,
                    endTime: time.format('HH:mm:ss'),
                  })
                }
                minTime={timeToDayJs(formState.startTime)}
                disabled={!canEditEvent}
              />
            </div>
          )}

          {/* Checkboxes */}
          <div className={styles.checkboxdiv}>
            <div className={styles.dispflexOrganizationEvents}>
              <label htmlFor="allday">{t('allDay')}?</label>
              <FormCheckField
                id="allday"
                name="allday"
                label=""
                type="switch"
                data-testid="updateAllDay"
                className={`me-4 ${styles.switch}`}
                checked={allDayChecked}
                onChange={() => {
                  const newAllDayChecked = !allDayChecked;
                  setAllDayChecked(newAllDayChecked);
                  if (
                    !newAllDayChecked &&
                    formState.startTime === formState.endTime
                  ) {
                    const start = timeToDayJs(formState.startTime);
                    const newEnd = start.add(1, 'hour').format('HH:mm:ss');
                    setFormState({ ...formState, endTime: newEnd });
                  }
                }}
                disabled={!canEditEvent}
              />
            </div>
            <div className={styles.dispflexOrganizationEvents}>
              <fieldset className="mb-3">
                <legend className="mb-2">{t('visibility')}</legend>
                <div role="radiogroup" aria-label={t('visibility')}>
                  <FormCheckField
                    inline
                    type="radio"
                    label={t('public')}
                    name="eventVisibility"
                    id="visibility-public"
                    checked={publicChecked}
                    onChange={() => {
                      setPublicChecked(true);
                      setInviteOnlyChecked(false);
                    }}
                    disabled={!canEditEvent}
                  />
                  <FormCheckField
                    inline
                    type="radio"
                    label={t('organizationMembers')}
                    name="eventVisibility"
                    id="visibility-members"
                    checked={!publicChecked && !inviteOnlyChecked}
                    onChange={() => {
                      setPublicChecked(false);
                      setInviteOnlyChecked(false);
                    }}
                    disabled={!canEditEvent}
                  />
                  <FormCheckField
                    inline
                    type="radio"
                    label={t('inviteOnly')}
                    name="eventVisibility"
                    id="visibility-inviteonly"
                    checked={!publicChecked && inviteOnlyChecked}
                    onChange={() => {
                      setPublicChecked(false);
                      setInviteOnlyChecked(true);
                    }}
                    disabled={!canEditEvent}
                  />
                </div>
              </fieldset>
            </div>
            <div className={styles.dispflexOrganizationEvents}>
              <label htmlFor="registrable">{t('isRegistrable')}?</label>
              <FormCheckField
                id="registrable"
                name="registrable"
                label=""
                type="switch"
                data-testid="updateRegistrable"
                className={`me-4 ${styles.switch}`}
                checked={registerableChecked}
                onChange={() => setRegisterableChecked(!registerableChecked)}
                disabled={!canEditEvent}
              />
            </div>
          </div>

          {/* Recurrence Dropdown */}
          {canEditEvent && canChangeRecurrence && (
            <Dropdown className="mb-3">
              <Dropdown.Toggle
                variant="outline-secondary"
                id="recurrence-dropdown"
                data-testid="recurrenceDropdown"
                className={`${styles.dropdown}`}
              >
                {getCurrentRecurrenceLabel()}
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                {getRecurrenceOptions().map((option, index) => (
                  <Dropdown.Item
                    key={index}
                    data-testid={`recurrenceOption-${index}`}
                    onClick={() => handleRecurrenceSelect(option)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </BaseModal>

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
          t={t}
          startDate={eventStartDate}
        />
      )}
    </>
  );
};

export default PreviewModal;
