import { useMutation } from '@apollo/client';
import {
  UPDATE_EVENT_MUTATION,
  UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION,
  UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
  UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { InterfaceEvent } from 'types/Event/interface';

// Extend dayjs with utc plugin
dayjs.extend(utc);
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';

interface IEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

interface FormState {
  name: string;
  eventdescrip: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface UpdateEventHandlerProps {
  eventListCardProps: IEventListCard;
  formState: FormState;
  alldaychecked: boolean;
  publicchecked: boolean;
  registrablechecked: boolean;
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
    eventStartDate,
    eventEndDate,
    recurrence,
    updateOption,
    hasRecurrenceChanged = false, // Default to false if not provided
    t,
    hideViewModal,
    setEventUpdateModalIsOpen,
    refetchEvents,
  }: UpdateEventHandlerProps): Promise<void> => {
    const isRecurringInstance =
      !eventListCardProps.isRecurringTemplate &&
      !!eventListCardProps.baseEventId;

    try {
      let data;
      const updateInput: any = { id: eventListCardProps._id };

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
      if (alldaychecked !== eventListCardProps.allDay) {
        updateInput.allDay = alldaychecked;
      }

      const newStartAt = alldaychecked
        ? dayjs.utc(eventStartDate).isValid()
          ? dayjs.utc(eventStartDate).startOf('day').toISOString()
          : ''
        : dayjs(eventStartDate).isValid()
          ? dayjs(eventStartDate)
              .hour(parseInt(formState.startTime.split(':')[0]))
              .minute(parseInt(formState.startTime.split(':')[1]))
              .second(parseInt(formState.startTime.split(':')[2]))
              .toISOString()
          : '';

      const newEndAt = alldaychecked
        ? dayjs.utc(eventEndDate).isValid()
          ? dayjs.utc(eventEndDate).endOf('day').toISOString()
          : ''
        : dayjs(eventEndDate).isValid()
          ? dayjs(eventEndDate)
              .hour(parseInt(formState.endTime.split(':')[0]))
              .minute(parseInt(formState.endTime.split(':')[1]))
              .second(parseInt(formState.endTime.split(':')[2]))
              .toISOString()
          : '';

      const originalStartAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.startDate).isValid()
          ? dayjs.utc(eventListCardProps.startDate).startOf('day').toISOString()
          : ''
        : dayjs(
              `${eventListCardProps.startDate}T${eventListCardProps.startTime}`,
            ).isValid()
          ? dayjs(
              `${eventListCardProps.startDate}T${eventListCardProps.startTime}`,
            ).toISOString()
          : '';

      const originalEndAt = eventListCardProps.allDay
        ? dayjs.utc(eventListCardProps.endDate).isValid()
          ? dayjs.utc(eventListCardProps.endDate).endOf('day').toISOString()
          : ''
        : dayjs(
              `${eventListCardProps.endDate}T${eventListCardProps.endTime}`,
            ).isValid()
          ? dayjs(
              `${eventListCardProps.endDate}T${eventListCardProps.endTime}`,
            ).toISOString()
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
        toast.info(t('eventListCard.noChangesToUpdate'));
        return;
      }

      if (updateInput.startAt === '' || updateInput.endAt === '') {
        toast.error(t('invalidDate'));
        return;
      }

      if (!isRecurringInstance) {
        const result = await updateStandaloneEvent({
          variables: { input: updateInput },
        });
        data = result.data;
      } else {
        switch (updateOption) {
          case 'single':
            const singleResult = await updateSingleRecurringEventInstance({
              variables: { input: updateInput },
            });
            data = singleResult.data;
            break;
          case 'following':
            const followingResult = await updateThisAndFollowingEvents({
              variables: { input: updateInput },
            });
            data = followingResult.data;
            break;
          case 'entireSeries':
            const entireSeriesInput: any = { id: eventListCardProps._id };
            if (formState.name !== eventListCardProps.name) {
              entireSeriesInput.name = formState.name;
            }
            if (formState.eventdescrip !== eventListCardProps.description) {
              entireSeriesInput.description = formState.eventdescrip;
            }
            const entireSeriesResult = await updateEntireRecurringEventSeries({
              variables: { input: entireSeriesInput },
            });
            data = entireSeriesResult.data;
            break;
        }
      }

      if (data) {
        toast.success(t('eventUpdated') as string);
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
