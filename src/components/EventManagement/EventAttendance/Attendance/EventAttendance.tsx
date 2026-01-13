/**
 * Component: EventAttendance
 *
 * This component is responsible for displaying and managing the attendance of members for a specific event.
 * It provides functionalities such as filtering, sorting, and searching attendees, as well as viewing attendance statistics.
 *
 * @component
 * @returns {JSX.Element} The rendered EventAttendance component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useLazyQuery` to fetch event attendees data.
 * - Supports filtering attendees by time periods (e.g., This Month, This Year, All).
 * - Allows sorting attendees by name in ascending or descending order.
 * - Includes a search functionality to filter attendees by name or email.
 * - Displays attendance statistics in a modal.
 *
 * @dependencies
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
 * @todo
 * - Improve accessibility for tooltips and dropdowns.
 * - Optimize performance for large attendee lists.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Button, Table } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from '../Statistics/EventStatistics';
import AttendedEventList from '../AttendanceList/AttendedEventList';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import { FilterPeriod, type InterfaceMember } from 'types/Event/interface';

function EventAttendance(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventAttendance' });
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

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{error.message}</p>;

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
          style={{
            width: 'auto',
            minWidth: 'fit-content',
            whiteSpace: 'nowrap',
          }}
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
            title="Filter"
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
        <Table aria-label={t('event_attendance_table')} role="grid">
          <TableHead>
            <TableRow className="" data-testid="table-header-row">
              <TableCell
                className={styles.customcell}
                data-testid="header-index"
                role="columnheader"
                aria-sort="none"
              >
                #
              </TableCell>
              <TableCell
                className={styles.customcell}
                data-testid="header-member-name"
              >
                {t('Member Name')}
              </TableCell>
              <TableCell
                className={styles.customcell}
                data-testid="header-status"
              >
                {t('Status')}
              </TableCell>
              <TableCell
                className={styles.customcell}
                data-testid="header-events-attended"
              >
                {t('Events Attended')}
              </TableCell>
              <TableCell
                className={styles.customcell}
                data-testid="header-task-assigned"
              >
                {t('Task Assigned')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow className={styles.noBorderRow}>
                <TableCell colSpan={5} align="center">
                  {t('noAttendees')}
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map(
                (member: InterfaceMember, index: number) => (
                  <TableRow
                    key={index}
                    data-testid={`attendee-row-${index}`}
                    className="my-6"
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      data-testid={`attendee-index-${index}`}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="left"
                      data-testid={`attendee-name-${index}`}
                    >
                      <Link
                        to={`/member/${currentUrl}`}
                        state={{ id: member.id }}
                        className={styles.membername}
                      >
                        {member.name}
                      </Link>
                    </TableCell>
                    <TableCell
                      align="left"
                      data-testid={`attendee-status-${index}`}
                    >
                      {member.role === 'administrator'
                        ? t('Admin')
                        : t('Member')}
                    </TableCell>
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
                            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                          },
                        },
                      }}
                      title={member.eventsAttended?.map(
                        (event: { id: string }, index: number) => (
                          <AttendedEventList
                            key={event.id}
                            id={event.id}
                            data-testid={`attendee-events-attended-${index}`}
                          />
                        ),
                      )}
                    >
                      <TableCell
                        align="left"
                        data-testid={`attendee-events-attended-${index}`}
                      >
                        <span className={styles.eventsAttended}>
                          {member.eventsAttended
                            ? member.eventsAttended.length
                            : '0'}
                        </span>
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      align="left"
                      data-testid={`attendee-task-assigned-${index}`}
                    >
                      {member.tagsAssignedWith ? (
                        member.tagsAssignedWith.edges.map(
                          (
                            edge: { node: { name: string } },
                            tagIndex: number,
                          ) => <div key={tagIndex}>{edge.node.name}</div>,
                        )
                      ) : (
                        <div>None</div>
                      )}
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EventAttendance;
