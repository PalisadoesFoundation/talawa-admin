import { Button, Modal } from 'react-bootstrap';
import React from 'react';
import styles from './OrganizationFundCampaign.module.css';

interface InterfaceDeleteCampaignModal {
  campaignDeleteModalIsOpen: boolean;
  hideDeleteCampaignModal: () => void;
  deleteCampaignHandler: () => Promise<void>;
}
const CampaignDeleteModal: React.FC<InterfaceDeleteCampaignModal> = ({
  campaignDeleteModalIsOpen,
  hideDeleteCampaignModal,
  deleteCampaignHandler,
}) => {
  return (
    <>
      <Modal show={campaignDeleteModalIsOpen} onHide={hideDeleteCampaignModal}>
        <Modal.Header>
          <p className={styles.titlemodal}> Delete Fund Campaign</p>
          <Button variant="danger" onClick={hideDeleteCampaignModal}>
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this campaign?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteCampaignHandler}>
            Delete
          </Button>
          <Button variant="secondary" onClick={hideDeleteCampaignModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CampaignDeleteModal;
