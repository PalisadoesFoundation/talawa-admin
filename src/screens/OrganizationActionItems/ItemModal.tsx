import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent, FC } from 'react';
import styles from '../../style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceActionItemCategory,
  InterfaceActionItem,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  POSTGRES_CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import {
  USERS_BY_ORGANIZATION_ID,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';

import { HiUser, HiUserGroup } from 'react-icons/hi2';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemQueries';

/**
 * The form state now uses a `dueDate` property that represents the date that will
 * be sent as `assignedAt` to the backend.
 */
interface InterfaceFormStateType {
  dueDate: Date;
  assigneeType: 'EventVolunteer' | 'EventVolunteerGroup' | 'User';
  actionItemCategoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  isCompleted: boolean;
}

type UserType = {
  id: string;
  name: string;
  emailAddress: string;
  createdAt: string;
  __typename?: string;
};

export interface InterfaceItemModalProps {
  isOpen: boolean;
  hide: () => void;
  orgId: string;
  eventId: string | undefined;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItem | null;
  editMode: boolean;
}

/**
 * Initializes the form state. Since the new interface no longer has a dueDate,
 * we use the `assignedAt` field (converted from string to Date) to populate the date.
 */
const initializeFormState = (
  actionItem: InterfaceActionItem | null,
): InterfaceFormStateType => ({
  dueDate: actionItem ? new Date(actionItem.assignedAt) : new Date(),
  actionItemCategoryId: actionItem?.actionItemCategory?.id || '',
  assigneeId: actionItem?.assigneeId || '',
  assigneeType: 'User', // Defaulting to 'User' as the new interface no longer stores assigneeType
  preCompletionNotes: actionItem?.preCompletionNotes || '',
  postCompletionNotes: actionItem?.postCompletionNotes || null,
  isCompleted: actionItem?.isCompleted || false,
});

const ItemModal: FC<InterfaceItemModalProps> = ({
  isOpen,
  hide,
  orgId,
  eventId,
  actionItem,
  editMode,
  actionItemsRefetch,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [actionItemCategory, setActionItemCategory] =
    useState<InterfaceActionItemCategory | null>(null);

  const [assigneeUser, setAssigneeUser] = useState<UserType | null>(null);

  const [formState, setFormState] = useState<InterfaceFormStateType>(
    initializeFormState(actionItem),
  );

  const {
    dueDate,
    assigneeType,
    actionItemCategoryId,
    assigneeId,
    preCompletionNotes,
    postCompletionNotes,
    isCompleted,
  } = formState;

  // Query to fetch action item categories
  const { data: actionItemCategoriesData } = useQuery(
    ACTION_ITEM_CATEGORY_LIST,
    {
      variables: {
        organizationId: orgId,
        where: { is_disabled: false },
      },
    },
  );

  // Query to fetch event volunteers
  const { data: volunteersData } = useQuery(EVENT_VOLUNTEER_LIST, {
    variables: {
      where: {
        eventId: eventId,
        hasAccepted: true,
      },
    },
  });

  // Query to fetch action item categories (for the Autocomplete)
  const { data: categoryData } = useQuery(ACTION_ITEM_CATEGORY, {
    variables: {
      input: { organizationId: orgId },
    },
  });

  // Query to fetch users
  const { data: usersData } = useQuery(USERS_BY_ORGANIZATION_ID, {
    variables: { organizationId: orgId },
  });
  // Query to fetch members
  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  const members = useMemo(
    () => membersData?.organizations[0].members || [],
    [membersData],
  );

  const volunteers = useMemo(
    () => volunteersData?.getEventVolunteers || [],
    [volunteersData],
  );

  const users = useMemo(
    () => usersData?.usersByOrganizationId || [],
    [usersData],
  );

  const actionItemCategories = useMemo(
    () => actionItemCategoriesData?.actionItemCategoriesByOrganization || [],
    [actionItemCategoriesData],
  );

  const [createActionItem] = useMutation(POSTGRES_CREATE_ACTION_ITEM_MUTATION);
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  const handleFormChange = (
    field: keyof InterfaceFormStateType,
    value: string | number | boolean | Date | undefined | null,
  ): void => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  /**
   * Handler for creating a new action item.
   * The dueDate is sent as `assignedAt` to match the new interface.
   */
  const createActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const inputVariables = {
        input: {
          categoryId: actionItemCategoryId,
          assigneeId: assigneeId,
          preCompletionNotes: preCompletionNotes,
          organizationId: orgId,
          eventId: eventId || null,
          assignedAt: dayjs(dueDate).format('YYYY-MM-DD'),
        },
      };

      await createActionItem({ variables: inputVariables });

      setFormState(initializeFormState(null));
      setActionItemCategory(null);

      actionItemsRefetch();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * Handler for updating an existing action item.
   * Fields are renamed to match the new interface:
   * - `actionItemCategoryId` becomes `categoryId`
   * - `dueDate` is sent as `assignedAt`
   */
  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: {
        [key: string]: string | boolean | null;
      } = {};

      // Update the category if it has changed
      if (actionItemCategoryId !== actionItem?.actionItemCategory?.id) {
        updatedFields.categoryId = actionItemCategoryId;
      }

      // Update the assignee if it has changed
      if (assigneeId !== actionItem?.assigneeId) {
        updatedFields.assigneeId = assigneeId;
      }

      // Update preCompletionNotes if it has changed
      if (preCompletionNotes !== actionItem?.preCompletionNotes) {
        updatedFields.preCompletionNotes = preCompletionNotes;
      }

      // Update postCompletionNotes if it has changed
      if (postCompletionNotes !== actionItem?.postCompletionNotes) {
        updatedFields.postCompletionNotes = postCompletionNotes;
      }

      // NOTE: Removing the update of 'assigneeType' and 'assignedAt'
      // because they are not defined in your MutationUpdateActionItemInput

      if (Object.keys(updatedFields).length === 0) {
        toast.warning(t('noneUpdated'));
        return;
      }

      await updateActionItem({
        variables: {
          input: {
            id: actionItem?.id,
            ...updatedFields,
            isCompleted: actionItem?.isCompleted,
          },
        },
      });

      setFormState(initializeFormState(null));
      actionItemsRefetch();
      hide();
      toast.success(t('successfulUpdation'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };

  /**
   * When the component mounts or the actionItem changes, set the form state
   * and resolve the category and assignee from the new interface values.
   */
  useEffect(() => {
    setFormState(initializeFormState(actionItem));

    setActionItemCategory(
      actionItemCategories.find(
        (category: InterfaceActionItemCategory) =>
          category.id === actionItem?.actionItemCategory?.id,
      ) || null,
    );

    setAssigneeUser(
      users.find((user: UserType) => user.id === actionItem?.assigneeId) ||
        null,
    );

    // If you don't have an existing interface for members, define one inline:
    interface InterfaceMember {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
    }

    const member = members.find(
      (member: InterfaceMember) => member._id === actionItem?.assigneeId,
    );
    if (member) {
      setAssigneeUser({
        id: member._id,
        name: member.firstName + ' ' + member.lastName,
        emailAddress: member.email,
        createdAt: member.createdAt,
        __typename: 'User',
      });
    } else {
      setAssigneeUser(null);
    }
  }, [actionItem, actionItemCategories, volunteers, members]);

  return (
    <Modal className={styles.itemModal} show={isOpen} onHide={hide}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {editMode ? t('updateActionItem') : t('createActionItem')}
        </p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.closeButton}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmitCapture={
            editMode ? updateActionItemHandler : createActionItemHandler
          }
          className="p-2"
        >
          <Form.Group className="d-flex gap-3 mb-3">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              data-testid="categorySelect"
              options={
                (categoryData?.actionCategoriesByOrganization as InterfaceActionItemCategory[]) ||
                []
              }
              value={actionItemCategory}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              filterSelectedOptions
              getOptionLabel={(item) => item.name}
              onChange={(_, newCategory) => {
                handleFormChange('actionItemCategoryId', newCategory?.id ?? '');
                setActionItemCategory(newCategory);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('actionItemCategory')}
                  required
                />
              )}
            />
          </Form.Group>
          {!isCompleted && (
            <>
              {eventId && (
                <>
                  <Form.Label className="my-0 py-0">{t('assignTo')}</Form.Label>
                  <div
                    className={`btn-group ${styles.toggleGroup} mt-0`}
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      className={`btn-check ${styles.toggleBtn}`}
                      name="btnradio"
                      id="individualRadio"
                      checked={assigneeType === 'EventVolunteer'}
                      onChange={() =>
                        handleFormChange('assigneeType', 'EventVolunteer')
                      }
                    />
                    <label
                      className={`btn btn-outline-primary ${styles.toggleBtn}`}
                      htmlFor="individualRadio"
                    >
                      <HiUser className="me-1" />
                      {t('individuals')}
                    </label>

                    <input
                      type="radio"
                      className={`btn-check ${styles.toggleBtn}`}
                      name="btnradio"
                      id="groupsRadio"
                      onChange={() =>
                        handleFormChange('assigneeType', 'EventVolunteerGroup')
                      }
                      checked={assigneeType === 'EventVolunteerGroup'}
                    />
                    <label
                      className={`btn btn-outline-primary ${styles.toggleBtn}`}
                      htmlFor="groupsRadio"
                    >
                      <HiUserGroup className="me-1" />
                      {t('groups')}
                    </label>
                  </div>
                </>
              )}

              <Form.Group className="mb-3 w-100">
                <Autocomplete
                  className={`${styles.noOutline} w-100`}
                  data-testid="memberSelect"
                  options={users.filter(
                    (user: UserType) => user.__typename === 'User',
                  )}
                  value={assigneeUser}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  filterSelectedOptions
                  getOptionLabel={(user: UserType): string => user.name}
                  onChange={(_, newAssignee): void => {
                    handleFormChange('assigneeId', newAssignee?.id ?? '');
                    setAssigneeUser(newAssignee);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('assignee')} required />
                  )}
                />
              </Form.Group>

              <Form.Group className="d-flex gap-3 mx-auto mb-3">
                <DatePicker
                  format="DD/MM/YYYY"
                  label={t('dueDate')}
                  className={styles.noOutline}
                  value={dayjs(dueDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) handleFormChange('dueDate', date.toDate());
                  }}
                />
              </Form.Group>

              <FormControl fullWidth className="mb-2">
                <TextField
                  label={t('preCompletionNotes')}
                  variant="outlined"
                  className={styles.noOutline}
                  value={preCompletionNotes}
                  onChange={(e) =>
                    handleFormChange('preCompletionNotes', e.target.value)
                  }
                />
              </FormControl>
            </>
          )}

          {isCompleted && (
            <FormControl fullWidth className="mb-2">
              <TextField
                label={t('postCompletionNotes')}
                className={styles.noOutline}
                value={postCompletionNotes}
                multiline
                maxRows={3}
                onChange={(e) =>
                  handleFormChange('postCompletionNotes', e.target.value)
                }
              />
            </FormControl>
          )}

          <Button
            type="submit"
            className={styles.addButton}
            data-testid="submitBtn"
          >
            {editMode ? t('updateActionItem') : t('createActionItem')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
