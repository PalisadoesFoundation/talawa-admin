import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceCreateFund, InterfaceFundInfo } from 'utils/interfaces';
import styles from './OrganizationFunds.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { toast } from 'react-toastify';
import { FormControl, TextField } from '@mui/material';

export interface InterfaceFundModal {
  isOpen: boolean;
  hide: () => void;
  refetchFunds: () => void;
  fund: InterfaceFundInfo | null;
  orgId: string;
  mode: 'create' | 'edit';
}

const FundModal: React.FC<InterfaceFundModal> = ({
  isOpen,
  hide,
  refetchFunds,
  fund,
  orgId,
  mode,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'funds',
  });

  const [formState, setFormState] = useState<InterfaceCreateFund>({
    fundName: fund?.name ?? '',
    fundRef: fund?.refrenceNumber ?? '',
    isDefault: fund?.isDefault ?? false,
    taxDeductible: fund?.taxDeductible ?? false,
    isArchived: fund?.isArchived ?? false,
  });

  useEffect(() => {
    setFormState({
      fundName: fund?.name ?? '',
      fundRef: fund?.refrenceNumber ?? '',
      isDefault: fund?.isDefault ?? false,
      taxDeductible: fund?.taxDeductible ?? false,
      isArchived: fund?.isArchived ?? false,
    });
  }, [fund]);

  const [createFund] = useMutation(CREATE_FUND_MUTATION);
  const [updateFund] = useMutation(UPDATE_FUND_MUTATION);

  const createFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const { fundName, fundRef, isDefault, taxDeductible, isArchived } =
      formState;
    try {
      await createFund({
        variables: {
          name: fundName,
          refrenceNumber: fundRef,
          organizationId: orgId,
          taxDeductible,
          isArchived,
          isDefault,
        },
      });

      setFormState({
        fundName: '',
        fundRef: '',
        isDefault: false,
        taxDeductible: false,
        isArchived: false,
      });
      toast.success(t('fundCreated'));
      refetchFunds();
      hide();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /*istanbul ignore next*/
  const updateFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const { fundName, fundRef, taxDeductible, isArchived, isDefault } =
      formState;
    try {
      const updatedFields: { [key: string]: string | boolean } = {};
      if (fundName != fund?.name) {
        updatedFields.name = fundName;
      }
      if (fundRef != fund?.refrenceNumber) {
        updatedFields.refrenceNumber = fundRef;
      }
      if (taxDeductible != fund?.taxDeductible) {
        updatedFields.taxDeductible = taxDeductible;
      }
      if (isArchived != fund?.isArchived) {
        updatedFields.isArchived = isArchived;
      }
      if (isDefault != fund?.isDefault) {
        updatedFields.isDefault = isDefault;
      }

      await updateFund({
        variables: {
          id: fund?._id,
          ...updatedFields,
        },
      });
      setFormState({
        fundName: '',
        fundRef: '',
        isDefault: false,
        taxDeductible: false,
        isArchived: false,
      });
      refetchFunds();
      hide();
      toast.success(t('fundUpdated'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Modal className={styles.fundModal} show={isOpen} onHide={hide}>
        <Modal.Header>
          <p className={styles.titlemodal}>
            {t(mode === 'create' ? 'fundCreate' : 'fundUpdate')}
          </p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="fundModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmitCapture={
              mode === 'create' ? createFundHandler : updateFundHandler
            }
            className="p-3"
          >
            <Form.Group className="d-flex mb-3 w-100">
              <FormControl fullWidth>
                <TextField
                  label={t('fundName')}
                  variant="outlined"
                  className={`${styles.noOutline} w-100`}
                  value={formState.fundName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fundName: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Form.Group>
            <Form.Group className="d-flex mb-3 w-100">
              <FormControl fullWidth>
                <TextField
                  label={t('fundId')}
                  variant="outlined"
                  className={`${styles.noOutline} w-100`}
                  value={formState.fundRef}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fundRef: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Form.Group>

            <div
              className={`d-flex mt-2 mb-3 flex-wrap ${mode === 'edit' ? 'justify-content-between' : 'justify-content-start gap-3'} `}
            >
              <Form.Group className="d-flex">
                <label>{t('taxDeductible')} </label>
                <Form.Switch
                  type="checkbox"
                  checked={formState.taxDeductible}
                  data-testid="setTaxDeductibleSwitch"
                  className="ms-2"
                  onChange={() =>
                    setFormState({
                      ...formState,
                      taxDeductible: !formState.taxDeductible,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="d-flex">
                <label>{t('default')} </label>
                <Form.Switch
                  type="checkbox"
                  className="ms-2"
                  data-testid="setDefaultSwitch"
                  checked={formState.isDefault}
                  onChange={() =>
                    setFormState({
                      ...formState,
                      isDefault: !formState.isDefault,
                    })
                  }
                />
              </Form.Group>
              {mode === 'edit' && (
                <Form.Group className="d-flex">
                  <label>{t('archived')} </label>
                  <Form.Switch
                    type="checkbox"
                    checked={formState.isArchived}
                    data-testid="archivedSwitch"
                    className="ms-2"
                    onChange={() =>
                      setFormState({
                        ...formState,
                        isArchived: !formState.isArchived,
                      })
                    }
                  />
                </Form.Group>
              )}
            </div>
            <Button
              type="submit"
              className={styles.greenregbtn}
              data-testid="createFundFormSubmitBtn"
            >
              {t(mode === 'create' ? 'fundCreate' : 'fundUpdate')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default FundModal;
