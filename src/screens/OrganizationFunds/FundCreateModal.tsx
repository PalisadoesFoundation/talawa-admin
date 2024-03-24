import React from 'react';
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
  isDefault: boolean;
  setIsDefault: (state: React.SetStateAction<boolean>) => void;
  t: (key: string) => string;
}

const FundCreateModal: React.FC<InterfaceFundCreateModal> = ({
  fundCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createFundHandler,
  taxDeductible,
  setTaxDeductible,
  isDefault,
  setIsDefault,
  t,
}) => {
  return (
    <>
      <Modal
        className={styles.fundModal}
        show={fundCreateModalIsOpen}
        onHide={hideCreateModal}
      >
        <Modal.Header className={styles.modalHeader}>
          <p className={styles.titlemodal}> {t('fundCreate')}</p>
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
              <Form.Label className={styles.label}>{t('fundName')} </Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}> {t('fundId')} </Form.Label>
              <Form.Control
                type="text"
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
            <div className="d-flex mb-3">
              <Form.Group>
                <div className="d-flex justify-content-end">
                  <label>{t('taxDeductible')} </label>
                  <Form.Switch
                    type="checkbox"
                    checked={taxDeductible}
                    data-testid="setTaxDeductibleSwitch"
                    className="ms-2"
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
                    data-testid="setDefaultSwitch"
                    checked={isDefault}
                    onChange={() => setIsDefault(!isDefault)}
                  />
                </div>
              </Form.Group>
            </div>
            <Button
              type="submit"
              className={styles.greenregbtn}
              data-testid="createFundFormSubmitBtn"
            >
              {t('fundCreate')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundCreateModal;
