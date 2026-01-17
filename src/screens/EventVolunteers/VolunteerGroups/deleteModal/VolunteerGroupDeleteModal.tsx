/**
 * VolunteerGroupDeleteModal
 *
 * A modal component that handles the deletion of volunteer groups.
 * It supports deleting groups for a single event instance or an entire recurring series.
 *
 * @param isOpen - Boolean to control modal visibility
 * @param hide - Function to close the modal
 * @param group - The volunteer group object to be deleted
 * @param refetchGroups - Callback to refresh the list after deletion
 * @param isRecurring - (Optional) Whether the event is recurring
 * @param eventId - (Optional) The ID of the specific event instance
 * @returns The rendered modal component
 */
import { Button, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  DELETE_VOLUNTEER_GROUP,
  DELETE_VOLUNTEER_GROUP_FOR_INSTANCE,
} from 'GraphQl/Mutations/EventVolunteerMutation';
//  Import the interface from the new file
import type { InterfaceDeleteVolunteerGroupModalProps } from 'types/EventVolunteers/VolunteerGroups/deleteModal/VolunteerGroupDeleteModal/interface';

const VolunteerGroupDeleteModal: React.FC<
  InterfaceDeleteVolunteerGroupModalProps
> = ({ isOpen, hide, group, refetchGroups, isRecurring = false, eventId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [deleteVolunteerGroup] = useMutation(DELETE_VOLUNTEER_GROUP);
  const [deleteVolunteerGroupForInstance] = useMutation(
    DELETE_VOLUNTEER_GROUP_FOR_INSTANCE,
  );

  const deleteHandler = async (): Promise<void> => {
    try {
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

      refetchGroups();
      hide();
      NotificationToast.success(t('volunteerGroupDeleted'));
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };
  const headerContent = (
    <>
      <p className={styles.titlemodal}> {t('deleteGroup')}</p>
      <Button
        variant="outline-secondary"
        onClick={hide}
        className={styles.modalCloseBtn}
        data-testid="modalCloseBtn"
      >
        <i className="fa fa-times"></i>
      </Button>
    </>
  );

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('deleteGroup')}
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
      <p> {t('deleteVolunteerGroupMsg')}</p>

      {/* Radio buttons for recurring events - Template-First: All recurring event volunteer groups are templates */}
      {isRecurring && group?.isTemplate && !group?.isInstanceException && (
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

export default VolunteerGroupDeleteModal;

