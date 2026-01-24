import { useMutation } from '@apollo/client';
// translation-check-keyPrefix: eventListCard
import {
  UPDATE_EVENT_MUTATION,
  UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { IEventFormSubmitPayload } from 'types/EventForm/interface';
import type { InterfaceEvent } from 'types/Event/interface';

// Extend dayjs with utc plugin
dayjs.extend(utc);
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';

interface IEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

/**
 * Determines if the recurrence rule has changed between the submitted payload and the original event.
 *
 * Compares recurrence presence, frequency, interval, day/month patterns, count, and end date
 * to detect any modifications to the recurrence configuration.
 *
 * @param payload - The form submission payload containing the new event data
 * @param eventListCardProps - The original event properties from the event list card
 * @returns `true` if any recurrence property has changed, `false` otherwise
 */
export const hasRecurrenceChanged = (
  payload: IEventFormSubmitPayload,
  eventListCardProps: IEventListCard,
): boolean => {
  // If no recurrence rule in payload but one existed, or vice versa
  const hadRecurrence = !!eventListCardProps.recurrenceRule;
  const hasRecurrence = !!payload.recurrenceRule;
  if (hadRecurrence !== hasRecurrence) return true;
  if (!hasRecurrence) return false;

  const original = eventListCardProps.recurrenceRule;
  const current = payload.recurrenceRule;

  if (!original || !current) return false; // Should be covered above but TS safety

  // Deep compare needed fields
  return (
    original.frequency !== current.frequency ||
    original.interval !== current.interval ||
    JSON.stringify(original.byDay) !== JSON.stringify(current.byDay) ||
    JSON.stringify(original.byMonth) !== JSON.stringify(current.byMonth) ||
    JSON.stringify(original.byMonthDay) !==
      JSON.stringify(current.byMonthDay) ||
    original.count !== current.count ||
    original.recurrenceEndDate !== current.recurrenceEndDate
  );
};

/**
 * Computes which update scopes are available when editing a recurring event instance.
 *
 * Determines whether the user can update just this instance, this and following instances,
 * or the entire series based on what fields have changed.
 *
 * @param payload - The form submission payload containing the new event data
 * @param eventListCardProps - The original event properties from the event list card
 * @returns An object with boolean fields:
 *   - `single`: `true` if updating only this instance is allowed (when recurrence hasn't changed)
 *   - `following`: `true` (always available for recurring instances)
 *   - `entireSeries`: `true` if only name or description changed (allows bulk metadata updates)
 *
 * @remarks
 * - The `entireSeries` option is only available when ONLY name/description changed
 * - Changes to start/end times, location, visibility, or recurrence prevent `entireSeries` updates
 * - The `single` option is disabled when the recurrence structure itself has changed
 */
export const getAvailableUpdateOptions = (
  payload: IEventFormSubmitPayload,
  eventListCardProps: IEventListCard,
) => {
  const recurrenceChanged = hasRecurrenceChanged(payload, eventListCardProps);

  // Check if only metadata changed
  const nameChanged = payload.name !== eventListCardProps.name;
  const descriptionChanged =
    payload.description !== eventListCardProps.description;
  const locationChanged = payload.location !== eventListCardProps.location;
  const publicChanged = payload.isPublic !== eventListCardProps.isPublic;
  const registerableChanged =
    payload.isRegisterable !== eventListCardProps.isRegisterable;
  const inviteOnlyChanged =
    payload.isInviteOnly !== (eventListCardProps.isInviteOnly ?? false);
  const allDayChanged = payload.allDay !== eventListCardProps.allDay;

  // But for "hasOnlyNameOrDesc", we just check if OTHER critical things didn't change.
  // Actually, entireSeries is usually allowed unless recurrence structure changed incompatibly?
  // The previous logic was strict: ONLY name/desc.
  // Let's stick to previous logic intent:
  // If recurrence structure changed, we can't update series easily (?) or maybe we can?
  // Previous Code: `return ((nameChanged || descriptionChanged) && !locationChanged && !publicChanged ...)`

  const startChanged = payload.startAtISO !== eventListCardProps.startAt;
  const endChanged = payload.endAtISO !== eventListCardProps.endAt;

  const onlyNameOrDescriptionChanged =
    (nameChanged || descriptionChanged) &&
    !locationChanged &&
    !publicChanged &&
    !registerableChanged &&
    !inviteOnlyChanged &&
    !allDayChanged &&
    !recurrenceChanged &&
    !startChanged &&
    !endChanged; // And assumption: times didn't change either?

  return {
    single: !recurrenceChanged,
    following: true,
    entireSeries: onlyNameOrDescriptionChanged,
  };
};

interface IEventUpdateInput {
  id: string;
  name?: string;
  description?: string;
  location?: string;
  isPublic?: boolean;
  isRegisterable?: boolean;
  isInviteOnly?: boolean;
  allDay?: boolean;
  startAt?: string;
  endAt?: string;
  recurrenceRule?: InterfaceRecurrenceRule | null;
  recurrence?: InterfaceRecurrenceRule | null;
}

interface IFormState {
  name: string;
  eventdescrip: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface IUpdateEventHandlerProps {
  eventListCardProps: IEventListCard;
  formState: IFormState;
  alldaychecked: boolean;
  publicchecked: boolean;
  registrablechecked: boolean;
  inviteOnlyChecked: boolean;
  eventStartDate: Date;
  eventEndDate: Date;
  recurrence: InterfaceRecurrenceRule | null;
  updateOption: 'single' | 'following' | 'entireSeries';
  hasRecurrenceChanged?: boolean; // Add this parameter
  t: (key: string) => string;
  hideViewModal: () => void;
  setEventUpdateModalIsOpen: (isOpen: boolean) => void;
  refetchEvents?: () => void;
}

export const useUpdateEventHandler = () => {
  const [updateStandaloneEvent] = useMutation(UPDATE_EVENT_MUTATION);
  const [updateSingleRecurringEventInstance] = useMutation(
    UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  );
  const [updateThisAndFollowingEvents] = useMutation(
    UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  );
  const [updateEntireRecurringEventSeries] = useMutation(
    UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  );

  const updateEventHandler = async ({
    eventListCardProps,
    formState,
    alldaychecked,
    publicchecked,
    registrablechecked,
    inviteOnlyChecked,
    eventStartDate,
    eventEndDate,
    recurrence,
    updateOption,
    hasRecurrenceChanged = false, // Default to false if not provided
    t,
    hideViewModal,
    setEventUpdateModalIsOpen,
    refetchEvents,
  }: IUpdateEventHandlerProps): Promise<void> => {
    const isRecurringInstance =
      !eventListCardProps.isRecurringEventTemplate &&
      !!eventListCardProps.baseEvent?.id;

    try {
      let data;
      const updateInput: IEventUpdateInput = { id: eventListCardProps.id };

      // Only include fields that have actually changed
      if (formState.name !== eventListCardProps.name) {
        updateInput.name = formState.name;
      }
      if (formState.eventdescrip !== eventListCardProps.description) {
        updateInput.description = formState.eventdescrip;
      }
      if (formState.location !== eventListCardProps.location) {
        updateInput.location = formState.location;
      }
      if (publicchecked !== eventListCardProps.isPublic) {
        updateInput.isPublic = publicchecked;
      }
      if (registrablechecked !== eventListCardProps.isRegisterable) {
        updateInput.isRegisterable = registrablechecked;
      }
      if (inviteOnlyChecked !== (eventListCardProps.isInviteOnly ?? false)) {
        updateInput.isInviteOnly = inviteOnlyChecked;
      }
      if (alldaychecked !== eventListCardProps.allDay) {
        updateInput.allDay = alldaychecked;
      }

      const newStartAt = alldaychecked
        ? dayjs.utc(eventStartDate).isValid()
          ? dayjs.utc(eventStartDate).startOf('day').toISOString()
          : ''
        : dayjs.utc(eventStartDate).isValid()
          ? dayjs
              .utc(eventStartDate)
              .hour(parseInt(formState.startTime.split(':')[0]))
              .minute(parseInt(formState.startTime.split(':')[1]))
              .second(parseInt(formState.startTime.split(':')[2]))
              .millisecond(0)
              .toISOString()
          : '';

      const newEndAt = alldaychecked
        ? dayjs.utc(eventEndDate).isValid()
          ? dayjs.utc(eventEndDate).endOf('day').toISOString()
          : ''
        : dayjs.utc(eventEndDate).isValid()
          ? dayjs
              .utc(eventEndDate)
              .hour(parseInt(formState.endTime.split(':')[0]))
              .minute(parseInt(formState.endTime.split(':')[1]))
              .second(parseInt(formState.endTime.split(':')[2]))
              .millisecond(0)
              .toISOString()
          : '';

      const originalStartAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.startAt).isValid()
          ? dayjs.utc(eventListCardProps.startAt).startOf('day').toISOString()
          : ''
        : (() => {
            const dateTimeStr = `${dayjs.utc(eventListCardProps.startAt).format('YYYY-MM-DD')}T${eventListCardProps.startTime}`;
            return dayjs.utc(dateTimeStr).isValid()
              ? dayjs.utc(dateTimeStr).toISOString()
              : '';
          })();

      const originalEndAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.endAt).isValid()
          ? dayjs.utc(eventListCardProps.endAt).endOf('day').toISOString()
          : ''
        : dayjs
              .utc(
                `${dayjs.utc(eventListCardProps.endAt).format('YYYY-MM-DD')}T${eventListCardProps.endTime}`,
              )
              .isValid()
          ? dayjs
              .utc(
                `${dayjs.utc(eventListCardProps.endAt).format('YYYY-MM-DD')}T${eventListCardProps.endTime}`,
              )
              .toISOString()
          : '';

      // Only include timing changes if they actually changed
      if (newStartAt !== originalStartAt) {
        updateInput.startAt = newStartAt;
      }
      if (newEndAt !== originalEndAt) {
        updateInput.endAt = newEndAt;
      }

      // Only include recurrence if it has actually changed
      // This prevents unnecessary splits when only updating metadata
      if (
        updateOption === 'following' &&
        recurrence !== null &&
        hasRecurrenceChanged
      ) {
        updateInput.recurrence = recurrence;
      }

      const hasChanges = Object.keys(updateInput).length > 1;
      if (!hasChanges) {
        NotificationToast.info(t('noChangesToUpdate'));
        return;
      }

      if (updateInput.startAt === '' || updateInput.endAt === '') {
        NotificationToast.error(t('invalidDate'));
        return;
      }

      if (!isRecurringInstance) {
        const result = await updateStandaloneEvent({
          variables: { input: updateInput },
        });
        data = result.data;
      } else {
        switch (updateOption) {
          case 'single': {
            const singleResult = await updateSingleRecurringEventInstance({
              variables: { input: updateInput },
            });
            data = singleResult.data;
            break;
          }
          case 'following': {
            const followingResult = await updateThisAndFollowingEvents({
              variables: { input: updateInput },
            });
            data = followingResult.data;
            break;
          }
          case 'entireSeries': {
            const entireSeriesInput: IEventUpdateInput = {
              id: eventListCardProps.id,
            };

            // Propagate all changed fields to the entire series
            if (formState.name !== eventListCardProps.name) {
              entireSeriesInput.name = formState.name;
            }
            if (formState.eventdescrip !== eventListCardProps.description) {
              entireSeriesInput.description = formState.eventdescrip;
            }
            if (formState.location !== eventListCardProps.location) {
              entireSeriesInput.location = formState.location;
            }
            if (publicchecked !== eventListCardProps.isPublic) {
              entireSeriesInput.isPublic = publicchecked;
            }
            if (registrablechecked !== eventListCardProps.isRegisterable) {
              entireSeriesInput.isRegisterable = registrablechecked;
            }
            if (
              inviteOnlyChecked !== (eventListCardProps.isInviteOnly ?? false)
            ) {
              entireSeriesInput.isInviteOnly = inviteOnlyChecked;
            }
            if (alldaychecked !== eventListCardProps.allDay) {
              entireSeriesInput.allDay = alldaychecked;
            }

            // Only include timing changes if they actually changed
            if (newStartAt !== originalStartAt) {
              entireSeriesInput.startAt = newStartAt;
            }
            if (newEndAt !== originalEndAt) {
              entireSeriesInput.endAt = newEndAt;
            }

            const entireSeriesResult = await updateEntireRecurringEventSeries({
              variables: { input: entireSeriesInput },
            });
            data = entireSeriesResult.data;
            break;
          }
        }
      }

      if (data) {
        NotificationToast.success(t('eventUpdated') as string);
        setEventUpdateModalIsOpen(false);
        hideViewModal();
        if (refetchEvents) {
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return { updateEventHandler };
};
