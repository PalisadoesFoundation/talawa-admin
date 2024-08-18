import { Button, Modal } from 'react-bootstrap';
import styles from './OrgActionItemCategories.module.css';
import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import type { InterfaceActionItemCategoryInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
import { DELETE_ACTION_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/ActionItemCategoryMutations';

export interface InterfaceDeleteCategoryModal {
  isOpen: boolean;
  hide: () => void;
  category: InterfaceActionItemCategoryInfo | null;
  refetchCategories: () => void;
}

/**
 * A modal dialog for confirming the deletion of a pledge.
 *
 * @param  isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param  category - The category object to be deleted.
 * @param refetchCategories - Function to refetch the categories after deletion.
 *
 * @returns  The rendered modal component.
 *
 *
 * The `CategoryDeleteModal` component displays a confirmation dialog when a user attempts to delete a category.
 * It allows the user to either confirm or cancel the deletion.
 * On confirmation, the `deleteCategory` mutation is called to remove the category from the database,
 * and the `refetchCategories` function is invoked to update the list of categories.
 * A success or error toast notification is shown based on the result of the deletion operation.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A body with a message asking for confirmation.
 * - A footer with "Yes" and "No" buttons to confirm or cancel the deletion.
 *
 * The `deleteCategory` mutation is used to perform the deletion operation.
 */

const CategoryDeleteModal: FC<InterfaceDeleteCategoryModal> = ({
  isOpen,
  hide,
  category,
  refetchCategories,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');

  const [deleteCategory] = useMutation(DELETE_ACTION_ITEM_CATEGORY_MUTATION);

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteCategory({
        variables: {
          categoryId: category?._id,
        },
      });
      refetchCategories();
      hide();
      toast.success(t('categoryDeleted'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  return (
    <>
      <Modal className={styles.pledgeModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deleteCategory')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="deleteCategoryCloseBtn"
          >
            {' '}
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('deleteCategoryMsg')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={deleteHandler}
            data-testid="deleteyesbtn"
          >
            {tCommon('yes')}
          </Button>
          <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
            {tCommon('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CategoryDeleteModal;
