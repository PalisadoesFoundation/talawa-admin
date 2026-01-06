/**
 * EventForm - A reusable form component for creating and editing events.
 * Supports date/time selection, recurrence configuration, and various event options.
 */
// translation-check-keyPrefix: organizationEvents
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import type {
  IEventFormProps,
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import CustomRecurrenceModal from '../Recurrence/CustomRecurrenceModal';
import {
  Frequency,
  WeekDays,
  createDefaultRecurrenceRule,
  formatRecurrenceForApi,
  validateRecurrenceInput,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
type EventVisibility = 'PUBLIC' | 'ORGANIZATION' | 'INVITE_ONLY';

const getVisibilityType = (
  isPublic?: boolean,
  isInviteOnly?: boolean,
): EventVisibility => {
  if (isPublic) return 'PUBLIC';
  if (isInviteOnly) return 'INVITE_ONLY';
  return 'ORGANIZATION';
};

// Extend dayjs with utc plugin
dayjs.extend(utc);

const timeToDayJs = (time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return dayjs()
    .hour(hours)
    .minute(minutes)
    .second(seconds || 0);
};

const buildRecurrenceOptions = (
  startDate: Date,
  t: (key: string, options?: Record<string, unknown>) => string,
): Array<{
  label: string;
  value: InterfaceRecurrenceRule | 'custom' | null;
}> => {
  const eventDate = new Date(startDate);
  const isValidDate = !Number.isNaN(eventDate.getTime());
  const safeDate = isValidDate ? eventDate : new Date();

  const dayOfWeek = safeDate.getDay();
  const dayOfMonth = safeDate.getDate();
  const month = safeDate.getMonth();

  const locale = navigator.language || 'en-US';
  const dayName = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(new Date(2024, 0, 7 + dayOfWeek));
  const monthName = new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(new Date(2024, month, 1));

  return [
    {
      label: t('doesNotRepeat'),
      value: null,
    },
    {
      label: t('daily'),
      value: createDefaultRecurrenceRule(safeDate, Frequency.DAILY),
    },
    {
      label: t('weeklyOn', { day: dayName }),
      value: createDefaultRecurrenceRule(safeDate, Frequency.WEEKLY),
    },
    {
      label: t('monthlyOnDay', { day: dayOfMonth }),
      value: createDefaultRecurrenceRule(safeDate, Frequency.MONTHLY),
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
      label: t('custom'),
      value: 'custom',
    },
  ];
};

const EventForm: React.FC<IEventFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  t,
  tCommon,
  showCreateChat = false,
  showRegisterable = true,
  showPublicToggle = true,

  disableRecurrence = false,
  submitting = false,
  showRecurrenceToggle = false,
  showCancelButton = false,
}) => {
  const [formState, setFormState] = useState<IEventFormValues>(initialValues);
  // Default to INVITE_ONLY for new events (no ID/name usually implies new, or explicit logic)
  // But initialValues might be partial.
  // Ideally, initialValues coming in should have isInviteOnly set.
  // If editing an old event where isInviteOnly is undefined, it treats as false.
  const [visibility, setVisibility] = useState<EventVisibility>(() => {
    // If it's a new event (empty name/desc usually), default to INVITE_ONLY
    // However, initialValues are passed in.
    // If initialValues has ALREADY set defaults, we use them.
    // But typically initialValues for NEW event are all false/empty.
    // We want NEW events to be Invite Only by default.
    // Let's assume if name is empty, it's new.
    if (
      !initialValues.name &&
      !initialValues.isPublic &&
      !initialValues.isInviteOnly
    ) {
      return 'INVITE_ONLY';
    }
    return getVisibilityType(
      initialValues.isPublic,
      initialValues.isInviteOnly,
    );
  });

  const [recurrenceDropdownOpen, setRecurrenceDropdownOpen] = useState(false);
  const [customRecurrenceModalIsOpen, setCustomRecurrenceModalIsOpen] =
    useState(false);
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(
    !disableRecurrence &&
      (!!initialValues.recurrenceRule || !showRecurrenceToggle),
  );

  useEffect(() => {
    setFormState(initialValues);
    setRecurrenceEnabled(
      !disableRecurrence &&
        (!!initialValues.recurrenceRule || !showRecurrenceToggle),
    );
    // Sync visibility state with initialValues
    if (
      !initialValues.name &&
      !initialValues.isPublic &&
      !initialValues.isInviteOnly
    ) {
      setVisibility('INVITE_ONLY');
    } else {
      setVisibility(
        getVisibilityType(initialValues.isPublic, initialValues.isInviteOnly),
      );
    }
  }, [initialValues, disableRecurrence, showRecurrenceToggle]);

  const recurrenceOptions = useMemo(
    () => buildRecurrenceOptions(formState.startDate, t),
    [formState.startDate, t],
  );

  const handleRecurrenceSelect = (option: {
    label: string;
    value: InterfaceRecurrenceRule | 'custom' | null;
  }): void => {
    if (option.value === 'custom') {
      if (!formState.recurrenceRule) {
        setFormState((prev) => ({
          ...prev,
          recurrenceRule: createDefaultRecurrenceRule(
            prev.startDate,
            Frequency.WEEKLY,
          ),
        }));
      }
      setCustomRecurrenceModalIsOpen(true);
    } else {
      setFormState((prev) => ({
        ...prev,
        recurrenceRule: option.value as InterfaceRecurrenceRule | null,
      }));
    }
    setRecurrenceDropdownOpen(false);
  };

  const currentRecurrenceLabel = (): string => {
    if (!formState.recurrenceRule) return t('doesNotRepeat');
    const matchingOption = recurrenceOptions.find((option) => {
      if (!option.value || option.value === 'custom') return false;
      return (
        JSON.stringify(option.value) ===
        JSON.stringify(formState.recurrenceRule)
      );
    });
    return matchingOption ? matchingOption.label : t('custom');
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (
      !formState.name.trim() ||
      !formState.description.trim() ||
      !formState.location.trim()
    ) {
      return;
    }

    const startTimeParts = formState.startTime.split(':');
    const endTimeParts = formState.endTime.split(':');

    // For all-day events, calculate start and end times
    // For startAt: use start of day, but if that's in the past, use current time + 10 seconds
    // This handles the case where we're creating an "all day" event for "today"
    let startAtISO: string;
    let endAtISO: string;

    if (formState.allDay) {
      const startOfDay = dayjs.utc(formState.startDate).startOf('day');
      const now = dayjs.utc();

      // If start of day is in the past, use current time plus a small buffer
      if (startOfDay.isBefore(now)) {
        startAtISO = now.add(10, 'second').toISOString();
      } else {
        startAtISO = startOfDay.toISOString();
      }
      endAtISO = dayjs.utc(formState.endDate).endOf('day').toISOString();
    } else {
      startAtISO = dayjs
        .utc(formState.startDate)
        .hour(parseInt(startTimeParts[0]))
        .minute(parseInt(startTimeParts[1]))
        .second(parseInt(startTimeParts[2]) || 0)
        .toISOString();
      endAtISO = dayjs
        .utc(formState.endDate)
        .hour(parseInt(endTimeParts[0]))
        .minute(parseInt(endTimeParts[1]))
        .second(parseInt(endTimeParts[2]) || 0)
        .toISOString();
    }

    if (recurrenceEnabled && formState.recurrenceRule) {
      const validation = validateRecurrenceInput(
        formState.recurrenceRule,
        formState.startDate,
      );
      if (!validation.isValid) {
        return;
      }
    }

    const payload: IEventFormSubmitPayload = {
      name: formState.name.trim(),
      description: formState.description.trim(),
      location: formState.location.trim(),
      allDay: formState.allDay,
      isPublic: visibility === 'PUBLIC',
      isInviteOnly: visibility === 'INVITE_ONLY',
      isRegisterable: formState.isRegisterable,

      recurrenceRule:
        recurrenceEnabled && formState.recurrenceRule
          ? formState.recurrenceRule
          : null,
      createChat: formState.createChat,
      startAtISO,
      endAtISO,
      startDate: formState.startDate,
      endDate: formState.endDate,
    };

    await onSubmit(payload);
  };

  const toggleAllDay = (): void => {
    setFormState((prev) => ({
      ...prev,
      allDay: !prev.allDay,
      startTime: prev.startTime,
      endTime: prev.endTime,
    }));
  };

  const toggleRecurrence = (): void => {
    if (disableRecurrence || !showRecurrenceToggle) return;
    setRecurrenceEnabled((prev) => {
      // Clear recurrence rule when disabling (prev was true, becoming false)
      if (prev) {
        setFormState((formPrev) => ({
          ...formPrev,
          recurrenceRule: null,
        }));
      }
      return !prev;
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="eventTitle">{t('eventName')}</label>
        <Form.Control
          type="text"
          id="eventTitle"
          placeholder={t('enterName')}
          autoComplete="off"
          required
          value={formState.name}
          className={styles.inputField}
          onChange={(e): void => {
            setFormState({ ...formState, name: e.target.value });
          }}
          data-testid="eventTitleInput"
          data-cy="eventTitleInput"
          aria-label={t('eventName')}
        />
        <label htmlFor="eventDescription">{tCommon('description')}</label>
        <Form.Control
          as="textarea"
          id="eventDescription"
          placeholder={t('enterDescription')}
          autoComplete="off"
          required
          value={formState.description}
          className={styles.inputField}
          onChange={(e): void => {
            setFormState({ ...formState, description: e.target.value });
          }}
          data-testid="eventDescriptionInput"
          data-cy="eventDescriptionInput"
          aria-label={tCommon('description')}
        />
        <label htmlFor="eventLocation">{tCommon('location')}</label>
        <Form.Control
          type="text"
          id="eventLocation"
          placeholder={tCommon('enterLocation')}
          autoComplete="off"
          required
          value={formState.location}
          className={styles.inputField}
          onChange={(e): void => {
            setFormState({ ...formState, location: e.target.value });
          }}
          data-testid="eventLocationInput"
          data-cy="eventLocationInput"
          aria-label={tCommon('location')}
        />
        <div className={styles.datedivEvents}>
          <div>
            <DatePicker
              label={tCommon('startDate')}
              className={styles.dateboxEvents}
              value={dayjs(formState.startDate)}
              onChange={(date): void => {
                if (date) {
                  setFormState((prev) => ({
                    ...prev,
                    startDate: date.toDate(),
                    endDate:
                      prev.endDate < date.toDate()
                        ? date.toDate()
                        : prev.endDate,
                  }));
                }
              }}
              data-testid="eventStartAt"
              slotProps={{
                textField: {
                  'aria-label': tCommon('startDate'),
                },
              }}
            />
          </div>
          <div>
            <DatePicker
              label={tCommon('endDate')}
              className={styles.dateboxEvents}
              value={dayjs(formState.endDate)}
              onChange={(date): void => {
                if (date) {
                  setFormState((prev) => ({
                    ...prev,
                    endDate: date.toDate(),
                  }));
                }
              }}
              minDate={dayjs(formState.startDate)}
              data-testid="eventEndAt"
              slotProps={{
                textField: {
                  'aria-label': tCommon('endDate'),
                },
              }}
            />
          </div>
        </div>
        <div className={styles.datediv}>
          <div className="mr-3">
            <TimePicker
              label={tCommon('startTime')}
              data-testid="startTime"
              className={styles.dateboxEvents}
              timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
              value={timeToDayJs(formState.startTime)}
              onChange={(time): void => {
                if (time) {
                  setFormState((prev) => {
                    const newStartTime = time.format('HH:mm:ss');
                    const currentEndTime = timeToDayJs(prev.endTime);
                    // Compare times by converting to minutes since midnight
                    const newStartMinutes = time.hour() * 60 + time.minute();
                    const currentEndMinutes =
                      currentEndTime.hour() * 60 + currentEndTime.minute();
                    return {
                      ...prev,
                      startTime: newStartTime,
                      endTime:
                        currentEndMinutes < newStartMinutes
                          ? newStartTime
                          : prev.endTime,
                    };
                  });
                }
              }}
              disabled={formState.allDay}
              slotProps={{
                textField: {
                  'aria-label': tCommon('startTime'),
                },
              }}
            />
          </div>
          <div>
            <TimePicker
              label={tCommon('endTime')}
              data-testid="endTime"
              className={styles.dateboxEvents}
              timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
              value={timeToDayJs(formState.endTime)}
              onChange={(time): void => {
                if (time) {
                  setFormState((prev) => ({
                    ...prev,
                    endTime: time.format('HH:mm:ss'),
                  }));
                }
              }}
              minTime={timeToDayJs(formState.startTime)}
              disabled={formState.allDay}
              slotProps={{
                textField: {
                  'aria-label': tCommon('endTime'),
                },
              }}
            />
          </div>
        </div>
        <div className={styles.checkboxdivEvents}>
          <div className={styles.dispflexEvents}>
            <label htmlFor="allday">{t('allDay')}?</label>
            <Form.Switch
              className={`me-4 ${styles.switch}`}
              id="allday"
              type="checkbox"
              checked={formState.allDay}
              data-testid="allDayEventCheck"
              onChange={toggleAllDay}
              aria-label={t('allDay')}
            />
          </div>
          {showRecurrenceToggle && (
            <div className={styles.dispflexEvents}>
              <label htmlFor="recurring">{t('recurring')}:</label>
              <Form.Switch
                className={`me-4 ${styles.switch}`}
                id="recurring"
                type="checkbox"
                checked={recurrenceEnabled}
                data-testid="recurringEventCheck"
                onChange={toggleRecurrence}
                aria-label={t('recurring')}
              />
            </div>
          )}
          {showRegisterable && (
            <div className={styles.dispflexEvents}>
              <label htmlFor="registrable">{t('registerable')}?</label>
              <Form.Switch
                className={`me-4 ${styles.switch}`}
                id="registrable"
                type="checkbox"
                checked={formState.isRegisterable}
                data-testid="registerableEventCheck"
                onChange={(): void =>
                  setFormState((prev) => ({
                    ...prev,
                    isRegisterable: !prev.isRegisterable,
                  }))
                }
                aria-label={t('registerable')}
              />
            </div>
          )}
          {showCreateChat && (
            <div className={styles.dispflexEvents}>
              <label htmlFor="createChat">{t('createChat')}?</label>
              <Form.Switch
                className={`me-4 ${styles.switch}`}
                id="chat"
                type="checkbox"
                data-testid="createChatCheck"
                checked={formState.createChat}
                onChange={(): void =>
                  setFormState((prev) => ({
                    ...prev,
                    createChat: !prev.createChat,
                  }))
                }
                aria-label={t('createChat')}
              />
            </div>
          )}
        </div>
        {showPublicToggle && (
          <div className="mb-3">
            <Form.Label>{tCommon('eventVisibility')}</Form.Label>
            <div className="ms-3">
              <Form.Check
                type="radio"
                id="visibility-public"
                label={
                  <div>
                    <strong>{tCommon('publicEvent')}</strong>
                    <div className="text-muted small">
                      {tCommon('publicEventDescription')}
                    </div>
                  </div>
                }
                name="eventVisibility"
                checked={visibility === 'PUBLIC'}
                onChange={() => setVisibility('PUBLIC')}
                className="mb-2"
                data-testid="visibilityPublicRadio"
              />
              <Form.Check
                type="radio"
                id="visibility-org"
                label={
                  <div>
                    <strong>{tCommon('organizationEvent')}</strong>
                    <div className="text-muted small">
                      {tCommon('organizationEventDescription')}
                    </div>
                  </div>
                }
                name="eventVisibility"
                checked={visibility === 'ORGANIZATION'}
                onChange={() => setVisibility('ORGANIZATION')}
                className="mb-2"
                data-testid="visibilityOrgRadio"
              />
              <Form.Check
                type="radio"
                id="visibility-invite"
                label={
                  <div>
                    <strong>{tCommon('inviteOnlyEvent')}</strong>
                    <div className="text-muted small">
                      {tCommon('inviteOnlyEventDescription')}
                    </div>
                  </div>
                }
                name="eventVisibility"
                checked={visibility === 'INVITE_ONLY'}
                onChange={() => setVisibility('INVITE_ONLY')}
                className="mb-2"
                data-testid="visibilityInviteRadio"
              />
            </div>
          </div>
        )}

        {!disableRecurrence && recurrenceEnabled && (
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
                aria-label={t('recurring')}
              >
                {currentRecurrenceLabel()}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {recurrenceOptions.map((option, index) => (
                  <Dropdown.Item
                    key={option.label}
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
        <Button
          type="submit"
          className={styles.addButton}
          value="createevent"
          data-testid="createEventBtn"
          data-cy="createEventBtn"
          disabled={submitting}
        >
          {submitLabel}
        </Button>
        {showCancelButton && (
          <Button
            variant="secondary"
            onClick={onCancel}
            data-testid="eventFormCancelBtn"
          >
            {tCommon('cancel')}
          </Button>
        )}
      </Form>

      {recurrenceEnabled && formState.recurrenceRule && (
        <CustomRecurrenceModal
          recurrenceRuleState={formState.recurrenceRule}
          setRecurrenceRuleState={(newRecurrence) => {
            setFormState((prev) => ({
              ...prev,
              recurrenceRule:
                typeof newRecurrence === 'function'
                  ? newRecurrence(
                      prev.recurrenceRule as InterfaceRecurrenceRule,
                    )
                  : newRecurrence,
            }));
          }}
          endDate={formState.endDate}
          setEndDate={(dateSetter) => {
            const nextDate =
              typeof dateSetter === 'function'
                ? dateSetter(formState.endDate)
                : dateSetter;
            setFormState((prev) => ({
              ...prev,
              endDate: nextDate ?? prev.endDate,
            }));
          }}
          customRecurrenceModalIsOpen={customRecurrenceModalIsOpen}
          hideCustomRecurrenceModal={(): void =>
            setCustomRecurrenceModalIsOpen(false)
          }
          setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
          t={t}
          startDate={formState.startDate}
        />
      )}
    </>
  );
};

/**
 * Formats a recurrence rule for API submission.
 * @param recurrenceRule - The recurrence rule to format
 * @param startDate - The event start date
 * @returns The formatted recurrence string or null
 * @throws Error if the recurrence rule is invalid
 */
export const formatRecurrenceForPayload = (
  recurrenceRule: InterfaceRecurrenceRule | null,
  startDate: Date,
) => {
  if (!recurrenceRule) return null;
  const { isValid, errors } = validateRecurrenceInput(
    recurrenceRule,
    startDate,
  );
  if (!isValid) {
    throw new Error(errors.join(', '));
  }
  return formatRecurrenceForApi(recurrenceRule);
};

export default EventForm;
