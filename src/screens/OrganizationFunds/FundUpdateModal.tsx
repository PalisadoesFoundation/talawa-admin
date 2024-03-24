import type { ChangeEvent } from 'react';
import React from 'react';
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
  t: (key: string) => string;
}
console.log('hey');

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
  t,
}) => {
  return (
    <>
      <Modal
        className={styles.fundModal}
        show={fundUpdateModalIsOpen}
        onHide={hideUpdateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('fundDetails')} </p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="editFundModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateFundHandler}>
            <Form.Group className="mb-3">
              <Form.Label>{t('fundName')} </Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enterfundName')}
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
                  <label>{t('taxDeductible')} </label>
                  <Form.Switch
                    type="checkbox"
                    checked={taxDeductible}
                    data-testid="taxDeductibleSwitch"
                    className="ms-2"
                    onChange={() => setTaxDeductible(!taxDeductible)}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3 ">
                <div className="d-flex justify-content-end">
                  <label>{t('archived')} </label>
                  <Form.Switch
                    type="checkbox"
                    className="ms-2"
                    data-testid="archivedSwitch"
                    checked={isArchived}
                    onChange={() => setIsArchived(!isArchived)}
                  />
                </div>
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-end">
                <label>{t('default')} </label>
                <Form.Switch
                  type="checkbox"
                  className="ms-2"
                  data-testid="defaultSwitch"
                  checked={isDefault}
                  onChange={() => setIsDefault(!isDefault)}
                />
              </div>
            </Form.Group>
            <Button
              type="submit"
              className={styles.greenregbtn}
              data-testid="editFundFormSubmitBtn"
            >
              {t('fundUpdate')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundUpdateModal;
