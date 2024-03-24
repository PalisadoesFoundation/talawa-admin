import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFunds.module.css';

interface InterfaceArchiveFund {
  fundArchiveModalIsOpen: boolean;
  toggleArchiveModal: () => void;
  archiveFundHandler: () => Promise<void>;
  t: (key: string) => string;
}
console.log('hey');

const FundArchiveModal: React.FC<InterfaceArchiveFund> = ({
  fundArchiveModalIsOpen,
  toggleArchiveModal,
  archiveFundHandler,
  t,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id={`archiveFundModal`}
        show={fundArchiveModalIsOpen}
        onHide={toggleArchiveModal}
        backdrop="static"
        keyboard={false}
        className={styles.fundModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`archiveFund`}>
            {t('archiveFund')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('archiveFundMsg')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleArchiveModal}
            data-testid="fundArchiveModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={archiveFundHandler}
            data-testid="fundArchiveModalArchiveBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default FundArchiveModal;
