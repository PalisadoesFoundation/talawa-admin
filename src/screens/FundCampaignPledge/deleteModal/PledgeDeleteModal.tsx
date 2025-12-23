/**
 * PledgeDeleteModal Component
 *
 * Renders a confirmation modal for deleting a pledge.
 *
 * @component
 * @param {InterfaceDeletePledgeModal} props - Props including isOpen, hide, pledge, refetchPledge.
 *
 * @example
 * <PledgeDeleteModal isOpen={true} hide={handleClose} pledge={pledge} refetchPledge={refetch} />
 */
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import React from 'react';
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

  const deleteHandler = async (): Promise<void> => {
    try {
      await deletePledge({ variables: { id: pledge?.id } });
      refetchPledge();
      hide();
      toast.success(t('pledgeDeleted') as string);
    } catch (error: unknown) {
      toast.error((error as Error).message);
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
      <p>{t('deletePledgeMsg')}</p>
    </BaseModal>
  );
};

export default PledgeDeleteModal;
