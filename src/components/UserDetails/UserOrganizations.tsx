/**
 * UserOrganizations Component
 *
 * This component displays a list of organizations associated with a user,
 * including organizations they have created, belong to, or joined. It provides
 * search, sorting, and filtering capabilities to help users easily navigate
 * through their organizations.
 *
 * Organization data is fetched using GraphQL queries and normalized into a
 * unified structure before being filtered and rendered.
 *
 * @component
 * @param {MemberDetailProps} props - The props for the component.
 * @param {string} [props.id] - Optional user ID used to fetch organization data.
 *                            If not provided, the ID is resolved from route state
 *                            or local storage.
 *
 * @returns {JSX.Element} The rendered UserOrganizations component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` to fetch user details and joined organizations.
 * - Combines multiple organization relationships (created, belong-to, joined)
 *   into a single normalized list.
 * - Supports client-side search, sorting, and filtering by organization type.
 * - Uses `useMemo` to optimize derived organization lists and avoid unnecessary
 *   recalculations.
 * - Integrates a reusable `PageHeader` component for search, sort, and filter controls.
 * - Displays an empty state message when no organizations match the criteria.
 *
 * @example
 * ```tsx
 * <UserOrganizations id="12345" />
 * ```
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries
 * - `react-router` for resolving route-based user IDs
 * - `react-bootstrap` and custom CSS modules for layout
 * - `@mui/material` and `@mui/icons-material` for action icons
 * - Shared UI components such as `PageHeader` and `PeopleTabUserOrganizations`
 *
 */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import PeopleTabUserOrganizations from 'shared-components/PeopleTabUserOrganizations/PeopleTabUserOrganizations';
import PageHeader from 'shared-components/Navbar/Navbar';
import styles from 'style/app-fixed.module.css';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useLocalStorage from 'utils/useLocalstorage';
import { useLocation } from 'react-router';
import {
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';

type MemberDetailProps = { id?: string };
type OrgRelationType = 'CREATED' | 'BELONG_TO' | 'JOINED';

type UserOrg = {
  id: string;
  name: string;
  relation: OrgRelationType;
  adminsCount: number;
  membersCount: number;
  description?: string;
  avatarURL?: string;
};

interface InterfaceJoinedOrgEdge {
  node: {
    id: string;
    name: string;
    adminsCount: number;
    membersCount: number;
    description?: string;
    avatarURL?: string;
  };
}

interface InterfaceJoinedOrganizationsData {
  user: {
    organizationsWhereMember?: {
      edges?: InterfaceJoinedOrgEdge[];
    };
  };
}

const UserOrganizations: React.FC<MemberDetailProps> = ({
  id,
}): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const [filterName] = useState('');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const [rowsPerPage] = React.useState(5);
  const [orgFilter, setOrgFilter] = useState<'ALL' | OrgRelationType>('ALL');

  const currentId = location.state?.id || getItem('id') || id;

  const { data: joinedOrganizationsData } =
    useQuery<InterfaceJoinedOrganizationsData>(
      USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      {
        variables: { id: currentId, first: rowsPerPage, filter: filterName },
      },
    );

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { input: { id: currentId } },
  });

  const allUserOrgs: UserOrg[] = useMemo(() => {
    if (!userData?.user && !joinedOrganizationsData?.user) {
      return [];
    }

    const created: UserOrg[] =
      userData?.user?.createdOrganizations?.map(
        (org: {
          id: string;
          name: string;
          adminsCount: number;
          membersCount: number;
          description?: string;
          avatarURL?: string;
        }) => ({
          id: org.id,
          name: org.name,
          relation: 'CREATED' as const,
          adminsCount: org.adminsCount ?? 0,
          membersCount: org.membersCount ?? 0,
          description: org.description || 'No Description',
          avatarURL: org.avatarURL || '',
        }),
      ) || [];

    const belongTo: UserOrg[] =
      userData?.user?.organizationsWhereMember?.edges?.map(
        (edge: {
          node: {
            id: string;
            name: string;
            adminsCount: number;
            membersCount: number;
            description?: string;
            avatarURL?: string;
          };
        }) => ({
          id: edge.node.id,
          name: edge.node.name,
          relation: 'BELONG_TO' as const,
          adminsCount: edge.node.adminsCount ?? 0,
          membersCount: edge.node.membersCount ?? 0,
          description: edge.node.description || 'No Description',
          avatarURL: edge.node.avatarURL || '',
        }),
      ) || [];

    const joined: UserOrg[] =
      joinedOrganizationsData?.user?.organizationsWhereMember?.edges?.map(
        (edge: {
          node: {
            id: string;
            name: string;
            adminsCount: number;
            membersCount: number;
            description?: string;
            avatarURL?: string;
          };
        }) => ({
          id: edge.node.id,
          name: edge.node.name,
          relation: 'JOINED' as const,
          adminsCount: edge.node.adminsCount ?? 0,
          membersCount: edge.node.membersCount ?? 0,
          description: edge.node.description || 'No Description',
          avatarURL: edge.node.avatarURL || '',
        }),
      ) || [];

    // Merge and remove duplicates
    const allOrgs = [...created, ...belongTo, ...joined];
    const uniqueOrgs = allOrgs.filter(
      (org, index, self) => index === self.findIndex((o) => o.id === org.id),
    );

    return uniqueOrgs;
  }, [userData, joinedOrganizationsData]);

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<'ASC' | 'DESC'>('ASC');

  const filteredOrgs = useMemo(() => {
    let list = [...allUserOrgs];

    if (searchValue) {
      list = list.filter((org) =>
        org.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    if (orgFilter !== 'ALL') {
      list = list.filter((org) => org.relation === orgFilter);
    }

    list.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOption === 'ASC'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return list;
  }, [allUserOrgs, searchValue, sortOption, orgFilter]);

  return (
    <div className={styles.peopleTabUserOrganizationsContainer}>
      {/* ===== Page Header with Search & Sort ===== */}
      <PageHeader
        search={{
          placeholder: 'Search organizations...',
          onSearch: setSearchValue,
        }}
        sorting={[
          {
            title: 'Sort By Name',
            options: [
              { label: 'A → Z', value: 'ASC' },
              { label: 'Z → A', value: 'DESC' },
            ],
            selected: sortOption,
            onChange: (value: string | number) =>
              setSortOption(value as 'ASC' | 'DESC'),
            testIdPrefix: 'orgSort',
          },
          {
            title: 'Filter By Type',
            options: [
              { label: 'All', value: 'ALL' },
              { label: 'Created', value: 'CREATED' },
              { label: 'Belong To', value: 'BELONG_TO' },
              { label: 'Joined', value: 'JOINED' },
            ],
            selected: orgFilter,
            onChange: (value: string | number) =>
              setOrgFilter(value as 'ALL' | OrgRelationType),
            testIdPrefix: 'orgFilter',
          },
        ]}
      />

      {/* ===== Organizations Grid ===== */}
      <div className={styles.peopleTabUserOrganizationsGrid}>
        {!userData?.user && !joinedOrganizationsData?.user ? (
          <p>{tCommon('loadingOrganizations')}</p>
        ) : filteredOrgs.length === 0 ? (
          <p>{tCommon('noOrganizationsFound.')}</p>
        ) : (
          filteredOrgs.map((org) => (
            <PeopleTabUserOrganizations
              key={org.id}
              title={org.name}
              description={org.description || 'No Description'}
              adminCount={org.adminsCount}
              membersCount={org.membersCount}
              img={org.avatarURL || ''}
              actionIcon={
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              }
              actionName="Edit"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrganizations;
