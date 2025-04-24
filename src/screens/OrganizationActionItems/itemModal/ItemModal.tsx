/**
 * A modal component for creating and updating action items.
 *
 * This component provides a form to create or edit action items, allowing users
 * to specify details such as due date, assignee, category, notes, and allotted hours.
 * It supports assigning action items to individual volunteers, volunteer groups, or members.
 *
 * @component
 * @param {InterfaceItemModalProps} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {string} props.orgId - The ID of the organization.
 * @param {string | undefined} props.eventId - The ID of the event (if applicable).
 * @param {InterfaceActionItemInfo | null} props.actionItem - The action item being edited (if in edit mode).
 * @param {boolean} props.editMode - Indicates whether the modal is in edit mode.
 * @param {() => void} props.actionItemsRefetch - Function to refetch the action items list after changes.
 *
 * @returns {JSX.Element} The `ItemModal` component.
 *
 * @remarks
 * - Uses Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for modal UI and `@mui/material` for form controls.
 * - Handles both creation and updating of action items.
 * - Displays appropriate fields based on the completion status of the action item.
 *
 * @example
 * ```tsx
 * <ItemModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   orgId="org123"
 *   eventId="event456"
 *   actionItem={null}
 *   editMode={false}
 *   actionItemsRefetch={refetchActionItems}
 * />
 * ```
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent, FC } from 'react';
import styles from 'style/app-fixed.module.css';
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
import { ACTION_ITEM_CATEGORIES_BY_ORGANIZATION } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { Autocomplete, FormControl, TextField } from '@mui/material';
import {
  USERS_BY_ORGANIZATION_ID,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';

import { HiUser, HiUserGroup } from 'react-icons/hi2';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

/**
 * The form state now uses a `dueDate` property that represents the date that will
 * be sent as `assignedAt` to the backend.
 */

interface InterfaceFormStateType {
  dueDate: Date;
  assigneeType: 'EventVolunteer' | 'EventVolunteerGroup' | 'User';
  actionItemCategoryId: string;
  assigneeId: string;
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  isCompleted: boolean;
  allottedHours: number | null;
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
  actionItemCategoryId: actionItem?.category?.id || '',
  assigneeId: actionItem?.assigneeId || '',
  assigneeType: 'User', // Defaulting to 'User' as the new interface no longer stores assigneeType
  preCompletionNotes: actionItem?.preCompletionNotes || '',
  postCompletionNotes: actionItem?.postCompletionNotes || null,
  isCompleted: actionItem?.isCompleted || false,
  allottedHours: actionItem?.allottedHours || null, // Adding the missing property
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
    allottedHours,
  } = formState;

  const {
    data: actionItemCategoriesData,
    loading: actionItemCategoriesLoading,
    error: actionItemCategoriesError,
  } = useQuery(ACTION_ITEM_CATEGORIES_BY_ORGANIZATION, {
    variables: {
      input: {
        organizationId: orgId,
      },
    },
  });

  const { data: volunteersData } = useQuery(EVENT_VOLUNTEER_LIST, {
    variables: {
      where: {
        eventId: eventId,
        hasAccepted: true,
      },
    },
  });

  // Query to fetch action item categories (for the Autocomplete)
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
    () => actionItemCategoriesData?.actionCategoriesByOrganization || [],
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
          eventId: eventId,
          assignedAt: dayjs(dueDate).format('YYYY-MM-DD'),
          allottedHours: allottedHours !== null ? allottedHours : null,
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
      // allow number in here too
      const updatedFields: {
        [key: string]: string | boolean | number | null;
      } = {};

      if (actionItemCategoryId !== actionItem?.category?.id) {
        updatedFields.categoryId = actionItemCategoryId;
      }

      if (allottedHours !== actionItem?.allottedHours) {
        updatedFields.allottedHours = allottedHours;
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

      if (Object.keys(updatedFields).length === 0) {
        toast.warning(t('noneUpdated'));
        return;
      }

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
          category.id === actionItem?.category?.id,
      ) || null,
    );

    setAssigneeUser(
      users.find((user: UserType) => user.id === actionItem?.assigneeId) ||
        null,
    );

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
        <p className={styles.titlemodal} data-testid="modalTitle">
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
              data-testid="eventSelect"
              options={actionItemCategories as InterfaceActionItemCategory[]}
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
                  inputProps={{
                    ...params.inputProps,
                    'data-testid': 'category-input',
                  }}
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

              <Autocomplete
                disablePortal
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
                  <TextField
                    {...params}
                    label={t('assignee')}
                    required
                    inputProps={{
                      ...params.inputProps,
                      'data-testid': 'assignee-input',
                    }}
                  />
                )}
              />

              <Form.Group className="d-flex gap-3 mx-auto mb-3">
                <div className="w-50">
                  <DatePicker
                    format="DD/MM/YYYY"
                    label={t('dueDate')}
                    className={`${styles.noOutline} w-100`}
                    value={dayjs(dueDate)}
                    onChange={(date: Dayjs | null): void => {
                      if (date) handleFormChange('dueDate', date.toDate());
                    }}
                  />
                </div>
                <div className="w-50">
                  <TextField
                    type="number"
                    label={t('allottedHours')}
                    variant="outlined"
                    className={`${styles.noOutline} w-100`}
                    value={allottedHours ?? ''}
                    onChange={(e) =>
                      handleFormChange(
                        'allottedHours',
                        Number(e.target.value) || null,
                      )
                    }
                    inputProps={{ min: 0 }}
                    data-testid="allottedHoursInput"
                  />
                </div>
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
