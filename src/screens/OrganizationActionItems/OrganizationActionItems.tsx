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
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch,
  }: {
    data: InterfaceActionItemList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: any;
  } = useQuery(ACTION_ITEM_LIST, {
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

      refetch();
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

  if (actionItemCategoriesLoading || membersLoading || actionItemsLoading) {
    return <Loader size="lg" />;
  }

  if (actionItemCategoriesError || membersError || actionItemsError) {
    return (
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
    );
  }

  return (
    <>
      <OrganizationScreen screenName="Action Items" title={t('title')}>
        <div className={`${styles.container} bg-white rounded-4 my-3`}>
          <div className={`${styles.btnsContainer} mt-4 mx-4`}>
            <div className={styles.input}>
              <Form.Control
                type="name"
                id="searchOrgname"
                className="bg-white"
                placeholder={t('searchByName')}
                data-testid="searchByName"
                autoComplete="off"
                required
                // onKeyUp={handleSearchByEnter}
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
                // onClick={handleSearchByBtnClick}
                data-testid="searchBtn"
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <div className={`${styles.dropdownContainer} d-flex flex-wrap`}>
                <Dropdown
                  aria-expanded="false"
                  title="Sort organizations"
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
                    data-testid="sortOrgs"
                  >
                    <SortIcon className={'me-1'} />
                    Sort
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Latest')}
                      data-testid="latest"
                    >
                      {t('latest')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      // onClick={(): void => handleSorting('Earliest')}
                      data-testid="oldest"
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
                    // variant={
                    //   sortingState.option === ''
                    //     ? 'outline-success'
                    //     : 'success'
                    // }
                    variant="outline-success"
                    data-testid="sortOrgs"
                    className="me-0"
                  >
                    Action Item Category
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {actionItemCategoriesData?.actionItemCategoriesByOrganization.map(
                      (category: any, index: any) => (
                        <Dropdown.Item
                          key={index}
                          // onClick={
                          //   /* istanbul ignore next */
                          //   () => setOrgSetting(setting)
                          // }
                          // className={
                          //   orgSetting === setting ? 'text-secondary' : ''
                          // }
                          className="my-1"
                        >
                          {category.name}
                        </Dropdown.Item>
                      )
                    )}
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
            actionItemsData={actionItemsData}
            membersData={membersData.organizations[0].members}
            refetch={refetch}
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
