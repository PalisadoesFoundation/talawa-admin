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

const OrgActionItemCategories = (): any => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('Create');
  const [categoryId, setCategoryId] = useState('');

  const [name, setName] = useState('');
  const [currName, setCurrName] = useState('');

  const { orgId: currentUrl } = useParams();

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
    CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const [updateActionItemCategory] = useMutation(
    UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  );

  const handleCreate = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItemCategory({
        variables: {
          name,
          organizationId: currentUrl,
        },
      });

      setName('');
      refetch();

      setModalIsOpen(false);

      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const handleEdit = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (name === currName) {
      toast.error(t('sameNameConflict'));
    } else {
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

        setModalIsOpen(false);

        toast.success(t('successfulUpdation'));
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.log(error.message);
        }
      }
    }
  };

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

      refetch();

      toast.success(
        disabledStatus ? t('categoryEnabled') : t('categoryDisabled'),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const showCreateModal = (): void => {
    setModalType('Create');
    setModalIsOpen(true);
  };

  const showUpdateModal = (name: string, id: string): void => {
    setCurrName(name);
    setName(name);
    setCategoryId(id);
    setModalType('Update');
    setModalIsOpen(true);
  };

  const hideModal = (): void => {
    setName('');
    setCategoryId('');
    setModalIsOpen(false);
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
        {t('createButton')}
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
                    {t('editButton')}
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
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="creatActionItemCategory"
              data-testid="formSubmitButton"
            >
              {modalType === 'Create'
                ? t('createButton')
                : t('updateActionItemCategory')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrgActionItemCategories;
