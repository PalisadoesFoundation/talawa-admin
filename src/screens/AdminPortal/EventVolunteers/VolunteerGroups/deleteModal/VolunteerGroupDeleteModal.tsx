/**
 * Modal that confirms deletion of a volunteer group.
 *
 * component VolunteerGroupDeleteModal
 * `@param` props - Component props from InterfaceDeleteVolunteerGroupModal
 * `@returns` JSX.Element
 */
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
import styles from './VolunteerGroupDeleteModal.module.css';

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
  const { isSubmitting, execute } = useMutationModal<Record<string, never>>(
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
      allowEmptyData: true,
    },
  );

  const deleteHandler = async (): Promise<void> => {
    await execute({});
  };

  const recurringEventContent =
    group?.isTemplate && !group?.isInstanceException ? (
      <fieldset className={styles.radioFieldset}>
        <legend className={styles.radioLegend}>{t('applyTo')}</legend>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input
              type="radio"
              name="applyTo"
              id="deleteApplyToSeries"
              data-testid="deleteApplyToSeries"
              value="series"
              checked={applyTo === 'series'}
              onChange={(e) => {
                if (e.target.checked) {
                  setApplyTo('series');
                }
              }}
            />
            <label htmlFor="deleteApplyToSeries">{t('entireSeries')}</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              name="applyTo"
              id="deleteApplyToInstance"
              data-testid="deleteApplyToInstance"
              value="instance"
              checked={applyTo === 'instance'}
              onChange={(e) => {
                if (e.target.checked) {
                  setApplyTo('instance');
                }
              }}
            />
            <label htmlFor="deleteApplyToInstance">{t('thisEventOnly')}</label>
          </div>
        </div>
      </fieldset>
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
