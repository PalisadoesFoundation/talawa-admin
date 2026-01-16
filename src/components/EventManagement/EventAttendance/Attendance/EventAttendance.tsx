/**
 * EventAttendance component.
 *
 * Displays and manages attendance for a specific event.
 * Provides filtering, sorting, searching of attendees, and viewing attendance statistics.
 *
 * @returns The rendered EventAttendance component.
 *
 * @remarks
 * - Uses Apollo Client lazy queries to fetch attendee data.
 * - Supports filtering by time range such as month, year, or all time.
 * - Allows sorting attendees alphabetically.
 * - Includes search by attendee name or email.
 * - Shows attendance statistics inside a modal.
 *
 * @example
 * ```tsx
 * <EventAttendance />
 * ```
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Paper, TableContainer } from '@mui/material';
import { Button } from 'react-bootstrap';
import DataTable from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import styles from 'style/app-fixed.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from '../Statistics/EventStatistics';
import { FilterPeriod, type InterfaceMember } from 'types/Event/interface';

function EventAttendance(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventAttendance' });
  const { eventId } = useParams<{ eventId: string }>();
  const { orgId: _currentUrl } = useParams();
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

  const [getEventAttendees, { data: memberData, loading, error }] =
    useLazyQuery(EVENT_ATTENDEES, {
      variables: { eventId },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    });

  const sortAttendees = (attendees: InterfaceMember[]) =>
    [...attendees].sort((a, b) => {
      const comparison = (a.name || '')
        .toLowerCase()
        .localeCompare((b.name || '').toLowerCase());
      return sortOrder === 'ascending' ? comparison : -comparison;
    });

  const filterAttendees = (attendees: InterfaceMember[]) => {
    const now = new Date();
    return filteringBy === FilterPeriod.All
      ? attendees
      : attendees.filter((attendee) => {
          const attendeeDate = new Date(attendee.createdAt);
          const isSameYear = attendeeDate.getFullYear() === now.getFullYear();
          return filteringBy === FilterPeriod.ThisMonth
            ? isSameYear && attendeeDate.getMonth() === now.getMonth()
            : isSameYear;
        });
  };

  const filterAndSortAttendees = (attendees: InterfaceMember[]) =>
    sortAttendees(filterAttendees(attendees));

  const searchEventAttendees = (value: string) => {
    const searchValue = value.toLowerCase().trim();
    const filtered = (memberData?.event?.attendees ?? []).filter(
      (attendee: InterfaceMember) =>
        (attendee.name?.toLowerCase() || '').includes(searchValue) ||
        (attendee.emailAddress?.toLowerCase() || '').includes(searchValue),
    );
    setFilteredAttendees(filterAndSortAttendees(filtered));
  };

  const showModal = () => setShow(true);
  const handleClose = () => setShow(false);

  const statistics = useMemo(() => {
    const totalMembers = filteredAttendees.length;
    const membersAttended = filteredAttendees.filter(
      (member: InterfaceMember) => member.eventsAttended?.length ?? 0 > 0,
    ).length;
    const attendanceRate =
      totalMembers > 0
        ? Number(((membersAttended / totalMembers) * 100).toFixed(2))
        : 0;

    return { totalMembers, membersAttended, attendanceRate };
  }, [filteredAttendees]);

  useEffect(() => {
    if (memberData?.event?.attendees) {
      setFilteredAttendees(filterAndSortAttendees(memberData.event.attendees));
    }
  }, [sortOrder, filteringBy, memberData]);

  useEffect(() => {
    getEventAttendees();
  }, [eventId, getEventAttendees]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{error.message}</p>;

  const columns: IColumnDef<InterfaceMember, unknown>[] = [
    {
      id: 'index',
      header: '#',
      accessor: (_member) => 0,
      render: (_value, row) => (
        <span>{filteredAttendees.indexOf(row) + 1}</span>
      ),
    },
    {
      id: 'name',
      header: 'Member Name',
      accessor: (member) => member.name ?? '',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (member) =>
        member.role === 'administrator' ? 'Admin' : 'Member',
    },
    {
      id: 'eventsAttended',
      header: 'Events Attended',
      accessor: (member) => member.eventsAttended ?? [],
      render: (value) => <span>{(value as { id: string }[]).length}</span>,
    },
    {
      id: 'tasksAssigned',
      header: 'Task Assigned',
      accessor: (member) => member.tagsAssignedWith?.edges ?? [],
      render: (value) =>
        (value as { node: { name: string } }[]).length > 0 ? (
          (value as { node: { name: string } }[]).map((edge, idx) => (
            <div key={idx}>{edge.node.name}</div>
          ))
        ) : (
          <div>{t('none')}</div>
        ),
    },
  ];

  return (
    <div>
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
              onChange={searchEventAttendees}
              onSearch={searchEventAttendees}
              onClear={() => searchEventAttendees('')}
              inputTestId="searchByName"
              buttonTestId="searchMembersBtn"
            />
          </div>
          <SortingButton
            title="Filter"
            sortingOptions={[
              { label: FilterPeriod.ThisMonth, value: FilterPeriod.ThisMonth },
              { label: FilterPeriod.ThisYear, value: FilterPeriod.ThisYear },
              { label: FilterPeriod.All, value: FilterPeriod.All },
            ]}
            selectedOption={filteringBy}
            onSortChange={(value) =>
              setFilteringBy(
                value as (typeof FilterPeriod)[keyof typeof FilterPeriod],
              )
            }
            dataTestIdPrefix="filter-dropdown"
            className={`${styles.dropdown} mx-4`}
            buttonLabel="Filter"
          />
          <SortingButton
            title="Sort"
            sortingOptions={[
              { label: 'Ascending', value: 'ascending' },
              { label: 'Descending', value: 'descending' },
            ]}
            selectedOption={sortOrder}
            onSortChange={(value) =>
              setSortOrder(value as 'ascending' | 'descending')
            }
            dataTestIdPrefix="sort-dropdown"
            buttonLabel="Sort"
          />
        </div>
      </div>
      <TableContainer
        component={Paper}
        className="mt-3"
        sx={{ borderRadius: '16px' }}
      >
        <DataTable columns={columns} data={filteredAttendees} />
      </TableContainer>
    </div>
  );
}

export default EventAttendance;
