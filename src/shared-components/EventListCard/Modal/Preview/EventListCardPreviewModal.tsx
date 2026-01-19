import React from 'react';
import { Dropdown } from 'react-bootstrap';
import FormCheck from 'react-bootstrap/FormCheck';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import Button from 'shared-components/Button';
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
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
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
  // Memoize timeToDayJs to prevent recreation on every render
  const timeToDayJs = React.useCallback(
    (time: string, baseDate: Date): Dayjs => {
      const dateStr = dayjs(baseDate).format('YYYY-MM-DD');
      const dateTimeString = dateStr + ' ' + time;
      return dayjs(dateTimeString, 'YYYY-MM-DD HH:mm:ss', true);
    },
    [],
  );

  const canEditEvent = React.useMemo(
    () =>
      eventListCardProps.creator?.id === userId ||
      eventListCardProps.userRole === UserRole.ADMINISTRATOR,
    [eventListCardProps.creator?.id, eventListCardProps.userRole, userId],
  );

  // Memoize recurrence options to prevent recalculation on every render
  const recurrenceOptions = React.useMemo(() => {
    const eventDate = dayjs(eventStartDate);
    const dayName = eventDate.format('dddd');
    const monthName = eventDate.format('MMMM');
    const dayOfMonth = eventDate.date();

    return [
      {
        label: t('recurrence.daily'),
        value: createDefaultRecurrenceRule(eventStartDate, Frequency.DAILY),
      },
      {
        label: t('recurrence.weeklyOn').replace('{{day}}', dayName),
        value: createDefaultRecurrenceRule(eventStartDate, Frequency.WEEKLY),
      },
      {
        label: t('recurrence.monthlyOn').replace(
          '{{day}}',
          dayOfMonth.toString(),
        ),
        value: createDefaultRecurrenceRule(eventStartDate, Frequency.MONTHLY),
      },
      {
        label: t('recurrence.annuallyOn')
          .replace('{{month}}', monthName)
          .replace('{{day}}', dayOfMonth.toString()),
        value: {
          frequency: Frequency.YEARLY,
          interval: 1,
          byMonth: [eventDate.month() + 1],
          byMonthDay: [dayOfMonth],
          never: true,
        },
      },
      {
        label: t('recurrence.everyWeekday'),
        value: {
          frequency: Frequency.WEEKLY,
          interval: 1,
          byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] as WeekDays[],
          never: true,
        },
      },
      {
        label: t('recurrence.custom'),
        value: 'custom' as const,
      },
    ];
  }, [eventStartDate, t]);

  const handleRecurrenceSelect = React.useCallback(
    (option: {
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
    },
    [recurrence, eventStartDate, setRecurrence, setCustomRecurrenceModalIsOpen],
  );

  const getCurrentRecurrenceLabel = React.useCallback((): string => {
    if (recurrence) {
      const matchingOption = recurrenceOptions.find((option) => {
        if (option.value === 'custom') return false;
        return JSON.stringify(option.value) === JSON.stringify(recurrence);
      });

      if (matchingOption) {
        return matchingOption.label;
      }

      if (recurrence.frequency) {
        return (
          recurrence.frequency.charAt(0).toUpperCase() +
          recurrence.frequency.slice(1).toLowerCase()
        );
      }
    }

    if (eventListCardProps.recurrenceDescription) {
      return eventListCardProps.recurrenceDescription;
    }

    return t('selectRecurrencePattern');
  }, [
    recurrence,
    recurrenceOptions,
    eventListCardProps.recurrenceDescription,
    t,
  ]);

  const isRecurringEvent = React.useMemo(
    () =>
      eventListCardProps.isRecurringEventTemplate ||
      (!eventListCardProps.isRecurringEventTemplate &&
        !!eventListCardProps.baseEvent?.id),
    [
      eventListCardProps.isRecurringEventTemplate,
      eventListCardProps.baseEvent?.id,
    ],
  );

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
          </>
        }
        centered={true}
      >
        <div className="w-100">
          <FormTextField
            name="eventname"
            label={t('eventName')}
            placeholder={t('enterName')}
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

          <FormTextField
            name="eventdescrip"
            label={tCommon('description')}
            as="textarea"
            placeholder={t('enterDescription')}
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
            onChange={(val) =>
              setFormState({ ...formState, eventdescrip: val })
            }
            disabled={!canEditEvent}
          />

          <FormTextField
            name="location"
            label={tCommon('location')}
            placeholder={tCommon('enterLocation')}
            className={`mb-3 ${styles.inputField}`}
            autoComplete="off"
            data-testid="updateLocation"
            data-cy="updateLocation"
            required
            value={formState.location || ''}
            onChange={(val) => setFormState({ ...formState, location: val })}
            disabled={!canEditEvent}
          />

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

          {!alldaychecked && (
            <div className={styles.datediv}>
              <TimePicker
                label={tCommon('startTime')}
                className={styles.datebox}
                // FIX: Use current event date
                value={timeToDayJs(formState.startTime, eventStartDate)}
                data-testid="startTime"
                onChange={(time) => {
                  if (time) {
                    setFormState({
                      ...formState,
                      startTime: time.format('HH:mm:ss'),
                      endTime:
                        timeToDayJs(formState.endTime, eventStartDate) < time
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
                // FIX: Use current event date
                value={timeToDayJs(formState.endTime, eventStartDate)}
                data-testid="endTime"
                onChange={(time) =>
                  time &&
                  setFormState({
                    ...formState,
                    endTime: time.format('HH:mm:ss'),
                  })
                }
                // FIX: Use current event date for minTime comparison
                minTime={timeToDayJs(formState.startTime, eventStartDate)}
                disabled={!canEditEvent}
              />
            </div>
          )}

          <div className={styles.checkboxdivEventListCardModals}>
            <div className={styles.dispflexEventListCardModals}>
              <label htmlFor="allday">{t('allDay')}?</label>
              <FormCheck
                type="switch"
                id="allday"
                data-testid="updateAllDay"
                className={`me-4 ${styles.switch}`}
                checked={alldaychecked}
                onChange={() => setAllDayChecked(!alldaychecked)}
                disabled={!canEditEvent}
              />
            </div>
            <div className={styles.dispflexEventListCardModals}>
              <label htmlFor="ispublic">{t('isPublic')}?</label>
              <FormCheck
                type="switch"
                id="ispublic"
                data-testid="updateIsPublic"
                className={`me-4 ${styles.switch}`}
                checked={publicchecked}
                onChange={() => setPublicChecked(!publicchecked)}
                disabled={!canEditEvent}
              />
            </div>
            <div className={styles.dispflexEventListCardModals}>
              <label htmlFor="registrable">{t('isRegistrable')}?</label>
              <FormCheck
                type="switch"
                id="registrable"
                data-testid="updateRegistrable"
                className={`me-4 ${styles.switch}`}
                checked={registrablechecked}
                onChange={() => setRegistrableChecked(!registrablechecked)}
                disabled={!canEditEvent}
              />
            </div>
          </div>

          {canEditEvent && canChangeRecurrence && (
            <Dropdown className="mb-3">
              <Dropdown.Toggle
                variant="outline-secondary"
                id="recurrence-dropdown"
                data-testid="recurrenceDropdown"
                className={`${styles.dropdown} `}
              >
                {getCurrentRecurrenceLabel()}
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100">
                {recurrenceOptions.map((option, index) => (
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
              // FIX: Handle case where 'prev' is null but function is called
              setRecurrence((prev) => {
                if (prev) return newRecurrence(prev);
                // Fallback: If no previous rule, create a default to update
                return newRecurrence(
                  createDefaultRecurrenceRule(eventStartDate, Frequency.WEEKLY),
                );
              });
            } else {
              setRecurrence(newRecurrence);
            }
          }}
          endDate={eventEndDate}
          setEndDate={(date: React.SetStateAction<Date | null>) => {
            if (typeof date === 'function') {
              // FIX: Ensure safe handling of null
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
