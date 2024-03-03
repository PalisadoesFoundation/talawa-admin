/*eslint-disable */
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFunds.module.css';

interface InterfaceFundDeleteModal {
  fundDeleteModalIsOpen: boolean;
  deleteFundHandler: () => Promise<void>;
  toggleDeleteModal: () => void;
}
const FundDeleteModal: React.FC<InterfaceFundDeleteModal> = ({
  fundDeleteModalIsOpen,
  deleteFundHandler,
  toggleDeleteModal,
}) => {
  return (
    <>
      <Modal
        size="sm"
        id={`deleteFundModal`}
        show={fundDeleteModalIsOpen}
        onHide={toggleDeleteModal}
        backdrop="static"
        keyboard={false}
        className={styles.fundModal}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteFund`}>
            Delete Fund
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to remove this Fund?</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="fundDeleteModalCloseBtn"
          >
            No
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteFundHandler}
            data-testid="deleteFundBtn"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default FundDeleteModal;
