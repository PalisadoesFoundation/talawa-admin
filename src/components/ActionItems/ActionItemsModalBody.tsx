import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import styles from 'components/ActionItems/ActionItemsWrapper.module.css';
import type {
  InterfaceActionItemCategoryList,
  InterfaceActionItemList,
  InterfaceMembersList,
} from 'utils/interfaces';

import ActionItemsContainer from 'components/ActionItemsContainer/ActionItemsContainer';
import Loader from 'components/Loader/Loader';
import { WarningAmberRounded } from '@mui/icons-material';
import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import ActionItemCreateModal from 'screens/OrganizationActionItems/ActionItemCreateModal';
import { useTranslation } from 'react-i18next';

export const ActionItemsModalBody = ({
  organizationId,
  eventId,
}: {
  organizationId: string;
  eventId: string;
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [actionItemCreateModalIsOpen, setActionItemCreateModalIsOpen] =
    useState(false);

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
      organizationId,
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
    variables: { id: organizationId },
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
      organizationId,
      eventId,
      orderBy: 'createdAt_DESC',
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
          eventId,
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
      toast.error(error.message);
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
    return <Loader size="xl" />;
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

  const actionItemCategories =
    actionItemCategoriesData?.actionItemCategoriesByOrganization.filter(
      (category) => !category.isDisabled,
    );

  const completedActionItemsCount =
    actionItemsData?.actionItemsByOrganization.reduce(
      (acc, item) => (item.isCompleted === true ? acc + 1 : acc),
      0,
    );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <span className="fw-bold text-secondary ms-2">
          <span className="d-none d-md-inline fw-bold text-dark">Status: </span>
          {actionItemsData?.actionItemsByOrganization.length} action items
          assigned, {completedActionItemsCount} completed
        </span>

        <Button
          type="submit"
          className={styles.greenregbtn}
          value="createEventActionItem"
          data-testid="createEventActionItemFormSubmitBtn"
          onClick={showCreateModal}
        >
          {t('createActionItem')}
        </Button>
      </div>

      <ActionItemsContainer
        actionItemsConnection={`Event`}
        actionItemsData={actionItemsData?.actionItemsByOrganization}
        membersData={membersData?.organizations[0].members}
        actionItemsRefetch={actionItemsRefetch}
      />

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
    </>
  );
};
