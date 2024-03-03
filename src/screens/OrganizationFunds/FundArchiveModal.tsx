import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFunds.module.css';

interface InterfaceArchiveFund {
  fundArchiveModalIsOpen: boolean;
  toggleArchiveModal: () => void;
  archiveFundHandler: () => Promise<void>;
}
const FundArchiveModal: React.FC<InterfaceArchiveFund> = ({
  fundArchiveModalIsOpen,
  toggleArchiveModal,
  archiveFundHandler,
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
            Archive Fund
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          On Archiving this fund will remove it from the fund listing.This
          action can be undone
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleArchiveModal}
            data-testid="fundArchiveModalCloseBtn"
          >
            No
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={archiveFundHandler}
            data-testid="archiveFundBtn"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default FundArchiveModal;
