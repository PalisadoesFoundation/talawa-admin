import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Dropdown, Form } from 'react-bootstrap';
import styles from './OrganizationActionItems.module.css';
import SortIcon from '@mui/icons-material/Sort';

import { useMutation, useQuery } from '@apollo/client';
import type {
  InterfaceActionItemCategoryList,
  InterfaceActionItemList,
} from 'utils/interfaces';
import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';

import { Search, WarningAmberRounded } from '@mui/icons-material';
import dayjs from 'dayjs';
import Loader from 'components/Loader/Loader';
import ActionItemsContainer from 'components/ActionItemsContainer/ActionItemsContainer';
import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import ActionItemCreateModal from './ActionItemCreateModal';

function organizationActionItems(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const currentUrl = window.location.href.split('=')[1];

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
    e: ChangeEvent<HTMLFormElement>
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
    } catch (error: any) {
      toast.success(error.message);
      console.log(error);
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
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <div className={styles.message}>
            <WarningAmberRounded
              className={styles.errorIcon}
              fontSize="large"
            />
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
      </OrganizationScreen>
    );
  }

  return (
    <>
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <div className={`mt-4 mx-4`}>
            <div className={styles.btnsContainer}>
              <div className={styles.btnsBlock}>
                <Button
                  variant="success"
                  onClick={handleClearFilters}
                  data-testid="clearFilters"
                >
                  <i className="fa fa-broom me-2"></i>
                  {t('clearFilters')}
                </Button>

                <Dropdown
                  aria-expanded="false"
                  title="Sort Action Items"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortActionItems"
                  >
                    <SortIcon className={'me-1'} />
                    {orderBy === 'Latest' ? 'Latest' : 'Earliest'}
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
                  title="Sort organizations"
                  data-testid="sort"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    variant="outline-success"
                    data-testid="sortOrgs"
                    className={
                      actionItemCategoryId === '' ? '' : 'bg-success text-white'
                    }
                  >
                    {actionItemCategoryName === ''
                      ? 'Action Item Category'
                      : actionItemCategoryName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {actionItemCategoriesData?.actionItemCategoriesByOrganization.map(
                      (category, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => {
                            setActionItemCategoryId(category._id);
                            setActionItemCategoryName(category.name);
                          }}
                        >
                          {category.name}
                        </Dropdown.Item>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  aria-expanded="false"
                  title="Action Item Status"
                  data-testid="actionItemStatus"
                  className={styles.dropdownToggle}
                >
                  <Dropdown.Toggle
                    variant="outline-success"
                    data-testid="actionItemStatus"
                    className={
                      actionItemStatus === '' ? '' : 'bg-success text-white'
                    }
                  >
                    {actionItemStatus === '' ? 'Status' : actionItemStatus}
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

              <Button
                variant="success"
                onClick={showCreateModal}
                data-testid="createActionItemBtn"
              >
                <i className={'fa fa-plus me-2'} />
                {t('createActionItem')}
              </Button>
            </div>
          </div>

          <hr />

          <ActionItemsContainer
            actionItemsData={actionItemsData?.actionItemsByOrganization}
            membersData={membersData.organizations[0].members}
            actionItemsRefetch={actionItemsRefetch}
          />
        </div>
      </OrganizationScreen>

      {/* Create Modal */}
      <ActionItemCreateModal
        actionItemCreateModalIsOpen={actionItemCreateModalIsOpen}
        hideCreateModal={hideCreateModal}
        formState={formState}
        setFormState={setFormState}
        createActionItemHandler={createActionItemHandler}
        t={t}
        actionItemCategoriesData={actionItemCategoriesData}
        membersData={membersData}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />
    </>
  );
}

export default organizationActionItems;
