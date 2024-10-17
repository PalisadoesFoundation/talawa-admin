import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './OrgActionItemCategories.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { WarningAmberRounded } from '@mui/icons-material';

import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';
import type { InterfaceActionItemCategoryList } from 'utils/interfaces';
import Loader from 'components/Loader/Loader';
import { useParams } from 'react-router-dom';

type ModalType = 'Create' | 'Update';

/**
 * Represents the component for managing organization action item categories.
 * This component allows creating, updating, enabling, and disabling action item categories.
 */
const OrgActionItemCategories = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');

  // State variables
  const [modalIsOpen, setModalIsOpen] = useState(false); // Controls modal visibility
  const [modalType, setModalType] = useState<ModalType>('Create'); // Type of modal (Create or Update)
  const [categoryId, setCategoryId] = useState(''); // Current category ID for updating
  const [name, setName] = useState(''); // Category name for creation or update
  const [currName, setCurrName] = useState(''); // Current category name (used for comparison)
  const [disabledStatus, setDisabledStatus] = useState(false);

  // Fetch organization ID from URL params
  const { orgId: currentUrl } = useParams();

  // Query to fetch action item categories
  const {
    data,
    loading,
    error,
    refetch,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Mutations for creating and updating categories
  const [createActionItemCategory] = useMutation(
    CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  // Handles category creation
  const handleCreate = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItemCategory({
        variables: {
          isDisabled: disabledStatus,
          name,
          organizationId: currentUrl,
        },
      });

      setName('');
      refetch();
      setDisabledStatus(false);
      setModalIsOpen(false);

      toast.success(t('successfulCreation') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  // Handles category update
  const handleEdit = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (name === currName) {
      toast.error(t('sameNameConflict') as string); // Show error if the name is the same
    } else {
      try {
        await updateActionItemCategory({
          variables: {
            actionItemCategoryId: categoryId,
            name,
          },
        });

        setName(''); // Clear the name input
        setCategoryId(''); // Clear the category ID
        refetch(); // Refetch the list of categories
        setModalIsOpen(false); // Close the modal

        toast.success(t('successfulUpdation') as string); // Show success toast
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message); // Show error toast
          console.log(error.message); // Log the error
        }
      }
    }
  };

  // Handles enabling or disabling a category
  const handleStatusChange = async (
    id: string,
    disabledStatus: boolean,
  ): Promise<void> => {
    try {
      await updateActionItemCategory({
        variables: {
          actionItemCategoryId: id,
          isDisabled: !disabledStatus,
        },
      });

      refetch(); // Refetch the list of categories

      toast.success(
        disabledStatus
          ? (t('categoryEnabled') as string)
          : (t('categoryDisabled') as string),
      ); // Show success toast
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  // Shows the modal for creating a new category
  const showCreateModal = (): void => {
    setModalType('Create');
    setModalIsOpen(true);
  };

  // Shows the modal for updating an existing category
  const showUpdateModal = (name: string, id: string): void => {
    setCurrName(name);
    setName(name);
    setCategoryId(id);
    setModalType('Update');
    setModalIsOpen(true);
  };

  // Hides the modal and clears input fields
  const hideModal = (): void => {
    setName('');
    setCategoryId('');
    setModalIsOpen(false);
  };

  // Show loader while data is being fetched
  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading Action Item Categories Data
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  // Render the list of action item categories
  const actionItemCategories = data?.actionItemCategoriesByOrganization;

  return (
    <>
      <Button
        variant="success"
        value="savechanges"
        onClick={showCreateModal}
        className={styles.addButton}
        data-testid="actionItemCategoryModalOpenBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {tCommon('create')}
      </Button>

      <div>
        {actionItemCategories?.map((category, index) => {
          return (
            <div key={index}>
              <div className="my-3 d-flex justify-content-between align-items-center">
                <h6
                  className={
                    category.isDisabled
                      ? 'text-secondary fw-bold mb-0'
                      : 'fw-bold mb-0'
                  }
                >
                  {category.name}
                </h6>
                <div>
                  <Button
                    onClick={() => showUpdateModal(category.name, category._id)}
                    size="sm"
                    variant="secondary"
                    className="me-2"
                    data-testid="actionItemCategoryUpdateModalOpenBtn"
                  >
                    {tCommon('edit')}
                  </Button>
                  <Button
                    onClick={() =>
                      handleStatusChange(category._id, category.isDisabled)
                    }
                    size="sm"
                    variant={category.isDisabled ? 'outline-success' : 'danger'}
                    data-testid="disabilityStatusButton"
                  >
                    {category.isDisabled
                      ? t('enableButton')
                      : t('disableButton')}
                  </Button>
                </div>
              </div>

              {index !== actionItemCategories.length - 1 && <hr />}
            </div>
          );
        })}
      </div>

      {/* Modal for creating or updating categories */}
      <Modal
        className={styles.createModal}
        show={modalIsOpen}
        onHide={hideModal}
      >
        <Modal.Header>
          <p className={`${styles.titlemodal}`}>
            {t('actionItemCategoryDetails')}
          </p>
          <Button
            variant="danger"
            onClick={hideModal}
            data-testid="actionItemCategoryModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmitCapture={modalType === 'Create' ? handleCreate : handleEdit}
          >
            <Form.Label
              className="ms-1 fs-5 mt-2 mb-0"
              htmlFor="actionItemCategoryName"
            >
              {t('actionItemCategoryName')}
            </Form.Label>
            <Form.Control
              type="title"
              id="actionItemCategoryName"
              placeholder={t('enterName')}
              autoComplete="off"
              required
              value={name}
              onChange={(e): void => {
                setName(e.target.value);
              }}
            />

            {/* Toggle for Disabled Status */}
            <Form.Check
              className="mt-3"
              type="switch"
              id="disabledStatusToggle"
              label={'disabledStatus'}
              checked={disabledStatus}
              onChange={(e): void => setDisabledStatus(e.target.checked)}
              data-testid="disabledStatusToggle"
            />

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="creatActionItemCategory"
              data-testid="formSubmitButton"
            >
              {modalType === 'Create'
                ? tCommon('create')
                : t('updateActionItemCategory')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrgActionItemCategories;
