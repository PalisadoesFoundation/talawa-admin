/**
 * AddPeopleToTag Component
 *
 * This component provides a modal interface for assigning members to a specific tag.
 * It allows users to search for members by first name or last name, select members,
 * and assign them to the tag. The component uses Apollo Client for GraphQL queries
 * and mutations, and custom native HTML tables for displaying member data.
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
import styles from './AddMembersModal.module.css';
import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import TableLoader from 'shared-components/TableLoader/TableLoader';
import type {
  InterfaceAddPeopleToTagProps,
  InterfaceMemberData,
  InterfaceTagUsersToAssignToQuery,
} from 'types/AdminPortal/Tag/interface';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

const AddMembersModal: React.FC<InterfaceAddPeopleToTagProps> = ({
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
          <div className={styles.scrollContainer}>
            <div className={styles.badgeContainer}>
              {assignToMembers.length === 0 ? (
                <div style={{ margin: 'auto', color: 'var(--gray-500)' }}>
                  {t('noOneSelected')}
                </div>
              ) : (
                assignToMembers.map((member) => (
                  <div key={member._id} className={styles.memberBadge}>
                    <span>{member.name}</span>
                    <button
                      type="button"
                      className={styles.removeMemberChipButton}
                      onClick={() => removeMember(member._id)}
                      data-testid="clearSelectedMember"
                      aria-label={t('removeMember')}
                    >
                      <i className="fa fa-times" aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-5)' }}>
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

          <div
            data-testid="addPeopleToTagScrollableDiv"
            className={styles.tableScrollableDiv}
          >
            {userTagsMembersToAssignToLoading ? (
              <div className={styles.loadingDiv}>
                <TableLoader noOfCols={3} noOfRows={5} />
              </div>
            ) : userTagMembersToAssignTo.length === 0 ? (
              <EmptyState
                icon="Tag"
                message={t('noMoreMembersFound')}
                dataTestId="add-people-to-tag-empty-state"
              />
            ) : (
              <div className="table-wrapper">
                <table className="data-table" aria-label={t('membersToAssign')}>
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        style={{ width: 'calc(48px)', textAlign: 'center' }}
                      >
                        {tCommon('sl_no')}
                      </th>
                      <th scope="col">{t('userName')}</th>
                      <th scope="col" style={{ textAlign: 'center' }}>
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTagMembersToAssignTo.map((row) => {
                      const isToBeAssigned = assignToMembers.some(
                        (member) => member._id === row._id,
                      );
                      return (
                        <tr key={row._id}>
                          <td style={{ textAlign: 'center' }}>
                            {rowIndexMap.get(row._id) ?? 0}.
                          </td>
                          <td>
                            <span
                              data-testid="memberName"
                              className={
                                isToBeAssigned ? styles.selectedMemberRow : ''
                              }
                            >
                              {row.name ?? ''}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={
                                isToBeAssigned
                                  ? undefined
                                  : () => handleSelectMember(row)
                              }
                              data-testid={
                                isToBeAssigned
                                  ? 'selectedMemberBtn'
                                  : 'selectMemberBtn'
                              }
                              className={`btn btn-sm ${isToBeAssigned ? styles.selectedMemberButton : styles.editButton}`}
                              aria-label={t('addMember')}
                              disabled={isToBeAssigned}
                            >
                              {isToBeAssigned ? (
                                <i className="fa fa-check" />
                              ) : (
                                '+'
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </form>
      </CRUDModalTemplate>
    </ErrorBoundaryWrapper>
  );
};

export default AddMembersModal;
