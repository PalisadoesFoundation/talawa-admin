import React, { useEffect, useState } from 'react';
import type { InterfaceCreateFund, InterfaceFundInfo } from 'utils/interfaces';
import styles from './FundModal.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_FUND_MUTATION,
  DELETE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import Button from 'shared-components/Button';

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
    } else {
      setIsDeleteModalOpen(false);
    }
  }, [isOpen]);

  const [createFund] = useMutation(CREATE_FUND_MUTATION);
  const [updateFund] = useMutation(UPDATE_FUND_MUTATION);
  const [deleteFund] = useMutation(DELETE_FUND_MUTATION);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const createFundHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    const { fundName, isDefault, isTaxDeductible, isArchived } = formState;

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFundHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (isSubmitting) return;

    const { fundName, isTaxDeductible } = formState;

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFundHandler = async (): Promise<void> => {
    if (isSubmitting || !fund?.id) return;

    setIsSubmitting(true);
    try {
      await deleteFund({
        variables: {
          id: fund.id,
        },
      });

      NotificationToast.success(t('fundDeleted') as string);
      setIsDeleteModalOpen(false);
      refetchFunds();
      hide();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const archiveFundHandler = async (): Promise<void> => {
    if (isSubmitting || !fund?.id) return;

    const nextArchivedState = !formState.isArchived;

    setIsSubmitting(true);
    try {
      await updateFund({
        variables: {
          input: {
            id: fund.id,
            isArchived: nextArchivedState,
          },
        },
      });

      setFormState((prev) => ({
        ...prev,
        isArchived: nextArchivedState,
      }));
      NotificationToast.success(t('fundUpdated') as string);
      refetchFunds();
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = t(mode === 'create' ? 'fundCreate' : 'fundUpdate');
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isFormValid = !fundNameError && !fundRefError;
  const modalClassName = `${styles.fundModal} ${isCreateMode ? styles.createMode : ''} ${isEditMode ? styles.editMode : ''}`;

  const formContent = (
    <>
      <div className={styles.fieldRow}>
        <FormTextField
          name="fundName"
          label={t('fundName')}
          required
          placeholder={t('enterFundName')}
          value={formState.fundName}
          touched={touched.fundName}
          error={fundNameError}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, fundName: value }))
          }
          onBlur={() => setTouched((prev) => ({ ...prev, fundName: true }))}
        />
      </div>

      <div className={styles.fieldRow}>
        <FormTextField
          name="fundId"
          label={t('fundId')}
          required
          placeholder={t('enterFundId')}
          value={formState.fundRef}
          touched={touched.fundRef}
          error={fundRefError}
          onChange={(value) =>
            setFormState((prev) => ({ ...prev, fundRef: value }))
          }
          onBlur={() => setTouched((prev) => ({ ...prev, fundRef: true }))}
        />
      </div>

      <div className={styles.switchRow}>
        <div className={styles.switchField}>
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

        <div className={styles.switchField}>
          <label htmlFor="isDefaultSwitch">{t('defaultFund')}</label>
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
      </div>
    </>
  );

  const editFooter = (
    <div className={styles.editFooterActions}>
      <div className={styles.editActionRow}>
        <Button
          type="submit"
          form="crud-edit-form"
          disabled={isSubmitting || !isFormValid}
          className={styles.editActionButton}
          data-testid="modal-submit-btn"
        >
          <i className="fa fa-edit" />
          {tCommon('edit')}
        </Button>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => setIsDeleteModalOpen(true)}
          className={styles.deleteActionButton}
          data-testid="modal-delete-btn"
        >
          <i className="fa fa-trash" />
          {tCommon('delete')}
        </Button>
      </div>

      <Button
        type="button"
        disabled={isSubmitting}
        onClick={archiveFundHandler}
        className={styles.archiveActionButton}
        data-testid="modal-archive-btn"
      >
        <i className="fa fa-archive" />
        {formState.isArchived ? t('unarchive') : t('archived')}
      </Button>
    </div>
  );

  if (mode === 'create') {
    return (
      <CreateModal
        open={isOpen}
        title={modalTitle}
        onClose={hide}
        onSubmit={createFundHandler}
        loading={isSubmitting}
        submitDisabled={!isFormValid}
        data-testid="fund-modal"
        className={modalClassName}
      >
        {formContent}
      </CreateModal>
    );
  }

  return (
    <>
      <EditModal
        open={isOpen}
        title={modalTitle}
        onClose={hide}
        onSubmit={updateFundHandler}
        loading={isSubmitting}
        submitDisabled={!isFormValid}
        customFooter={editFooter}
        data-testid="fund-modal"
        className={modalClassName}
      >
        {formContent}
      </EditModal>

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('fundDelete')}
        onDelete={deleteFundHandler}
        loading={isSubmitting}
        entityName={fund?.name}
        data-testid="fund-delete-modal"
      >
        <p>{t('deleteFundMsg')}</p>
      </DeleteModal>
    </>
  );
};

export default FundModal;
