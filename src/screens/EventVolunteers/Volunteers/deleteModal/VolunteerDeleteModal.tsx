/**
 * VolunteerDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of a volunteer.
 * It provides options to either confirm or cancel the deletion process.
 */
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'components/BaseModal/BaseModal';
import styles from 'style/app-fixed.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
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
      toast.success(t('volunteerRemoved'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  const customHeader = (
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
      customHeader={customHeader}
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
