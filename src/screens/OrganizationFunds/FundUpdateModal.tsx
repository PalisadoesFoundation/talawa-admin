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
  deleteFundHandler: () => Promise<void>;
  setIsArchived: (state: React.SetStateAction<boolean>) => void;
  isDefault: boolean;
  setIsDefault: (state: React.SetStateAction<boolean>) => void;
  t: (key: string) => string;
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
  deleteFundHandler,
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
        <Modal.Header className={styles.modalHeader}>
          <p className={styles.titlemodal}>{t('manageFund')} </p>
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
              <Form.Label className={styles.label}>{t('fundName')} </Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enterfundName')}
                data-testid="fundNameInput"
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
              <Form.Label className={styles.label}> {t('fundId')} </Form.Label>
              <Form.Control
                type="text"
                data-testid="fundIdInput"
                placeholder={t('enterfundId')}
                value={formState.fundRef}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    fundRef: e.target.value,
                  })
                }
              />
            </Form.Group>

            <div className="d-flex mx-3 flex-column">
              <div className="d-flex mb-3 justify-content-between">
                <Form.Group>
                  <div className="d-flex justify-content-end">
                    <label>{t('taxDeductible')} </label>
                    <Form.Switch
                      type="checkbox"
                      checked={taxDeductible}
                      className="ms-2"
                      data-testid="taxDeductibleSwitch"
                      onChange={() => setTaxDeductible(!taxDeductible)}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="ms-3">
                  <div className="d-flex justify-content-end">
                    <label>{t('default')} </label>
                    <Form.Switch
                      type="checkbox"
                      className="ms-2"
                      checked={isDefault}
                      data-testid="defaultSwitch"
                      onChange={() => setIsDefault(!isDefault)}
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="d-flex mb-3 justify-content-between">
                <Form.Group className="mb-3">
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
            </div>
            <div className="d-flex justify-content-between mb-2">
              <Button
                type="submit"
                variant="success"
                className={styles.manageBtn}
                data-testid="updateFormBtn"
              >
                {t('fundUpdate')}
              </Button>
              <Button
                type="button"
                variant="danger"
                className={styles.manageBtn}
                onClick={deleteFundHandler}
                data-testid="fundDeleteModalDeleteBtn"
              >
                {t('fundDelete')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundUpdateModal;
