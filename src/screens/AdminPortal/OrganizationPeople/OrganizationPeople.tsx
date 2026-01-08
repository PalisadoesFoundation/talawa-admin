/**
 * OrganizationPeople Component
 *
 * This component renders a paginated and searchable table of organization members,
 * administrators, or users. It provides functionality for sorting, searching, and
 * managing members within an organization.
 *
 * @remarks
 * - Uses CursorPaginationManager for cursor-based pagination.
 * - Implements server-side search and role filtering.
 * - Supports tab-based filtering (members, administrators, users).
 * - Displays members in a table format with "Load More" pagination.
 * - Includes modal for removing members.
 *
 * @remarks
 * Requires:
 * - `react`, `react-router-dom` for routing and state management.
 * - `CursorPaginationManager` for pagination.
 * - `dayjs` for date formatting.
 * - Custom components: `AdminSearchFilterBar`, `Avatar`, `AddMember`, `OrgPeopleListCard`.
 *
 * @example
 * ```tsx
 * <OrganizationPeople />
 * ```
 *
 * @returns \{JSX.Element\} A JSX element rendering the organization people table.

 * @remarks
 * Component state includes:
 * - `state` (number): Current tab state (0: members, 1: administrators, 2: users).
 * - `searchTerm` (string): Search input for filtering rows.
 * - `showRemoveModal` (boolean): Controls visibility of the remove member modal.
 * - `selectedMemId` (string | undefined): ID of the member selected for removal.
 * - `refetchTrigger` (number): Triggers data refetch when tab/search changes.

 * @remarks
 * Key methods:
 * - `handleSortChange`: Updates the tab state based on sorting selection.
 * - `toggleRemoveModal`: Toggles the visibility of the remove member modal.
 * - `toggleRemoveMemberModal`: Sets the selected member ID and toggles the modal.

 * @remarks
 * Dependencies:
 * - GraphQL Queries: `ORGANIZATIONS_MEMBER_CONNECTION_LIST`, `USER_LIST_FOR_TABLE`.
 * - Styles: `style/app-fixed.module.css`.
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, Link } from 'react-router';
import { Delete } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import styles from 'style/app-fixed.module.css';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { Button } from 'react-bootstrap';
import Avatar from 'components/Avatar/Avatar';
import AddMember from './addMember/AddMember';
import AdminSearchFilterBar from 'components/AdminSearchFilterBar/AdminSearchFilterBar';
import CursorPaginationManager from 'components/CursorPaginationManager/CursorPaginationManager';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';

/**
 * Maps numeric filter state to string option identifiers.
 */
const STATE_TO_OPTION: Record<number, string> = {
  0: 'members',
  1: 'admin',
  2: 'users',
};

/**
 * Maps string option identifiers to numeric filter state.
 */
const OPTION_TO_STATE: Record<string, number> = {
  members: 0,
  admin: 1,
  users: 2,
};

interface IUserNode {
  id: string;
  name: string;
  role: string;
  avatarURL?: string;
  emailAddress: string;
  createdAt: string;
}

function OrganizationPeople(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationPeople',
  });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const role = location?.state;
  const { orgId: currentUrl } = useParams();

  // State
  const [state, setState] = useState(role?.role || 0);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMemId, setSelectedMemId] = useState<string | null>(null);

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Mutation to remove a member from the organization
  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION_PG);

  // Handle tab changes and search updates
  useEffect(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, [state, searchTerm, currentUrl]);

  // Modal Handlers
  const handleCloseModal = () => {
    setShowRemoveModal(false);
    setSelectedMemId(null);
  };

  const handleOpenRemoveModal = (id: string) => {
    setSelectedMemId(id);
    setShowRemoveModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedMemId) return;

    try {
      const { data } = await removeMember({
        variables: { memberId: selectedMemId, organizationId: currentUrl },
      });

      if (data) {
        NotificationToast.success(
          tCommon('removedSuccessfully', { item: tCommon('removeMember') }),
        );
        // Refresh list after deletion
        setRefetchTrigger((prev) => prev + 1);
        handleCloseModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleSortChange = (value: string): void => {
    setState(OPTION_TO_STATE[value] ?? 0);
  };

  // Determine query and variables based on current tab
  const getQueryAndVariables = () => {
    const baseVariables = {
      orgId: currentUrl,
    };

    // Build where filter for search
    const searchFilter = searchTerm
      ? { firstName: { contains: searchTerm } }
      : undefined;

    if (state === 0) {
      // Members
      return {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          ...baseVariables,
          where: searchFilter,
        },
        dataPath: 'organization.members',
      };
    } else if (state === 1) {
      // Admins
      return {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          ...baseVariables,
          where: searchFilter
            ? { ...searchFilter, role: { equal: 'administrator' } }
            : { role: { equal: 'administrator' } },
        },
        dataPath: 'organization.members',
      };
    } else {
      // Users
      return {
        query: USER_LIST_FOR_TABLE,
        variables: {
          where: searchFilter,
        },
        dataPath: 'allUsers',
      };
    }
  };

  const { query, variables, dataPath } = getQueryAndVariables();

  // Define footer buttons for BaseModal
  const modalFooter = (
    <>
      <Button variant="secondary" onClick={handleCloseModal}>
        {tCommon('cancel') || 'Cancel'}
      </Button>
      <Button variant="danger" onClick={handleDeleteUser}>
        {tCommon('remove') || 'Remove'}
      </Button>
    </>
  );

  return (
    <>
      <AdminSearchFilterBar
        hasDropdowns={true}
        searchPlaceholder={t('searchFullName')}
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        searchInputTestId="searchbtn"
        searchButtonTestId="searchBtn"
        containerClassName={styles.calendar__header}
        dropdowns={[
          {
            id: 'organization-people-sort',
            label: tCommon('sort'),
            type: 'sort',
            options: [
              { label: tCommon('members'), value: 'members' },
              { label: tCommon('admin'), value: 'admin' },
              { label: tCommon('users'), value: 'users' },
            ],
            selectedOption: STATE_TO_OPTION[state] ?? 'members',
            onOptionChange: (value) => handleSortChange(value.toString()),
            dataTestIdPrefix: 'sort',
          },
        ]}
        additionalButtons={<AddMember />}
      />

      {/* Organization People Table */}
      <section
        className={styles.tableContainer}
        aria-label={t('organizationPeopleTable')}
      >
        <table
          className={styles.table}
          aria-label={t('organizationPeopleTable')}
        >
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('sl_no')}
              </th>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('profile')}
              </th>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('name')}
              </th>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('email')}
              </th>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('joinedOn')}
              </th>
              <th
                className={`${styles.tableHeader} ${styles.tableCell}`}
                scope="col"
              >
                {tCommon('action')}
              </th>
            </tr>
          </thead>
          <tbody>
            <CursorPaginationManager
              query={query}
              queryVariables={variables}
              dataPath={dataPath}
              itemsPerPage={10}
              renderItem={(item: IUserNode, index: number) => {
                const rowNumber = index + 1;
                return (
                  <tr key={item.id} className={styles.rowBackground}>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      {rowNumber}
                    </td>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      {item.avatarURL ? (
                        <img
                          src={item.avatarURL}
                          alt={tCommon('avatar')}
                          className={styles.avatarImage}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <Avatar name={item.name} />
                        </div>
                      )}
                    </td>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      <Link
                        to={`/member/${currentUrl}`}
                        state={{ id: item.id }}
                        className={`${styles.membername} ${styles.subtleBlueGrey} ${styles.memberNameFontSize}`}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      {item.emailAddress}
                    </td>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      {dayjs(item.createdAt).format('DD/MM/YYYY')}
                    </td>
                    <td className={`${styles.tableCell} ${styles.centerAlign}`}>
                      <Button
                        className={`${styles.removeButton}`}
                        variant="danger"
                        disabled={state === 2}
                        onClick={() => handleOpenRemoveModal(item.id)}
                        aria-label={tCommon('removeMember')}
                        data-testid="removeMemberModalBtn"
                      >
                        <Delete />
                      </Button>
                    </td>
                  </tr>
                );
              }}
              keyExtractor={(item: IUserNode) => item.id}
              refetchTrigger={refetchTrigger}
              emptyStateComponent={
                <tr>
                  <td colSpan={6} className={styles.emptyStateCell}>
                    <EmptyState
                      icon="groups"
                      message={tCommon('notFound')}
                      dataTestId="organization-people-empty-state"
                    />
                  </td>
                </tr>
              }
            />
          </tbody>
        </table>
      </section>

      <BaseModal
        show={showRemoveModal}
        onHide={handleCloseModal}
        title={t('removeMemberTitle') || 'Remove Member'}
        footer={modalFooter}
        centered
        dataTestId="remove-member-modal"
      >
        <p className={styles.modalBodyText}>
          {t('removeMemberConfirmation') ||
            'Are you sure you want to remove this member?'}
        </p>
      </BaseModal>
    </>
  );
}

export default OrganizationPeople;
