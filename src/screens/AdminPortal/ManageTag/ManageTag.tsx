/**
 * ManageTag Component
 *
 * This component is responsible for managing tags within an organization. It provides
 * functionalities to view, edit, assign, unassign, and remove tags, as well as manage
 * members assigned to a specific tag. It also supports infinite scrolling for assigned
 * members and includes modals for various actions.
 *
 * @returns The ManageTag component.
 *
 * remarks
 * - Uses GraphQL queries and mutations to fetch and manipulate tag data.
 * - Includes modals for actions like editing, removing, assigning, and unassigning tags.
 * - Implements infinite scrolling for the list of assigned members.
 *
 * dependencies
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `react-router-dom` for navigation.
 * - Plain HTML elements for UI components.
 * - `@mui/x-data-grid` for displaying assigned members in a table.
 * - `react-toastify` for notifications.
 * - Custom components like `AddPeopleToTag`, `TagActions`, `EditUserTagModal`, etc.
 *
 * state
 * - `unassignUserTagModalIsOpen` - Controls the visibility of the unassign user tag modal.
 * - `addPeopleToTagModalIsOpen` - Controls the visibility of the add people to tag modal.
 * - `tagActionsModalIsOpen` - Controls the visibility of the tag actions modal.
 * - `editUserTagModalIsOpen` - Controls the visibility of the edit user tag modal.
 * - `removeUserTagModalIsOpen` - Controls the visibility of the remove user tag modal.
 * - `assignedMemberSearchInput` - Stores the search input for filtering assigned members.
 * - `assignedMemberSortOrder` - Stores the sort order for assigned members.
 * - `tagActionType` - Specifies the type of tag action (assign or remove).
 * - `newTagName` - Stores the new name for the tag being edited.
 *
 * methods
 * - `toggleRemoveUserTagModal` - Toggles the visibility of the remove user tag modal.
 * - `showAddPeopleToTagModal` - Opens the add people to tag modal.
 * - `hideAddPeopleToTagModal` - Closes the add people to tag modal.
 * - `showTagActionsModal` - Opens the tag actions modal.
 * - `hideTagActionsModal` - Closes the tag actions modal.
 * - `handleUnassignUserTag` - Handles the unassignment of a user from a tag.
 * - `handleEditUserTag` - Handles the editing of a tag's name.
 * - `handleRemoveUserTag` - Handles the removal of a tag.
 *
 * errorHandling
 * - Displays error messages using `react-toastify` in case of GraphQL errors.
 *
 * @example
 * ```tsx
 * <ManageTag />
 * ```
 */
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import LoadingState from 'shared-components/LoadingState/LoadingState';

import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceQueryUserTagsAssignedMembers } from 'utils/interfaces';
import styles from './ManageTag.module.css';
import type {
  InterfaceTagAssignedMembersQuery,
  SortedByType,
  TagActionType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import AddPeopleToTag from 'components/AdminPortal/AddPeopleToTag/AddPeopleToTag';
import TagActions from 'components/AdminPortal/TagActions/TagActions';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import EditUserTagModal from './editModal/EditUserTagModal';
import RemoveUserTagModal from './removeModal/RemoveUserTagModal';
import UnassignUserTagModal from './unassignModal/UnassignUserTagModal';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import Button from 'shared-components/Button/Button';

export const getManageTagErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  return String(error);
};

function ManageTag(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
  const { orgId, tagId: currentTagId } = useParams();
  const navigate = useNavigate();

  const unassignUserTagModal = useModalState();
  const addPeopleToTagModal = useModalState();
  const tagActionsModal = useModalState();
  const editUserTagModal = useModalState();
  const removeUserTagModal = useModalState();

  const [unassignUserId, setUnassignUserId] = useState<string | null>(null);
  const [assignedMemberSearchInput, setAssignedMemberSearchInput] =
    useState('');
  const [assignedMemberSearchFirstName, setAssignedMemberSearchFirstName] =
    useState('');
  const [assignedMemberSearchLastName, setAssignedMemberSearchLastName] =
    useState('');
  const [assignedMemberSortOrder] = useState<SortedByType>('DESCENDING');
  // a state to specify whether we're assigning to tags or removing from tags
  const [tagActionType, setTagActionType] =
    useState<TagActionType>('assignToTags');

  const toggleUnassignUserTagModal = (): void => {
    if (unassignUserTagModal.isOpen) {
      setUnassignUserId(null);
    }
    unassignUserTagModal.toggle();
  };

  const {
    data: userTagAssignedMembersData,
    loading: userTagAssignedMembersLoading,
    error: userTagAssignedMembersError,
    refetch: userTagAssignedMembersRefetch,
    fetchMore: fetchMoreAssignedMembers,
  }: InterfaceTagAssignedMembersQuery = useQuery(USER_TAGS_ASSIGNED_MEMBERS, {
    variables: {
      id: currentTagId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      where: {
        firstName: { starts_with: assignedMemberSearchFirstName },
        lastName: { starts_with: assignedMemberSearchLastName },
      },
      sortedBy: { id: assignedMemberSortOrder },
    },
    fetchPolicy: 'no-cache',
  });

  const loadMoreAssignedMembers = (): void => {
    fetchMoreAssignedMembers({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after:
          userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo?.pageInfo
            ?.endCursor,
      },
      updateQuery: (
        prevResult: { getAssignedUsers: InterfaceQueryUserTagsAssignedMembers },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: {
            getAssignedUsers: InterfaceQueryUserTagsAssignedMembers;
          };
        },
      ) => {
        if (!fetchMoreResult?.getAssignedUsers) return prevResult;

        return {
          getAssignedUsers: {
            ...fetchMoreResult.getAssignedUsers,
            usersAssignedTo: {
              ...fetchMoreResult.getAssignedUsers.usersAssignedTo,
              edges: [
                ...(prevResult.getAssignedUsers.usersAssignedTo?.edges ?? []),
                ...(fetchMoreResult.getAssignedUsers.usersAssignedTo?.edges ??
                  []),
              ],
            },
          },
        };
      },
    });
  };

  useEffect(() => {
    const [firstName, ...lastNameParts] = assignedMemberSearchInput
      .trim()
      .split(/\s+/);
    const lastName = lastNameParts.join(' '); // Joins everything after the first word
    setAssignedMemberSearchFirstName(firstName);
    setAssignedMemberSearchLastName(lastName);
  }, [assignedMemberSearchInput]);

  const [unassignUserTag] = useMutation(UNASSIGN_USER_TAG);

  const handleUnassignUserTag = async (): Promise<void> => {
    try {
      await unassignUserTag({
        variables: { tagId: currentTagId, userId: unassignUserId },
      });

      userTagAssignedMembersRefetch();
      toggleUnassignUserTagModal();
      NotificationToast.success({
        key: 'successfullyUnassigned',
        namespace: 'translation',
      });
    } catch (error: unknown) {
      const errorMessage = getManageTagErrorMessage(error);
      NotificationToast.error(errorMessage);
    }
  };

  const [edit] = useMutation(UPDATE_USER_TAG);

  const [newTagName, setNewTagName] = useState<string>('');
  const currentTagName =
    userTagAssignedMembersData?.getAssignedUsers.name ?? '';

  useEffect(() => {
    setNewTagName(userTagAssignedMembersData?.getAssignedUsers.name ?? '');
  }, [userTagAssignedMembersData]);

  const handleEditUserTag = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (newTagName === currentTagName) {
      NotificationToast.info({
        key: 'changeNameToEdit',
        namespace: 'translation',
      });
      return;
    }

    try {
      await edit({
        variables: { tagId: currentTagId, name: newTagName },
      });

      NotificationToast.success({
        key: 'tagUpdationSuccess',
        namespace: 'translation',
      });
      userTagAssignedMembersRefetch();
      editUserTagModal.close();
    } catch (error: unknown) {
      const errorMessage = getManageTagErrorMessage(error);
      NotificationToast.error(errorMessage);
    }
  };

  const [removeUserTag] = useMutation(REMOVE_USER_TAG);
  const handleRemoveUserTag = async (): Promise<void> => {
    try {
      await removeUserTag({ variables: { id: currentTagId } });

      navigate(`/admin/orgtags/${orgId}`);
      removeUserTagModal.toggle();
      NotificationToast.success({
        key: 'tagRemovalSuccess',
        namespace: 'translation',
      });
    } catch (error: unknown) {
      const errorMessage = getManageTagErrorMessage(error);
      NotificationToast.error(errorMessage);
    }
  };

  if (userTagAssignedMembersError) {
    return (
      <div className={`${styles.errorContainer} rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className={styles.errorHeading}>
            {t('errorLoadingAssignedMembers')}
          </h6>
        </div>
      </div>
    );
  }

  const userTagAssignedMembers =
    userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo?.edges?.map(
      (edge) => edge.node,
    ) ?? [];

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...(userTagAssignedMembersData?.getAssignedUsers?.ancestorTags ?? []),
    { _id: currentTagId, name: currentTagName },
  ];

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/subTags/${tagId}`);
  };
  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const getFullName = (
    firstName?: string | null,
    lastName?: string | null,
  ): string => {
    return [firstName, lastName]
      .filter((name): name is string => Boolean(name))
      .join(' ');
  };

  const hasMoreAssignedMembers = Boolean(
    userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo?.pageInfo
      ?.hasNextPage,
  );

  const getInitials = (
    firstName?: string | null,
    lastName?: string | null,
  ): string => {
    const f = firstName?.charAt(0)?.toUpperCase() ?? '';
    const l = lastName?.charAt(0)?.toUpperCase() ?? '';
    return f + l || '?';
  };

  return (
    <>
      <nav
        className={`breadcrumb ${styles.breadcrumbNav}`}
        aria-label="Breadcrumb"
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/admin/orgtags/${orgId}`);
          }}
          data-testid="allTagsBtn"
          className={styles.breadcrumbLink}
        >
          {t('tags')}
        </a>
        {orgUserTagAncestors?.map((tag, index) => (
          <span key={index}>
            {' \u203A '}
            {tag._id === currentTagId ? (
              <span
                className={styles.breadcrumbCurrent}
                data-testid="redirectToManageTag"
                data-text={tag.name}
              >
                {tag.name}
              </span>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  redirectToManageTag(tag._id as string);
                }}
                data-testid="redirectToManageTag"
                data-text={tag.name}
                className={styles.breadcrumbLink}
              >
                {tag.name}
              </a>
            )}
          </span>
        ))}
      </nav>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {currentTagName || t('manageTag')}
            <Button
              variant="plain"
              className={`btn-icon ${styles.editIconBtn}`}
              title={tCommon('edit')}
              onClick={editUserTagModal.open}
              data-testid="editUserTag"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </Button>
          </h1>
          <p className="page-subtitle">{t('assignedMembersOf')}</p>
        </div>
        <div className="page-header-actions">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              redirectToSubTags(currentTagId as string);
            }}
            className="btn btn-secondary"
            data-testid="subTagsBtn"
          >
            {t('subTags')} (
            {userTagAssignedMembersData?.getAssignedUsers?.childTags
              ?.totalCount ?? 0}
            )
          </a>
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Tag Details */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t('manageTag')}</span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="field-label" htmlFor="tag-name">
                {t('tagName') || 'Tag Name'}
              </label>
              <input
                type="text"
                id="tag-name"
                className="form-input"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                aria-label={t('tagName') || 'Tag name'}
              />
            </div>
            <div className={styles.saveBtnWrapper}>
              <Button
                variant="plain"
                className="btn btn-primary"
                onClick={() => {
                  const event = new Event('submit', {
                    bubbles: true,
                    cancelable: true,
                  }) as unknown as React.FormEvent<HTMLFormElement>;
                  Object.defineProperty(event, 'preventDefault', {
                    value: () => {},
                  });
                  handleEditUserTag(event);
                }}
                data-testid="saveTagBtn"
              >
                {tCommon('save') || 'Save'}
              </Button>
            </div>
            <div className={styles.assignBtnsWrapper}>
              <Button
                variant="plain"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setTagActionType('assignToTags');
                  tagActionsModal.open();
                }}
                data-testid="assignToTags"
              >
                {t('assignToTags')}
              </Button>
              <Button
                variant="plain"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setTagActionType('removeFromTags');
                  tagActionsModal.open();
                }}
                data-testid="removeFromTags"
              >
                {t('removeFromTags')}
              </Button>
            </div>

            <div className={styles.dangerZone}>
              <p className={styles.dangerZoneTitle}>{t('dangerZone')}</p>
              <p className={styles.dangerZoneDesc}>{t('dangerZoneDesc')}</p>
              <Button
                variant="plain"
                className="btn btn-danger"
                onClick={removeUserTagModal.open}
                data-testid="removeTag"
              >
                {t('removeUserTag')}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Assigned Members */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {t('assignedMembersOf')} ({userTagAssignedMembers.length})
            </span>
            <Button
              variant="plain"
              className="btn btn-sm btn-primary"
              onClick={addPeopleToTagModal.open}
              data-testid="addPeopleToTagBtn"
            >
              {t('addPeopleToTag')}
            </Button>
          </div>
          <div className="card-body">
            <div className={styles.searchBarWrapper}>
              <div className={`search-bar ${styles.searchBarFullWidth}`}>
                <svg
                  aria-hidden="true"
                  className="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder={tCommon('searchByName')}
                  aria-label={tCommon('searchByName')}
                  value={assignedMemberSearchInput}
                  onChange={(e) =>
                    setAssignedMemberSearchInput(e.target.value.trim())
                  }
                  data-testid="searchInput"
                />
              </div>
            </div>

            <LoadingState
              isLoading={userTagAssignedMembersLoading}
              variant="spinner"
            >
              <div
                id="manageTagScrollableDiv"
                data-testid="manageTagScrollableDiv"
                className={styles.manageTagScrollableDiv}
              >
                <InfiniteScroll
                  dataLength={userTagAssignedMembers.length}
                  next={loadMoreAssignedMembers}
                  hasMore={hasMoreAssignedMembers}
                  loader={<InfiniteScrollLoader />}
                  scrollableTarget="manageTagScrollableDiv"
                >
                  {userTagAssignedMembers.length === 0 ? (
                    <div className={styles.emptyMembers}>
                      {t('noAssignedMembersFound')}
                    </div>
                  ) : (
                    userTagAssignedMembers.map((member, index) => {
                      const initials = getInitials(
                        member.firstName,
                        member.lastName,
                      );
                      const fullName = getFullName(
                        member.firstName,
                        member.lastName,
                      );
                      return (
                        <div
                          key={member._id || index}
                          className={`member-row ${styles.memberRow} ${
                            index < userTagAssignedMembers.length - 1
                              ? styles.memberRowBorder
                              : ''
                          }`}
                        >
                          <div
                            className={`${styles.memberAvatar} ${
                              styles[`avatarColor${index % 5}`]
                            }`}
                          >
                            {initials}
                          </div>
                          <span
                            className={styles.memberNameText}
                            data-testid="memberName"
                          >
                            {fullName}
                          </span>
                          <Button
                            variant="plain"
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              setUnassignUserId(member._id);
                              toggleUnassignUserTagModal();
                            }}
                            data-testid="unassignTagBtn"
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })
                  )}
                </InfiniteScroll>
              </div>
            </LoadingState>
          </div>
        </div>
      </div>

      {/* Add People To Tag Modal */}
      <AddPeopleToTag
        addPeopleToTagModalIsOpen={addPeopleToTagModal.isOpen}
        hideAddPeopleToTagModal={addPeopleToTagModal.close}
        refetchAssignedMembersData={userTagAssignedMembersRefetch}
      />
      {/* Assign People To Tags Modal */}
      <TagActions
        tagActionsModalIsOpen={tagActionsModal.isOpen}
        hideTagActionsModal={tagActionsModal.close}
        tagActionType={tagActionType}
      />
      {/* Unassign User Tag Modal */}
      <UnassignUserTagModal
        unassignUserTagModalIsOpen={unassignUserTagModal.isOpen}
        toggleUnassignUserTagModal={toggleUnassignUserTagModal}
        handleUnassignUserTag={handleUnassignUserTag}
      />
      {/* Edit User Tag Modal */}
      <EditUserTagModal
        editUserTagModalIsOpen={editUserTagModal.isOpen}
        hideEditUserTagModal={editUserTagModal.close}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        handleEditUserTag={handleEditUserTag}
      />
      {/* Remove User Tag Modal */}
      <RemoveUserTagModal
        removeUserTagModalIsOpen={removeUserTagModal.isOpen}
        toggleRemoveUserTagModal={removeUserTagModal.close}
        handleRemoveUserTag={handleRemoveUserTag}
      />
    </>
  );
}
export default ManageTag;
