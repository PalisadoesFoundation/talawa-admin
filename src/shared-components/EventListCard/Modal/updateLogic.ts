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
} from 'types/shared-components/EventListCard/interface';
import { useTranslation } from 'react-i18next';

// Extend dayjs with utc plugin
dayjs.extend(utc);
import { DATE_FORMAT_ISO_DATE } from 'Constant/common';

/**
 * Creates the update handler for EventListCard modal edits, managing mutations for standalone and recurring events.
 *
 * @returns An object containing the update logic:
 * - updateEventHandler: `(args: IUpdateEventHandlerProps) => Promise<void>` - Asynchronous function that handles the event update process, including validation and mutation execution.
 */
export const useUpdateEventHandler = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventListCard',
  });
  const [updateStandaloneEvent] = useMutation(UPDATE_EVENT_MUTATION, {
    fetchPolicy: 'no-cache',
    update(cache, { data }) {
      // Manually update the cache to ensure the event is updated everywhere
      if (data?.updateStandaloneEvent) {
        const updatedEvent = data.updateStandaloneEvent;
        console.log(
          'Updating Apollo cache with fresh event data:',
          updatedEvent,
        );

        // Modify the cache entry for this specific event
        cache.modify({
          id: cache.identify(updatedEvent),
          fields: {
            startDate() {
              return updatedEvent.startDate;
            },
            endDate() {
              return updatedEvent.endDate;
            },
            startAt() {
              return updatedEvent.startAt;
            },
            endAt() {
              return updatedEvent.endAt;
            },
            allDay() {
              return updatedEvent.allDay;
            },
            name() {
              return updatedEvent.name;
            },
            description() {
              return updatedEvent.description;
            },
            location() {
              return updatedEvent.location;
            },
            isPublic() {
              return updatedEvent.isPublic;
            },
            isRegisterable() {
              return updatedEvent.isRegisterable;
            },
            isInviteOnly() {
              return updatedEvent.isInviteOnly;
            },
          },
        });
      }
    },
  });
  const [updateSingleRecurringEventInstance] = useMutation(
    UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
    {
      fetchPolicy: 'no-cache',
    },
  );
  const [updateThisAndFollowingEvents] = useMutation(
    UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
    {
      fetchPolicy: 'no-cache',
    },
  );
  const [updateEntireRecurringEventSeries] = useMutation(
    UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
    {
      fetchPolicy: 'no-cache',
    },
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
    hideViewModal,
    closeUpdateModal,
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
        ? dayjs(eventStartDate).isValid()
          ? dayjs(eventStartDate).startOf('day').toISOString()
          : ''
        : dayjs(eventStartDate).isValid()
          ? dayjs(eventStartDate)
              .hour(parseInt(formState.startTime.split(':')[0], 10) || 0)
              .minute(parseInt(formState.startTime.split(':')[1], 10) || 0)
              .second(parseInt(formState.startTime.split(':')[2], 10) || 0)
              .millisecond(0)
              .toISOString()
          : '';

      const newEndAt = allDayChecked
        ? dayjs(eventEndDate).isValid()
          ? dayjs(eventEndDate).endOf('day').toISOString()
          : ''
        : dayjs(eventEndDate).isValid()
          ? dayjs(eventEndDate)
              .hour(parseInt(formState.endTime.split(':')[0], 10) || 0)
              .minute(parseInt(formState.endTime.split(':')[1], 10) || 0)
              .second(parseInt(formState.endTime.split(':')[2], 10) || 0)
              .millisecond(0)
              .toISOString()
          : '';

      const originalStartAt = eventListCardProps.allDay
        ? eventListCardProps.startDate
          ? `${eventListCardProps.startDate}T00:00:00.000Z`
          : dayjs.utc(eventListCardProps.startAt).isValid()
            ? dayjs.utc(eventListCardProps.startAt).startOf('day').toISOString()
            : ''
        : eventListCardProps.startAt || '';

      const originalEndAt = eventListCardProps.allDay
        ? eventListCardProps.endDate
          ? `${eventListCardProps.endDate}T23:59:59.999Z`
          : dayjs.utc(eventListCardProps.endAt).isValid()
            ? dayjs.utc(eventListCardProps.endAt).endOf('day').toISOString()
            : ''
        : eventListCardProps.endAt || '';

      const allDayStartDate = dayjs(eventStartDate);
      const allDayEndDate = dayjs(eventEndDate);

      if (
        allDayChecked &&
        (!allDayStartDate.isValid() || !allDayEndDate.isValid())
      ) {
        NotificationToast.error(t('invalidDate'));
        return;
      }

      // Only include timing changes if they actually changed
      if (newStartAt !== originalStartAt || newEndAt !== originalEndAt) {
        if (allDayChecked) {
          // For all-day events, use date fields (YYYY-MM-DD format)
          const startDate = allDayStartDate.format(DATE_FORMAT_ISO_DATE);
          // Add +1 day to endDate for RFC 5545 exclusive end dates
          const endDate = allDayEndDate
            .add(1, 'day')
            .format(DATE_FORMAT_ISO_DATE);

          if (startDate !== eventListCardProps.startDate) {
            updateInput.startDate = startDate;
          }
          if (endDate !== eventListCardProps.endDate) {
            updateInput.endDate = endDate;
          }
        } else {
          // For timed events, use timestamp fields
          if (newStartAt !== originalStartAt) {
            updateInput.startAt = newStartAt;
          }
          if (newEndAt !== originalEndAt) {
            updateInput.endAt = newEndAt;
          }
        }
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

      // Validate date/time fields based on event type
      if (allDayChecked) {
        if (updateInput.startDate === '' || updateInput.endDate === '') {
          NotificationToast.error(t('invalidDate'));
          return;
        }
      } else {
        if (updateInput.startAt === '' || updateInput.endAt === '') {
          NotificationToast.error(t('invalidDate'));
          return;
        }
      }

      if (!isRecurringInstance) {
        const result = await updateStandaloneEvent({
          variables: { input: updateInput },
        });
        data = result.data;
        // Debug: Log mutation response
        console.log('Update mutation response:', {
          updateInput,
          returnedData: result.data?.updateStandaloneEvent,
        });

        // Update Apollo cache with the fresh data from mutation
        if (result.data?.updateStandaloneEvent) {
          // The mutation returns fresh data, so Apollo should auto-update the cache
          // But let's ensure refetchEvents gets the latest
          console.log('Mutation returned fresh data, cache should be updated');
        }
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
            if (newStartAt !== originalStartAt || newEndAt !== originalEndAt) {
              if (allDayChecked) {
                // For all-day events, use date fields (YYYY-MM-DD format)
                const startDate = dayjs
                  .utc(eventStartDate)
                  .format(DATE_FORMAT_ISO_DATE);
                // Add +1 day to endDate for RFC 5545 exclusive end dates
                const endDate = dayjs
                  .utc(eventEndDate)
                  .add(1, 'day')
                  .format(DATE_FORMAT_ISO_DATE);

                if (startDate !== eventListCardProps.startDate) {
                  entireSeriesInput.startDate = startDate;
                }
                if (endDate !== eventListCardProps.endDate) {
                  entireSeriesInput.endDate = endDate;
                }
              } else {
                // For timed events, use timestamp fields
                if (newStartAt !== originalStartAt) {
                  entireSeriesInput.startAt = newStartAt;
                }
                if (newEndAt !== originalEndAt) {
                  entireSeriesInput.endAt = newEndAt;
                }
              }
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
        if (refetchEvents) {
          await refetchEvents();
        }
        closeUpdateModal();
        hideViewModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return { updateEventHandler };
};
