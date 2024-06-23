import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFundCampaign.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_CAMPAIGN_MUTATION } from 'GraphQl/Mutations/CampaignMutation';
import type { InterfaceCampaignInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface InterfaceDeleteCampaignModal {
  isOpen: boolean;
  hide: () => void;
  campaign: InterfaceCampaignInfo | null;
  refetchCampaign: () => void;
}
const CampaignDeleteModal: React.FC<InterfaceDeleteCampaignModal> = ({
  isOpen,
  hide,
  campaign,
  refetchCampaign,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'fundCampaign',
  });
  const { t: tCommon } = useTranslation('common');

  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN_MUTATION);

  const deleteCampaignHandler = async (): Promise<void> => {
    try {
      await deleteCampaign({
        variables: {
          id: campaign?._id,
        },
      });
      toast.success(t('deletedCampaign'));
      refetchCampaign();
      hide();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
    }
  };
  return (
    <>
      <Modal show={isOpen} onHide={hide}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deleteCampaign')} </p>
          <Button
            variant="danger"
            onClick={hide}
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
          <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
            {tCommon('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CampaignDeleteModal;
