import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFundCampaign.module.css';

/**
 * InterfaceDeleteCampaignModal is an object containing the props for CampaignDeleteModal component
 */
interface InterfaceDeleteCampaignModal {
  campaignDeleteModalIsOpen: boolean;
  hideDeleteCampaignModal: () => void;
  deleteCampaignHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * CampaignDeleteModal component is used to delete the campaign
 * @param  campaignDeleteModalIsOpen - boolean value to check if the modal is open or not
 * @param  hideDeleteCampaignModal - function to hide the modal
 * @param  deleteCampaignHandler - function to delete the campaign
 * @param  t - i18n function to translate the text
 * @param  tCommon - i18n function to translate the common text
 * @returns  returns the CampaignDeleteModal component
 */
const CampaignDeleteModal: React.FC<InterfaceDeleteCampaignModal> = ({
  campaignDeleteModalIsOpen,
  hideDeleteCampaignModal,
  deleteCampaignHandler,
  t,
  tCommon,
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
            {tCommon('yes')}
          </Button>
          <Button
            variant="secondary"
            onClick={hideDeleteCampaignModal}
            data-testid="deletenobtn"
          >
            {tCommon('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CampaignDeleteModal;
