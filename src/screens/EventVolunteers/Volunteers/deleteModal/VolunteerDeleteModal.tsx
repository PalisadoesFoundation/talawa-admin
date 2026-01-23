/**
 * VolunteerDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of a volunteer.
 * It provides options to either confirm or cancel the deletion process.
 *
 * @returns A modal element for confirming volunteer deletion.
 *
 * @example
 * ```tsx
 * <VolunteerDeleteModal
 *   isOpen={isModalOpen}
 *   hide={closeModal}
 *   volunteer={selectedVolunteer}
 *   refetchVolunteers={fetchVolunteers}
 * />
 * ```
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and button components.
 * - Integrates `react-i18next` for translations.
 * - Utilizes Apollo Client's `useMutation` hook to perform the delete operation.
 * - Displays success or error messages using `NotificationToast`.
 */
import { Button } from 'react-bootstrap';
import styles from './VolunteerDeleteModal.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
  const { t: tCommon } = useTranslation('common');

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [deleteVolunteer] = useMutation(DELETE_VOLUNTEER);
  const [deleteVolunteerForInstance] = useMutation(
    DELETE_VOLUNTEER_FOR_INSTANCE,
  );

  const deleteHandler = async (): Promise<void> => {
    try {
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

      refetchVolunteers();
      hide();
      NotificationToast.success(t('volunteerRemoved'));
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };
  return (
    <BaseModal
      className={styles.volunteerModal}
      onHide={hide}
      show={isOpen}
      headerContent={
        <p className={styles.titlemodal}> {t('removeVolunteer')}</p>
      }
      footer={
        <>
          <Button
            variant="danger"
            onClick={deleteHandler}
            data-testid="deleteyesbtn"
          >
            {tCommon('yes')}
          </Button>
          <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
            {tCommon('no')}
          </Button>
        </>
      }
    >
      <p> {t('removeVolunteerMsg')}</p>

      {/* Radio buttons for recurring events - Template-First: All recurring event volunteers are templates */}
      {volunteer.isTemplate && !volunteer.isInstanceException && (
        <div className="mb-3">
          <label>{t('applyTo')}</label>
          <div>
            <input
              type="radio"
              name="applyTo"
              id="deleteApplyToSeries"
              data-testid="deleteApplyToSeries"
              checked={applyTo === 'series'}
              onChange={() => setApplyTo('series')}
            />
            <label htmlFor="deleteApplyToSeries">{t('entireSeries')}</label>
          </div>
          <div>
            <input
              type="radio"
              name="applyTo"
              id="deleteApplyToInstance"
              data-testid="deleteApplyToInstance"
              checked={applyTo === 'instance'}
              onChange={() => setApplyTo('instance')}
            />
            <label htmlFor="deleteApplyToInstance">{t('thisEventOnly')}</label>
          </div>
        </div>
      )}
    </BaseModal>
  );
};
export default VolunteerDeleteModal;
