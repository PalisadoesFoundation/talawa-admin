/**
 * Modal that confirms deletion of a volunteer.
 *
 * component VolunteerDeleteModal
 * `@param` props - Component props from InterfaceDeleteVolunteerModal
 * `@returns` JSX.Element
 */
import { Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  DeleteModal,
  useMutationModal,
} from 'shared-components/CRUDModalTemplate';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import {
  DELETE_VOLUNTEER,
  DELETE_VOLUNTEER_FOR_INSTANCE,
} from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceDeleteVolunteerModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
  // New props for recurring events
  isRecurring?: boolean;
  eventId?: string;
}

const VolunteerDeleteModal: React.FC<InterfaceDeleteVolunteerModal> = ({
  isOpen,
  hide,
  volunteer,
  refetchVolunteers,
  isRecurring = false,
  eventId,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [deleteVolunteer] = useMutation(DELETE_VOLUNTEER);
  const [deleteVolunteerForInstance] = useMutation(
    DELETE_VOLUNTEER_FOR_INSTANCE,
  );

  // Use useMutationModal for loading/error state management
  const { isSubmitting, execute } = useMutationModal<void>(
    async () => {
      // Template-First Approach: For recurring events, all volunteers are templates
      if (isRecurring && applyTo === 'instance' && eventId) {
        // Delete for specific instance only (create exception)
        await deleteVolunteerForInstance({
          variables: {
            input: {
              volunteerId: volunteer.id,
              recurringEventInstanceId: eventId,
            },
          },
        });
      } else {
        // Delete for entire series or non-recurring event
        await deleteVolunteer({ variables: { id: volunteer.id } });
      }
    },
    {
      onSuccess: () => {
        refetchVolunteers();
        hide();
        NotificationToast.success(t('volunteerRemoved'));
      },
      onError: (error) => {
        NotificationToast.error(error.message);
      },
    },
  );

  const deleteHandler = async (): Promise<void> => {
    await execute();
  };

  const recurringEventContent =
    volunteer.isTemplate && !volunteer.isInstanceException ? (
      <Form.Group className="mb-3">
        <Form.Label>{t('applyTo')}</Form.Label>
        <Form.Check
          type="radio"
          label={t('entireSeries')}
          name="applyTo"
          id="deleteApplyToSeries"
          data-testid="deleteApplyToSeries"
          checked={applyTo === 'series'}
          onChange={() => setApplyTo('series')}
        />
        <Form.Check
          type="radio"
          label={t('thisEventOnly')}
          name="applyTo"
          id="deleteApplyToInstance"
          data-testid="deleteApplyToInstance"
          checked={applyTo === 'instance'}
          onChange={() => setApplyTo('instance')}
        />
      </Form.Group>
    ) : undefined;

  return (
    <DeleteModal
      open={isOpen}
      title={t('removeVolunteer')}
      onClose={hide}
      onDelete={deleteHandler}
      loading={isSubmitting}
      data-testid="deleteVolunteerModal"
      recurringEventContent={recurringEventContent}
    >
      <p>{t('removeVolunteerMsg')}</p>
    </DeleteModal>
  );
};
export default VolunteerDeleteModal;
