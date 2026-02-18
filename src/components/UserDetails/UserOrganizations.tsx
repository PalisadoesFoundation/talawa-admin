/**
 * UserOrganizations
 *
 * Displays a list of organizations associated with a user.
 *
 * The list includes organizations the user has created, belongs to,
 * or has joined. The component supports searching, sorting,
 * and filtering to help users navigate large organization lists.
 *
 * Organization data is fetched via GraphQL queries and normalized
 * into a unified structure before being filtered and rendered.
 *
 * @param props - Component props.
 * Optional {@link MemberDetailProps.id | id} may be provided to fetch
 * organizations for a specific user. If not provided, the ID is resolved
 * from route state or local storage.
 *
 * @returns The rendered UserOrganizations component.
 *
 * @remarks
 * - Uses Apollo Client queries to fetch user and organization data.
 * - Merges created, belonging, and joined organizations into one list.
 * - Removes duplicate organizations by ID.
 * - Supports client-side search, sorting, and filtering by organization type.
 * - Uses memoization to avoid unnecessary recalculations.
 * - Integrates PeopleTabNavbar for search, sort, and filter controls.
 * - Displays loading and empty states when applicable.
 *
 * @example
 * ```tsx
 * <UserOrganizations id="12345" />
 * ```
 */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import PeopleTabUserOrganizations from 'shared-components/PeopleTabUserOrganization/PeopleTabUserOrganizations';
import PeopleTabNavbar from 'shared-components/PeopleTabNavbar/PeopleTabNavbar';
import styles from './UserOrganizations.module.css';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useLocalStorage from 'utils/useLocalstorage';
import { useLocation } from 'react-router';
import {
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';
import { InterfaceJoinedOrganizationsData } from 'types/AdminPortal/UserDetails/UserOrganization/interface';
import {
  InterfaceUserOrganizationsProps,
  InterfaceOrgRelationType,
  InterfaceUserOrg,
} from 'types/AdminPortal/UserDetails/UserOrganization/type';
const UserOrganizations: React.FC<InterfaceUserOrganizationsProps> = ({
  id,
}): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const [filterName] = useState('');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const [rowsPerPage] = React.useState(5);
  const [orgFilter, setOrgFilter] = useState<'ALL' | InterfaceOrgRelationType>(
    'ALL',
  );

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

  const allUserOrgs: InterfaceUserOrg[] = useMemo(() => {
    const created: InterfaceUserOrg[] =
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
          adminsCount: org.adminsCount,
          membersCount: org.membersCount,
          description: org.description || 'No Description',
          avatarURL: org.avatarURL || '',
        }),
      ) || [];

    const belongTo: InterfaceUserOrg[] =
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
          adminsCount: edge.node.adminsCount,
          membersCount: edge.node.membersCount,
          description: edge.node.description || 'No Description',
          avatarURL: edge.node.avatarURL || '',
        }),
      ) || [];

    const joined: InterfaceUserOrg[] =
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
          adminsCount: edge.node.adminsCount,
          membersCount: edge.node.membersCount,
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
      <PeopleTabNavbar
        search={{
          placeholder: 'Search created organizations',
          onSearch: setSearchValue,
        }}
        sorting={[
          {
            title: 'Sort By Name',
            options: [
              { label: 'A → Z', value: 'ASC' },
              { label: 'Z → A', value: 'DESC' },
            ],
            icon: '/images/svg/ion_options-outline.svg',
            selected: sortOption,
            onChange: (value: string | number) =>
              setSortOption(value as 'ASC' | 'DESC'),
            testIdPrefix: 'orgSort',
          },
          {
            title: 'Filter By Type',
            options: [
              { label: 'All', value: 'ALL' },
              { label: 'Created Organizations', value: 'CREATED' },
              { label: 'Organizations user belong To', value: 'BELONG_TO' },
              { label: 'Joined Organizations', value: 'JOINED' },
            ],
            icon: '/images/svg/ri_arrow-up-down-line.svg',
            selected: orgFilter,
            onChange: (value: string | number) =>
              setOrgFilter(value as 'ALL' | InterfaceOrgRelationType),
            testIdPrefix: 'orgFilter',
          },
        ]}
      />

      {/* ===== Organizations Grid ===== */}
      <div className={styles.peopleTabUserOrganizationsGrid}>
        {!userData?.user && !joinedOrganizationsData?.user ? (
          <p>{tCommon('loadingOrganizations')}</p>
        ) : filteredOrgs.length === 0 ? (
          <p>{tCommon('noOrganizationsFound')}</p>
        ) : (
          filteredOrgs.map((org) => (
            <PeopleTabUserOrganizations
              key={org.id}
              title={org.name}
              description={org.description}
              adminCount={org.adminsCount}
              membersCount={org.membersCount}
              img={org.avatarURL || ''}
              actionIcon={
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
              }
              actionName={tCommon('edit')}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrganizations;
