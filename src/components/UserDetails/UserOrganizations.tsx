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

type MemberDetailProps = { id?: string };
type OrgRelationType = 'CREATED' | 'BELONG_TO' | 'JOINED';

type UserOrg = {
  id: string;
  name: string;
  relation: OrgRelationType;
};
interface InterfaceJoinedOrgEdge {
  node: {
    id: string;
    name: string;
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
    if (!userData?.user) {
      return [];
    }

    const created =
      userData.user.createdOrganizations?.map(
        (org: { id: string; name: string }) => ({
          id: org.id,
          name: org.name,
          relation: 'CREATED' as OrgRelationType,
        }),
      ) || [];

    const belongTo: UserOrg[] =
      userData.user.organizationsWhereMember?.edges?.map(
        (edge: { node: { id: string; name: string } }) => ({
          id: edge.node.id,
          name: edge.node.name,
          relation: 'BELONG_TO',
        }),
      ) || [];

    const joined: UserOrg[] =
      joinedOrganizationsData?.user?.organizationsWhereMember?.edges?.map(
        (edge: InterfaceJoinedOrgEdge) => ({
          id: edge.node.id,
          name: edge.node.name,
          relation: 'JOINED' as const,
        }),
      ) || [];

    return [...created, ...belongTo, ...joined];
  }, [userData]);

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<'ASC' | 'DESC'>('ASC');
  searchValue.trim().toLowerCase();

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

  // const DUMMY_ORGANIZATIONS = [
  //   {
  //     id: 1,
  //     title: 'Alpha Organization',
  //     description: 'This is Alpha organization description.',
  //     adminCount: 3,
  //     membersCount: 25,
  //   },
  //   {
  //     id: 2,
  //     title: 'Beta Organization',
  //     description: 'This is Beta organization description.',
  //     adminCount: 5,
  //     membersCount: 40,
  //   },
  //   {
  //     id: 3,
  //     title: 'Gamma Organization',
  //     description: 'This is Gamma organization description.',
  //     adminCount: 2,
  //     membersCount: 18,
  //   },
  //   {
  //     id: 4,
  //     title: 'Delta Tech Group',
  //     description:
  //       'A technology-focused organization working on scalable systems.',
  //     adminCount: 4,
  //     membersCount: 60,
  //   },
  //   {
  //     id: 5,
  //     title: 'Epsilon Innovations',
  //     description:
  //       'Innovation-driven organization fostering creative solutions.',
  //     adminCount: 6,
  //     membersCount: 80,
  //   },
  //   {
  //     id: 6,
  //     title: 'Zeta Community',
  //     description: 'A community-based organization for collaborative growth.',
  //     adminCount: 2,
  //     membersCount: 15,
  //   },
  //   {
  //     id: 7,
  //     title: 'Omega Enterprises',
  //     description:
  //       'Enterprise-level organization managing large-scale operations.',
  //     adminCount: 8,
  //     membersCount: 120,
  //   },
  //   {
  //     id: 8,
  //     title: 'Nova Labs',
  //     description:
  //       'Research and development lab focused on emerging technologies.',
  //     adminCount: 3,
  //     membersCount: 35,
  //   },
  //   {
  //     id: 9,
  //     title: 'Vertex Solutions',
  //     description:
  //       'Solutions-oriented organization delivering high-impact products.',
  //     adminCount: 5,
  //     membersCount: 55,
  //   },
  //   {
  //     id: 10,
  //     title: 'Horizon Collective',
  //     description:
  //       'A collective aiming to build long-term sustainable initiatives.',
  //     adminCount: 4,
  //     membersCount: 45,
  //   },
  // ];

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
        {filteredOrgs.length === 0 ? (
          <p>No organizations found.</p>
        ) : (
          filteredOrgs.map((org) => (
            <PeopleTabUserOrganizations
              key={org.id}
              title={org.name}
              description={
                org.relation === 'CREATED'
                  ? 'Created by user'
                  : org.relation === 'BELONG_TO'
                    ? 'Member of organization'
                    : 'Joined organization'
              }
              adminCount={0}
              membersCount={0}
              img={''}
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
