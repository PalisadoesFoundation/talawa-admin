import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceCreateFund, InterfaceFundInfo } from 'utils/interfaces';
import styles from '../../style/app.module.css';
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
/**
 * `FundModal` component provides a modal dialog for creating or editing a fund.
 * It allows users to input fund details and submit them to the server.
 *
 * This component handles both the creation of new funds and the editing of existing funds,
 * based on the `mode` prop. It displays a form with fields for the fund's name, description,
 * and other relevant details. Upon submission, it interacts with the GraphQL API to save
 * or update the fund details and triggers a refetch of the fund data.
 *
 * ### Props
 * - `isOpen`: A boolean indicating whether the modal is open or closed.
 * - `hide`: A function to close the modal.
 * - `refetchFunds`: A function to refetch the fund list after a successful operation.
 * - `fund`: The current fund object being edited or `null` if creating a new fund.
 * - `orgId`: The ID of the organization to which the fund belongs.
 * - `mode`: The mode of the modal, either 'edit' or 'create'.
 *
 * ### State
 * - `name`: The name of the fund.
 * - `description`: The description of the fund.
 * - `amount`: The amount associated with the fund.
 * - `status`: The status of the fund (e.g., active, archived).
 *
 * ### Methods
 * - `handleSubmit()`: Handles form submission, creates or updates the fund, and triggers a refetch of the fund list.
 * - `handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)`: Updates the state based on user input.
 *
 * @returns  The rendered modal dialog.
 */
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
      toast.success(t('fundCreated') as string);
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
      if (Object.keys(updatedFields).length === 0) {
        return;
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
      toast.success(t('fundUpdated') as string);
    } catch (error: unknown) {
      toast.error((error as Error).message);
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
            className={styles.closeButton}
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
              className={styles.addButton}
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
