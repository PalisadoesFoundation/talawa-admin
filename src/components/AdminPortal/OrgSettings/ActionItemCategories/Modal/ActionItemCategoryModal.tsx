import React, { type FormEvent, type FC, useEffect, useState } from 'react';
import Button from 'shared-components/Button/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import styles from './ActionItemCategoryModal.module.css';
import { useTranslation } from 'react-i18next';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import { useMutation } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  DELETE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

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
  const { t: tErrors } = useTranslation('errors');
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

    if (!window.confirm(tCommon('deleteConfirmation'))) {
      return;
    }

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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <CRUDModalTemplate
        open={isOpen}
        onClose={hide}
        className={styles.createModal}
        data-testid="actionItemCategoryModal"
        title={t('categoryDetails')}
      >
        <form
          onSubmit={mode === 'create' ? handleCreate : handleEdit}
          className="p-2"
        >
          {/* Category Name Input */}
          <FormTextField
            name="categoryName"
            label={t('actionItemCategoryName')}
            type="text"
            autoComplete="off"
            value={name}
            onChange={(value: string): void =>
              setFormState({ ...formState, name: value })
            }
            required
            data-testid="categoryNameInput"
          />

          {/* Category Description Input */}
          <FormTextField
            name="categoryDescription"
            label={t('actionItemCategoryDescription')}
            as="textarea"
            rows={3}
            autoComplete="off"
            value={description}
            onChange={(value: string): void =>
              setFormState({ ...formState, description: value })
            }
            data-testid="categoryDescriptionInput"
          />

          {/* Disabled Toggle */}
          <FormCheckField
            name="isDisabled"
            label={tCommon('disabled')}
            id="isDisabledSwitch"
            type="checkbox"
            checked={isDisabled}
            data-testid="isDisabledSwitch"
            className="form-check-input mt-2 ms-2"
            onChange={() =>
              setFormState({ ...formState, isDisabled: !isDisabled })
            }
          />

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
        </form>
      </CRUDModalTemplate>
    </ErrorBoundaryWrapper>
  );
};

export default CategoryModal;
