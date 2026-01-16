import { Button, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  DELETE_VOLUNTEER,
  DELETE_VOLUNTEER_FOR_INSTANCE,
} from 'GraphQl/Mutations/EventVolunteerMutation';
// 👇 Import the interface from the new file
import { InterfaceDeleteVolunteerModal } from 'types/EventVolunteers/Volunteers/deleteModal/VolunteerDeleteModal/interface';

/**
 * VolunteerDeleteModal
 *
 * A modal component used to confirm and handle the deletion of a specific volunteer.
 *
 * @param isOpen - Boolean to control modal visibility
 * @param hide - Function to close the modal
 * @param volunteer - The volunteer object to be deleted
 * @param refetchVolunteers - Callback to refresh the list after deletion
 * @param isRecurring - (Optional) Whether the event is recurring
 * @param eventId - (Optional) The ID of the specific event instance
 */
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
  const headerContent = (
    <>
      <p className={styles.titlemodal}> {t('removeVolunteer')}</p>
      <Button
        variant="danger"
        onClick={hide}
        className={styles.modalCloseBtn}
        data-testid="modalCloseBtn"
      >
        {' '}
        <i className="fa fa-times"></i>
      </Button>
    </>
  );

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('removeVolunteer')}
      className={styles.volunteerModal}
      headerContent={headerContent}
      centered={false}
      backdrop={true}
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
      )}
    </BaseModal>
  );
};
export default VolunteerDeleteModal;