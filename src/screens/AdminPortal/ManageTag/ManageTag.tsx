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
 * - `react-bootstrap` for UI components.
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
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useNavigate, useParams, Link } from 'react-router';
import { Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Button from 'shared-components/Button/Button';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './ManageTag.module.css';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import type {
  InterfaceTagAssignedMembersQuery,
  TagActionType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import AddPeopleToTag from 'components/AdminPortal/AddPeopleToTag/AddPeopleToTag';
import TagActions from 'components/AdminPortal/TagActions/TagActions';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { useModalState } from 'shared-components/CRUDModalTemplate';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

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

  const [unassignUserId, setUnassignUserId] = useState<string | null>(null);
  const [assignedMemberSearchInput, setAssignedMemberSearchInput] =
    useState('');
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
  }: InterfaceTagAssignedMembersQuery = useQuery(USER_TAGS_ASSIGNED_MEMBERS, {
    variables: {
      id: currentTagId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
    },
    fetchPolicy: 'no-cache',
  });

  const [unassignUserTag, { loading: unassignUserTagLoading }] =
    useMutation(UNASSIGN_USER_TAG);

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

  const currentTagName =
    userTagAssignedMembersData?.getAssignedUsers.name ?? '';

  const userTagAssignedMembers =
    userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo?.edges?.map(
      (edge) => edge.node,
    ) ?? [];

  const filteredAssignedMembers = userTagAssignedMembers.filter((member) =>
    (member.name ?? '')
      .toLowerCase()
      .startsWith(assignedMemberSearchInput.toLowerCase()),
  );

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...(userTagAssignedMembersData?.getAssignedUsers?.ancestorTags ?? []),
    { _id: currentTagId, name: currentTagName },
  ];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
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

  const columns: IColumnDef<(typeof filteredAssignedMembers)[number]>[] = [
    {
      id: 'sl_no',
      header: tCommon('sl_no'),
      accessor: '_id',
      render: (_value, row) => <span>{rowIndexMap.get(row._id) ?? 0}.</span>,
      meta: {
        sortable: false,
        align: 'center',
        width: 'var(--space-13)',
      },
    },
    {
      id: 'userName',
      header: tCommon('userName'),
      accessor: 'name',
      render: (value) => (
        <span data-testid="memberName" className={styles.memberNameText}>
          {String(value ?? '')}
        </span>
      ),
      meta: { sortable: false, align: 'left' },
    },
    {
      id: 'actions',
      header: tCommon('actions'),
      accessor: '_id',
      render: (_value, row) => {
        return (
          <div className={styles.tableActionButtons}>
            <Link
              to={`/admin/member/${orgId}/${row?._id}`}
              state={{ id: row?._id }}
              data-testid="viewProfileBtn"
            >
              <div className={`btn btn-sm btn-primary ${styles.editButton}`}>
                {t('viewProfile')}
              </div>
            </Link>

            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => {
                setUnassignUserId(row?._id);
                toggleUnassignUserTagModal();
              }}
              data-testid="unassignTagBtn"
              className={styles.unassignButton}
            >
              {tCommon('unassign')}
            </Button>
          </div>
        );
      },
      meta: {
        sortable: false,
        align: 'center',
        width: 'var(--space-21)',
      },
    },
  ];

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div
            className={styles.topBreadcrumb}
            data-testid="manage-tag-top-breadcrumb"
          >
            <Button
              variant="link"
              className={styles.topBreadcrumbLink}
              onClick={() => navigate(`/admin/orgtags/${orgId}`)}
              data-testid="allTagsBtn"
              aria-label={t('tags')}
            >
              {t('tags')}
            </Button>
            {orgUserTagAncestors.map((tag, index) => {
              const isLast = index === orgUserTagAncestors.length - 1;
              return (
                <div
                  key={tag._id ?? index}
                  className={styles.topBreadcrumbItemWrap}
                >
                  <span className={styles.topBreadcrumbSeparator}>/</span>
                  {isLast ? (
                    <span className={styles.topBreadcrumbCurrent}>
                      {tag.name}
                    </span>
                  ) : (
                    <Button
                      variant="link"
                      className={styles.topBreadcrumbLink}
                      onClick={() => redirectToManageTag(tag._id as string)}
                      data-testid="redirectToManageTag"
                    >
                      {tag.name}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.btnsContainer}>
            <div className={styles.searchBarGrow}>
              <SearchFilterBar
                hasDropdowns={false}
                searchPlaceholder={tCommon('searchByName')}
                searchValue={assignedMemberSearchInput}
                onSearchChange={(term) =>
                  setAssignedMemberSearchInput(term.trim())
                }
                searchInputTestId="searchInput"
                searchButtonTestId="searchBtn"
              />
            </div>
            <Button
              variant="success"
              onClick={addPeopleToTagModal.open}
              data-testid="addPeopleToTagBtn"
              className={styles.createButton}
            >
              <i className={'fa fa-plus me-2'} />
              {t('addPeopleToTag')}
            </Button>
          </div>

          <LoadingState
            isLoading={userTagAssignedMembersLoading}
            variant="spinner"
          >
            <Row className="mb-4">
              <Col xs={9}>
                <div
                  id="manageTagScrollableDiv"
                  data-testid="manageTagScrollableDiv"
                  className={styles.manageTagScrollableDiv}
                >
                  {!userTagAssignedMembersLoading &&
                  filteredAssignedMembers.length === 0 ? (
                    <EmptyState
                      icon="User"
                      message={t('noAssignedMembersFound')}
                      dataTestId="manage-tag-empty-state"
                    />
                  ) : (
                    <DataTable
                      data={filteredAssignedMembers}
                      columns={columns}
                      loading={userTagAssignedMembersLoading}
                      rowKey="_id"
                      paginationMode="client"
                      pageSize={PAGE_SIZE}
                      tableClassName={styles.listTable}
                    />
                  )}
                </div>
              </Col>
              <Col className="ms-auto" xs={3}>
                <div className="bg-secondary text-white rounded-top mb-0 py-2 fw-semibold ms-2">
                  <div className="ms-3 fs-5">{tCommon('actions')}</div>
                </div>
                <div className="d-flex flex-column align-items-center bg-white rounded-bottom mb-0 py-2 fw-semibold ms-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setTagActionType('assignToTags');
                      tagActionsModal.open();
                    }}
                    className={styles.assignTagActionButton}
                    data-testid="assignToTags"
                  >
                    <span className={styles.actionButtonContent}>
                      <i
                        className={`fa fa-tag ${styles.actionButtonIcon}`}
                        aria-hidden="true"
                      />
                      <span>{t('assignToTags')}</span>
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setTagActionType('removeFromTags');
                      tagActionsModal.open();
                    }}
                    className={styles.removeTagActionButton}
                    data-testid="removeFromTags"
                  >
                    <span className={styles.actionButtonContent}>
                      <i
                        className={`fa fa-tag ${styles.actionButtonIcon}`}
                        aria-hidden="true"
                      />
                      <span>{t('removeFromTags')}</span>
                    </span>
                  </Button>
                  <hr className={styles.tagActionsDivider} />
                </div>
              </Col>
            </Row>
          </LoadingState>
        </div>
      </Row>

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
    </>
  );
}
export default ManageTag;
