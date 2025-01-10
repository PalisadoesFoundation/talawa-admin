import React, { useEffect, useMemo, useState } from 'react';
import { BiSearch as Search } from 'react-icons/bi';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Button, Table, FormControl } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from './EventStatistics';
import AttendedEventList from './AttendedEventList';
import type { InterfaceMember } from './InterfaceEvents';
import SortingButton from 'subComponents/SortingButton';

enum FilterPeriod {
  ThisMonth = 'This Month',
  ThisYear = 'This Year',
  All = 'All',
}

/**
 * Component to manage and display event attendance information
 * Includes filtering and sorting functionality for attendees
 * @returns JSX element containing the event attendance interface
 */
function EventAttendance(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventAttendance',
  });
  const { eventId } = useParams<{ eventId: string }>();
  const { orgId: currentUrl } = useParams();
  const [filteredAttendees, setFilteredAttendees] = useState<InterfaceMember[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>(
    'ascending',
  );
  const [filteringBy, setFilteringBy] = useState<FilterPeriod>(
    FilterPeriod.All,
  );
  const [show, setShow] = useState(false);

  const sortAttendees = (attendees: InterfaceMember[]): InterfaceMember[] => {
    return [...attendees].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === 'ascending'
        ? nameA.localeCompare(nameB)
        : /*istanbul ignore next*/
          nameB.localeCompare(nameA);
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
            : /*istanbul ignore next*/
              isSameYear;
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
        const fullName =
          `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
        return (
          attendee.firstName?.toLowerCase().includes(searchValueLower) ||
          attendee.lastName?.toLowerCase().includes(searchValueLower) ||
          attendee.email?.toLowerCase().includes(searchValueLower) ||
          fullName.includes(searchValueLower)
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
      variables: {
        id: eventId,
      },
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
  /*istanbul ignore next*/
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
          className={`border-1 bg-white text-success ${styles.actionBtn}`}
          onClick={showModal}
          data-testid="stats-modal"
        >
          {t('historical_statistics')}
        </Button>
        <div className="d-flex align-items-center">
          <div className={`${styles.input} me-3`}>
            <FormControl
              type="text"
              id="posttitle"
              className="bg-white border"
              placeholder={t('Search member')}
              data-testid="searchByName"
              autoComplete="off"
              required
              onChange={(e): void => searchEventAttendees(e.target.value)}
            />
            <Button
              tabIndex={-1}
              className={`position-absolute z-10 bottom-0 end-0 h-100`}
            >
              <Search size={20} />
            </Button>
          </div>
          <SortingButton
            title="Filter"
            sortingOptions={[
              {
                label: FilterPeriod.ThisMonth,
                value: FilterPeriod.ThisMonth,
              },
              { label: FilterPeriod.ThisYear, value: FilterPeriod.ThisYear },
              { label: FilterPeriod.All, value: 'Filter: All' },
            ]}
            selectedOption={filteringBy}
            onSortChange={(value) => setFilteringBy(value as FilterPeriod)}
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
      <TableContainer component={Paper} className="mt-3">
        <Table aria-label={t('event_attendance_table')} role="grid">
          <TableHead>
            <TableRow className="" data-testid="table-header-row" role="row">
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
              <TableRow>
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
                        state={{ id: member._id }}
                        className={styles.membername}
                      >
                        {member.firstName} {member.lastName}
                      </Link>
                    </TableCell>
                    <TableCell
                      align="left"
                      data-testid={`attendee-status-${index}`}
                    >
                      {member.__typename === 'User' ? t('Member') : t('Admin')}
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
                        (event: { _id: string }, index: number) => (
                          <AttendedEventList
                            key={event._id}
                            eventId={event._id}
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
                            : /*istanbul ignore next*/
                              '0'}
                        </span>
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      align="left"
                      data-testid={`attendee-task-assigned-${index}`}
                    >
                      {member.tagsAssignedWith ? (
                        /*istanbul ignore next*/
                        member.tagsAssignedWith.edges.map(
                          /*istanbul ignore next*/
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
