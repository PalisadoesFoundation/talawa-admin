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

import ActionItemsContainer from 'components/ActionItems/ActionItemsContainer';
import Loader from 'components/Loader/Loader';
import { WarningAmberRounded } from '@mui/icons-material';
import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import ActionItemCreateModal from 'screens/OrganizationActionItems/ActionItemCreateModal';
import { useTranslation } from 'react-i18next';

/**
 * Component displaying the body of the Action Items modal.
 * Fetches and displays action items, members, and action item categories related to a specific event within an organization.
 *
 * @param organizationId - The ID of the organization.
 * @param eventId - The ID of the event.
 *
 *
 * @example
 * ```tsx
 * <ActionItemsModalBody organizationId="org123" eventId="event456" />
 * ```
 * This example renders the `ActionItemsModalBody` component with the provided organization and event IDs.
 */
export const ActionItemsModalBody = ({
  organizationId,
  eventId,
}: {
  organizationId: string;
  eventId: string;
}): JSX.Element => {
  // Setting up translation
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  // State to manage due date
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  // State to manage the visibility of the action item creation modal
  const [actionItemCreateModalIsOpen, setActionItemCreateModalIsOpen] =
    useState(false);

  // State to manage form inputs
  const [formState, setFormState] = useState({
    actionItemCategoryId: '',
    assigneeId: '',
    preCompletionNotes: '',
  });

  // Query to fetch action item categories
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

  // Query to fetch members list
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

  // Query to fetch action items list
  const {
    data: actionItemsData,
    loading: actionItemsLoading,
    error: actionItemsError,
    refetch: actionItemsRefetch,
  }: {
    data: InterfaceActionItemList | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_LIST, {
    variables: {
      organizationId,
      eventId,
      orderBy: 'createdAt_DESC',
    },
    notifyOnNetworkStatusChange: true,
  });

  // Mutation to create a new action item
  const [createActionItem] = useMutation(CREATE_ACTION_ITEM_MUTATION);

  /**
   * Handles the creation of a new action item.
   *
   * @param e - The change event from the form submission.
   */
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

      // Resetting form state and due date after successful creation
      setFormState({
        assigneeId: '',
        actionItemCategoryId: '',
        preCompletionNotes: '',
      });

      setDueDate(new Date());

      // Refetching the action items list to update the UI
      actionItemsRefetch();
      hideCreateModal();
      toast.success(t('successfulCreation') as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };

  /**
   * Shows the create action item modal.
   */
  const showCreateModal = (): void => {
    setActionItemCreateModalIsOpen(!actionItemCreateModalIsOpen);
  };

  /**
   * Hides the create action item modal.
   */
  const hideCreateModal = (): void => {
    setActionItemCreateModalIsOpen(!actionItemCreateModalIsOpen);
  };

  // Showing loader while data is being fetched
  if (actionItemCategoriesLoading || membersLoading || actionItemsLoading) {
    return <Loader size="xl" />;
  }

  // Showing error message if any of the queries fail
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

  // Filtering out disabled action item categories
  const actionItemCategories =
    actionItemCategoriesData?.actionItemCategoriesByOrganization.filter(
      (category) => !category.isDisabled,
    );

  // Counting the number of completed action items
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
          data-testid="createEventActionItemBtn"
          onClick={showCreateModal}
        >
          {tCommon('create')}
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
