/**
 * Component: EventAttendance
 *
 * This component is responsible for displaying and managing the attendance of members for a specific event.
 * It provides functionalities such as filtering, sorting, and searching attendees, as well as viewing attendance statistics.
 *
 * @returns The rendered EventAttendance component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useLazyQuery` to fetch event attendees data.
 * - Supports filtering attendees by time periods (e.g., This Month, This Year, All).
 * - Allows sorting attendees by name in ascending or descending order.
 * - Includes a search functionality to filter attendees by name or email.
 * - Displays attendance statistics in a modal.
 *
 * Dependencies:
 * - React and React hooks (`useState`, `useEffect`, `useMemo`).
 * - Apollo Client for GraphQL queries.
 * - React Router's `useParams` for accessing route parameters.
 * - Material-UI and React-Bootstrap for UI components.
 * - `react-i18next` for internationalization.
 *
 * @example
 * ```tsx
 * <EventAttendance />
 * ```
 *
 *
 *
 * TODO:
 * - Improve accessibility for tooltips and dropdowns.
 * - Optimize performance for large attendee lists.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from '@mui/material';
import Button from 'shared-components/Button';
import styles from './EventAttendance.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from '../Statistics/EventStatistics';
import AttendedEventList from '../AttendanceList/AttendedEventList';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { FilterPeriod, type InterfaceMember } from 'types/Event/interface';
import { DataGridWrapper, GridColDef } from 'shared-components/DataGridWrapper';

function EventAttendance(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventAttendance' });
  const { t: tCommon } = useTranslation('common');
  const { eventId } = useParams<{ eventId: string }>();
  const { orgId: currentUrl } = useParams();
  const [filteredAttendees, setFilteredAttendees] = useState<InterfaceMember[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>(
    'ascending',
  );
  const [filteringBy, setFilteringBy] = useState<
    (typeof FilterPeriod)[keyof typeof FilterPeriod]
  >(FilterPeriod.All);

  const [show, setShow] = useState(false);

  const sortAttendees = (attendees: InterfaceMember[]): InterfaceMember[] => {
    return [...attendees].sort((a, b) => {
      const comparison = (a.name || '')
        .toLowerCase()
        .localeCompare((b.name || '').toLowerCase());
      return sortOrder === 'ascending' ? comparison : -comparison;
    });
  };

  const filterAttendees = (attendees: InterfaceMember[]): InterfaceMember[] => {
    const now = new Date();
    return filteringBy === 'All'
      ? attendees
      : attendees.filter((attendee) => {
          const attendeeDate = new Date(attendee.createdAt);
          const isSameYear = attendeeDate.getFullYear() === now.getFullYear();
          return filteringBy === 'This Month'
            ? isSameYear && attendeeDate.getMonth() === now.getMonth()
            : isSameYear;
        });
  };

  const filterAndSortAttendees = (
    attendees: InterfaceMember[],
  ): InterfaceMember[] => {
    return sortAttendees(filterAttendees(attendees));
  };
  const searchEventAttendees = (value: string): void => {
    const searchValueLower = value.toLowerCase().trim();

    const filtered = (memberData?.event?.attendees ?? []).filter(
      (attendee: InterfaceMember) => {
        const name = attendee.name?.toLowerCase() || '';
        const email = attendee.emailAddress?.toLowerCase() || '';
        return (
          name.includes(searchValueLower) || email.includes(searchValueLower)
        );
      },
    );

    const finalFiltered = filterAndSortAttendees(filtered);
    setFilteredAttendees(finalFiltered);
  };
  const showModal = (): void => setShow(true);
  const handleClose = (): void => setShow(false);

  const statistics = useMemo(() => {
    const totalMembers = filteredAttendees.length;
    const membersAttended = filteredAttendees.filter(
      (member) => member?.eventsAttended && member.eventsAttended.length > 0,
    ).length;
    const attendanceRate =
      totalMembers > 0
        ? Number(((membersAttended / totalMembers) * 100).toFixed(2))
        : 0;

    return { totalMembers, membersAttended, attendanceRate };
  }, [filteredAttendees]);

  const [getEventAttendees, { data: memberData, loading, error }] =
    useLazyQuery(EVENT_ATTENDEES, {
      variables: { eventId: eventId },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (memberData?.event?.attendees) {
      const updatedAttendees = filterAndSortAttendees(
        memberData.event.attendees,
      );
      setFilteredAttendees(updatedAttendees);
    }
  }, [sortOrder, filteringBy, memberData]);

  useEffect(() => {
    getEventAttendees();
  }, [eventId, getEventAttendees]);

  const columns: GridColDef<InterfaceMember & { index: number }>[] = useMemo(
    () => [
      {
        field: 'index',
        headerName: '#',
        width: 70,
        sortable: false,
        filterable: false,
        headerAlign: 'left',
        align: 'left',
      },
      {
        field: 'name',
        headerName: t('Member Name'),
        width: 200,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Link
            to={`/admin/member/${currentUrl}/${params.row.id}`}
            state={{ id: params.row.id }}
            className={styles.membername}
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: 'status',
        headerName: t('Status'),
        width: 150,
        sortable: false,
        filterable: false,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) =>
          params.row.role === 'administrator' ? t('Admin') : t('Member'),
      },
      {
        field: 'eventsAttended',
        headerName: t('Events Attended'),
        width: 180,
        sortable: false,
        filterable: false,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'var(--bs-white)',
                  fontSize: '2em',
                  maxHeight: '170px',
                  overflowY: 'scroll',
                  scrollbarColor: 'white',
                  border: 'var(--primary-border-solid)',
                  borderRadius: '6px',
                  boxShadow:
                    'var(--shadow-offset-sm) var(--shadow-blur-md) var(--shadow-spread-xs) rgba(var(--color-black), 0.1)',
                },
              },
            }}
            title={
              params.row.eventsAttended?.map(
                (event: { id: string }, index: number) => (
                  <AttendedEventList
                    key={event.id}
                    id={event.id}
                    data-testid={`attendee-events-attended-${index}`}
                  />
                ),
              ) || []
            }
          >
            <span className={styles.eventsAttended}>
              {params.row.eventsAttended
                ? params.row.eventsAttended.length
                : '0'}
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'tagsAssignedWith',
        headerName: t('Task Assigned'),
        width: 200,
        sortable: false,
        filterable: false,
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) =>
          params.row.tagsAssignedWith ? (
            <>
              {params.row.tagsAssignedWith.edges.map(
                (edge: { node: { name: string } }, tagIndex: number) => (
                  <div key={tagIndex}>{edge.node.name}</div>
                ),
              )}
            </>
          ) : (
            <div>{tCommon('none')}</div>
          ),
      },
    ],
    [t, currentUrl, tCommon],
  );

  const rowsWithIndex = useMemo(
    () =>
      filteredAttendees.map((attendee, index) => ({
        ...attendee,
        index: index + 1,
      })),
    [filteredAttendees],
  );

  return (
    <div className="">
      <AttendanceStatisticsModal
        show={show}
        statistics={statistics}
        handleClose={handleClose}
        memberData={filteredAttendees}
        t={t}
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          className={`border-1 bg-white text-success ${styles.createButton}`}
          onClick={showModal}
          data-testid="stats-modal"
        >
          {t('historical_statistics')}
        </Button>
        <div className="d-flex align-items-center">
          <div className={`${styles.input} me-3`}>
            <SearchBar
              placeholder={t('Search member')}
              onChange={(value) => searchEventAttendees(value)}
              onSearch={(value) => searchEventAttendees(value)}
              onClear={() => searchEventAttendees('')}
              inputTestId="searchByName"
              buttonTestId="searchMembersBtn"
            />
          </div>
          <SortingButton
            title={tCommon('filter')}
            sortingOptions={[
              { label: FilterPeriod.ThisMonth, value: FilterPeriod.ThisMonth },
              { label: FilterPeriod.ThisYear, value: FilterPeriod.ThisYear },
              { label: FilterPeriod.All, value: 'Filter: All' },
            ]}
            selectedOption={filteringBy}
            onSortChange={(value) =>
              setFilteringBy(
                value as (typeof FilterPeriod)[keyof typeof FilterPeriod],
              )
            }
            dataTestIdPrefix="filter-dropdown"
            className={`${styles.dropdown} mx-4`}
            buttonLabel={tCommon('filter')}
          />
          <SortingButton
            title={tCommon('sort')}
            sortingOptions={[
              { label: tCommon('ascending'), value: 'ascending' },
              { label: tCommon('descending'), value: 'descending' },
            ]}
            selectedOption={sortOrder}
            onSortChange={(value) =>
              setSortOrder(value as 'ascending' | 'descending')
            }
            dataTestIdPrefix="sort-dropdown"
            buttonLabel={tCommon('sort')}
          />
        </div>
      </div>
      <DataGridWrapper
        rows={rowsWithIndex}
        columns={columns}
        loading={loading}
        error={error ? error.message : undefined}
        emptyStateProps={{
          message: t('noAttendees'),
          dataTestId: 'empty-state-noattendees',
        }}
      />
    </div>
  );
}

export default EventAttendance;
