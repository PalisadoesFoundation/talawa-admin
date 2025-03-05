import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent, FC } from 'react';
import styles from '../../style/app-fixed.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceActionItemCategory,
  InterfaceActionItemCategoryList,
  InterfaceActionItemInfo,
  InterfaceEventVolunteerInfo,
  InterfaceMembersList,
  InterfaceVolunteerGroupInfo,
} from 'utils/interfaces';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  POSTGRES_CREATE_ACTION_ITEM_MUTATION,
  // POSTGRES_EVENTS_BY_ORGANIZATION_ID,
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
 * Interface for the form state used in the `ItemModal` component.
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

/**
 * Props for the `ItemModal` component.
 */
export interface InterfaceItemModalProps {
  isOpen: boolean;
  hide: () => void;
  orgId: string;
  eventId: string | undefined;
  actionItemsRefetch: () => void;
  actionItem: InterfaceActionItemInfo | null;
  editMode: boolean;
}

/**
 * Initializes the form state for the `ItemModal` component.
 *
 * @param actionItem - The action item to be edited.
 * @returns
 */

const initializeFormState = (
  actionItem: InterfaceActionItemInfo | null,
): InterfaceFormStateType => ({
  dueDate: actionItem?.dueDate || new Date(),
  actionItemCategoryId: actionItem?.actionItemCategory?._id || '',
  assigneeId:
    actionItem?.assignee?._id ||
    actionItem?.assigneeGroup?._id ||
    actionItem?.assigneeUser?._id ||
    '',
  assigneeType: actionItem?.assigneeType || 'User',
  preCompletionNotes: actionItem?.preCompletionNotes || '',
  postCompletionNotes: actionItem?.postCompletionNotes || null,
  isCompleted: actionItem?.isCompleted || false,
});

/**
 * A modal component for creating action items.
 *
 * @param props - The properties passed to the component.
 * @returns The `ItemModal` component.
 */
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
  const [assignee, setAssignee] = useState<InterfaceEventVolunteerInfo | null>(
    null,
  );
  const [assigneeGroup, setAssigneeGroup] =
    useState<InterfaceVolunteerGroupInfo | null>(null);

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

  /**
   * Query to fetch action item categories for the organization.
   */
  const {
    data: actionItemCategoriesData,
  }: {
    data: InterfaceActionItemCategoryList | undefined;
  } = useQuery(ACTION_ITEM_CATEGORY_LIST, {
    variables: {
      organizationId: orgId,
      where: { is_disabled: false },
    },
  });

  /**
   * Query to fetch event volunteers for the event.
   */
  const {
    data: volunteersData,
  }: {
    data?: {
      getEventVolunteers: InterfaceEventVolunteerInfo[];
    };
  } = useQuery(EVENT_VOLUNTEER_LIST, {
    variables: {
      where: {
        eventId: eventId,
        hasAccepted: true,
      },
    },
  });

  // const { data: eventsData } = useQuery(POSTGRES_EVENTS_BY_ORGANIZATION_ID, {
  //   variables: {
  //     input: { organizationId: orgId },
  //   },
  //   onCompleted: (data) => console.log(' Events Data:', data),
  //   onError: (error) => console.error(' Error fetching events:', error),
  // });

  // const events1 = useMemo(() => {
  //   if (eventsData?.eventsByOrganizationId) {
  //     console.log(' Processed Events:', eventsData.eventsByOrganizationId);
  //     return eventsData.eventsByOrganizationId;
  //   }
  //   return [];
  // }, [eventsData]);

  const {
    data: categoryData,
  }: {
    data:
      | {
          actionCategoriesByOrganization: {
            id: string;
            name: string;
            organizationId: string;
            creatorId: string;
            isDisabled: boolean;
            createdAt: string;
            updatedAt: string;
          }[];
        }
      | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(ACTION_ITEM_CATEGORY, {
    variables: {
      input: { organizationId: orgId }, // Pass the current organization ID here
    },
    onCompleted: (data) => {
      console.log(' Successfully fetched action categories:', data);
    },
    onError: (error) => {
      console.error(' Error fetching action categories:', error);
    },
  });

  /**
   * Query to fetch the list of volunteer groups for the event.
   */
  const {
    data: usersData,
  }: {
    data?: {
      usersByOrganizationId: UserType[];
    };
  } = useQuery(USERS_BY_ORGANIZATION_ID, {
    variables: {
      organizationId: orgId,
    },
  });

  useEffect(() => {
    if (usersData) {
      console.log('🚀 Backend Response - usersByOrganizationId:', usersData);
    }
  }, [usersData]);

  /**
   * Query to fetch members of the organization.
   */
  const {
    data: membersData,
  }: {
    data: InterfaceMembersList | undefined;
  } = useQuery(MEMBERS_LIST, {
    variables: { id: orgId },
  });

  const members = useMemo(
    () => membersData?.organizations[0].members || [],
    [membersData],
  );

  // const events = useMemo(() => {
  //   if (eventsData?.eventsByOrganizationId) {
  //     console.log('🚀 Processed Events:', eventsData.eventsByOrganizationId);
  //     return eventsData.eventsByOrganizationId;
  //   }
  //   return [];
  // }, [eventsData]);

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

  /**
   * Mutation to create & update a new action item.
   */
  const [createActionItem] = useMutation(POSTGRES_CREATE_ACTION_ITEM_MUTATION);
  const [updateActionItem] = useMutation(UPDATE_ACTION_ITEM_MUTATION);

  /**
   * Handler function to update the form state.
   *
   * @param field - The field to be updated.
   * @param value - The value to be set.
   * @returns void
   */
  const handleFormChange = (
    field: keyof InterfaceFormStateType,
    value: string | number | boolean | Date | undefined | null,
  ): void => {
    // Special handling for allottedHours

    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  /**
   * Handler function to create a new action item.
   *
   * @param e - The form submit event.
   * @returns A promise that resolves when the action item is created.
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
          eventId,
        },
      };

      //  Only include `eventId` if it exists (omit null values)
      if (eventId) {
        inputVariables.input.eventId = eventId;
      }

      console.log(
        ' Sending Data to Backend - POSTGRES_CREATE_ACTION_ITEM_MUTATION:',
        inputVariables,
      );

      await createActionItem({
        variables: inputVariables,
      });

      setFormState(initializeFormState(null));
      setActionItemCategory(null);
      setAssignee(null);

      actionItemsRefetch();
      hide();
      toast.success(t('successfulCreation'));
    } catch (error: unknown) {
      console.error('❌ Error Creating Action Item:', error);
      toast.error((error as Error).message);
    }
  };

  /**
   * Handles the form submission for updating an action item.
   *
   * @param  e - The form submission event.
   */
  const updateActionItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const updatedFields: {
        [key: string]: number | string | boolean | Date | undefined | null;
      } = {};

      if (actionItemCategoryId !== actionItem?.actionItemCategory?._id) {
        updatedFields.actionItemCategoryId = actionItemCategoryId;
      }

      if (
        assigneeId !== actionItem?.assignee?._id &&
        assigneeType === 'EventVolunteer'
      ) {
        updatedFields.assigneeId = assigneeId;
      }

      if (
        assigneeId !== actionItem?.assigneeGroup?._id &&
        assigneeType === 'EventVolunteerGroup'
      ) {
        updatedFields.assigneeId = assigneeId;
      }

      if (
        assigneeId !== actionItem?.assigneeUser?._id &&
        assigneeType === 'User'
      ) {
        updatedFields.assigneeId = assigneeId;
      }

      if (assigneeType !== actionItem?.assigneeType) {
        updatedFields.assigneeType = assigneeType;
      }

      if (preCompletionNotes !== actionItem?.preCompletionNotes) {
        updatedFields.preCompletionNotes = preCompletionNotes;
      }

      if (postCompletionNotes !== actionItem?.postCompletionNotes) {
        updatedFields.postCompletionNotes = postCompletionNotes;
      }

      if (dueDate !== actionItem?.dueDate) {
        updatedFields.dueDate = dayjs(dueDate).format('YYYY-MM-DD');
      }

      if (Object.keys(updatedFields).length === 0) {
        toast.warning(t('noneUpdated'));
        return;
      }

      await updateActionItem({
        variables: {
          actionItemId: actionItem?._id,
          assigneeId: assigneeId,
          assigneeType: assigneeType,
          ...updatedFields,
          isCompleted: actionItem?.isCompleted,
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

  useEffect(() => {
    setFormState(initializeFormState(actionItem));

    setActionItemCategory(
      actionItemCategories.find(
        (category) => category.id === actionItem?.actionItemCategory?._id,
      ) || null,
    );

    setAssignee(
      volunteers.find(
        (volunteer) => volunteer._id === actionItem?.assignee?._id,
      ) || null,
    );

    setAssigneeUser(
      users.find((user) => user.id === actionItem?.assignee?._id) || null,
    );

    setAssigneeUser(
      members.find((member) => member._id === actionItem?.assigneeUser?._id)
        ? {
            id:
              members.find(
                (member) => member._id === actionItem?.assigneeUser?._id,
              )?._id || '',
            name:
              members.find(
                (member) => member._id === actionItem?.assigneeUser?._id,
              )?.firstName +
                ' ' +
                members.find(
                  (member) => member._id === actionItem?.assigneeUser?._id,
                )?.lastName || '',
            emailAddress:
              members.find(
                (member) => member._id === actionItem?.assigneeUser?._id,
              )?.email || '',
            createdAt:
              members.find(
                (member) => member._id === actionItem?.assigneeUser?._id,
              )?.createdAt || '',
            __typename: 'User', // Optional, only if needed
          }
        : null,
    );
  }, [actionItem, actionItemCategories, volunteers, members]); // ✅ Removed `groups`

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
              value={actionItemCategory as InterfaceActionItemCategory | null}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              filterSelectedOptions={true}
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

            {isCompleted && <></>}
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

              {assigneeType === 'EventVolunteer' ? (
                <Form.Group className="mb-3 w-100">
                  <Autocomplete
                    className={`${styles.noOutline} w-100`}
                    data-testid="volunteerSelect"
                    options={volunteers}
                    value={assignee}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    filterSelectedOptions={true}
                    getOptionLabel={(
                      volunteer: InterfaceEventVolunteerInfo,
                    ): string =>
                      `${volunteer.user.firstName} ${volunteer.user.lastName}`
                    }
                    onChange={(_, newAssignee): void => {
                      handleFormChange('assigneeId', newAssignee?._id ?? '');
                      setAssignee(newAssignee);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={t('volunteers')} required />
                    )}
                  />
                </Form.Group>
              ) : assigneeType === 'EventVolunteerGroup' ? (
                <Form.Group className="mb-3 w-100">
                  <Autocomplete
                    className={`${styles.noOutline} w-100`}
                    data-testid="volunteerGroupSelect"
                    options={groups}
                    value={assigneeGroup}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    filterSelectedOptions={true}
                    getOptionLabel={(
                      group: InterfaceVolunteerGroupInfo,
                    ): string => `${group.name}`}
                    onChange={(_, newAssignee): void => {
                      handleFormChange('assigneeId', newAssignee?._id ?? '');
                      setAssigneeGroup(newAssignee);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('volunteerGroups')}
                        required
                      />
                    )}
                  />
                </Form.Group>
              ) : (
                <Form.Group className="mb-3 w-100">
                  <Autocomplete
                    className={`${styles.noOutline} w-100`}
                    data-testid="memberSelect"
                    options={users.filter((user) => user.__typename === 'User')} // ✅ Only include users with __typename === "User"
                    value={assigneeUser}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    } // ✅ Use `id` instead of `_id`
                    filterSelectedOptions={true}
                    getOptionLabel={(user: UserType): string => user.name} // ✅ Get name directly from user object
                    onChange={(_, newAssignee): void => {
                      handleFormChange('assigneeId', newAssignee?.id ?? '');
                      setAssigneeUser(newAssignee);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={t('assignee')} required />
                    )}
                  />
                </Form.Group>
              )}

              <Form.Group className="d-flex gap-3 mx-auto mb-3">
                {/* Date Calendar Component to select due date of an action item */}
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

              {/* <Form.Group className="mb-3 w-100">
              <Autocomplete
                className={`${styles.noOutline} w-100`}
                data-testid="eventSelect"
                options={events}
                value={events.find(event => event.id === eventId) || null}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                getOptionLabel={(event) => event.name}
                onChange={(_, selectedEvent) => {
                  handleFormChange("eventId", selectedEvent?.id || undefined);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Event" required />
                )}
              />
            </Form.Group> */}

              {/* Input text Component to add notes for action item */}
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
