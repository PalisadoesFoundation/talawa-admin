import { Button, Modal } from 'react-bootstrap';
import styles from './FundCampaignPledge.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';

interface InterfaceDeletePledgeModal {
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
