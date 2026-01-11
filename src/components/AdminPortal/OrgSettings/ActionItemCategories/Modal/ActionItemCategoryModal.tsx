import React, { type FormEvent, type FC, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseModal } from 'shared-components/BaseModal';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import { useMutation } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  DELETE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { FormControl, TextField } from '@mui/material';

export interface IActionItemCategoryModal {
  isOpen: boolean;
  hide: () => void;
  refetchCategories: () => void;
  orgId: string;
  category: IActionItemCategoryInfo | null;
  mode: 'create' | 'edit';
}

const CategoryModal: FC<IActionItemCategoryModal> = ({
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
    description: category?.description ?? '',
    isDisabled: category?.isDisabled ?? false,
  });

  const { name, description, isDisabled } = formState;

  useEffect(() => {
    setFormState({
      name: category?.name ?? '',
      description: category?.description ?? '',
      isDisabled: category?.isDisabled ?? false,
    });
  }, [category]);

  // Mutations for creating, updating, and deleting categories
  const [createActionItemCategory] = useMutation(
    CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const [deleteActionItemCategory] = useMutation(
    DELETE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  /**
   * Handles category creation using the new input structure.
   */
  const handleCreate = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItemCategory({
        variables: {
          input: {
            name,
            description: description || null,
            isDisabled,
            organizationId: orgId,
          },
        },
      });

      refetchCategories();
      hide();
      setFormState({ name: '', description: '', isDisabled: false });
      NotificationToast.success({
        key: 'eventActionItems.successfulCreation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    }
  };

  /**
   * Handles category update using the new input structure.
   */
  const handleEdit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (
      name === category?.name &&
      description === category?.description &&
      isDisabled === category?.isDisabled
    ) {
      NotificationToast.error({
        key: 'sameNameConflict',
        namespace: 'translation',
      });
      return;
    }

    try {
      // Build the update input object
      const updateInput: {
        id: string;
        name?: string;
        description?: string | null;
        isDisabled?: boolean;
      } = {
        id: category?.id ?? '',
      };

      // Only include fields that have changed
      if (name !== category?.name) {
        updateInput.name = name;
      }
      if (description !== category?.description) {
        updateInput.description = description || null;
      }
      if (isDisabled !== category?.isDisabled) {
        updateInput.isDisabled = isDisabled;
      }

      await updateActionItemCategory({
        variables: {
          input: updateInput,
        },
      });

      setFormState({ name: '', description: '', isDisabled: false });
      refetchCategories();
      hide();
      NotificationToast.success({
        key: 'eventActionItems.successfulUpdation',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    }
  };

  /**
   * Handles category deletion without confirmation.
   */
  const handleDelete = async (): Promise<void> => {
    if (!category?.id) return;

    try {
      await deleteActionItemCategory({
        variables: {
          input: {
            id: category.id,
          },
        },
      });

      refetchCategories();
      hide();
      NotificationToast.success({
        key: 'categoryDeleted',
        namespace: 'translation',
      });
    } catch {
      NotificationToast.error({
        key: 'unknownError',
        namespace: 'errors',
      });
    }
  };

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      className={styles.createModal}
      dataTestId="actionItemCategoryModal"
      headerContent={
        <p className={styles.titlemodal}>{t('categoryDetails')}</p>
      }
    >
      <Form
        onSubmit={mode === 'create' ? handleCreate : handleEdit}
        className="p-2"
      >
        {/* Category Name Input */}
        <FormControl fullWidth className="mb-3">
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
            data-testid="categoryNameInput"
          />
        </FormControl>

        {/* Category Description Input */}
        <FormControl fullWidth className="mb-3">
          <TextField
            label={t('actionItemCategoryDescription')}
            type="text"
            variant="outlined"
            autoComplete="off"
            multiline
            rows={3}
            className={styles.noOutline}
            value={description}
            onChange={(e): void =>
              setFormState({ ...formState, description: e.target.value })
            }
            data-testid="categoryDescriptionInput"
          />
        </FormControl>

        {/* Disabled Toggle */}
        <Form.Group className="d-flex flex-column mb-4">
          <label htmlFor="isDisabledSwitch">{tCommon('disabled')} </label>
          <Form.Switch
            id="isDisabledSwitch"
            type="checkbox"
            checked={isDisabled}
            data-testid="isDisabledSwitch"
            className="mt-2 ms-2"
            onChange={() =>
              setFormState({ ...formState, isDisabled: !isDisabled })
            }
          />
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-flex gap-2 justify-content-between">
          {/* Delete Button - Only show in edit mode */}
          {mode === 'edit' && (
            <Button
              variant="danger"
              onClick={handleDelete}
              data-testid="deleteCategoryButton"
            >
              <i className="fa fa-trash me-2" />
              {tCommon('delete')}
            </Button>
          )}

          {/* Create/Update Button */}
          <Button
            type="submit"
            className={styles.editButton}
            value="actionItemCategory"
            data-testid="formSubmitButton"
          >
            {mode === 'create'
              ? tCommon('create')
              : t('updateActionItemCategory')}
          </Button>
        </div>
      </Form>
    </BaseModal>
  );
};

export default CategoryModal;
