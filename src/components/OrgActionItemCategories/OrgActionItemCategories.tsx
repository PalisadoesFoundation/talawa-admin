import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './OrgActionItemCategories.module.css';
import { useTranslation } from 'react-i18next';

import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import type { InterfaceActionItemCategoryList } from 'utils/interfaces';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import Loader from 'components/Loader/Loader';
import { WarningAmberRounded } from '@mui/icons-material';

type ModalType = 'Create' | 'Update';

const OrgActionItemCategories = (): any => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });

  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('Create');
  const [categoryId, setCategoryId] = useState('');

  const [name, setName] = useState('');

  const currentUrl = window.location.href.split('=')[1];

  const {
    data,
    loading,
    error,
    refetch,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [createActionItemCategory] = useMutation(
    CREATE_ACTION_ITEM_CATEGORY_MUTATION
  );

  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION
  );

  const handleCreate = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { data } = await createActionItemCategory({
        variables: {
          name,
          organizationId: currentUrl,
        },
      });

      setName('');
      refetch();

      setAddModalIsOpen(false);

      toast.success('Action Item Category created successfully');
      console.log(data);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEdit = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await updateActionItemCategory({
        variables: {
          actionItemCategoryId: categoryId,
          name,
        },
      });

      setName('');
      setCategoryId('');
      refetch();

      setAddModalIsOpen(false);

      toast.success('Action Item Category updated successfully');
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleDisableStatus = async (
    id: string,
    disabledStatus: boolean
  ): Promise<void> => {
    try {
      await updateActionItemCategory({
        variables: {
          actionItemCategoryId: id,
          isDisabled: !disabledStatus,
        },
      });

      refetch();

      toast.success(
        `Action Item Category ${
          disabledStatus === true ? 'Enabled' : 'Disabled'
        }`
      );
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const showCreateModal = (): void => {
    setModalType('Create');
    setAddModalIsOpen(true);
  };

  const showUpdateModal = (name: string, id: string): void => {
    setName(name);
    setCategoryId(id);
    setModalType('Update');
    setAddModalIsOpen(true);
  };

  const hideModal = (): void => {
    setName('');
    setCategoryId('');
    setAddModalIsOpen(false);
  };

  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

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

  return (
    <>
      <Button
        variant="success"
        value="savechanges"
        onClick={showCreateModal}
        className={styles.addButton}
        data-testid="saveChangesBtn"
      >
        <i className={'fa fa-plus me-2'} />
        {t('addActionItemCategory')}
      </Button>

      <div>
        {data?.actionItemCategoriesByOrganization.map((category, index) => {
          return (
            <div key={index}>
              <div className="my-3 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">{category.name}</h6>
                <div>
                  <Button
                    onClick={() => showUpdateModal(category.name, category._id)}
                    size="sm"
                    variant="secondary"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      handleDisableStatus(category._id, category.isDisabled)
                    }
                    size="sm"
                    variant={category.isDisabled ? 'outline-success' : 'danger'}
                  >
                    {category.isDisabled ? 'Enable' : 'Disable'}
                  </Button>
                </div>
              </div>

              {index !== data.actionItemCategoriesByOrganization.length - 1 && (
                <hr />
              )}
            </div>
          );
        })}
      </div>

      <Modal
        className={styles.createModal}
        show={addModalIsOpen}
        onHide={hideModal}
      >
        <Modal.Header>
          <p className={`${styles.titlemodal}`}>
            {t('actionItemCategoryDetails')}
          </p>
          <Button
            variant="danger"
            onClick={hideModal}
            data-testid="createEventModalCloseBtn"
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
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="creatActionItemCategory"
              data-testid="creatActionItemCategoryBtn"
            >
              {modalType === 'Create'
                ? t('addActionItemCategory')
                : t('updateActionItemCategory')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrgActionItemCategories;
