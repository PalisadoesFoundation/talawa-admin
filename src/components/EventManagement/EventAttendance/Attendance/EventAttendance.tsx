/**
 * EventAttendance component.
 *
 * Displays and manages the attendance of members for a specific event.
 * Provides filtering, sorting, searching attendees, and viewing statistics.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  DataGridWrapper,
  GridRenderCellParams,
} from '../../../../shared-components/DataGridWrapper/DataGridWrapper';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from '../Statistics/EventStatistics';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { FilterPeriod, InterfaceMember } from 'types/Event/interface';

// Define the row type for DataGridWrapper
interface IRowType {
  id: string;
  index: number;
  member: InterfaceMember;
}

function EventAttendance(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventAttendance' });
  const { eventId, orgId: currentUrl } = useParams<{
    eventId: string;
    orgId: string;
  }>();

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

  // Sorting function
  const sortAttendees = (attendees: InterfaceMember[]) =>
    [...attendees].sort((a, b) => {
      const comparison = (a.name || '')
        .toLowerCase()
        .localeCompare((b.name || '').toLowerCase());
      return sortOrder === 'ascending' ? comparison : -comparison;
    });

  // Filtering function
  const filterAttendees = (attendees: InterfaceMember[]) => {
    const now = new Date();
    if (filteringBy === FilterPeriod.All) return attendees;

    return attendees.filter((attendee) => {
      const date = new Date(attendee.createdAt);
      const sameYear = date.getFullYear() === now.getFullYear();
      return filteringBy === FilterPeriod.ThisMonth
        ? sameYear && date.getMonth() === now.getMonth()
        : sameYear;
    });
  };

  const filterAndSortAttendees = (attendees: InterfaceMember[]) =>
    sortAttendees(filterAttendees(attendees));

  // Search function
  const searchEventAttendees = (value: string) => {
    const searchLower = value.toLowerCase().trim();
    const filtered = (memberData?.event?.attendees || []).filter(
      (attendee: InterfaceMember) => {
        const name = attendee.name?.toLowerCase() || '';
        const email = attendee.emailAddress?.toLowerCase() || '';
        return name.includes(searchLower) || email.includes(searchLower);
      },
    );
    setFilteredAttendees(filterAndSortAttendees(filtered));
  };

  const showModal = () => setShow(true);
  const handleClose = () => setShow(false);

  // Attendance statistics
  const statistics = useMemo(() => {
    const total = filteredAttendees.length;
    const attended = filteredAttendees.filter(
      (m) => m.eventsAttended?.length,
    ).length;
    const rate = total > 0 ? Number(((attended / total) * 100).toFixed(2)) : 0;
    return {
      totalMembers: total,
      membersAttended: attended,
      attendanceRate: rate,
    };
  }, [filteredAttendees]);

  // Apollo query
  const [getEventAttendees, { data: memberData, loading, error }] =
    useLazyQuery(EVENT_ATTENDEES, {
      variables: { eventId },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    getEventAttendees();
  }, [eventId, getEventAttendees]);

  useEffect(() => {
    if (memberData?.event?.attendees) {
      setFilteredAttendees(filterAndSortAttendees(memberData.event.attendees));
    }
  }, [sortOrder, filteringBy, memberData]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{error.message}</p>;

  // Prepare rows for DataGridWrapper
  const rows: IRowType[] = filteredAttendees.map((member, index) => ({
    id: member.id,
    index: index + 1,
    member,
  }));

  // Define columns for DataGridWrapper
  const columns = [
    { field: 'index', headerName: '#', width: 50 },
    {
      field: 'member',
      headerName: t('Member Name'),
      renderCell: (params: GridRenderCellParams<IRowType['member']>) => (
        <Link
          to={`/member/${currentUrl}`}
          state={{ id: params.value.id }}
          className={styles.membername}
        >
          {params.value.name}
        </Link>
      ),
    },
    {
      field: 'member',
      headerName: t('Status'),
      renderCell: (params: GridRenderCellParams<IRowType['member']>) =>
        params.value.role === 'administrator' ? t('Admin') : t('Member'),
    },
    {
      field: 'member',
      headerName: t('Events Attended'),
      renderCell: (params: GridRenderCellParams<IRowType['member']>) =>
        params.value.eventsAttended?.length ?? 0,
    },
    {
      field: 'member',
      headerName: t('Task Assigned'),
      renderCell: (params: GridRenderCellParams<IRowType['member']>) =>
        params.value.tagsAssignedWith
          ? params.value.tagsAssignedWith.edges
              .map((e: { node: { name: string } }) => e.node.name)
              .join(', ')
          : 'None',
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

      <DataGridWrapper rows={rows} columns={columns} />
    </div>
  );
}

export default EventAttendance;
