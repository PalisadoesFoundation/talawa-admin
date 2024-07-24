import { Button, Modal } from 'react-bootstrap';
import styles from './FundCampaignPledge.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';

/**
 * Props for the PledgeDeleteModal component.
 */
export interface InterfaceDeletePledgeModal {
  isOpen: boolean;
  hide: () => void;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
}

/**
 * Modal component for confirming the deletion of a pledge.
 *
 * Allows users to confirm or cancel the deletion of a pledge.
 * Triggers a mutation to delete the pledge and refetches the pledge data upon success.
 *
 * @param props - The props for the component.
 * @returns  The rendered component.
 */
const PledgeDeleteModal: React.FC<InterfaceDeletePledgeModal> = ({
  isOpen,
  hide,
  pledge,
  refetchPledge,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pledges',
  });
  const { t: tCommon } = useTranslation('common');

  const [deletePledge] = useMutation(DELETE_PLEDGE);

  /**
   * Handler for deleting the pledge.
   *
   * Executes the delete mutation and refetches the pledge data.
   * Shows a success or error toast based on the result of the mutation.
   */
  const deleteHandler = async (): Promise<void> => {
    try {
      await deletePledge({
        variables: {
          id: pledge?._id,
        },
      });
      refetchPledge();
      hide();
      toast.success(t('pledgeDeleted'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  return (
    <>
      <Modal className={styles.pledgeModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deletePledge')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="deletePledgeCloseBtn"
          >
            {' '}
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('deletePledgeMsg')}</p>
        </Modal.Body>
        <Modal.Footer>
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PledgeDeleteModal;
