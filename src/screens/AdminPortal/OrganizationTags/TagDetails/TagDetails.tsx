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
 * - Native HTML tables and custom design components for UI.
 * - `react-toastify` for notifications.
 * - Custom components like `AddPeopleToTag`, `TagActions`, `EditTagModal`, etc.
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
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useNavigate, useParams, Link } from 'react-router';
import Button from 'shared-components/Button/Button';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './TagDetails.module.css';
import { useTableData } from 'shared-components/DataTable/hooks/useTableData';
import type { Key } from 'types/shared-components/DataTable/interface';
import type { TagActionType } from 'utils/organizationTagsUtils';
import type {
  InterfaceAssignedMemberRow,
  InterfaceManageTagQueryData,
} from 'types/AdminPortal/ManageTag/interface';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import AddMembersModal from 'components/AdminPortal/Tags/Modals/AddMembersModal/AddMembersModal';
import BulkTagActions from 'components/AdminPortal/Tags/BulkTagActions/BulkTagActions';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import TableLoader from 'shared-components/TableLoader/TableLoader';

export const getManageTagErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  return String(error);
};

function TagDetails(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tOrganizationTags } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');
  const { orgId, tagId: currentTagId } = useParams();
  const navigate = useNavigate();

  const unassignUserTagModal = useModalState();
  const addPeopleToTagModal = useModalState();
  const tagActionsModal = useModalState();

  const [unassignUserIds, setUnassignUserIds] = useState<string[]>([]);
  const [selectedMemberKeys, setSelectedMemberKeys] = useState<
    ReadonlySet<Key>
  >(new Set());
  const [assignedMemberSearchInput, setAssignedMemberSearchInput] =
    useState('');
  // a state to specify whether we're assigning to tags or removing from tags
  const [tagActionType, setTagActionType] =
    useState<TagActionType>('assignToTags');

  const toggleUnassignUserTagModal = (): void => {
    if (unassignUserTagModal.isOpen) {
      setUnassignUserIds([]);
    }
    unassignUserTagModal.toggle();
  };

  const userTagAssignedMembersQuery = useQuery<InterfaceManageTagQueryData>(
    USER_TAGS_ASSIGNED_MEMBERS,
    {
      variables: {
        id: currentTagId,
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const {
    rows: userTagAssignedMembers,
    loading: userTagAssignedMembersLoading,
    error: userTagAssignedMembersError,
    refetch: userTagAssignedMembersRefetch,
  } = useTableData<
    InterfaceAssignedMemberRow,
    InterfaceAssignedMemberRow,
    InterfaceManageTagQueryData
  >(userTagAssignedMembersQuery, {
    path: (data) => data?.getAssignedUsers?.usersAssignedTo,
  });

  const userTagAssignedMembersData = userTagAssignedMembersQuery.data;

  const [unassignUserTag, { loading: unassignUserTagLoading }] =
    useMutation(UNASSIGN_USER_TAG);

  const handleUnassignUserTag = async (): Promise<void> => {
    try {
      const batchErrors: string[] = [];

      for (const userId of unassignUserIds) {
        try {
          await unassignUserTag({
            variables: { tagId: currentTagId, userId },
          });
        } catch (error: unknown) {
          batchErrors.push(getManageTagErrorMessage(error));
        }
      }

      if (batchErrors.length > 0) {
        NotificationToast.error(batchErrors[0]);
        return;
      }

      userTagAssignedMembersRefetch();
      setSelectedMemberKeys(new Set());
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

  const currentTagName =
    userTagAssignedMembersData?.getAssignedUsers.name ?? '';

  const filteredAssignedMembers = userTagAssignedMembers.filter((member) =>
    (member.name ?? '')
      .toLowerCase()
      .startsWith(assignedMemberSearchInput.toLowerCase()),
  );

  const folderBreadcrumbs = useMemo(() => {
    const breadcrumbs: Array<{ id: string; name: string }> = [];
    let currentFolder = userTagAssignedMembersData?.getAssignedUsers?.folder;

    while (currentFolder) {
      breadcrumbs.unshift({ id: currentFolder._id, name: currentFolder.name });
      currentFolder = currentFolder.parentFolder ?? null;
    }

    return breadcrumbs;
  }, [userTagAssignedMembersData]);

  const redirectToFolder = (folderId: string): void => {
    navigate(`/admin/orgtags/${orgId}/tags/${folderId}`);
  };

  const handleBulkUnassignClick = (): void => {
    const selectedIds = Array.from(selectedMemberKeys).map((key) =>
      String(key),
    );

    if (selectedIds.length === 0) {
      NotificationToast.error(t('noOneSelected'));
      return;
    }

    setUnassignUserIds(selectedIds);
    unassignUserTagModal.open();
  };

  const rowIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredAssignedMembers.forEach((member, index) => {
      map.set(member._id, index + 1);
    });
    return map;
  }, [filteredAssignedMembers]);

  if (userTagAssignedMembersError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className="fw-bold text-danger text-center">
            {t('errorLoadingAssignedMembers')}
          </h6>
        </div>
      </div>
    );
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMemberKeys(new Set(filteredAssignedMembers.map((m) => m._id)));
    } else {
      setSelectedMemberKeys(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedMemberKeys);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedMemberKeys(next);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <div
            className={styles.topBreadcrumb}
            data-testid="manage-tag-top-breadcrumb"
          >
            <button
              className={`btn btn-link ${styles.topBreadcrumbLink}`}
              onClick={() => navigate(`/admin/orgtags/${orgId}`)}
              data-testid="allTagsBtn"
            >
              {tOrganizationTags('tags')}
            </button>
            {folderBreadcrumbs.map((folder) => (
              <div key={folder.id} className={styles.topBreadcrumbItemWrap}>
                <span
                  className={styles.topBreadcrumbSeparator}
                  aria-hidden="true"
                />
                <button
                  className={`btn btn-link ${styles.topBreadcrumbLink}`}
                  onClick={() => redirectToFolder(folder.id)}
                  data-testid="redirectToFolder"
                >
                  {folder.name}
                </button>
              </div>
            ))}
            {currentTagName && (
              <div className={styles.topBreadcrumbItemWrap}>
                <span
                  className={styles.topBreadcrumbSeparator}
                  aria-hidden="true"
                />
                <span className={styles.topBreadcrumbCurrent}>
                  {currentTagName}
                </span>
              </div>
            )}
          </div>
          <h1 className="page-title">{currentTagName || tCommon('manage')}</h1>
          <p className="page-subtitle">
            {tCommon('manage')} {tOrganizationTags('tags')}
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={addPeopleToTagModal.open}
            data-testid="addPeopleToTagBtn"
          >
            + {t('addPeopleToTag')}
          </button>
        </div>
      </div>

      <div
        className="toolbar"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          className="search-input"
          placeholder={tCommon('searchByName')}
          value={assignedMemberSearchInput}
          onChange={(e) => setAssignedMemberSearchInput(e.target.value.trim())}
          data-testid="searchInput"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
          }}
        />
      </div>

      <LoadingState isLoading={userTagAssignedMembersLoading} variant="spinner">
        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <div
              id="manageTagScrollableDiv"
              data-testid="manageTagScrollableDiv"
              className={styles.manageTagScrollableDiv}
            >
              {!userTagAssignedMembersLoading &&
              filteredAssignedMembers.length === 0 ? (
                <div className="card">
                  <EmptyState
                    icon="User"
                    message={t('noAssignedMembersFound')}
                    dataTestId="manage-tag-empty-state"
                  />
                </div>
              ) : (
                <div className="table-wrapper">
                  <table
                    className="data-table"
                    aria-label={t('assignedMembers')}
                  >
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          style={{ width: 'calc(48px)', textAlign: 'center' }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              filteredAssignedMembers.length > 0 &&
                              selectedMemberKeys.size ===
                                filteredAssignedMembers.length
                            }
                            onChange={handleSelectAll}
                            aria-label="Select All"
                          />
                        </th>
                        <th scope="col">#</th>
                        <th scope="col">{tCommon('userName')}</th>
                        <th scope="col" style={{ textAlign: 'center' }}>
                          {tCommon('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignedMembers.map((row) => (
                        <tr
                          key={row._id}
                          className={
                            selectedMemberKeys.has(row._id) ? 'selected' : ''
                          }
                        >
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={selectedMemberKeys.has(row._id)}
                              onChange={() => handleSelectRow(row._id)}
                              aria-label={`Select ${row.name}`}
                            />
                          </td>
                          <td>
                            <span className={styles.tableItemIndex}>
                              {(rowIndexMap.get(row._id) ?? 0).toString()}.
                            </span>
                          </td>
                          <td>
                            <span
                              data-testid="memberName"
                              className={styles.memberNameText}
                            >
                              {row.name ?? ''}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <Link
                              to={`/admin/member/${orgId}/${row._id}`}
                              state={{ id: row._id }}
                              data-testid="viewProfileBtn"
                              className="btn btn-secondary btn-sm"
                            >
                              {t('viewProfile')}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsPanel}>
            <div className={styles.actionsPanelHeader}>
              <div className={styles.actionsPanelTitle}>
                {tCommon('actions')}
              </div>
            </div>
            <div className={styles.actionsPanelBody}>
              <button
                type="button"
                className={`btn ${styles.assignTagActionButton}`}
                onClick={() => {
                  setTagActionType('assignToTags');
                  tagActionsModal.open();
                }}
                data-testid="assignToTags"
              >
                <div className={styles.actionButtonContent}>
                  <i
                    className={`fa fa-tag ${styles.actionButtonIcon}`}
                    aria-hidden="true"
                  />
                  <span>{t('moveToTags')}</span>
                </div>
              </button>
              <button
                type="button"
                className={`btn ${styles.removeTagActionButton}`}
                onClick={() => {
                  setTagActionType('removeFromTags');
                  tagActionsModal.open();
                }}
                data-testid="removeFromTags"
              >
                <div className={styles.actionButtonContent}>
                  <i
                    className={`fa fa-tag ${styles.actionButtonIcon}`}
                    aria-hidden="true"
                  />
                  <span>{t('removeFromTags')}</span>
                </div>
              </button>
              <hr className={styles.tagActionsDivider} />
              <button
                type="button"
                className={`btn ${styles.bulkUnassignActionButton}`}
                onClick={handleBulkUnassignClick}
                data-testid="bulkUnassignBtn"
                disabled={selectedMemberKeys.size === 0}
              >
                <div className={styles.actionButtonContent}>
                  <i
                    className={`fa fa-user-minus ${styles.actionButtonIcon}`}
                    aria-hidden="true"
                  />
                  <span>{`${tCommon('unassign')} ${tCommon('selected')}`}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </LoadingState>

      {/* Add People To Tag Modal */}
      <AddMembersModal
        addPeopleToTagModalIsOpen={addPeopleToTagModal.isOpen}
        hideAddPeopleToTagModal={addPeopleToTagModal.close}
        refetchAssignedMembersData={userTagAssignedMembersRefetch}
      />
      {/* Move/Remove People To Tags Modal */}
      <BulkTagActions
        tagActionsModalIsOpen={tagActionsModal.isOpen}
        hideTagActionsModal={tagActionsModal.close}
        tagActionType={tagActionType}
        assigneeIds={userTagAssignedMembers.map((member) => member._id)}
      />
      <DeleteModal
        open={unassignUserTagModal.isOpen}
        title={t('unassignUserTag')}
        onClose={toggleUnassignUserTagModal}
        onDelete={handleUnassignUserTag}
        loading={unassignUserTagLoading}
      >
        <p>{t('unassignUserTagMessage')}</p>
      </DeleteModal>
    </div>
  );
}
export default TagDetails;
