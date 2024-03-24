import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import SortIcon from '@mui/icons-material/Sort';
import { WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { useMutation, useQuery } from '@apollo/client';
import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

import type {
  InterfaceActionItemCategoryList,
  InterfaceActionItemList,
  InterfaceMembersList,
} from 'utils/interfaces';
import ActionItemsContainer from 'components/ActionItems/ActionItemsContainer';
import ActionItemCreateModal from './ActionItemCreateModal';
import styles from './OrganizationActionItems.module.css';
import Loader from 'components/Loader/Loader';

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const { orgId: currentUrl } = useParams();

  const [actionItemCreateModalIsOpen, setActionItemCreateModalIsOpen] =
    useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [orderBy, setOrderBy] = useState<'Latest' | 'Earliest'>('Latest');
  const [actionItemStatus, setActionItemStatus] = useState('');
  const [actionItemCategoryId, setActionItemCategoryId] = useState('');
  const [actionItemCategoryName, setActionItemCategoryName] = useState('');

  const [formState, setFormState] = useState({
    actionItemCategoryId: '',
    assigneeId: '',
    preCompletionNotes: '',
  });

  const {
    data: actionItemCategoriesData,
    loading: actionItemCategoriesLoading,
    error: actionItemCategoriesError,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: currentUrl,
    },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: membersData,
    loading: membersLoading,
    error: membersError,
  }: {
    data: InterfaceMembersList | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(MEMBERS_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  }: {
    data: InterfaceActionItemList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ACTION_ITEM_LIST, {
    variables: {
      organizationId: currentUrl,
      actionItemCategoryId,
      orderBy: orderBy === 'Latest' ? 'createdAt_DESC' : 'createdAt_ASC',
      isActive: actionItemStatus === 'Active' ? true : false,
      isCompleted: actionItemStatus === 'Completed' ? true : false,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);

  const createActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await createActionItem({
        variables: {
          assigneeId: formState.assigneeId,
          actionItemCategoryId: formState.actionItemCategoryId,
          preCompletionNotes: formState.preCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
        },
      });

      setFormState({
        assigneeId: '',
        actionItemCategoryId: '',
        preCompletionNotes: '',
      });

      setDueDate(new Date());

      actionItemsRefetch();
      hideCreateModal();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  const showCreateModal = (): void => {
    setActionItemCreateModalIsOpen(!actionItemCreateModalIsOpen);
  };

  const hideCreateModal = (): void => {
    setActionItemCreateModalIsOpen(!actionItemCreateModalIsOpen);
  };

  const handleSorting = (sort: string): void => {
    if (sort === 'Latest') {
      setOrderBy('Latest');
    } else {
      setOrderBy('Earliest');
    }
  };

  const handleStatusFilter = (status: string): void => {
    if (status === 'Active') {
      setActionItemStatus('Active');
    } else {
      setActionItemStatus('Completed');
    }
  };

  const handleClearFilters = (): void => {
    setActionItemCategoryId('');
    setActionItemCategoryName('');
    setActionItemStatus('');
    setOrderBy('Latest');
  };

  if (actionItemCategoriesLoading || membersLoading || actionItemsLoading) {
    return <Loader size="xl" />;
  }

  if (actionItemCategoriesError || membersError || actionItemsError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading{' '}
            {actionItemCategoriesError
              ? 'Action Item Categories'
              : membersError
                ? 'Members List'
                : 'Action Items List'}{' '}
            Data
            <br />
            {actionItemCategoriesError
              ? actionItemCategoriesError.message
              : membersError
                ? membersError.message
                : actionItemsError?.message}
          </h6>
        </div>
      </div>
    );
  }

  const actionItemCategories =
    actionItemCategoriesData?.actionItemCategoriesByOrganization.filter(
      (category) => !category.isDisabled,
    );

  return (
    <div className={styles.organizationActionItemsContainer}>
      <Button
        variant="success"
        onClick={showCreateModal}
        data-testid="createActionItemBtn"
        className={styles.createActionItemButton}
      >
        <i className={'fa fa-plus me-2'} />
        {t('createActionItem')}
      </Button>
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={`mt-4 mx-4`}>
          <div className={styles.btnsContainer}>
            <div className={styles.btnsBlock}>
              <Dropdown
                aria-expanded="false"
                title="Sort Action Items"
                data-testid="sort"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortActionItems"
                >
                  <div className="d-none d-md-inline">
                    <SortIcon className={'me-1'} />
                  </div>
                  {orderBy === 'Latest' ? t('latest') : t('earliest')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(): void => handleSorting('Latest')}
                    data-testid="latest"
                  >
                    {t('latest')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(): void => handleSorting('Earliest')}
                    data-testid="earliest"
                  >
                    {t('earliest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                aria-expanded="false"
                title="Action Item Categories"
                data-testid="actionItemCategories"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant={
                    actionItemCategoryName === ''
                      ? 'outline-success'
                      : 'success'
                  }
                  data-testid="selectActionItemCategory"
                >
                  <div className="d-lg-none">
                    {actionItemCategoryName === ''
                      ? t('actionItemCategory')
                      : actionItemCategoryName}
                  </div>
                  <div className="d-none d-lg-inline">
                    {t('actionItemCategory')}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {actionItemCategories?.map((category, index) => (
                    <Dropdown.Item
                      key={index}
                      data-testid="actionItemCategory"
                      onClick={() => {
                        setActionItemCategoryId(category._id);
                        setActionItemCategoryName(category.name);
                      }}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                aria-expanded="false"
                title="Action Item Status"
                data-testid="actionItemStatus"
                className={styles.dropdownToggle}
              >
                <Dropdown.Toggle
                  variant={
                    actionItemStatus === '' ? 'outline-success' : 'success'
                  }
                  data-testid="selectActionItemStatus"
                >
                  <div className="d-lg-none">
                    {actionItemStatus === '' ? t('status') : actionItemStatus}
                  </div>
                  <div className="d-none d-lg-inline">{t('status')}</div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(): void => handleStatusFilter('Active')}
                    data-testid="activeActionItems"
                  >
                    {t('active')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(): void => handleStatusFilter('Completed')}
                    data-testid="completedActionItems"
                  >
                    {t('completed')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="mt-3 d-none d-lg-inline flex-grow-1 d-flex align-items-center border bg-light-subtle rounded-3">
              {!actionItemCategoryName && !actionItemStatus && (
                <div className="lh-lg mt-2 text-center fw-semibold text-body-tertiary">
                  No Filters
                </div>
              )}

              {actionItemCategoryName !== '' && (
                <div className="badge text-bg-secondary bg-dark-subtle bg-gradient lh-lg mt-2 ms-2 text-body-secondary">
                  {actionItemCategoryName}
                  <i
                    className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary pe-auto`}
                    onClick={() => {
                      setActionItemCategoryName('');
                      setActionItemCategoryId('');
                    }}
                    data-testid="clearActionItemCategoryFilter"
                  />
                </div>
              )}

              {actionItemStatus !== '' && (
                <div className="badge text-bg-secondary bg-dark-subtle bg-gradient lh-lg mt-2 ms-2 text-secondary-emphasis">
                  {actionItemStatus}
                  <i
                    className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary pe-auto`}
                    onClick={() => setActionItemStatus('')}
                    data-testid="clearActionItemStatusFilter"
                  />
                </div>
              )}
            </div>

            <Button
              variant="success"
              onClick={handleClearFilters}
              data-testid="clearFilters"
              className={styles.clearFiltersBtn}
            >
              <i className="fa fa-broom me-2"></i>
              {t('clearFilters')}
            </Button>
          </div>
        </div>

        <hr />

        <ActionItemsContainer
          actionItemsConnection={`Organization`}
          actionItemsData={actionItemsData?.actionItemsByOrganization}
          membersData={membersData?.organizations[0].members}
          actionItemsRefetch={actionItemsRefetch}
        />
      </div>

      {/* Create Modal */}
      <ActionItemCreateModal
        actionItemCreateModalIsOpen={actionItemCreateModalIsOpen}
        hideCreateModal={hideCreateModal}
        formState={formState}
        setFormState={setFormState}
        createActionItemHandler={createActionItemHandler}
        t={t}
        actionItemCategories={actionItemCategories}
        membersData={membersData?.organizations[0].members}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />
    </div>
  );
}

export default organizationActionItems;
