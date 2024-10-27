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
import Modal from 'react-bootstrap/Modal';
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
  TAGS_QUERY_PAGE_SIZE,
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

  const [unassignTagModalIsOpen, setUnassignTagModalIsOpen] = useState(false);

  const [addPeopleToTagModalIsOpen, setAddPeopleToTagModalIsOpen] =
    useState(false);
  const [assignToTagsModalIsOpen, setAssignToTagsModalIsOpen] = useState(false);

  const [editTagModalIsOpen, setEditTagModalIsOpen] = useState(false);
  const [removeTagModalIsOpen, setRemoveTagModalIsOpen] = useState(false);

  const { orgId, tagId: currentTagId } = useParams();
  const navigate = useNavigate();

  const [unassignUserId, setUnassignUserId] = useState(null);

  // a state to specify whether we're assigning to tags or removing from tags
  const [tagActionType, setTagActionType] =
    useState<TagActionType>('assignToTags');

  const toggleRemoveUserTagModal = (): void => {
    setRemoveTagModalIsOpen(!removeTagModalIsOpen);
  };

  const showAddPeopleToTagModal = (): void => {
    setAddPeopleToTagModalIsOpen(true);
  };

  const hideAddPeopleToTagModal = (): void => {
    setAddPeopleToTagModalIsOpen(false);
  };

  const showAssignToTagsModal = (): void => {
    setAssignToTagsModalIsOpen(true);
  };

  const hideAssignToTagsModal = (): void => {
    setAssignToTagsModalIsOpen(false);
  };

  const hideEditTagModal = (): void => {
    setEditTagModalIsOpen(false);
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
      first: TAGS_QUERY_PAGE_SIZE,
    },
  });

  const loadMoreAssignedMembers = (): void => {
    fetchMoreAssignedMembers({
      variables: {
        first: TAGS_QUERY_PAGE_SIZE,
        after:
          userTagAssignedMembersData?.getUserTag.usersAssignedTo.pageInfo
            .endCursor, // Fetch after the last loaded cursor
      },
      updateQuery: (
        prevResult: { getUserTag: InterfaceQueryUserTagsAssignedMembers },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: {
            getUserTag: InterfaceQueryUserTagsAssignedMembers;
          };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          getUserTag: {
            ...fetchMoreResult.getUserTag,
            usersAssignedTo: {
              ...fetchMoreResult.getUserTag.usersAssignedTo,
              edges: [
                ...prevResult.getUserTag.usersAssignedTo.edges,
                ...fetchMoreResult.getUserTag.usersAssignedTo.edges,
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

  const handleUnassignTag = async (): Promise<void> => {
    try {
      await unassignUserTag({
        variables: {
          tagId: currentTagId,
          userId: unassignUserId,
        },
      });

      userTagAssignedMembersRefetch();
      toggleUnassignTagModal();
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

  useEffect(() => {
    setNewTagName(userTagAssignedMembersData?.getUserTag.name ?? '');
  }, [userTagAssignedMembersData]);

  const editTag = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

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
        setEditTagModalIsOpen(false);
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
    userTagAssignedMembersData?.getUserTag.usersAssignedTo.edges.map(
      (edge) => edge.node,
    );

  const orgUserTagAncestors = orgUserTagAncestorsData?.getUserTagAncestors;

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/subTags/${tagId}`);
  };

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/orgtags/${orgId}/managetag/${tagId}`);
  };

  const toggleUnassignTagModal = (): void => {
    if (unassignTagModalIsOpen) {
      setUnassignUserId(null);
    }
    setUnassignTagModalIsOpen(!unassignTagModalIsOpen);
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
          <div className="d-flex justify-content-center align-items-center">
            <Link
              to={`/member/${orgId}`}
              state={{ id: params.row._id }}
              className={styles.membername}
              data-testid="viewProfileBtn"
            >
              <div className="btn btn-sm btn-primary">{t('viewProfile')}</div>
            </Link>

            <Button
              size="sm"
              variant="danger"
              className={`ms-2`}
              onClick={() => {
                setUnassignUserId(params.row._id);
                toggleUnassignTagModal();
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
          </div>

          <Row className="mb-4">
            <Col xs={9}>
              <div className="bg-white light border border-bottom-0 rounded-top mb-0 py-2 d-flex align-items-center">
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
              <InfiniteScroll
                dataLength={userTagAssignedMembers?.length ?? 0} // This is important field to render the next data
                next={loadMoreAssignedMembers}
                hasMore={
                  userTagAssignedMembersData?.getUserTag.usersAssignedTo
                    .pageInfo.hasNextPage ?? false
                }
                loader={
                  <div className="simpleLoader">
                    <div className="spinner" />
                  </div>
                }
              >
                <DataGrid
                  disableColumnMenu
                  columnBufferPx={7}
                  hideFooter={true}
                  getRowId={(row) => row._id}
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
            </Col>

            <Col className="ms-auto" xs={3}>
              <div className="bg-secondary text-white rounded-top mb-0 py-2 fw-semibold ms-2">
                <div className="ms-3 fs-5">{'Actions'}</div>
              </div>
              <div className="bg-white rounded-bottom mb-0 py-2 fw-semibold ms-2">
                <div
                  onClick={() => {
                    setTagActionType('assignToTags');
                    showAssignToTagsModal();
                  }}
                  className="ms-5 mt-2 mb-2 btn btn-primary btn-sm w-75"
                  data-testid="assignToTags"
                >
                  {t('assignToTags')}
                </div>
                <div
                  onClick={() => {
                    setTagActionType('removeFromTags');
                    showAssignToTagsModal();
                  }}
                  className="ms-5 mb-3 btn btn-danger btn-sm w-75"
                  data-testid="removeFromTags"
                >
                  {t('removeFromTags')}
                </div>

                <hr className="mb-1 mt-2" />

                <div
                  onClick={() => {
                    setEditTagModalIsOpen(true);
                  }}
                  className="ms-5 mt-3 mb-2 btn btn-primary btn-sm w-75"
                  data-testid="editTag"
                >
                  {tCommon('edit')}
                </div>
                <div
                  onClick={() => {
                    setRemoveTagModalIsOpen(true);
                  }}
                  className="ms-5 mb-2 btn btn-danger btn-sm w-75"
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
        assignToTagsModalIsOpen={assignToTagsModalIsOpen}
        hideAssignToTagsModal={hideAssignToTagsModal}
        tagActionType={tagActionType}
        t={t}
        tCommon={tCommon}
      />

      {/* Unassign Tag Modal */}
      <Modal
        size="sm"
        id={`unassignTagModal`}
        show={unassignTagModalIsOpen}
        onHide={toggleUnassignTagModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`unassignTag`}>
            {t('unassignUserTag')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('unassignUserTagMessage')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleUnassignTagModal}
            data-testid="unassignTagModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={handleUnassignTag}
            data-testid="unassignTagModalSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        show={editTagModalIsOpen}
        onHide={hideEditTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className="bg-primary"
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('tagDetails')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={editTag}>
          <Modal.Body>
            <Form.Label htmlFor="tagName">{t('tagName')}</Form.Label>
            <Form.Control
              type="name"
              id="orgname"
              className="mb-3"
              placeholder={t('tagNamePlaceholder')}
              data-testid="tagNameInput"
              autoComplete="off"
              required
              value={newTagName}
              onChange={(e): void => {
                setNewTagName(e.target.value);
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(): void => hideEditTagModal()}
              data-testid="closeEditTagModalBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" value="invite" data-testid="editTagSubmitBtn">
              {tCommon('edit')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Remove User Tag Modal */}
      <Modal
        size="sm"
        id={`deleteActionItemModal`}
        show={removeTagModalIsOpen}
        onHide={toggleRemoveUserTagModal}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white" id={`deleteActionItem`}>
            {t('removeUserTag')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('removeUserTagMessage')}</Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            onClick={toggleRemoveUserTagModal}
            data-testid="removeUserTagModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={handleRemoveUserTag}
            data-testid="removeUserTagSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageTag;
