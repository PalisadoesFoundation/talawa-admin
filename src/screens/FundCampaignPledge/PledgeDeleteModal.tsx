import { Button, Modal } from 'react-bootstrap';
import styles from './FundCampaignPledge.module.css';
import React from 'react';

interface InterfaceDeletePledgeModal {
  deletePledgeModalIsOpen: boolean;
  hideDeletePledgeModal: () => void;
  deletePledgeHandler: () => Promise<void>;
  t: (key: string) => string;
}
const PledgeDeleteModal: React.FC<InterfaceDeletePledgeModal> = ({
  deletePledgeModalIsOpen,
  hideDeletePledgeModal,
  deletePledgeHandler,
  t,
}) => {
  return (
    <>
      <Modal
        className={styles.pledgeModal}
        onHide={hideDeletePledgeModal}
        show={deletePledgeModalIsOpen}
      >
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deletePledge')}</p>
          <Button
            variant="danger"
            onClick={hideDeletePledgeModal}
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
            onClick={deletePledgeHandler}
            data-testid="deleteyesbtn"
          >
            {t('yes')}
          </Button>
          <Button
            variant="secondary"
            onClick={hideDeletePledgeModal}
            data-testid="deletenobtn"
          >
            {t('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default PledgeDeleteModal;
