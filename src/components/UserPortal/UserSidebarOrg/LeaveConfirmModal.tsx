import type { FC } from 'react';
import React from 'react';
import styles from './LeaveConfirmModal.module.css';
import { Button, Modal } from 'react-bootstrap';
import { LEAVE_ORGANIZATION } from 'GraphQl/Mutations/OrganizationMutations';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/OrganizationQueries';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface InterfaceLeaveConfirmModalProps {
  show: boolean;
  onHide: () => void;
  orgId: string;
}

/**
 * LeaveConfirmModal component for user to leave an organization.
 *
 * Provides:
 * - Modal to confirm leaving an organization.
 *
 * @param orgId - ID of the current organization. 
 * @param show - Boolean indicating if the modal should be shown.
 * @param onHide - Function to hide the modal.
 *
 * @returns JSX.Element - The rendered LeaveConfirmModal component.
 */

const LeaveConfirmModal: FC<InterfaceLeaveConfirmModalProps> = ({
  onHide,
  show,
  orgId,
}) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgLeave',
  });

  const [leaveOrganization] = useMutation(LEAVE_ORGANIZATION, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id: orgId } },
    ],
  });

  async function leaveOrg(): Promise<void> {
    try {
      await leaveOrganization({
        variables: {
          organizationId: orgId,
        },
      });
      onHide();
      toast.success(t('orgLeft'));
      redirect(`/user/organizations`);
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(t('errorOccured'));
      }
      onHide();
    }
  }
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="leave-confirm-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('heading')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{t('confirmation')}</h4>
        <p>{t('description')}</p>
      </Modal.Body>
      <Modal.Footer className={styles.leaveConfirmModalFooter}>
        <Button variant="danger" onClick={onHide}>
          {tCommon('cancel')}
        </Button>
        <Button onClick={leaveOrg}>{tCommon('confirm')}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeaveConfirmModal;
