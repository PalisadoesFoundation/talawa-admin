/**
 * Leaderboard component for displaying volunteer rankings within an organization.
 *
 * This component fetches and displays a leaderboard of volunteers based on their
 * hours volunteered. It includes features such as search, sorting, and filtering
 * by time frame. The leaderboard is displayed in a table format using the MUI DataGrid.
 *
 * @returns The rendered leaderboard component.
 *
 * remarks
 * - Redirects to the home page if `orgId` is not present in the URL parameters.
 * - Displays a loader while fetching data and an error message if the query fails.
 * - Uses Apollo Client's `useQuery` to fetch volunteer rankings from the GraphQL API.
 * - Supports debounced search functionality to filter volunteers by name.
 *
 * @example
 * ```tsx
 * <Leaderboard />
 * ```
 *
 * dependencies
 * - `@mui/x-data-grid` for table rendering.
 * - `@apollo/client` for GraphQL queries.
 * - `react-router-dom` for navigation and URL parameter handling.
 * - `@mui/material` for UI components like `Stack`.
 * - Custom components: `Loader`, `Avatar`, `SortingButton`, `SearchBar`.
 *
 * enum [TimeFrame]
 * - `All`: All-time rankings.
 * - `Weekly`: Rankings for the past week.
 * - `Monthly`: Rankings for the past month.
 * - `Yearly`: Rankings for the past year.
 *
 * query
 * - `VOLUNTEER_RANKING`: Fetches volunteer rankings based on organization ID, sort order,
 *   time frame, and search term.
 *
 * state
 * - `searchTerm` (`string`): The current search term for filtering volunteers.
 * - `sortBy` (`'hours_ASC' | 'hours_DESC'`): The current sorting order.
 * - `timeFrame` (`TimeFrame`): The selected time frame for filtering rankings.
 *
 * styles
 * - Custom styles are applied using `styles` imported from `./Leaderboard.module.css`.
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';

import { WarningAmberRounded } from '@mui/icons-material';
import gold from 'assets/images/gold.png';
import silver from 'assets/images/silver.png';
import bronze from 'assets/images/bronze.png';

import type { InterfaceVolunteerRank } from 'utils/interfaces';
import styles from './Leaderboard.module.css';

import LoadingState from 'shared-components/LoadingState/LoadingState';
import Avatar from 'shared-components/Avatar/Avatar';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';

import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from 'shared-components/DataGridWrapper';

import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';
import { useQuery } from '@apollo/client';

enum TimeFrame {
  All = 'allTime',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

function Leaderboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'leaderboard' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'hours_ASC' | 'hours_DESC'>(
    'hours_DESC',
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.All);

  const { data, loading, error } = useQuery(VOLUNTEER_RANKING, {
    variables: {
      orgId,
      where: {
        orderBy: sortBy,
        timeFrame,
        nameContains: searchTerm,
      },
    },
    skip: !orgId,
  });

  const rankings = useMemo(() => data?.getVolunteerRanks ?? [], [data]);

  const leaderboardDropdowns = useMemo(
    () => [
      {
        id: 'leaderboard-sort',
        label: tCommon('sort'),
        type: 'sort' as const,
        options: [
          { label: t('mostHours'), value: 'hours_DESC' },
          { label: t('leastHours'), value: 'hours_ASC' },
        ],
        selectedOption: sortBy,
        onOptionChange: (value: string | number) =>
          setSortBy(value as 'hours_ASC' | 'hours_DESC'),
        dataTestIdPrefix: 'sort',
      },
      {
        id: 'leaderboard-timeframe',
        label: t('timeFrame'),
        type: 'filter' as const,
        options: [
          { label: t('allTime'), value: TimeFrame.All },
          { label: t('weekly'), value: TimeFrame.Weekly },
          { label: t('monthly'), value: TimeFrame.Monthly },
          { label: t('yearly'), value: TimeFrame.Yearly },
        ],
        selectedOption: timeFrame,
        onOptionChange: (value: string | number) =>
          setTimeFrame(value as TimeFrame),
        dataTestIdPrefix: 'timeFrame',
      },
    ],
    [t, tCommon, sortBy, timeFrame],
  );

  if (!orgId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: t('volunteerRankings') })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'rank',
      headerName: t('rank'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        if (params.row.rank === 1)
          return <img src={gold} alt={t('goldMedal')} />;
        if (params.row.rank === 2)
          return <img src={silver} alt={t('silverMedal')} />;
        if (params.row.rank === 3)
          return <img src={bronze} alt={t('bronzeMedal')} />;
        return params.row.rank;
      },
    },
    {
      field: 'volunteer',
      headerName: t('volunteer'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const { _id, firstName, lastName, image } = params.row.user;
        const handleNavigation = () => {
          navigate(`/admin/member/${orgId}/${_id}`, { state: { id: _id } });
        };
        return (
          <div
            className={styles.volunteerCell}
            onClick={handleNavigation}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigation();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${tCommon('viewProfile')} ${firstName} ${lastName}`}
            data-testid="userName"
          >
            {image ? (
              <img src={image} alt={tCommon('user')} />
            ) : (
              <Avatar
                name={`${firstName} ${lastName}`}
                alt={`${firstName} ${lastName}`}
              />
            )}
            {firstName} {lastName}
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: t('email'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <div data-testid="userEmail">{params.row.user.email}</div>
      ),
    },
    {
      field: 'hoursVolunteered',
      headerName: t('hoursVolunteered'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridCellParams) => (
        <strong>{params.row.hoursVolunteered}</strong>
      ),
    },
  ];

  return (
    <LoadingState isLoading={loading} variant="spinner">
      <div className={styles.leaderboardContainer}>
        <SearchFilterBar
          searchPlaceholder={t('searchByVolunteer')}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={setSearchTerm}
          searchInputTestId="searchBy"
          searchButtonTestId="searchBtn"
          hasDropdowns
          dropdowns={leaderboardDropdowns}
        />

        <div className={styles.dataGridStyle}>
          <DataGrid
            hideFooter
            autoHeight
            getRowId={(row) => row.user._id}
            rows={rankings.map((r: InterfaceVolunteerRank, i: number) => ({
              id: i + 1,
              ...r,
            }))}
            columns={columns}
            isRowSelectable={() => false}
            slots={{
              noRowsOverlay: () => (
                <EmptyState
                  icon="emoji_events"
                  message={t('noVolunteers')}
                  dataTestId="leaderboard-empty-state"
                />
              ),
            }}
          />
        </div>
      </div>
    </LoadingState>
  );
}

export default Leaderboard;
