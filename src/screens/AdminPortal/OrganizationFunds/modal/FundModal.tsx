import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
import type { InterfaceCreateFund, InterfaceFundInfo } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { TextField } from '@mui/material';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

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
  const { t } = useTranslation('translation', { keyPrefix: 'funds' });

  const [formState, setFormState] = useState<InterfaceCreateFund>({
    fundName: fund?.name ?? '',
    fundRef: fund?.refrenceNumber ?? '',
    isDefault: fund?.isDefault ?? false,
    isTaxDeductible: fund?.isTaxDeductible ?? false,
    isArchived: fund?.isArchived ?? false,
  });

  useEffect(() => {
    setFormState({
      fundName: fund?.name ?? '',
      fundRef: fund?.refrenceNumber ?? '',
      isDefault: fund?.isDefault ?? false,
      isTaxDeductible: fund?.isTaxDeductible ?? false,
      isArchived: fund?.isArchived ?? false,
    });
  }, [fund]);

  const [createFund] = useMutation(CREATE_FUND_MUTATION);
  const [updateFund] = useMutation(UPDATE_FUND_MUTATION);

  const createFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const { fundName, isDefault, isTaxDeductible, isArchived } = formState;

    try {
      await createFund({
        variables: {
          name: fundName,
          organizationId: orgId,
          isTaxDeductible,
          isArchived,
          isDefault,
        },
      });

      setFormState({
        fundName: '',
        fundRef: '',
        isDefault: false,
        isTaxDeductible: false,
        isArchived: false,
      });

      NotificationToast.success(t('fundCreated') as string);
      refetchFunds();
      hide();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  const updateFundHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const { fundName, isTaxDeductible } = formState;

    try {
      const updatedFields: { [key: string]: string | boolean } = {};

      if (fundName !== fund?.name) {
        updatedFields.name = fundName;
      }
      if (isTaxDeductible !== fund?.isTaxDeductible) {
        updatedFields.isTaxDeductible = isTaxDeductible;
      }

      if (Object.keys(updatedFields).length === 0) {
        return;
      }

      await updateFund({
        variables: {
          input: {
            id: fund?.id,
            ...updatedFields,
          },
        },
      });

      setFormState({
        fundName: '',
        fundRef: '',
        isDefault: false,
        isTaxDeductible: false,
        isArchived: false,
      });

      refetchFunds();
      hide();
      NotificationToast.success(t('fundUpdated') as string);
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    }
  };

  return (
    <BaseModal
      className={styles.fundModal}
      show={isOpen}
      onHide={hide}
      headerContent={
        <div className="d-flex justify-content-between align-items-center">
          <p className={styles.titlemodal} data-testid="modalTitle">
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
        </div>
      }
    >
      <Form
        onSubmitCapture={
          mode === 'create' ? createFundHandler : updateFundHandler
        }
        className="p-3"
      >
        <Form.Group className="d-flex mb-3 w-100">
          <FormFieldGroup label={t('fundName')} name="fundName">
            <TextField
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={formState.fundName}
              inputProps={{ id: 'fundName' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormState({ ...formState, fundName: e.target.value });
              }}
            />
          </FormFieldGroup>
        </Form.Group>

        <Form.Group className="d-flex mb-3 w-100">
          <FormFieldGroup label={t('fundId')} name="fundId">
            <TextField
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={formState.fundRef}
              inputProps={{ id: 'fundId' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormState({ ...formState, fundRef: e.target.value });
              }}
            />
          </FormFieldGroup>
        </Form.Group>

        <div
          className={`d-flex mt-2 mb-3 flex-wrap ${
            mode === 'edit'
              ? 'justify-content-between'
              : 'justify-content-start gap-3'
          }`}
        >
          <Form.Group className="d-flex">
            <label>{t('taxDeductible')}</label>
            <Form.Switch
              type="checkbox"
              checked={formState.isTaxDeductible}
              data-testid="setisTaxDeductibleSwitch"
              className={`ms-2 ${styles.switch}`}
              onChange={() =>
                setFormState({
                  ...formState,
                  isTaxDeductible: !formState.isTaxDeductible,
                })
              }
            />
          </Form.Group>

          <Form.Group className="d-flex">
            <label>{t('default')}</label>
            <Form.Switch
              type="checkbox"
              className={`ms-2 ${styles.switch}`}
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
              <label>{t('archived')}</label>
              <Form.Switch
                type="checkbox"
                checked={formState.isArchived}
                data-testid="archivedSwitch"
                className={`ms-2 ${styles.switch}`}
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
    </BaseModal>
  );
};

export default FundModal;
