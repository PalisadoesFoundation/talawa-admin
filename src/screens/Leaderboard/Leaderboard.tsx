import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Search, WarningAmberRounded } from '@mui/icons-material';
import gold from 'assets/images/gold.png';
import silver from 'assets/images/silver.png';
import bronze from 'assets/images/bronze.png';

import type { InterfaceVolunteerRank } from 'utils/interfaces';
import styles from '../../style/app.module.css';
import Loader from 'components/Loader/Loader';
import {
  DataGrid,
  type GridCellParams,
  type GridColDef,
} from '@mui/x-data-grid';
import { debounce, Stack } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';
import { useQuery } from '@apollo/client';
import SortingButton from 'subComponents/SortingButton';

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
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.5rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.5rem',
  },
};

/**
 * Component to display the leaderboard of volunteers.
 *
 * This component shows a leaderboard of volunteers ranked by hours contributed,
 * with features for filtering by time frame and sorting by hours. It displays
 * volunteer details including rank, name, email, and hours volunteered.
 *
 * @returns The rendered component.
 */
function leaderboard(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'leaderboard',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Get the organization ID from URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>('');
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
    data?: {
      getVolunteerRanks: InterfaceVolunteerRank[];
    };
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
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={t('searchByVolunteer')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center`}
            style={{ marginBottom: '10px' }}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
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
        rows={rankings.map((ranking, index) => ({
          id: index + 1,
          ...ranking,
        }))}
        columns={columns}
        isRowSelectable={() => false}
      />
    </div>
  );
}

export default leaderboard;
