/**
 * Modal that confirms deletion of a pledge.
 *
 * @remarks
 * Uses DeleteModal template from CRUDModalTemplate for consistent UI and behavior.
 *
 * @param props - Component props including visibility flag, pledge details, and callbacks.
 *
 * @returns React element for the delete pledge modal.
 *
 * @example
 * ```tsx
 * <PledgeDeleteModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   pledge={selectedPledge}
 *   refetchPledge={fetchPledges}
 * />
 * ```
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';

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

  const [deletePledge] = useMutation(DELETE_PLEDGE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmDelete = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deletePledge({ variables: { id: pledge?.id } });
      refetchPledge();
      hide();
      NotificationToast.success(t('pledgeDeleted') as string);
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DeleteModal
      open={isOpen}
      onClose={hide}
      title={t('deletePledge')}
      onDelete={onConfirmDelete}
      loading={isSubmitting}
      entityName={pledge?.pledger?.name}
      showWarning={false}
      data-testid="pledge-delete-modal"
    >
      <p>{t('deletePledgeMsg')}</p>
    </DeleteModal>
  );
};

export default PledgeDeleteModal;
