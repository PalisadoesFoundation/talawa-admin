import { useMutation, useQuery } from '@apollo/client';
import type { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import type { InterfaceQueryUserTagsMembersToAssignTo } from 'utils/interfaces';
import styles from '../../style/app.module.css';
import type { InterfaceTagUsersToAssignToQuery } from 'utils/organizationTagsUtils';
import {
  TAGS_QUERY_DATA_CHUNK_SIZE,
  dataGridStyle,
} from 'utils/organizationTagsUtils';
import { Stack } from '@mui/material';
import { toast } from 'react-toastify';
import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import type { TFunction } from 'i18next';

/** * Props for the `AddPeopleToTag` component.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.editButton`
 * - `.modalHeader`
 * - `.inputField`
 * - `.addButton`
 * - `.removeButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */

export interface InterfaceAddPeopleToTagProps {
  addPeopleToTagModalIsOpen: boolean;
  hideAddPeopleToTagModal: () => void;
  refetchAssignedMembersData: () => void;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
}

interface InterfaceMemberData {
  _id: string;
  firstName: string;
  lastName: string;
}

const AddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
  refetchAssignedMembersData,
  t,
  tCommon,
}) => {
  const { tagId: currentTagId } = useParams();

  const { t: tErrors } = useTranslation('error');

  const [assignToMembers, setAssignToMembers] = useState<InterfaceMemberData[]>(
    [],
  );

  const [memberToAssignToSearchFirstName, setMemberToAssignToSearchFirstName] =
    useState('');
  const [memberToAssignToSearchLastName, setMemberToAssignToSearchLastName] =
    useState('');

  const {
    data: userTagsMembersToAssignToData,
    loading: userTagsMembersToAssignToLoading,
    error: userTagsMembersToAssignToError,
    refetch: userTagsMembersToAssignToRefetch,
    fetchMore: fetchMoreMembersToAssignTo,
  }: InterfaceTagUsersToAssignToQuery = useQuery(
    USER_TAGS_MEMBERS_TO_ASSIGN_TO,
    {
      variables: {
        id: currentTagId,
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: memberToAssignToSearchFirstName },
          lastName: { starts_with: memberToAssignToSearchLastName },
        },
      },
      skip: !addPeopleToTagModalIsOpen,
    },
  );

  useEffect(() => {
    setMemberToAssignToSearchFirstName('');
    setMemberToAssignToSearchLastName('');
    userTagsMembersToAssignToRefetch();
  }, [addPeopleToTagModalIsOpen]);

  const loadMoreMembersToAssignTo = (): void => {
    fetchMoreMembersToAssignTo({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after:
          userTagsMembersToAssignToData?.getUsersToAssignTo.usersToAssignTo
            .pageInfo.endCursor, // Fetch after the last loaded cursor
      },
      updateQuery: (
        prevResult: {
          getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
        },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult: {
            getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
          };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          getUsersToAssignTo: {
            ...fetchMoreResult.getUsersToAssignTo,
            usersToAssignTo: {
              ...fetchMoreResult.getUsersToAssignTo.usersToAssignTo,
              edges: [
                ...prevResult.getUsersToAssignTo.usersToAssignTo.edges,
                ...fetchMoreResult.getUsersToAssignTo.usersToAssignTo.edges,
              ],
            },
          },
        };
      },
    });
  };

  const userTagMembersToAssignTo =
    userTagsMembersToAssignToData?.getUsersToAssignTo.usersToAssignTo.edges.map(
      (edge) => edge.node,
    ) ?? [];

  const handleAddOrRemoveMember = (member: InterfaceMemberData): void => {
    setAssignToMembers((prevMembers) => {
      const isAssigned = prevMembers.some((m) => m._id === member._id);
      if (isAssigned) {
        return prevMembers.filter((m) => m._id !== member._id);
      } else {
        return [...prevMembers, member];
      }
    });
  };

  const removeMember = (id: string): void => {
    setAssignToMembers((prevMembers) =>
      prevMembers.filter((m) => m._id !== id),
    );
  };

  const [addPeople, { loading: addPeopleToTagLoading }] =
    useMutation(ADD_PEOPLE_TO_TAG);

  const addPeopleToCurrentTag = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!assignToMembers.length) {
      toast.error(t('noOneSelected'));
      return;
    }

    try {
      const { data } = await addPeople({
        variables: {
          tagId: currentTagId,
          userIds: assignToMembers.map((member) => member._id),
        },
      });

      if (data) {
        toast.success(t('successfullyAssignedToPeople'));
        refetchAssignedMembersData();
        hideAddPeopleToTagModal();
        setAssignToMembers([]);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : tErrors('unknownError');
      toast.error(errorMessage);
    }
  };

  if (userTagsMembersToAssignToError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6
            className={`${styles['fw-bold']} ${styles['text-danger']} text-center`}
          >
            {t('errorOccurredWhileLoadingMembers')}
            <br />
            {userTagsMembersToAssignToError.message}
          </h6>
        </div>
      </div>
    );
  }

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
      headerName: t('userName'),
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
      headerName: t('actions'),
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const isToBeAssigned = assignToMembers.some(
          (member) => member._id === params.row._id,
        );

        return (
          <Button
            size="sm"
            onClick={() => handleAddOrRemoveMember(params.row)}
            data-testid={
              isToBeAssigned ? 'deselectMemberBtn' : 'selectMemberBtn'
            }
            // variant={!isToBeAssigned ? 'primary' : 'danger'}
            className={
              !isToBeAssigned ? styles.editButton : `btn btn-danger btn-sm`
            }
          >
            {isToBeAssigned ? 'x' : '+'}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        show={addPeopleToTagModalIsOpen}
        onHide={hideAddPeopleToTagModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className={`${styles['bg-primary']} ${styles.modalHeader}`}
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className={`${styles['text-white']}`}>
            {t('addPeople')}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={addPeopleToCurrentTag}>
          <Modal.Body>
            <div
              className={`${styles['d-flex']} ${styles['flex-wrap']} ${styles['align-items-center']} ${styles['border']} ${styles['border-2']} ${styles['border-dark-subtle']} ${styles['bg-light-subtle']} ${styles['rounded-3']} ${styles['p-2']} ${styles['scrollContainer']}`}
            >
              {assignToMembers.length === 0 ? (
                <div
                  className={`${styles['text-body-tertiary']} ${styles['mx-auto']}`}
                >
                  {t('noOneSelected')}
                </div>
              ) : (
                assignToMembers.map((member) => (
                  <div
                    key={member._id}
                    className={`${styles['badge']} ${styles['bg-dark-subtle']} ${styles['text-secondary-emphasis']} ${styles['lh-lg']} ${styles['my-2']} ${styles['ms-2']} ${styles['d-flex']} ${styles['align-items-center']} ${styles['memberBadge']}`}
                  >
                    {member.firstName} {member.lastName}
                    <i
                      className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary`}
                      onClick={() => removeMember(member._id)}
                      data-testid="clearSelectedMember"
                    />
                  </div>
                ))
              )}
            </div>

            <div className={`${styles['my-3']} ${styles['d-flex']}`}>
              <div
                className={`${styles['me-2']} ${styles['position-relative']}`}
              >
                <i
                  className={`${styles['fa']} ${styles['fa-search']} ${styles['position-absolute']} ${styles['text-body-tertiary']} ${styles['end-0']} ${styles['top-50']} ${styles['translate-middle']}`}
                />
                <Form.Control
                  type="text"
                  id="firstName"
                  className={`${styles['bg-light']} ${styles['inputField']}`}
                  placeholder={tCommon('firstName')}
                  onChange={(e) =>
                    setMemberToAssignToSearchFirstName(e.target.value.trim())
                  }
                  data-testid="searchByFirstName"
                  autoComplete="off"
                />
              </div>
              <div
                className={`${styles['mx-2']} ${styles['position-relative']}`}
              >
                <i
                  className={`${styles['fa']} ${styles['fa-search']} ${styles['position-absolute']} ${styles['text-body-tertiary']} ${styles['end-0']} ${styles['top-50']} ${styles['translate-middle']}`}
                />
                <Form.Control
                  type="text"
                  id="lastName"
                  className={`${styles['bg-light']} ${styles.inputField}`}
                  placeholder={tCommon('lastName')}
                  onChange={(e) =>
                    setMemberToAssignToSearchLastName(e.target.value.trim())
                  }
                  data-testid="searchByLastName"
                  autoComplete="off"
                />
              </div>
            </div>

            {userTagsMembersToAssignToLoading ? (
              <div className={styles.loadingDiv}>
                <InfiniteScrollLoader />
              </div>
            ) : (
              <>
                <div
                  id="addPeopleToTagScrollableDiv"
                  data-testid="addPeopleToTagScrollableDiv"
                  style={{
                    height: 300,
                    overflow: 'auto',
                  }}
                >
                  <InfiniteScroll
                    dataLength={userTagMembersToAssignTo?.length ?? 0} // This is important field to render the next data
                    next={loadMoreMembersToAssignTo}
                    hasMore={
                      userTagsMembersToAssignToData?.getUsersToAssignTo
                        .usersToAssignTo.pageInfo.hasNextPage ?? false
                    }
                    loader={<InfiniteScrollLoader />}
                    scrollableTarget="addPeopleToTagScrollableDiv"
                  >
                    <DataGrid
                      disableColumnMenu
                      columnBufferPx={7}
                      hideFooter={true}
                      getRowId={(row) => row.id}
                      slots={{
                        noRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {t('noMoreMembersFound')}
                          </Stack>
                        ),
                      }}
                      sx={{
                        ...dataGridStyle,
                        '& .MuiDataGrid-topContainer': {
                          position: 'static',
                        },
                        '& .MuiDataGrid-virtualScrollerContent': {
                          marginTop: '0',
                        },
                      }}
                      getRowClassName={() => `${styles.rowBackground}`}
                      autoHeight
                      rowHeight={65}
                      rows={userTagMembersToAssignTo?.map(
                        (membersToAssignTo, index) => ({
                          id: index + 1,
                          ...membersToAssignTo,
                        }),
                      )}
                      columns={columns}
                      isRowSelectable={() => false}
                    />
                  </InfiniteScroll>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={hideAddPeopleToTagModal}
              variant="outline-danger"
              data-testid="closeAddPeopleToTagModal"
              className={styles.removeButton}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={addPeopleToTagLoading}
              data-testid="assignPeopleBtn"
              className={styles.addButton}
            >
              {t('assign')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddPeopleToTag;
