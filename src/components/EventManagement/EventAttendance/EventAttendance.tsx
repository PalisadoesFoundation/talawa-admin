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
  title: string;
}


function EventAttendance(): JSX.Element {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const { orgId: currentUrl } = useParams();
  const [setSearchText] = useState('');
  const [filteredAttendees, setFilteredAttendees] = useState<InterfaceMember[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>(
    'ascending',
  );
  const [show, setShow] = useState(false);

  const { data: memberData, refetch: memberRefetch } = useLazyQuery(
    EVENT_ATTENDEES,
    {
      variables: {
        id: eventId,
      },
    },
  );

  useEffect(() => {
    memberRefetch({
      id: eventId,
    });
  }, [eventId, memberRefetch]);

  useEffect(() => {
    if (memberData?.event?.attendees) {
      sortAttendees(memberData.event.attendees);
    }
  }, [sortOrder, memberData]);

  const sortAttendees = (attendees: InterfaceMember[]): void => {
    const sorted = [...attendees].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === 'ascending'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setFilteredAttendees(sorted);
  };

  const searchEventAttendees = (value: string): void => {
    setSearchText(value);
    if (memberData?.event?.attendees) {
      const filtered = memberData?.event?.attendees.filter(
        (attendee: InterfaceMember) =>
          attendee.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          attendee.lastName?.toLowerCase().includes(value.toLowerCase()) ||
          attendee.email?.toLowerCase().includes(value.toLowerCase()),
      );
      sortAttendees(filtered);
    }
  };

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
      <div className="border-1 border-top pb-4"></div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Button
            className={`border-1 bg-white text-success ${styles.actionBtn}`}
            onClick={showModal}
          >
            Attendance Statistics
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-end w-50">
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
      <TableContainer component={Paper} className="mt-3">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow className="" data-testid="row">
              <TableCell className={styles.customcell}>#</TableCell>
              <TableCell className={styles.customcell}>
                {t('Member Name')}
              </TableCell>
              <TableCell className={styles.customcell}>{t('Status')}</TableCell>
              <TableCell className={styles.customcell}>
                {t('Events Attended')}
              </TableCell>
              <TableCell className={styles.customcell}>
                {t('Task Assigned')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendees.map((member: InterfaceMember, index: number) => (
              <TableRow key={index} className="my-6">
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left">
                  <Link
                    to={`/member/${currentUrl}`}
                    state={{ id: member._id }}
                    className={styles.membername}
                  >
                    {member.firstName} {member.lastName}
                  </Link>
                </TableCell>
                <TableCell align="left">
                  {member.__typename === 'User' ? t('Member') : t('Admin')}
                </TableCell>
                <Tooltip
                  arrow
                  title={member.eventsAttended?.map((event: InterfaceEvent) => (
                    <AttendedEventList key={event._id} eventId={event._id} />
                  ))}
                >
                  <TableCell align="left">
                    <a href="#">
                      {member.eventsAttended
                        ? member.eventsAttended.length
                        : '0'}
                    </a>
                  </TableCell>
                </Tooltip>
                <TableCell align="left">
                  {member.tagsAssignedWith ? (
                    member.tagsAssignedWith.edges.map(
                      (edge: { node: { name: string; }; }, index: number) => (
                        <div key={index}>{edge.node.name}</div>
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
