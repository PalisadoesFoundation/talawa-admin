/**
 * CategoryModal Component
 *
 * This component renders a modal for creating or editing action item categories.
 * It provides a form with fields for category name and a toggle switch for enabling/disabling the category.
 * The modal supports two modes: 'create' and 'edit', and handles the respective GraphQL mutations.
 *
 * @component
 * @param {InterfaceActionItemCategoryModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {() => void} props.refetchCategories - Function to refetch the list of categories after a mutation.
 * @param {string} props.orgId - The ID of the organization to which the category belongs.
 * @param {InterfaceActionItemCategoryInfo | null} props.category - The category data for editing, or null for creating a new category.
 * @param {'create' | 'edit'} props.mode - The mode of the modal, either 'create' or 'edit'.
 *
 * @returns {JSX.Element} The rendered CategoryModal component.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and form styling.
 * - Integrates with `@apollo/client` for GraphQL mutations.
 * - Displays success and error messages using `react-toastify`.
 * - Translations are handled using `react-i18next`.
 *
 * @example
 * ```tsx
 * <CategoryModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   refetchCategories={fetchCategories}
 *   orgId="12345"
 *   category={selectedCategory}
 *   mode="edit"
 * />
 * ```
 */
import React, { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceActionItemCategoryInfo } from 'utils/interfaces';
import { useMutation } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
import { toast } from 'react-toastify';
import { FormControl, TextField } from '@mui/material';

export interface InterfaceActionItemCategoryModal {
  isOpen: boolean;
  hide: () => void;
  refetchCategories: () => void;
  orgId: string;
  category: InterfaceActionItemCategoryInfo | null;
  mode: 'create' | 'edit';
}

const CategoryModal: FC<InterfaceActionItemCategoryModal> = ({
  category,
  hide,
  isOpen,
  mode,
  refetchCategories,
  orgId,
}) => {
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });

  const [formState, setFormState] = useState({
    name: category?.name ?? '',
    isDisabled: category?.isDisabled ?? false,
  });

  const { name, isDisabled } = formState;

  useEffect(() => {
    setFormState({
      name: category?.name ?? '',
      isDisabled: category?.isDisabled ?? false,
    });
  }, [category]);

  // Mutations for creating and updating categories
  const [createActionItemCategory] = useMutation(
    CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handles category creation.
   *
   * @param e - The form submission event.
   */
  const handleCreate = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItemCategory({
        variables: { name, isDisabled, organizationId: orgId },
      });

      refetchCategories();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles category update.
   *
   * @param e - The form submission event.
   */
  const handleEdit = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (name === category?.name && isDisabled === category?.isDisabled) {
      toast.error(t('sameNameConflict')); // Show error if the name is the same
    } else {
      try {
        const updatedFields: { [key: string]: string | boolean } = {};
        if (name != category?.name) {
          updatedFields.name = name;
        }
        if (isDisabled != category?.isDisabled) {
          updatedFields.isDisabled = isDisabled;
        }

        await updateActionItemCategory({
          variables: { actionItemCategoryId: category?._id, ...updatedFields },
        });

        setFormState({ name: '', isDisabled: false });
        refetchCategories();
        hide();
        toast.success(t('successfulUpdation'));
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    }
  };

  return (
    <Modal className={styles.createModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={`${styles.titlemodal}`}>{t('categoryDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="actionItemCategoryModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmitCapture={mode === 'create' ? handleCreate : handleEdit}
          className="p-2"
        >
          {/* Input field to enter amount to be pledged */}

          <FormControl fullWidth className="mb-2">
            <TextField
              label={t('actionItemCategoryName')}
              type="text"
              variant="outlined"
              autoComplete="off"
              className={styles.noOutline}
              value={name}
              onChange={(e): void =>
                setFormState({ ...formState, name: e.target.value })
              }
              required
            />
          </FormControl>
          <Form.Group className="d-flex flex-column mb-4">
            <label>{tCommon('disabled')} </label>
            <Form.Switch
              type="checkbox"
              checked={isDisabled}
              data-testid="isDisabledSwitch"
              className="mt-2 ms-2"
              onChange={() =>
                setFormState({ ...formState, isDisabled: !isDisabled })
              }
            />
          </Form.Group>

          <Button
            type="submit"
            className={styles.regBtn}
            value="creatActionItemCategory"
            data-testid="formSubmitButton"
          >
            {mode === 'create'
              ? tCommon('create')
              : t('updateActionItemCategory')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
