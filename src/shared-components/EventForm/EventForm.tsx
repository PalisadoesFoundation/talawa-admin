/**
 * EventForm - A reusable form component for creating and editing events.
 * Supports date/time selection, recurrence configuration, and various event options.
 */
// translation-check-keyPrefix: organizationEvents
import DatePicker from '../DatePicker';
import TimePicker from '../TimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks';
import styles from './EventForm.module.css';
import type {
  IEventFormProps,
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import CustomRecurrenceModal from '../Recurrence/CustomRecurrenceModal';
import {
  Frequency,
  createDefaultRecurrenceRule,
  validateRecurrenceInput,
  formatRecurrenceForApi,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import {
  timeToDayJs,
  getVisibilityType,
  buildRecurrenceOptions,
} from './utils';
import type { EventVisibility, InterfaceRecurrenceOption } from './utils';
import VisibilitySelector from './VisibilitySelector/VisibilitySelector';
import RecurrenceDropdown from './RecurrenceDropdown/RecurrenceDropdown';

// Extend dayjs with utc plugin
dayjs.extend(utc);
const EventForm: React.FC<IEventFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  showCreateChat = false,
  showRegisterable = true,
  showPublicToggle = true,

  disableRecurrence = false,
  submitting = false,
  showRecurrenceToggle = false,
  showCancelButton = false,
  readOnly = false,
  hideSubmitButton = false,
  onStateChange,
  customRecurrenceModalIsOpen: customRecurrenceModalIsOpenProp,
  setCustomRecurrenceModalIsOpen: setCustomRecurrenceModalIsOpenProp,
  hideCustomRecurrenceModal: hideCustomRecurrenceModalProp,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');
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

  const internalRecurrenceModal = useModalState();
  const customRecurrenceModalIsOpen =
    customRecurrenceModalIsOpenProp ?? internalRecurrenceModal.isOpen;
  const openCustomRecurrenceModal = setCustomRecurrenceModalIsOpenProp
    ? () => setCustomRecurrenceModalIsOpenProp(true)
    : internalRecurrenceModal.open;
  const closeCustomRecurrenceModal =
    hideCustomRecurrenceModalProp ?? internalRecurrenceModal.close;
  const setCustomRecurrenceModalIsOpen =
    setCustomRecurrenceModalIsOpenProp ??
    ((state: boolean | ((prev: boolean) => boolean)) => {
      const next =
        typeof state === 'function'
          ? state(internalRecurrenceModal.isOpen)
          : state;
      if (next) internalRecurrenceModal.open();
      else internalRecurrenceModal.close();
    });
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(
    !disableRecurrence &&
      (!!initialValues.recurrenceRule || !showRecurrenceToggle),
  );

  useEffect(() => {
    setFormState((prev) => {
      // Shallow compare to avoid creating new object refs if values are unchanged
      if (
        prev.name === initialValues.name &&
        prev.description === initialValues.description &&
        prev.location === initialValues.location &&
        prev.startDate === initialValues.startDate &&
        prev.endDate === initialValues.endDate &&
        prev.startTime === initialValues.startTime &&
        prev.endTime === initialValues.endTime &&
        prev.allDay === initialValues.allDay &&
        prev.isPublic === initialValues.isPublic &&
        prev.isInviteOnly === initialValues.isInviteOnly &&
        prev.recurrenceRule === initialValues.recurrenceRule &&
        prev.isRegisterable === (initialValues.isRegisterable ?? false) &&
        prev.createChat === (initialValues.createChat ?? false)
      ) {
        return prev;
      }
      return {
        ...prev,
        name: initialValues.name,
        description: initialValues.description,
        location: initialValues.location,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate,
        startTime: initialValues.startTime,
        endTime: initialValues.endTime,
        allDay: initialValues.allDay,
        isPublic: initialValues.isPublic,
        isInviteOnly: initialValues.isInviteOnly,
        recurrenceRule: initialValues.recurrenceRule,
        isRegisterable: initialValues.isRegisterable ?? false,
        createChat: initialValues.createChat ?? false,
      };
    });

    setRecurrenceEnabled((prev) => {
      const next =
        !disableRecurrence &&
        (!!initialValues.recurrenceRule || !showRecurrenceToggle);
      return prev !== next ? next : prev;
    });

    // Sync visibility state with initialValues
    setVisibility((prev) => {
      let next: EventVisibility;
      if (
        !initialValues.name &&
        !initialValues.isPublic &&
        !initialValues.isInviteOnly
      ) {
        next = 'INVITE_ONLY';
      } else {
        next = getVisibilityType(
          initialValues.isPublic,
          initialValues.isInviteOnly,
        );
      }
      return prev !== next ? next : prev;
    });
  }, [initialValues, disableRecurrence, showRecurrenceToggle]);

  const recurrenceOptions = useMemo(
    () => buildRecurrenceOptions(formState.startDate, t),
    [formState.startDate, t],
  );

  const handleRecurrenceSelect = (option: InterfaceRecurrenceOption): void => {
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
      openCustomRecurrenceModal();
    } else {
      setFormState((prev) => ({
        ...prev,
        recurrenceRule: option.value as InterfaceRecurrenceRule | null,
      }));
    }
  };

  // Stabilize onStateChange callback
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  // Sync internal formState and visibility back to parent if requested
  useEffect(() => {
    onStateChangeRef.current?.({
      ...formState,
      isPublic: visibility === 'PUBLIC',
      isInviteOnly: visibility === 'INVITE_ONLY',
    });
  }, [formState, visibility]);

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
      startAtISO = dayjs(formState.startDate)
        .hour(parseInt(startTimeParts[0]))
        .minute(parseInt(startTimeParts[1]))
        .second(parseInt(startTimeParts[2]) || 0)
        .toISOString();
      endAtISO = dayjs(formState.endDate)
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
      <form onSubmit={handleSubmit}>
        <div className={styles.textFieldsSection}>
          <FormTextField
            name="eventTitle"
            label={t('eventName')}
            placeholder={t('enterName')}
            required
            value={formState.name}
            className={styles.inputField}
            onChange={(value) => setFormState({ ...formState, name: value })}
            data-testid="eventTitleInput"
            data-cy="eventTitleInput"
            disabled={readOnly}
            maxLength={100}
          />
          <FormTextField
            name="eventDescription"
            label={tCommon('description')}
            placeholder={t('enterDescription')}
            required
            value={formState.description}
            className={styles.inputField}
            onChange={(value) =>
              setFormState({ ...formState, description: value })
            }
            data-testid="eventDescriptionInput"
            data-cy="eventDescriptionInput"
            disabled={readOnly}
            maxLength={256}
          />
          <FormTextField
            name="eventLocation"
            label={tCommon('location')}
            placeholder={tCommon('enterLocation')}
            required
            value={formState.location}
            className={styles.inputField}
            onChange={(value) =>
              setFormState({ ...formState, location: value })
            }
            data-testid="eventLocationInput"
            data-cy="eventLocationInput"
            disabled={readOnly}
          />
        </div>
        <div className={styles.datedivEvents}>
          <div>
            <DatePicker
              name="startDate"
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
              disabled={readOnly}
              slotProps={{
                textField: {
                  'aria-label': tCommon('startDate'),
                },
              }}
            />
          </div>
          <div>
            <DatePicker
              name="endDate"
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
              disabled={readOnly}
              slotProps={{
                textField: {
                  'aria-label': tCommon('endDate'),
                },
              }}
            />
          </div>
        </div>
        {!formState.allDay && (
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
                disabled={readOnly}
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
                disabled={readOnly}
                slotProps={{
                  textField: {
                    'aria-label': tCommon('endTime'),
                  },
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.checkboxdivEvents}>
          <div className={styles.dispflexEvents}>
            <FormCheckField
              className={`me-4 ${styles.switch}`}
              id="allday"
              name="allDay"
              label={t('allDay')}
              type="switch"
              checked={formState.allDay}
              data-testid="allDayEventCheck"
              onChange={toggleAllDay}
              disabled={readOnly}
            />
          </div>
          {showRecurrenceToggle && (
            <div className={styles.dispflexEvents}>
              <FormCheckField
                className={`me-4 ${styles.switch}`}
                id="recurring"
                name="recurring"
                label={t('recurring')}
                type="switch"
                checked={recurrenceEnabled}
                data-testid="recurringEventCheck"
                onChange={toggleRecurrence}
                disabled={readOnly}
              />
            </div>
          )}
          {showRegisterable && (
            <div className={styles.dispflexEvents}>
              <FormCheckField
                className={`me-4 ${styles.switch}`}
                id="registrable"
                name="registrable"
                label={t('registerable')}
                type="switch"
                checked={formState.isRegisterable}
                data-testid="registerableEventCheck"
                onChange={(): void =>
                  setFormState((prev) => ({
                    ...prev,
                    isRegisterable: !prev.isRegisterable,
                  }))
                }
                disabled={readOnly}
              />
            </div>
          )}
          {showCreateChat && (
            <div className={styles.dispflexEvents}>
              <FormCheckField
                className={`me-4 ${styles.switch}`}
                id="chat"
                name="createChat"
                label={t('createChat')}
                type="switch"
                data-testid="createChatCheck"
                checked={formState.createChat}
                onChange={(): void =>
                  setFormState((prev) => ({
                    ...prev,
                    createChat: !prev.createChat,
                  }))
                }
                disabled={readOnly}
              />
            </div>
          )}
        </div>
        {showPublicToggle && (
          <VisibilitySelector
            visibility={visibility}
            setVisibility={setVisibility}
            disabled={readOnly}
          />
        )}

        {!disableRecurrence && recurrenceEnabled && (
          <RecurrenceDropdown
            recurrenceOptions={recurrenceOptions}
            currentLabel={currentRecurrenceLabel()}
            onSelect={handleRecurrenceSelect}
            disabled={readOnly}
          />
        )}
        {submitLabel === tCommon('create') && (
          <div className={styles.createModalSeparator}></div>
        )}
        <div className={styles.footerActions}>
          {!hideSubmitButton && (
            <Button
              type="submit"
              className={`${styles.addButton} ${styles.footerButton}`}
              value="createevent"
              data-testid="createEventBtn"
              data-cy="createEventBtn"
              disabled={submitting || readOnly}
            >
              {submitLabel}
            </Button>
          )}
          {showCancelButton && (
            <Button
              variant="secondary"
              onClick={onCancel}
              data-testid="eventFormCancelBtn"
            >
              {tCommon('cancel')}
            </Button>
          )}
        </div>
      </form>

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
          hideCustomRecurrenceModal={closeCustomRecurrenceModal}
          setCustomRecurrenceModalIsOpen={setCustomRecurrenceModalIsOpen}
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
