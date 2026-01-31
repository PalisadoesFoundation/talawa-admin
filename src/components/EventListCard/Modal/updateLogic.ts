// translation-check-keyPrefix: eventListCard
import { useMutation } from '@apollo/client';
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
import type {
  InterfaceEventUpdateInput,
  InterfaceUpdateEventHandlerProps,
} from 'types/EventListCard/interface';

// Extend dayjs with utc plugin
dayjs.extend(utc);
import { DATE_FORMAT_ISO_DATE, DATE_TIME_SEPARATOR } from 'Constant/common';

/**
 * Creates the update handler for EventListCard modal edits, managing mutations for standalone and recurring events.
 *
 * @returns An object containing the update logic:
 * - updateEventHandler: `(args: IUpdateEventHandlerProps) => Promise<void>` - Asynchronous function that handles the event update process, including validation and mutation execution.
 */
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
    allDayChecked,
    publicChecked,
    registerableChecked,
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
  }: InterfaceUpdateEventHandlerProps): Promise<void> => {
    const isRecurringInstance =
      !eventListCardProps.isRecurringEventTemplate &&
      !!eventListCardProps.baseEvent?.id;

    try {
      let data;
      const updateInput: InterfaceEventUpdateInput = {
        id: eventListCardProps.id,
      };

      // Only include fields that have actually changed
      if (formState.name !== eventListCardProps.name) {
        updateInput.name = formState.name;
      }
      if (formState.eventDescription !== eventListCardProps.description) {
        updateInput.description = formState.eventDescription;
      }
      if (formState.location !== eventListCardProps.location) {
        updateInput.location = formState.location;
      }
      if (publicChecked !== eventListCardProps.isPublic) {
        updateInput.isPublic = publicChecked;
      }
      if (registerableChecked !== eventListCardProps.isRegisterable) {
        updateInput.isRegisterable = registerableChecked;
      }
      if (inviteOnlyChecked !== (eventListCardProps.isInviteOnly ?? false)) {
        updateInput.isInviteOnly = inviteOnlyChecked;
      }
      if (allDayChecked !== eventListCardProps.allDay) {
        updateInput.allDay = allDayChecked;
      }

      const newStartAt = allDayChecked
        ? dayjs.utc(eventStartDate).isValid()
          ? dayjs.utc(eventStartDate).startOf('day').toISOString()
          : ''
        : dayjs.utc(eventStartDate).isValid()
          ? dayjs
              .utc(eventStartDate)
              .hour(parseInt(formState.startTime.split(':')[0], 10) || 0)
              .minute(parseInt(formState.startTime.split(':')[1], 10) || 0)
              .second(parseInt(formState.startTime.split(':')[2], 10) || 0)
              .millisecond(0)
              .toISOString()
          : '';

      const newEndAt = allDayChecked
        ? dayjs.utc(eventEndDate).isValid()
          ? dayjs.utc(eventEndDate).endOf('day').toISOString()
          : ''
        : dayjs.utc(eventEndDate).isValid()
          ? dayjs
              .utc(eventEndDate)
              .hour(parseInt(formState.endTime.split(':')[0], 10) || 0)
              .minute(parseInt(formState.endTime.split(':')[1], 10) || 0)
              .second(parseInt(formState.endTime.split(':')[2], 10) || 0)
              .millisecond(0)
              .toISOString()
          : '';

      const originalStartAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.startAt).isValid()
          ? dayjs.utc(eventListCardProps.startAt).startOf('day').toISOString()
          : ''
        : (() => {
            const dateTimeStr = `${dayjs.utc(eventListCardProps.startAt).format(DATE_FORMAT_ISO_DATE)}${DATE_TIME_SEPARATOR}${eventListCardProps.startTime}`;
            return dayjs.utc(dateTimeStr).isValid()
              ? dayjs.utc(dateTimeStr).toISOString()
              : '';
          })();

      const originalEndAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.endAt).isValid()
          ? dayjs.utc(eventListCardProps.endAt).endOf('day').toISOString()
          : ''
        : (() => {
            const endDateTimeStr = `${dayjs.utc(eventListCardProps.endAt).format(DATE_FORMAT_ISO_DATE)}${DATE_TIME_SEPARATOR}${eventListCardProps.endTime}`;

            return dayjs.utc(endDateTimeStr).isValid()
              ? dayjs.utc(endDateTimeStr).toISOString()
              : '';
          })();

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
            const entireSeriesInput: InterfaceEventUpdateInput = {
              id: eventListCardProps.id,
            };

            // Propagate all changed fields to the entire series
            if (formState.name !== eventListCardProps.name) {
              entireSeriesInput.name = formState.name;
            }
            if (formState.eventDescription !== eventListCardProps.description) {
              entireSeriesInput.description = formState.eventDescription;
            }
            if (formState.location !== eventListCardProps.location) {
              entireSeriesInput.location = formState.location;
            }
            if (publicChecked !== eventListCardProps.isPublic) {
              entireSeriesInput.isPublic = publicChecked;
            }
            if (registerableChecked !== eventListCardProps.isRegisterable) {
              entireSeriesInput.isRegisterable = registerableChecked;
            }
            if (
              inviteOnlyChecked !== (eventListCardProps.isInviteOnly ?? false)
            ) {
              entireSeriesInput.isInviteOnly = inviteOnlyChecked;
            }
            if (allDayChecked !== eventListCardProps.allDay) {
              entireSeriesInput.allDay = allDayChecked;
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
        NotificationToast.success(t('eventUpdated'));
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
