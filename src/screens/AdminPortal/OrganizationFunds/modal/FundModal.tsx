import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from 'shared-components/Button';
import { BaseModal } from 'shared-components/BaseModal';
import type { InterfaceCreateFund, InterfaceFundInfo } from 'utils/interfaces';
import styles from './FundModal.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

export interface InterfaceFundModal {
  isOpen: boolean;
  hide: () => void;
  refetchFunds: () => void;
  fund: InterfaceFundInfo | null;
  orgId: string;
  mode: 'create' | 'edit';
}

/**
 * Modal component for creating or editing a Fund.
 *
 * @param isOpen - Whether the modal is open
 * @param hide - Function to hide the modal
 * @param refetchFunds - Callback to refresh funds list
 * @param fund - Existing fund data or null
 * @param orgId - Organization ID
 * @param mode - 'create' or 'edit'
 */
const FundModal: React.FC<InterfaceFundModal> = ({
  isOpen,
  hide,
  refetchFunds,
  fund,
  orgId,
  mode,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'funds' });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState<InterfaceCreateFund>({
    fundName: fund?.name ?? '',
    fundRef: fund?.refrenceNumber ?? '',
    isDefault: fund?.isDefault ?? false,
    isTaxDeductible: fund?.isTaxDeductible ?? false,
    isArchived: fund?.isArchived ?? false,
  });

  const [touched, setTouched] = useState<{
    fundName: boolean;
    fundRef: boolean;
  }>({
    fundName: false,
    fundRef: false,
  });

  // Validation logic
  const fundNameError =
    touched.fundName && !formState.fundName.trim()
      ? tCommon('required')
      : undefined;
  const fundRefError =
    touched.fundRef && !formState.fundRef.trim()
      ? tCommon('required')
      : undefined;

  useEffect(() => {
    setFormState({
      fundName: fund?.name ?? '',
      fundRef: fund?.refrenceNumber ?? '',
      isDefault: fund?.isDefault ?? false,
      isTaxDeductible: fund?.isTaxDeductible ?? false,
      isArchived: fund?.isArchived ?? false,
    });
  }, [fund]);

  // Reset touched state when modal opens to prevent stale validation errors
  useEffect(() => {
    if (isOpen) {
      setTouched({ fundName: false, fundRef: false });
    }
  }, [isOpen]);

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
        </div>
      }
    >
      <form
        onSubmitCapture={
          mode === 'create' ? createFundHandler : updateFundHandler
        }
        className="p-3"
      >
        <div className="d-flex mb-3 w-100">
          <FormTextField
            name="fundName"
            label={t('fundName')}
            required
            value={formState.fundName}
            touched={touched.fundName}
            error={fundNameError}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, fundName: value }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, fundName: true }))}
          />
        </div>

        <div className="d-flex mb-3 w-100">
          <FormTextField
            name="fundId"
            label={t('fundId')}
            required
            value={formState.fundRef}
            touched={touched.fundRef}
            error={fundRefError}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, fundRef: value }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, fundRef: true }))}
          />
        </div>

        <div
          className={`d-flex mt-2 mb-3 flex-wrap ${
            mode === 'edit'
              ? 'justify-content-between'
              : 'justify-content-start gap-3'
          }`}
        >
          <div className="d-flex align-items-center">
            <label htmlFor="isTaxDeductibleSwitch">{t('taxDeductible')}</label>
            <div className={`form-check form-switch ms-2 ${styles.switch}`}>
              <input
                type="checkbox"
                id="isTaxDeductibleSwitch"
                className="form-check-input"
                checked={formState.isTaxDeductible}
                data-testid="setisTaxDeductibleSwitch"
                onChange={() =>
                  setFormState((prev) => ({
                    ...prev,
                    isTaxDeductible: !prev.isTaxDeductible,
                  }))
                }
              />
            </div>
          </div>

          <div className="d-flex align-items-center">
            <label htmlFor="isDefaultSwitch">{t('default')}</label>
            <div className={`form-check form-switch ms-2 ${styles.switch}`}>
              <input
                type="checkbox"
                id="isDefaultSwitch"
                className="form-check-input"
                checked={formState.isDefault}
                data-testid="setDefaultSwitch"
                onChange={() =>
                  setFormState((prev) => ({
                    ...prev,
                    isDefault: !prev.isDefault,
                  }))
                }
              />
            </div>
          </div>

          {mode === 'edit' && (
            <div className="d-flex align-items-center">
              <label htmlFor="archivedSwitch">{t('archived')}</label>
              <div className={`form-check form-switch ms-2 ${styles.switch}`}>
                <input
                  type="checkbox"
                  id="archivedSwitch"
                  className="form-check-input"
                  checked={formState.isArchived}
                  data-testid="archivedSwitch"
                  onChange={() =>
                    setFormState((prev) => ({
                      ...prev,
                      isArchived: !prev.isArchived,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className={styles.addButton}
          data-testid="createFundFormSubmitBtn"
        >
          {t(mode === 'create' ? 'fundCreate' : 'fundUpdate')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default FundModal;
