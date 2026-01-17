/**
 * PledgeDeleteModal Component
 *
 * This component renders a modal for deleting a pledge. It provides a confirmation
 * dialog to the user, allowing them to either confirm or cancel the deletion of a pledge.
 *
 * @component
 * @param {InterfaceDeletePledgeModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to hide the modal.
 * @param {InterfacePledgeInfo | null} props.pledge - The pledge information to be deleted.
 * @param {() => void} props.refetchPledge - Function to refetch the pledge data after deletion.
 *
 * @returns {React.FC} A React functional component rendering the delete pledge modal.
 *
 * @remarks
 * - The component uses `react-bootstrap` for modal and button styling.
 * - It utilizes the `useTranslation` hook from `react-i18next` for internationalization.
 * - The `useMutation` hook from `@apollo/client` is used to perform the `DELETE_PLEDGE` GraphQL mutation.
 * - Notifications are displayed using `react-toastify` to indicate success or error during the deletion process.
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
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
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
