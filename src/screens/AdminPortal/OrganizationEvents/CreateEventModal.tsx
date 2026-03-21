import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import { errorHandler } from 'utils/errorHandler';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import type { IEventFormInput } from 'types/Event/interface';
import { mapCreateEventInputToMutationInput } from 'types/Event/createEventInput';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';

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

  const [create, { loading: createLoading }] = useMutation(
    CREATE_EVENT_MUTATION,
    { errorPolicy: 'all' },
  );

  const { t: tCommon } = useTranslation('common');

  const defaultValues: IEventFormValues = React.useMemo(() => {
    // Default to today's date for better UX - form submission handles past times
    // by adding a buffer when needed (see EventForm.handleSubmit)
    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const nextHour = new Date(now);
    const nextHourValue = Math.min(now.getHours() + 1, 23);
    nextHour.setHours(nextHourValue, 0, 0, 0);
    const twoHoursLater = new Date(nextHour);
    const twoHoursLaterValue = Math.min(nextHourValue + 2, 23);
    twoHoursLater.setHours(twoHoursLaterValue, 0, 0, 0);

    return {
      name: '',
      description: '',
      location: '',
      startDate: todayUTC,
      endDate: new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0,
        ),
      ),
      startTime: nextHour.toTimeString().split(' ')[0],
      endTime: twoHoursLater.toTimeString().split(' ')[0],
      allDay: true,
      isPublic: false,
      isInviteOnly: true,
      isRegisterable: false,

      recurrenceRule: null,
      createChat: false,
    };
  }, []);
  const [formResetKey, setFormResetKey] = useState(0);

  const handleClose = (): void => {
    setFormResetKey((prev) => prev + 1);
    onClose();
  };

  const handleSubmit = async (payload: IEventFormSubmitPayload) => {
    try {
      const recurrenceInput = payload.recurrenceRule
        ? formatRecurrenceForPayload(payload.recurrenceRule, payload.startDate)
        : undefined;

      // Build input object with shared typed interface
      // All-day events: use startDate/endDate (YYYY-MM-DD strings)
      // Timed events: use startAt/endAt (ISO timestamps)
      const input: IEventFormInput = {
        name: payload.name,
        ...(payload.allDay
          ? {
              // Backend expects all-day endDate to be exclusive (strictly greater than startDate).
              startDate: dayjs(payload.startDate).format('YYYY-MM-DD'),
              endDate: dayjs(payload.endDate)
                .add(1, 'day')
                .format('YYYY-MM-DD'),
            }
          : {
              startAt: payload.startAtISO,
              endAt: payload.endAtISO,
            }),
        organizationId: currentUrl,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
        isInviteOnly: payload.isInviteOnly,

        ...(payload.description && { description: payload.description }),
        ...(payload.location && { location: payload.location }),
        ...(recurrenceInput && { recurrence: recurrenceInput }),
      };

      const mutationInput = mapCreateEventInputToMutationInput(input);

      const { data: createEventData } = await create({
        variables: { input: mutationInput },
      });

      if (createEventData?.createEvent) {
        NotificationToast.success(t('eventCreated') as string);
        onEventCreated();
        setFormResetKey((prev) => prev + 1);
        onClose();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <CRUDModalTemplate
      open={isOpen}
      onClose={handleClose}
      title={t('eventDetails')}
      loading={createLoading}
      showFooter={false}
      data-testid="createEventModal"
    >
      <EventForm
        key={formResetKey}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel={tCommon('create')}
        showRegisterable
        showPublicToggle
        showRecurrenceToggle
        submitting={createLoading}
        showCancelButton
      />
    </CRUDModalTemplate>
  );
};
export default CreateEventModal;
