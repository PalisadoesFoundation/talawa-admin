/**
 * PledgeDeleteModal Component
 *
 * Renders a confirmation modal for deleting a pledge.
 * Allows the user to confirm or cancel the deletion action.
 *
 * @component
 * @param {InterfaceDeletePledgeModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {InterfacePledgeInfo | null} props.pledge - The pledge information to be deleted.
 * @param {() => void} props.refetchPledge - Function to refetch pledge data after deletion.
 *
 * @returns {JSX.Element} The rendered delete pledge confirmation modal.
 *
 * @example
 * <PledgeDeleteModal
 *   isOpen={true}
 *   hide={handleClose}
 *   pledge={pledge}
 *   refetchPledge={refetch}
 * />
 */
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
import { BaseModal } from 'shared-components/BaseModal';

export interface InterfaceDeletePledgeModal {
  isOpen: boolean;
  hide: () => void;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
}

const PledgeDeleteModal: React.FC<InterfaceDeletePledgeModal> = ({
  isOpen,
  hide,
  pledge,
  refetchPledge,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
  const { t: tCommon } = useTranslation('common');

  const [deletePledge] = useMutation(DELETE_PLEDGE);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmDelete = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deletePledge({ variables: { id: pledge?.id } });
      refetchPledge();
      hide();
      toast.success(t('pledgeDeleted') as string);
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('deletePledge')}
      className={styles.pledgeModal}
      closeButtonVariant="danger"
      dataTestId="pledge-delete-modal"
      footer={
        <>
          <Button
            variant="danger"
            onClick={onConfirmDelete}
            disabled={isSubmitting}
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
      <p>{t('deletePledgeMsg')}</p>
    </BaseModal>
  );
};

export default PledgeDeleteModal;
