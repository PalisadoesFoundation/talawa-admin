/**
 * Modal that confirms deletion of a volunteer.
 *
 * component VolunteerDeleteModal
 * @param props - Component props from InterfaceDeleteVolunteerModal
 * @returns JSX.Element
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VolunteerDeleteModal.module.css';
import { useMutation } from '@apollo/client';
import {
  DeleteModal,
  useMutationModal,
} from 'shared-components/CRUDModalTemplate';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import {
  DELETE_VOLUNTEER,
  DELETE_VOLUNTEER_FOR_INSTANCE,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import type { InterfaceVolunteerDeleteModalProps } from 'types/AdminPortal/VolunteerDeleteModal/interface';

const VolunteerDeleteModal: React.FC<InterfaceVolunteerDeleteModalProps> = ({
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
  const { isSubmitting, execute } = useMutationModal<Record<string, never>>(
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
      allowEmptyData: true,
    },
  );

  const deleteHandler = async (): Promise<void> => {
    await execute({});
  };

  const recurringEventContent =
    volunteer.isTemplate && !volunteer.isInstanceException ? (
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
              onChange={() => setApplyTo('series')}
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
              onChange={() => setApplyTo('instance')}
            />
            <label htmlFor="deleteApplyToInstance">{t('thisEventOnly')}</label>
          </div>
        </div>
      </fieldset>
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
