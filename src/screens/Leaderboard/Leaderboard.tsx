/**
 * Leaderboard component for displaying volunteer rankings within an organization.
 *
 * This component fetches and displays a leaderboard of volunteers based on their
 * hours volunteered. It includes features such as search, sorting, and filtering
 * by time frame. The leaderboard is displayed in a table format using the MUI DataGrid.
 *
 * @component
 * @returns {JSX.Element} The rendered leaderboard component.
 *
 * @remarks
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
 * @dependencies
 * - `@mui/x-data-grid` for table rendering.
 * - `@apollo/client` for GraphQL queries.
 * - `react-router-dom` for navigation and URL parameter handling.
 * - `@mui/material` for UI components like `Stack`.
 * - Custom components: `Loader`, `Avatar`, `SortingButton`, `SearchBar`.
 *
 * @enum {TimeFrame}
 * - `All`: All-time rankings.
 * - `Weekly`: Rankings for the past week.
 * - `Monthly`: Rankings for the past month.
 * - `Yearly`: Rankings for the past year.
 *
 * @query
 * - `VOLUNTEER_RANKING`: Fetches volunteer rankings based on organization ID, sort order,
 *   time frame, and search term.
 *
 * @state
 * - `searchTerm` (`string`): The current search term for filtering volunteers.
 * - `sortBy` (`'hours_ASC' | 'hours_DESC'`): The current sorting order.
 * - `timeFrame` (`TimeFrame`): The selected time frame for filtering rankings.
 *
 * @styles
 * - Custom styles are applied using `styles` imported from `app-fixed.module.css`.
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';

import { WarningAmberRounded } from '@mui/icons-material';
import gold from 'assets/images/gold.png';
import silver from 'assets/images/silver.png';
import bronze from 'assets/images/bronze.png';

import type { InterfaceVolunteerRank } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { debounce } from 'utils/performance';
import Avatar from 'components/Avatar/Avatar';
import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';
import { useQuery } from '@apollo/client';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';

enum TimeFrame {
  All = 'allTime',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}

const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-row.Mui-hovered': { backgroundColor: 'transparent' },
  '& .MuiDataGrid-root': { borderRadius: '0.5rem' },
  '& .MuiDataGrid-main': { borderRadius: '0.5rem' },
};

function leaderboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'leaderboard' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'hours_ASC' | 'hours_DESC'>(
    'hours_DESC',
  );
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.All);

  /**
   * Query to fetch volunteer rankings.
   */
  const {
    data: rankingsData,
    loading: rankingsLoading,
    error: rankingsError,
  }: {
    data?: { getVolunteerRanks: InterfaceVolunteerRank[] };
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(VOLUNTEER_RANKING, {
    variables: {
      orgId,
      where: {
        orderBy: sortBy,
        timeFrame: timeFrame,
        nameContains: searchTerm,
      },
    },
  });

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const rankings = useMemo(
    () => rankingsData?.getVolunteerRanks || [],
    [rankingsData],
  );

  if (rankingsLoading) {
    return <Loader size="xl" />;
  }

  if (rankingsError) {
    return (
      <div className={styles.message} data-testid="errorMsg">
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          {tErrors('errorLoading', { entity: 'Volunteer Rankings' })}
        </h6>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'rank',
      headerName: 'Rank',
      flex: 1,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        if (params.row.rank === 1) {
          return (
            <>
              <img src={gold} alt="gold" className={styles.rankings} />
            </>
          );
        } else if (params.row.rank === 2) {
          return (
            <>
              <img src={silver} alt="silver" className={styles.rankings} />
            </>
          );
        } else if (params.row.rank === 3) {
          return (
            <>
              <img src={bronze} alt="bronze" className={styles.rankings} />
            </>
          );
        } else return <>{params.row.rank}</>;
      },
    },
    {
      field: 'volunteer',
      headerName: 'Volunteer',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        const { _id, firstName, lastName, image } = params.row.user;

        return (
          <>
            <div
              className="d-flex fw-bold align-items-center ms-5 "
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(`/member/${orgId}`, { state: { id: _id } })
              }
              data-testid="userName"
            >
              {image ? (
                <img
                  src={image}
                  alt="User"
                  data-testid={`image${_id + 1}`}
                  className={styles.TableImage}
                />
              ) : (
                <div className={styles.avatarContainer}>
                  <Avatar
                    key={_id + '1'}
                    containerStyle={styles.imageContainer}
                    avatarStyle={styles.TableImageSmall}
                    name={firstName + ' ' + lastName}
                    alt={firstName + ' ' + lastName}
                  />
                </div>
              )}
              {firstName + ' ' + lastName}
            </div>
          </>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      align: 'center',
      minWidth: 100,
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return (
          <div
            className="d-flex justify-content-center"
            data-testid="userEmail"
          >
            {params.row.user.email}
          </div>
        );
      },
    },
    {
      field: 'hoursVolunteered',
      headerName: 'Hours Volunteered',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: `${styles.tableHeader}`,
      renderCell: (params: GridCellParams) => {
        return <div className="fw-bold">{params.row.hoursVolunteered}</div>;
      },
    },
  ];

  return (
    <div className="mt-4 mx-2 bg-white p-4 pt-2 rounded-4 shadow">
      {/* Header with search, filter  and Create Button */}
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        <SearchBar
          placeholder={t('searchByVolunteer')}
          onSearch={debouncedSearch}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-3 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <SortingButton
              sortingOptions={[
                { label: t('mostHours'), value: 'hours_DESC' },
                { label: t('leastHours'), value: 'hours_ASC' },
              ]}
              selectedOption={sortBy}
              onSortChange={(value) =>
                setSortBy(value as 'hours_DESC' | 'hours_ASC')
              }
              dataTestIdPrefix="sort"
              buttonLabel={tCommon('sort')}
            />
            <SortingButton
              sortingOptions={[
                { label: t('allTime'), value: TimeFrame.All },
                { label: t('weekly'), value: TimeFrame.Weekly },
                { label: t('monthly'), value: TimeFrame.Monthly },
                { label: t('yearly'), value: TimeFrame.Yearly },
              ]}
              selectedOption={timeFrame}
              onSortChange={(value) => setTimeFrame(value as TimeFrame)}
              dataTestIdPrefix="timeFrame"
              buttonLabel={t('timeFrame')}
              type="filter"
            />
          </div>
        </div>
      </div>

      {/* Table with Action Items */}
      <DataGrid
        disableColumnMenu
        columnBufferPx={7}
        hideFooter={true}
        getRowId={(row) => row.user._id}
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {t('noVolunteers')}
            </Stack>
          ),
        }}
        sx={dataGridStyle}
        getRowClassName={() => `${styles.rowBackground}`}
        autoHeight
        rowHeight={65}
        rows={rankings.map((ranking, index) => ({ id: index + 1, ...ranking }))}
        columns={columns}
        isRowSelectable={() => false}
      />
    </div>
  );
}

export default leaderboard;
