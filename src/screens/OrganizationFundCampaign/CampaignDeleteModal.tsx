import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFundCampaign.module.css';

interface InterfaceDeleteCampaignModal {
  campaignDeleteModalIsOpen: boolean;
  hideDeleteCampaignModal: () => void;
  deleteCampaignHandler: () => Promise<void>;
  t: (key: string) => string;
}
const CampaignDeleteModal: React.FC<InterfaceDeleteCampaignModal> = ({
  campaignDeleteModalIsOpen,
  hideDeleteCampaignModal,
  deleteCampaignHandler,
  t,
}) => {
  return (
    <>
      <Modal show={campaignDeleteModalIsOpen} onHide={hideDeleteCampaignModal}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deleteCampaign')} </p>
          <Button
            variant="danger"
            onClick={hideDeleteCampaignModal}
            data-testid="deleteCampaignCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('deleteCampaignMsg')} </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={deleteCampaignHandler}
            data-testid="deleteyesbtn"
          >
            {t('yes')}
          </Button>
          <Button
            variant="secondary"
            onClick={hideDeleteCampaignModal}
            data-testid="deletenobtn"
          >
            {t('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CampaignDeleteModal;
