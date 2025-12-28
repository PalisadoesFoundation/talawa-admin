import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app-fixed.module.css';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import { errorHandler } from 'utils/errorHandler';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';

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

  const defaultValues: IEventFormValues = {
    name: '',
    description: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '08:00:00',
    endTime: '18:00:00',
    allDay: true,
    isPublic: true,
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

      // Build input object with typed interface
      const input: {
        name: string;
        startAt: string;
        endAt: string;
        organizationId: string | undefined;
        allDay: boolean;
        isPublic: boolean;
        isRegisterable: boolean;
        description?: string;
        location?: string;
        recurrence?: ReturnType<typeof formatRecurrenceForPayload>;
      } = {
        name: payload.name,
        startAt: payload.startAtISO,
        endAt: payload.endAtISO,
        organizationId: currentUrl,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
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
    <>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header>
          <p className={styles.titlemodalOrganizationEvents}>
            {t('eventDetails')}
          </p>
          <Button
            variant="danger"
            onClick={handleClose}
            className={styles.closeButtonOrganizationEvents}
            data-testid="createEventModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateEventModal;
