import { Button, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';

export interface InterfaceDeletePledgeModal {
  isOpen: boolean;
  hide: () => void;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
}

/**
 * A modal dialog for confirming the deletion of a pledge.
 *
 * @param  isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param  pledge - The pledge object to be deleted.
 * @param refetchPledge - Function to refetch the pledges after deletion.
 *
 * @returns  The rendered modal component.
 *
 *
 * The `PledgeDeleteModal` component displays a confirmation dialog when a user attempts to delete a pledge.
 * It allows the user to either confirm or cancel the deletion.
 * On confirmation, the `deletePledge` mutation is called to remove the pledge from the database,
 * and the `refetchPledge` function is invoked to update the list of pledges.
 * A success or error toast notification is shown based on the result of the deletion operation.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A body with a message asking for confirmation.
 * - A footer with "Yes" and "No" buttons to confirm or cancel the deletion.
 *
 * The `deletePledge` mutation is used to perform the deletion operation.
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

  const deleteHandler = async (): Promise<void> => {
    try {
      await deletePledge({
        variables: {
          id: pledge?._id,
        },
      });
      refetchPledge();
      hide();
      toast.success(t('pledgeDeleted') as string);
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
