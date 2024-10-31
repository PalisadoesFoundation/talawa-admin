import React, { useEffect, useState } from 'react';
import { Search } from '@mui/icons-material';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  Button,
  Dropdown,
  DropdownButton,
  Table,
  FormControl,
} from 'react-bootstrap';
import styles from './EventsAttendance.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AttendanceStatisticsModal } from './EventStatistics';
import AttendedEventList from './AttendedEventList';

interface InterfaceMember {
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  eventsAttended?: {
    _id: string;
  }[];
  birthDate: Date;
  __typename: string;
  _id: string;
  tagsAssignedWith: {
    edges: {
      node: {
        name: string;
      };
    }[];
  };
}
interface InterfaceEvent {
  _id: string;
  // title: string;
}

function EventAttendance(): JSX.Element {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const { orgId: currentUrl } = useParams();
  const [filteredAttendees, setFilteredAttendees] = useState<InterfaceMember[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>(
    'ascending',
  );
  const [filteringBy, setFilteringBy] = useState<
    'This Month' | 'This Year' | 'All'
  >('All');
  const [show, setShow] = useState(false);

  const { data: memberData, refetch: memberRefetch } = useLazyQuery(
    EVENT_ATTENDEES,
    {
      variables: {
        id: eventId,
      },
    },
  )[1];

  useEffect(() => {
    memberRefetch({
      id: eventId,
    });
  }, [eventId, memberRefetch]);

  const sortAttendees = (attendees: InterfaceMember[]): InterfaceMember[] => {
    return [...attendees].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === 'ascending'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  };

  const filterAttendees = (attendees: InterfaceMember[]): InterfaceMember[] => {
    const now = new Date();

    if (filteringBy === 'All') {
      return attendees;
    }

    return attendees.filter((attendee) => {
      const attendeeDate = new Date(attendee.createdAt);

      if (filteringBy === 'This Month') {
        return (
          attendeeDate.getMonth() === now.getMonth() &&
          attendeeDate.getFullYear() === now.getFullYear()
        );
      } else if (filteringBy === 'This Year') {
        return attendeeDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const filterAndSortAttendees = (
    attendees: InterfaceMember[],
  ): InterfaceMember[] => {
    return sortAttendees(filterAttendees(attendees));
  };

  const searchEventAttendees = (value: string): void => {
    const searchValueLower = value.toLowerCase().trim();

    const filtered =
      memberData?.event?.attendees?.filter((attendee: InterfaceMember) => {
        const fullName =
          `${attendee.firstName} ${attendee.lastName}`.toLowerCase();
        return (
          attendee.firstName?.toLowerCase().includes(searchValueLower) ||
          attendee.lastName?.toLowerCase().includes(searchValueLower) ||
          attendee.email?.toLowerCase().includes(searchValueLower) ||
          fullName.includes(searchValueLower)
        );
      }) ?? [];

    // Filter and sort the attendees based on the search results
    const finalFiltered = filterAndSortAttendees(filtered);
    setFilteredAttendees(finalFiltered);
  };
  useEffect(() => {
    if (memberData?.event?.attendees) {
      // If there's a search term, filter and sort based on it
      const updatedAttendees = filterAndSortAttendees(
        memberData.event.attendees,
      );
      setFilteredAttendees(updatedAttendees);
    }
  }, [sortOrder, filteringBy, memberData]);

  const showModal = (): void => setShow(true);
  const handleClose = (): void => setShow(false);

  const totalMembers = filteredAttendees.length;
  const membersAttended = filteredAttendees.filter(
    (member) => member?.eventsAttended && member.eventsAttended.length > 0,
  ).length;
  const attendanceRate =
    totalMembers > 0 ? (membersAttended / totalMembers) * 100 : 0;
  return (
    <div className="">
      <AttendanceStatisticsModal
        show={show}
        statistics={{ totalMembers, membersAttended, attendanceRate }}
        handleClose={handleClose}
        memberData={filteredAttendees}
      />
      <div className="d-flex justify-content-between">
        <div className="d-flex w-100">
          <Button
            className={`border-1 bg-white text-success ${styles.actionBtn}`}
            onClick={showModal}
            data-testid="stats-modal"
          >
            Historical Statistics
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-end w-100 ">
          <div className={styles.input}>
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
              <Search />
            </Button>
          </div>

          <DropdownButton
            data-testid="filter-dropdown"
            className={`border-1 mx-4`}
            title={
              <>
                <img
                  src="/images/svg/up-down.svg"
                  width={20}
                  height={20}
                  alt="Sort"
                  className={styles.sortImg}
                />
                <span className="ms-2">Filter: {filteringBy}</span>
              </>
            }
            onSelect={(eventKey) =>
              setFilteringBy(eventKey as 'This Month' | 'This Year' | 'All')
            }
          >
            <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
            <Dropdown.Item eventKey="This Year">This Year</Dropdown.Item>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
          </DropdownButton>
          <DropdownButton
            data-testid="sort-dropdown"
            className={`border-1 `}
            title={
              <>
                <img
                  src="/images/svg/up-down.svg"
                  width={20}
                  height={20}
                  alt="Sort"
                  className={styles.sortImg}
                />
                <span className="ms-2">Sort</span>
              </>
            }
            onSelect={(eventKey) =>
              setSortOrder(eventKey as 'ascending' | 'descending')
            }
          >
            <Dropdown.Item eventKey="ascending">Ascending</Dropdown.Item>
            <Dropdown.Item eventKey="descending">Descending</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      {/* <h3>{totalMembers}</h3> */}
      <TableContainer component={Paper} className="mt-3">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow className="" data-testid="table-header-row">
              <TableCell
                className={styles.customcell}
                data-testid="header-index"
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
            {filteredAttendees.map((member: InterfaceMember, index: number) => (
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
                <TableCell align="left" data-testid={`attendee-name-${index}`}>
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
                        backgroundColor: 'white',
                        fontSize: '2em',
                        maxHeight: '170px',
                        overflowY: 'scroll',
                        scrollbarColor: 'white',
                        border: '1px solid green',
                        borderRadius: '6px',
                        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                      },
                    },
                  }}
                  title={member.eventsAttended?.map(
                    (event: InterfaceEvent, index) => (
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
                    <a href="#">
                      {member.eventsAttended
                        ? member.eventsAttended.length
                        : '0'}
                    </a>
                  </TableCell>
                </Tooltip>
                <TableCell
                  align="left"
                  data-testid={`attendee-task-assigned-${index}`}
                >
                  {member.tagsAssignedWith ? (
                    member.tagsAssignedWith.edges.map(
                      (edge: { node: { name: string } }, tagIndex: number) => (
                        <div key={tagIndex}>{edge.node.name}</div>
                      ),
                    )
                  ) : (
                    <div>None</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default EventAttendance;
