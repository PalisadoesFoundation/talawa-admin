/*eslint-disable */
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceCreateFund } from 'utils/interfaces';
import styles from './OrganizationFunds.module.css';

interface InterfaceFundUpdateModal {
  fundUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceCreateFund;
  setFormState: (state: React.SetStateAction<InterfaceCreateFund>) => void;
  updateFundHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  taxDeductible: boolean;
  setTaxDeductible: (state: React.SetStateAction<boolean>) => void;
  isArchived: boolean;
  setIsArchived: (state: React.SetStateAction<boolean>) => void;
  isDefault: boolean;
  setIsDefault: (state: React.SetStateAction<boolean>) => void;
}

const FundUpdateModal: React.FC<InterfaceFundUpdateModal> = ({
  fundUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateFundHandler,
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
        show={fundUpdateModalIsOpen}
        onHide={hideUpdateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>Funds detail</p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="createFundModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateFundHandler}>
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

            <div className="d-flex justify-content-between">
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

              <Form.Group className="mb-3 ">
                <div className="d-flex justify-content-end">
                  <label>Archived</label>
                  <Form.Switch
                    type="checkbox"
                    className="ms-2"
                    checked={isArchived}
                    onChange={() => setIsArchived(!isArchived)}
                  />
                </div>
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-end">
                <label>Default</label>
                <Form.Switch
                  type="checkbox"
                  className="ms-2"
                  checked={isDefault}
                  onChange={() => setIsDefault(!isDefault)}
                />
              </div>
            </Form.Group>
            <Button type="submit" className={styles.greenregbtn}>
              Update Fund
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundUpdateModal;
