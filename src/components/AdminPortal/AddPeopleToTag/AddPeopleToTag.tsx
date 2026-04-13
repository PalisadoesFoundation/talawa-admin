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
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import type { ChangeEvent } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'shared-components/Button';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useParams } from 'react-router';
import styles from './AddPeopleToTag.module.css';
import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type {
  InterfaceAddPeopleToTagProps,
  InterfaceMemberData,
  InterfaceTagUsersToAssignToQuery,
} from 'types/AdminPortal/Tag/interface';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'types/AdminPortal/Tag/utils';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

const AddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
  refetchAssignedMembersData,
}) => {
  const { orgId, tagId: currentTagId } = useParams();

  const { t: tErrors } = useTranslation('errors');

  const [assignToMembers, setAssignToMembers] = useState<InterfaceMemberData[]>(
    [],
  );

  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');

  const [memberToAssignToSearchInput, setMemberToAssignToSearchInput] =
    useState('');
  const wasAddPeopleModalOpenRef = useRef(addPeopleToTagModalIsOpen);

  const {
    data: userTagsMembersToAssignToData,
    loading: userTagsMembersToAssignToLoading,
    error: userTagsMembersToAssignToError,
    refetch: userTagsMembersToAssignToRefetch,
  }: InterfaceTagUsersToAssignToQuery = useQuery(
    USER_TAGS_MEMBERS_TO_ASSIGN_TO,
    {
      variables: {
        organizationId: orgId,
        tagId: currentTagId,
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: memberToAssignToSearchInput
          ? {
              name_contains: memberToAssignToSearchInput,
            }
          : undefined,
      },
      skip: !addPeopleToTagModalIsOpen,
    },
  );

  useEffect(() => {
    const wasModalOpen = wasAddPeopleModalOpenRef.current;

    if (!wasModalOpen && addPeopleToTagModalIsOpen) {
      setMemberToAssignToSearchInput('');
      userTagsMembersToAssignToRefetch();
    }

    wasAddPeopleModalOpenRef.current = addPeopleToTagModalIsOpen;
  }, [addPeopleToTagModalIsOpen, userTagsMembersToAssignToRefetch]);

  const assignedMemberIds = new Set(
    userTagsMembersToAssignToData?.tag?.assignees?.edges
      ?.map((edge) => edge?.node?.id)
      .filter((id): id is string => Boolean(id)) ?? [],
  );

  const userTagMembersToAssignTo =
    userTagsMembersToAssignToData?.organization?.members?.edges
      ?.map((edge) => edge.node)
      .filter((member) => !assignedMemberIds.has(member._id)) ?? [];

  const rowIndexMap = useMemo(() => {
    const indexMap = new Map<string, number>();
    userTagMembersToAssignTo.forEach((member, index) => {
      indexMap.set(member._id, index + 1);
    });
    return indexMap;
  }, [userTagMembersToAssignTo]);

  const handleSelectMember = (member: InterfaceMemberData): void => {
    setAssignToMembers((prevMembers) => {
      const isAssigned = prevMembers.some((m) => m._id === member._id);
      if (isAssigned) {
        return prevMembers;
      }
      return [...prevMembers, member];
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

    const memberIds = assignToMembers
      .map((member) => member._id)
      .filter((memberId): memberId is string => Boolean(memberId));

    if (!currentTagId || memberIds.length !== assignToMembers.length) {
      NotificationToast.error(
        'Unable to assign members due to missing tag or member information.',
      );
      setAssignToMembers([]);
      return;
    }

    const successfullyAssignedMemberIds: string[] = [];

    try {
      for (const memberId of memberIds) {
        const { data } = await addPeople({
          variables: {
            tagId: currentTagId,
            userId: memberId,
          },
        });

        if (data) {
          successfullyAssignedMemberIds.push(memberId);
        }
      }

      if (successfullyAssignedMemberIds.length === memberIds.length) {
        NotificationToast.success(t('successfullyAssignedToPeople'));
        await Promise.resolve(refetchAssignedMembersData());
        hideAddPeopleToTagModal();
        setAssignToMembers([]);
      }
    } catch (error: unknown) {
      await Promise.resolve(refetchAssignedMembersData());
      setAssignToMembers([]);

      const errorMessage =
        error instanceof Error ? error.message : tErrors('unknownError');
      NotificationToast.error(
        successfullyAssignedMemberIds.length > 0
          ? `${errorMessage} Assignments were refreshed to avoid partial state.`
          : errorMessage,
      );
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

  const columns: IColumnDef<InterfaceMemberData>[] = [
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
      header: t('userName'),
      accessor: 'name',
      render: (value, row) => {
        const isToBeAssigned = assignToMembers.some(
          (member) => member._id === row._id,
        );

        return (
          <span
            data-testid="memberName"
            className={isToBeAssigned ? styles.selectedMemberRow : ''}
          >
            {String(value)}
          </span>
        );
      },
      meta: {
        sortable: false,
      },
    },
    {
      id: 'actions',
      header: t('actions'),
      accessor: '_id',
      render: (_value, row) => {
        const isToBeAssigned = assignToMembers.some(
          (member) => member._id === row._id,
        );

        return (
          <Button
            size="sm"
            onClick={isToBeAssigned ? undefined : () => handleSelectMember(row)}
            data-testid={
              isToBeAssigned ? 'selectedMemberBtn' : 'selectMemberBtn'
            }
            className={
              isToBeAssigned ? styles.selectedMemberButton : styles.editButton
            }
            aria-label={t('addMember')}
            disabled={isToBeAssigned}
          >
            +
          </Button>
        );
      },
      meta: {
        sortable: false,
        align: 'center',
        width: 'var(--space-13)',
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
      <CRUDModalTemplate
        open={addPeopleToTagModalIsOpen}
        onClose={hideAddPeopleToTagModal}
        title={t('addPeople')}
        customFooter={modalFooter}
        data-testId="addPeopleToTagModal"
      >
        <form onSubmit={addPeopleToCurrentTag} id="addPeopleToTagForm">
          <div
            className={`d-flex flex-wrap align-items-center border border-2 border-dark-subtle bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
          >
            {assignToMembers.length === 0 ? (
              <div className="text-body-tertiary mx-auto">
                {t('noOneSelected')}
              </div>
            ) : (
              assignToMembers.map((member) => (
                <div key={member._id} className={styles.memberBadge}>
                  {member.name}
                  <Button
                    type="button"
                    className={styles.removeMemberChipButton}
                    onClick={() => removeMember(member._id)}
                    data-testid="clearSelectedMember"
                    aria-label={t('removeMember')}
                  >
                    <i className="fa fa-times" aria-hidden="true" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="my-3">
            <SearchBar
              placeholder={tCommon('searchByName')}
              value={memberToAssignToSearchInput}
              onChange={(value) => setMemberToAssignToSearchInput(value.trim())}
              onSearch={(value) => setMemberToAssignToSearchInput(value.trim())}
              inputTestId="searchByName"
              showSearchButton={false}
              showLeadingIcon
            />
          </div>

          <div data-testid="addPeopleToTagScrollableDiv">
            {!userTagsMembersToAssignToLoading &&
            userTagMembersToAssignTo.length === 0 ? (
              <EmptyState
                icon="Tag"
                message={t('noMoreMembersFound')}
                dataTestId="add-people-to-tag-empty-state"
              />
            ) : (
              <DataTable<InterfaceMemberData>
                data={userTagMembersToAssignTo}
                columns={columns}
                loading={userTagsMembersToAssignToLoading}
                rowKey="_id"
                paginationMode="client"
                pageSize={PAGE_SIZE}
              />
            )}
          </div>
        </form>
      </CRUDModalTemplate>
    </ErrorBoundaryWrapper>
  );
};

export default AddPeopleToTag;
