/*eslint-disable */
import { Button, Modal } from 'react-bootstrap';
import styles from './OrganizationFunds.module.css';

interface InterfaceFundDeleteModal {
  fundDeleteModalIsOpen: boolean;
  deleteFundHandler: () => Promise<void>;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
}
const FundDeleteModal: React.FC<InterfaceFundDeleteModal> = ({
  fundDeleteModalIsOpen,
  deleteFundHandler,
  toggleDeleteModal,
  t,
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
            t
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('deleteFundMsg')} </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleDeleteModal}
            data-testid="fundDeleteModalCloseBtn"
          >
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deleteFundHandler}
            data-testid="fundDeleteModalDeleteBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default FundDeleteModal;
