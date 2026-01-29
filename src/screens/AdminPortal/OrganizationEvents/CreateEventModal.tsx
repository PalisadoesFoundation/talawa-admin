import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
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
import type { ICreateEventInput } from 'types/Event/interface';
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
  const { t: tCommon } = useTranslation('common');

  const [create, { loading: createLoading }] = useMutation(
    CREATE_EVENT_MUTATION,
  );

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

  const defaultValues: IEventFormValues = {
    name: '',
    description: '',
    location: '',
    startDate: todayUTC,
    endDate: todayUTC,
    startTime: '08:00:00',
    endTime: '18:00:00',
    allDay: true,
    isPublic: false,
    isInviteOnly: true,
    isRegisterable: false,

    recurrenceRule: null,
    createChat: false,
  };
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
      const input: ICreateEventInput = {
        name: payload.name,
        startAt: payload.startAtISO,
        endAt: payload.endAtISO,
        organizationId: currentUrl,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
        isInviteOnly: payload.isInviteOnly,

        ...(payload.description && { description: payload.description }),
        ...(payload.location && { location: payload.location }),
        ...(recurrenceInput && { recurrence: recurrenceInput }),
      };

      const { data: createEventData } = await create({
        variables: { input },
      });

      if (createEventData) {
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
        submitLabel={t('createEvent')}
        t={t}
        tCommon={tCommon}
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
