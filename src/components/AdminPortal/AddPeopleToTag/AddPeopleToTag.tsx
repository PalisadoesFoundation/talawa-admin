/**
 * AddPeopleToTag Component
 *
 * This component provides a modal interface for assigning members to a specific tag.
 * It allows users to search for members by first name or last name, select members,
 * and assign them to the tag. The component uses Apollo Client for GraphQL queries
 * and mutations, and Material-UI's DataGrid for displaying member data.
 *
 * Props:
 * - `addPeopleToTagModalIsOpen` (boolean): Controls the visibility of the modal.
 * - `hideAddPeopleToTagModal` (function): Callback to close the modal.
 * - `refetchAssignedMembersData` (function): Callback to refetch the assigned members data.
 * - `t` (function): Translation function for component-specific strings.
 * - `tCommon` (function): Translation function for common strings.
 *
 * State:
 * - `assignToMembers` (InterfaceMemberData[]): List of members selected for assignment.
 * - `memberToAssignToSearchFirstName` (string): Search filter for first name.
 * - `memberToAssignToSearchLastName` (string): Search filter for last name.
 *
 * Queries:
 * - `USER_TAGS_MEMBERS_TO_ASSIGN_TO`: Fetches members available for assignment to the tag.
 *
 * Mutations:
 * - `ADD_PEOPLE_TO_TAG`: Assigns selected members to the tag.
 *
 * Features:
 * - Infinite scrolling for loading more members.
 * - Search functionality for filtering members by name.
 * - Displays selected members with the ability to remove them.
 * - Handles errors and loading states with appropriate UI feedback.
 *
 * Dependencies:
 * - React, Apollo Client, Material-UI, React-Bootstrap, React-Toastify, React-Infinite-Scroll.
 *
 * Usage:
 * This component is used in the context of managing tags and their associated members.
 * It is designed to be displayed as a modal and requires integration with GraphQL APIs.
 */
// translation-check-keyPrefix: manageTag
import { useMutation, useQuery } from '@apollo/client';
import type {
  GridCellParams,
  GridColDef,
} from 'shared-components/DataGridWrapper';
import { DataGrid } from 'shared-components/DataGridWrapper';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useParams } from 'react-router';
import styles from 'style/app-fixed.module.css';
import { Stack } from '@mui/material';
import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import type {
  InterfaceAddPeopleToTagProps,
  InterfaceMemberData,
  InterfaceTagUsersToAssignToQuery,
  InterfaceQueryUserTagsMembersToAssignTo,
} from 'types/AdminPortal/Tag/interface';
import {
  TAGS_QUERY_DATA_CHUNK_SIZE,
  dataGridStyle,
} from 'types/AdminPortal/Tag/utils';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import componentStyles from './AddPeopleToTag.module.css';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

const AddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
  refetchAssignedMembersData,
  t,
  tCommon,
}) => {
  const { tagId: currentTagId } = useParams();

  const { t: tErrors } = useTranslation('errors');

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
        if (!fetchMoreResult || !fetchMoreResult.getUsersToAssignTo)
          return prevResult;

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
      NotificationToast.error(t('noOneSelected'));
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
        NotificationToast.success(t('successfullyAssignedToPeople'));
        refetchAssignedMembersData();
        hideAddPeopleToTagModal();
        setAssignToMembers([]);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : tErrors('unknownError');
      NotificationToast.error(errorMessage);
    }
  };

  if (userTagsMembersToAssignToError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={`${styles.errorIcon} fs-1`} />
          <h6 className="fw-bold text-danger text-center">
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
            aria-label={isToBeAssigned ? t('removeMember') : t('addMember')}
          >
            {isToBeAssigned ? 'x' : '+'}
          </Button>
        );
      },
    },
  ];

  const modalFooter = (
    <>
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
        form="addPeopleToTagForm"
      >
        {t('assign')}
      </Button>
    </>
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={hideAddPeopleToTagModal}
    >
      <BaseModal
        show={addPeopleToTagModalIsOpen}
        onHide={hideAddPeopleToTagModal}
        title={t('addPeople')}
        headerClassName={`bg-primary ${styles.modalHeader}`}
        footer={modalFooter}
        dataTestId="addPeopleToTagModal"
      >
        <Form onSubmit={addPeopleToCurrentTag} id="addPeopleToTagForm">
          <div
            className={`d-flex flex-wrap align-items-center border border-2 border-dark-subtle bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
          >
            {assignToMembers.length === 0 ? (
              <div className="text-body-tertiary mx-auto">
                {t('noOneSelected')}
              </div>
            ) : (
              assignToMembers.map((member) => (
                <div
                  key={member._id}
                  className={`badge bg-dark-subtle text-secondary-emphasis lh-lg my-2 ms-2 d-flex align-items-center ${styles.memberBadge}`}
                >
                  {member.firstName} {member.lastName}
                  <button
                    type="button"
                    className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary`}
                    onClick={() => removeMember(member._id)}
                    data-testid="clearSelectedMember"
                  />
                </div>
              ))
            )}
          </div>

          <div className="my-3 d-flex flex-wrap gap-3">
            <div className="flex-grow-1">
              <SearchBar
                placeholder={tCommon('firstName')}
                value={memberToAssignToSearchFirstName}
                onChange={(value) =>
                  setMemberToAssignToSearchFirstName(value.trim())
                }
                onClear={() => setMemberToAssignToSearchFirstName('')}
                showSearchButton={false}
                inputTestId="searchByFirstName"
                clearButtonTestId="clearFirstNameSearch"
              />
            </div>
            <div className="flex-grow-1">
              <SearchBar
                placeholder={tCommon('lastName')}
                value={memberToAssignToSearchLastName}
                onChange={(value) =>
                  setMemberToAssignToSearchLastName(value.trim())
                }
                onClear={() => setMemberToAssignToSearchLastName('')}
                showSearchButton={false}
                inputTestId="searchByLastName"
                clearButtonTestId="clearLastNameSearch"
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
                className={componentStyles.dataGridContainer}
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
                      '& .MuiDataGrid-topContainer': { position: 'static' },
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
        </Form>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};

export default AddPeopleToTag;
