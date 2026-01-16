/**
 * Modal that confirms deletion of a volunteer group.
 *
 * component VolunteerGroupDeleteModal
 * `@param` props - Component props from InterfaceDeleteVolunteerGroupModal
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
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import {
  DELETE_VOLUNTEER_GROUP,
  DELETE_VOLUNTEER_GROUP_FOR_INSTANCE,
} from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceDeleteVolunteerGroupModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
  // New props for recurring events
  isRecurring?: boolean;
  eventId?: string;
}

const VolunteerGroupDeleteModal: React.FC<
  InterfaceDeleteVolunteerGroupModal
> = ({ isOpen, hide, group, refetchGroups, isRecurring = false, eventId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [deleteVolunteerGroup] = useMutation(DELETE_VOLUNTEER_GROUP);
  const [deleteVolunteerGroupForInstance] = useMutation(
    DELETE_VOLUNTEER_GROUP_FOR_INSTANCE,
  );

  // Use useMutationModal for loading/error state management
  const { isSubmitting, execute } = useMutationModal<void>(
    async () => {
      // Template-First Approach: For recurring events, all volunteer groups are templates
      if (isRecurring && applyTo === 'instance' && group && eventId) {
        // Delete for specific instance only (create exception)
        await deleteVolunteerGroupForInstance({
          variables: {
            input: {
              volunteerGroupId: group.id,
              recurringEventInstanceId: eventId,
            },
          },
        });
      } else {
        // Delete for entire series or non-recurring event
        await deleteVolunteerGroup({ variables: { id: group?.id } });
      }
    },
    {
      onSuccess: () => {
        refetchGroups();
        hide();
        NotificationToast.success(t('volunteerGroupDeleted'));
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
    group?.isTemplate && !group?.isInstanceException ? (
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
      title={t('deleteGroup')}
      onClose={hide}
      onDelete={deleteHandler}
      loading={isSubmitting}
      data-testid="deleteVolunteerGroupModal"
      recurringEventContent={recurringEventContent}
    >
      <p>{t('deleteVolunteerGroupMsg')}</p>
    </DeleteModal>
  );
};
export default VolunteerGroupDeleteModal;
