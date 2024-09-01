import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfaceFundInfo } from 'utils/interfaces';
import styles from './OrganizationFunds.module.css';
import { Button, Modal } from 'react-bootstrap';
import { REMOVE_FUND_MUTATION } from 'GraphQl/Mutations/FundMutation';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

export interface InterfaceDeleteFundModal {
  isOpen: boolean;
  hide: () => void;
  fund: InterfaceFundInfo | null;
  refetchFunds: () => void;
}
/**
 * `FundDeleteModal` component provides a modal dialog for confirming the deletion of a fund.
 * It prompts the user to confirm or cancel the deletion of a specific fund.
 *
 * ### Props
 * - `isOpen`: A boolean indicating whether the modal is open or closed.
 * - `hide`: A function to close the modal.
 * - `fund`: The fund object to be deleted or `null` if no fund is selected.
 * - `refetchFunds`: A function to refetch the list of funds after a successful deletion.
 *
 * ### Methods
 * - `deleteFundHandler()`: Asynchronously handles the deletion of the fund using the `REMOVE_FUND_MUTATION` mutation.
 * - `onClose()`: Closes the modal without deleting the fund.
 *
 * ### Behavior
 * - Displays a confirmation modal when `isOpen` is `true`.
 * - On confirmation, it triggers the `deleteFundHandler` to perform the deletion.
 * - On successful deletion, it calls `refetchFunds`, hides the modal, and shows a success toast notification.
 * - On failure, it shows an error toast notification.
 *
 * @returns  The rendered modal dialog.
 */
const FundDeleteModal: React.FC<InterfaceDeleteFundModal> = ({
  isOpen,
  hide,
  fund,
  refetchFunds,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'funds',
  });
  const { t: tCommon } = useTranslation('common');

  const [deleteFund] = useMutation(REMOVE_FUND_MUTATION);

  const deleteFundHandler = async (): Promise<void> => {
    try {
      await deleteFund({
        variables: {
          id: fund?._id,
        },
      });
      refetchFunds();
      hide();
      toast.success(t('fundDeleted'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <Modal className={styles.fundModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('fundDelete')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="deleteFundCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('deleteFundMsg')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={deleteFundHandler}
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

export default FundDeleteModal;
