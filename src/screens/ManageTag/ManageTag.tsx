import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, type ApolloError } from '@apollo/client';
import { Search, WarningAmberRounded } from '@mui/icons-material';
import SortIcon from '@mui/icons-material/Sort';
import Loader from 'components/Loader/Loader';
import IconComponent from 'components/IconComponent/IconComponent';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { InterfaceQueryUserTagsAssignedMembers } from 'utils/interfaces';
import styles from './ManageTag.module.css';
import { DataGrid } from '@mui/x-data-grid';
import type {
  InterfaceTagAssignedMembersQuery,
  TagActionType,
} from 'utils/organizationTagsUtils';
import {
  TAGS_QUERY_DATA_CHUNK_SIZE,
  dataGridStyle,
} from 'utils/organizationTagsUtils';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import {
  USER_TAG_ANCESTORS,
  USER_TAGS_ASSIGNED_MEMBERS,
} from 'GraphQl/Queries/userTagQueries';
import AddPeopleToTag from 'components/AddPeopleToTag/AddPeopleToTag';
import TagActions from 'components/TagActions/TagActions';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import EditUserTagModal from './EditUserTagModal';
import RemoveUserTagModal from './RemoveUserTagModal';
import UnassignUserTagModal from './UnassignUserTagModal';

/**
 * Component that renders the Manage Tag screen when the app navigates to '/orgtags/:orgId/managetag/:tagId'.
 *
 * This component does not accept any props and is responsible for displaying
 * the content associated with the corresponding route.
 */

function ManageTag(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'manageTag',
  });
  const { t: tCommon } = useTranslation('common');

  const [unassignUserTagModalIsOpen, setUnassignUserTagModalIsOpen] =
    useState(false);
  const [addPeopleToTagModalIsOpen, setAddPeopleToTagModalIsOpen] =
    useState(false);
  const [tagActionsModalIsOpen, setTagActionsModalIsOpen] = useState(false);
  const [editUserTagModalIsOpen, setEditUserTagModalIsOpen] = useState(false);
  const [removeUserTagModalIsOpen, setRemoveUserTagModalIsOpen] =
    useState(false);

  const { orgId, tagId: currentTagId } = useParams();
  const navigate = useNavigate();
  const [unassignUserId, setUnassignUserId] = useState(null);

  // a state to specify whether we're assigning to tags or removing from tags
  const [tagActionType, setTagActionType] =
    useState<TagActionType>('assignToTags');

  const toggleRemoveUserTagModal = (): void => {
    setRemoveUserTagModalIsOpen(!removeUserTagModalIsOpen);
  };

  const showAddPeopleToTagModal = (): void => {
    setAddPeopleToTagModalIsOpen(true);
  };
  const hideAddPeopleToTagModal = (): void => {
    setAddPeopleToTagModalIsOpen(false);
  };

  const showTagActionsModal = (): void => {
    setTagActionsModalIsOpen(true);
  };
  const hideTagActionsModal = (): void => {
    setTagActionsModalIsOpen(false);
  };

  const showEditUserTagModal = (): void => {
    setEditUserTagModalIsOpen(true);
  };
  const hideEditUserTagModal = (): void => {
    setEditUserTagModalIsOpen(false);
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
    },
  });

  const loadMoreAssignedMembers = (): void => {
    fetchMoreAssignedMembers({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after:
          userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo.pageInfo
            .endCursor,
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
        if (!fetchMoreResult) return prevResult;

        return {
          getAssignedUsers: {
            ...fetchMoreResult.getAssignedUsers,
            usersAssignedTo: {
              ...fetchMoreResult.getAssignedUsers.usersAssignedTo,
              edges: [
                ...prevResult.getAssignedUsers.usersAssignedTo.edges,
                ...fetchMoreResult.getAssignedUsers.usersAssignedTo.edges,
              ],
            },
          },
        };
      },
    });
  };

  const {
    data: orgUserTagAncestorsData,
    loading: orgUserTagsAncestorsLoading,
    refetch: orgUserTagsAncestorsRefetch,
    error: orgUserTagsAncestorsError,
  }: {
    data?: {
      getUserTagAncestors: {
        _id: string;
        name: string;
      }[];
    };
    loading: boolean;
    error?: ApolloError;
    refetch: () => void;
  } = useQuery(USER_TAG_ANCESTORS, {
    variables: {
      id: currentTagId,
    },
  });

  const [unassignUserTag] = useMutation(UNASSIGN_USER_TAG);

  const handleUnassignUserTag = async (): Promise<void> => {
    try {
      await unassignUserTag({
        variables: {
          tagId: currentTagId,
          userId: unassignUserId,
        },
      });

      userTagAssignedMembersRefetch();
      toggleUnassignUserTagModal();
      toast.success(t('successfullyUnassigned') as string);
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
      toast.info(t('changeNameToEdit'));
      return;
    }

    try {
      const { data } = await edit({
        variables: {
          tagId: currentTagId,
          name: newTagName,
        },
      });

      if (data) {
        toast.success(t('tagUpdationSuccess'));
        userTagAssignedMembersRefetch();
        orgUserTagsAncestorsRefetch();
        setEditUserTagModalIsOpen(false);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const [removeUserTag] = useMutation(REMOVE_USER_TAG);
  const handleRemoveUserTag = async (): Promise<void> => {
    try {
      await removeUserTag({
        variables: {
          id: currentTagId,
        },
      });

      navigate(`/orgtags/${orgId}`);
      toggleRemoveUserTagModal();
      toast.success(t('tagRemovalSuccess') as string);
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (userTagAssignedMembersLoading || orgUserTagsAncestorsLoading) {
    return <Loader />;
  }

  if (userTagAssignedMembersError || orgUserTagsAncestorsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            Error occured while loading{' '}
            {userTagAssignedMembersError ? 'assigned users' : 'tag ancestors'}
            <br />
            {userTagAssignedMembersError
              ? userTagAssignedMembersError.message
              : orgUserTagsAncestorsError?.message}
          </h6>
        </div>
      </div>
    );
  }

  const userTagAssignedMembers =
    userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo.edges.map(
      (edge) => edge.node,
    ) ?? /* istanbul ignore next */ [];
  const orgUserTagAncestors = orgUserTagAncestorsData?.getUserTagAncestors;

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/subTags/${tagId}`);
  };
  const redirectToManageTag = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const toggleUnassignUserTagModal = (): void => {
    if (unassignUserTagModalIsOpen) {
      setUnassignUserId(null);
    }
    setUnassignUserTagModalIsOpen(!unassignUserTagModalIsOpen);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: `${styles.tableHeader}`,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.id}</div>;
      },
    },
    {
      field: 'userName',
      headerName: 'User Name',
      flex: 2,
      minWidth: 100,
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div data-testid="memberName">
            {params.row.firstName + ' ' + params.row.lastName}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div>
            <Link
              to={`/member/${orgId}`}
              state={{ id: params.row._id }}
              data-testid="viewProfileBtn"
            >
              <div className="btn btn-sm btn-primary me-3">
                {t('viewProfile')}
              </div>
            </Link>

            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setUnassignUserId(params.row._id);
                toggleUnassignUserTagModal();
              }}
              data-testid="unassignTagBtn"
            >
              {'Unassign'}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpageright}>
          <div className={styles.btnsContainer}>
            <div className={styles.input}>
              <Form.Control
                type="text"
                id="userName"
                className="bg-white"
                placeholder={tCommon('search')}
                data-testid="searchByName"
                autoComplete="off"
                required
              />
              <Button
                tabIndex={-1}
                className={`position-absolute z-10 bottom-0 end-0 h-100 d-flex justify-content-center align-items-center`}
              >
                <Search />
              </Button>
            </div>
            <div className={styles.btnsBlock}>
              <Dropdown
                aria-expanded="false"
                title="Sort People"
                data-testid="sort"
              >
                <Dropdown.Toggle
                  variant="outline-success"
                  data-testid="sortPeople"
                >
                  <SortIcon className={'me-1'} />
                  {tCommon('sort')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item data-testid="latest">
                    {tCommon('Latest')}
                  </Dropdown.Item>
                  <Dropdown.Item data-testid="oldest">
                    {tCommon('Oldest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="success"
                onClick={() => redirectToSubTags(currentTagId as string)}
                className="mx-4"
                data-testid="subTagsBtn"
              >
                {t('subTags')}
              </Button>
            </div>
            <Button
              variant="success"
              onClick={showAddPeopleToTagModal}
              data-testid="addPeopleToTagBtn"
              className="ms-auto"
            >
              <i className={'fa fa-plus me-2'} />
              {t('addPeopleToTag')}
            </Button>
          </div>
          <Row className="mb-4">
            <Col xs={9}>
              <div className="bg-white light border rounded-top mb-0 py-2 d-flex align-items-center">
                <div className="ms-3 my-1">
                  <IconComponent name="Tag" />
                </div>
                <div
                  onClick={() => navigate(`/orgtags/${orgId}`)}
                  className={`fs-6 ms-3 my-1 ${styles.tagsBreadCrumbs}`}
                  data-testid="allTagsBtn"
                >
                  {'Tags'}
                  <i className={'mx-2 fa fa-caret-right'} />
                </div>
                {orgUserTagAncestors?.map((tag, index) => (
                  <div
                    key={index}
                    className={`ms-2 my-1 ${tag._id === currentTagId ? `fs-4 fw-semibold text-secondary` : `${styles.tagsBreadCrumbs} fs-6`}`}
                    onClick={() => redirectToManageTag(tag._id as string)}
                    data-testid="redirectToManageTag"
                  >
                    {tag.name}
                    {orgUserTagAncestors.length - 1 !== index && (
                      /* istanbul ignore next */
                      <i className={'mx-2 fa fa-caret-right'} />
                    )}
                  </div>
                ))}
              </div>
              <div
                id="manageTagScrollableDiv"
                data-testid="manageTagScrollableDiv"
                className={styles.manageTagScrollableDiv}
              >
                <InfiniteScroll
                  dataLength={userTagAssignedMembers?.length ?? 0}
                  next={loadMoreAssignedMembers}
                  hasMore={
                    userTagAssignedMembersData?.getAssignedUsers.usersAssignedTo
                      .pageInfo.hasNextPage ?? /* istanbul ignore next */ false
                  }
                  loader={<InfiniteScrollLoader />}
                  scrollableTarget="manageTagScrollableDiv"
                >
                  <DataGrid
                    disableColumnMenu
                    columnBufferPx={7}
                    hideFooter={true}
                    getRowId={(row) => row.id}
                    slots={{
                      noRowsOverlay: /* istanbul ignore next */ () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {t('noAssignedMembersFound')}
                        </Stack>
                      ),
                    }}
                    sx={dataGridStyle}
                    getRowClassName={() => `${styles.rowBackground}`}
                    autoHeight
                    rowHeight={65}
                    rows={userTagAssignedMembers?.map(
                      (assignedMembers, index) => ({
                        id: index + 1,
                        ...assignedMembers,
                      }),
                    )}
                    columns={columns}
                    isRowSelectable={() => false}
                  />
                </InfiniteScroll>
              </div>
            </Col>
            <Col className="ms-auto" xs={3}>
              <div className="bg-secondary text-white rounded-top mb-0 py-2 fw-semibold ms-2">
                <div className="ms-3 fs-5">{'Actions'}</div>
              </div>
              <div className="d-flex flex-column align-items-center bg-white rounded-bottom mb-0 py-2 fw-semibold ms-2">
                <div
                  onClick={() => {
                    setTagActionType('assignToTags');
                    showTagActionsModal();
                  }}
                  className="my-2 btn btn-primary btn-sm w-75"
                  data-testid="assignToTags"
                >
                  {t('assignToTags')}
                </div>
                <div
                  onClick={() => {
                    setTagActionType('removeFromTags');
                    showTagActionsModal();
                  }}
                  className="mb-1 btn btn-danger btn-sm w-75"
                  data-testid="removeFromTags"
                >
                  {t('removeFromTags')}
                </div>
                <hr
                  style={{
                    borderColor: 'lightgray',
                    borderWidth: '2px',
                    width: '85%',
                  }}
                />
                <div
                  onClick={showEditUserTagModal}
                  className="mt-1 mb-2 btn btn-primary btn-sm w-75"
                  data-testid="editUserTag"
                >
                  {tCommon('edit')}
                </div>
                <div
                  onClick={toggleRemoveUserTagModal}
                  className="mb-2 btn btn-danger btn-sm w-75"
                  data-testid="removeTag"
                >
                  {tCommon('remove')}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Row>

      {/* Add People To Tag Modal */}
      <AddPeopleToTag
        addPeopleToTagModalIsOpen={addPeopleToTagModalIsOpen}
        hideAddPeopleToTagModal={hideAddPeopleToTagModal}
        refetchAssignedMembersData={userTagAssignedMembersRefetch}
        t={t}
        tCommon={tCommon}
      />
      {/* Assign People To Tags Modal */}
      <TagActions
        tagActionsModalIsOpen={tagActionsModalIsOpen}
        hideTagActionsModal={hideTagActionsModal}
        tagActionType={tagActionType}
        t={t}
        tCommon={tCommon}
      />
      {/* Unassign User Tag Modal */}
      <UnassignUserTagModal
        unassignUserTagModalIsOpen={unassignUserTagModalIsOpen}
        toggleUnassignUserTagModal={toggleUnassignUserTagModal}
        handleUnassignUserTag={handleUnassignUserTag}
        t={t}
        tCommon={tCommon}
      />
      {/* Edit User Tag Modal */}
      <EditUserTagModal
        editUserTagModalIsOpen={editUserTagModalIsOpen}
        hideEditUserTagModal={hideEditUserTagModal}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        handleEditUserTag={handleEditUserTag}
        t={t}
        tCommon={tCommon}
      />
      {/* Remove User Tag Modal */}
      <RemoveUserTagModal
        removeUserTagModalIsOpen={removeUserTagModalIsOpen}
        toggleRemoveUserTagModal={toggleRemoveUserTagModal}
        handleRemoveUserTag={handleRemoveUserTag}
        t={t}
        tCommon={tCommon}
      />
    </>
  );
}
export default ManageTag;
