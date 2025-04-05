/**
 * CategoryModal Component
 *
 * This component renders a modal for creating or editing action item categories.
 * It provides a form with fields for category name and a toggle switch for enabling/disabling the category.
 * The modal supports two modes: 'create' and 'edit', and handles the respective GraphQL mutations.
 *
 * @component
 */
import React, { FC, useEffect, useState, ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { FormControl, TextField } from '@mui/material';

import styles from 'style/app-fixed.module.css';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
// import type { InterfaceActionItemCategory } from 'utils/interfaces';

export interface InterfaceActionItemCategory {
  id: string;
  name: string;
  organizationId: string;
  creatorId: string;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceActionItemCategoryModal {
  isOpen: boolean;
  hide: () => void;
  refetchCategories: () => void;
  orgId: string;
  category: InterfaceActionItemCategory | null;
  mode: 'create' | 'edit';
}

export const CategoryModal: FC<InterfaceActionItemCategoryModal> = ({
  isOpen,
  hide,
  refetchCategories,
  orgId,
  category,
  mode,
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

  // Keep form in sync with `category` prop changes (e.g., if user re-opens modal)
  useEffect(() => {
    setFormState({
      name: category?.name ?? '',
      isDisabled: category?.isDisabled ?? false,
    });
  }, [category]);

  // GraphQL mutations for create and update
  const [createActionItemCategory] = useMutation(
    CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  );
  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handles creating a new category.
   */
  const handleCreate = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createActionItemCategory({
        variables: {
          input: {
            name,
            isDisabled,
            organizationId: orgId,
          },
        },
      });
      refetchCategories();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles editing an existing category.
   */
  const handleEdit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If nothing changed, show an error (optional check)
    if (name === category?.name && isDisabled === category?.isDisabled) {
      toast.error(t('sameNameConflict'));
      return;
    }

    try {
      await updateActionItemCategory({
        variables: {
          input: {
            categoryId: category?.id,
            // Only send changed fields
            ...(name !== category?.name && { name }),
            ...(isDisabled !== category?.isDisabled && { isDisabled }),
          },
        },
      });
      setFormState({ name: '', isDisabled: false });
      refetchCategories();
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Modal className={styles.createModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('categoryDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="actionItemCategoryModalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmitCapture={mode === 'create' ? handleCreate : handleEdit}
          className="p-2"
        >
          <FormControl fullWidth className="mb-2">
            <TextField
              label={t('actionItemCategoryName')}
              type="text"
              variant="outlined"
              autoComplete="off"
              className={styles.noOutline}
              value={name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              inputProps={{ 'data-testid': 'categoryNameInput' }}
              required
            />
          </FormControl>
          <Form.Group className="d-flex flex-column mb-4">
            <label>{tCommon('disabled')}</label>
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
