import React, { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceActionItemCategoryInfo } from 'utils/interfaces';
import { useMutation } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
import { toast } from 'react-toastify';
import { FormControl, TextField } from '@mui/material';

/**
 * Props for the `CategoryModal` component.
 *
 *
 * isOpen - The state of the modal.
 * hide - The function to hide the modal.
 * refetchCategories - The function to refetch the categories.
 * orgId - The organization ID.
 * category - The category to be edited.
 * mode - The mode of the modal.
 * @returns The `CategoryModal` component.
 */
export interface InterfaceActionItemCategoryModal {
  isOpen: boolean;
  hide: () => void;
  refetchCategories: () => void;
  orgId: string;
  category: InterfaceActionItemCategoryInfo | null;
  mode: 'create' | 'edit';
}

/**
 * A modal component for creating and editing action item categories.
 *
 * @param props - The properties passed to the component.
 * @returns The `CategoryModal` component.
 */
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
        variables: {
          name,
          isDisabled,
          organizationId: orgId,
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
          variables: {
            actionItemCategoryId: category?._id,
            ...updatedFields,
          },
        });

        setFormState({
          name: '',
          isDisabled: false,
        });
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
                setFormState({
                  ...formState,
                  isDisabled: !isDisabled,
                })
              }
            />
          </Form.Group>

          <Button
            type="submit"
            className={styles.greenregbtn}
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
