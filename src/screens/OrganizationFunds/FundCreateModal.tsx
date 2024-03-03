/*eslint-disable */
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceCreateFund } from 'utils/interfaces';
import styles from './OrganizationFunds.module.css';

interface InterfaceFundCreateModal {
  fundCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceCreateFund;
  setFormState: (state: React.SetStateAction<InterfaceCreateFund>) => void;
  createFundHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  taxDeductible: boolean;
  setTaxDeductible: (state: React.SetStateAction<boolean>) => void;
  isArchived: boolean;
  setIsArchived: (state: React.SetStateAction<boolean>) => void;
  isDefault: boolean;
  setIsDefault: (state: React.SetStateAction<boolean>) => void;
}

const FundCreateModal: React.FC<InterfaceFundCreateModal> = ({
  fundCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createFundHandler,
  taxDeductible,
  setTaxDeductible,
  isArchived,
  setIsArchived,
  isDefault,
  setIsDefault,
}) => {
  return (
    <>
      <Modal
        className={styles.fundModal}
        show={fundCreateModalIsOpen}
        onHide={hideCreateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>Funds detail</p>
          <Button
            variant="danger"
            onClick={hideCreateModal}
            data-testid="createFundModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createFundHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Fund Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Fund Name"
                value={formState.fundName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    fundName: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fund Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Fund Id"
                value={formState.fundRef}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    fundRef: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="d-flex-col ">
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-end">
                  <label>Tax Deductible</label>
                  <Form.Switch
                    type="checkbox"
                    checked={taxDeductible}
                    className="ms-2"
                    onChange={() => setTaxDeductible(!taxDeductible)}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-end">
                  <label>Default Fund</label>
                  <Form.Switch
                    type="checkbox"
                    className="ms-2"
                    checked={isDefault}
                    onChange={() => setIsDefault(!isDefault)}
                  />
                </div>
              </Form.Group>
            </div>
            <Button type="submit" className={styles.greenregbtn}>
              Create Fund
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundCreateModal;
