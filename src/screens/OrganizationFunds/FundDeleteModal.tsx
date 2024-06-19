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
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
