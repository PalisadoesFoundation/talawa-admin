import React from 'react';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from 'utils/dateFormatter';
import { ReactComponent as DateIcon } from 'assets/svgs/cardItemDate.svg';

interface InterfaceEventsAttended {
  eventId: string;
}

const AttendedEventList: React.FC<InterfaceEventsAttended> = ({ eventId }) => {
  const { orgId: currentOrg } = useParams();
  const { data, loading } = useQuery(EVENT_DETAILS, {
    variables: { id: eventId },
  });

  const event = data?.event;

  if (loading) return <p>Loading...</p>;

  return (
    <React.Fragment>
      <Table className="bg-primary">
        <TableBody className="bg-primary">
          {event && (
            <TableRow key={event._id} className="bg-white rounded">
              <TableCell>
                <Link
                  to={`/event/${currentOrg}/${event._id}`}
                  className="d-flex justify-items-center align-items-center"
                  style={{ color: 'blue', textDecoration: 'none' }}
                >
                  <DateIcon
                    title="Event Date"
                    fill="var(--bs-gray-600)"
                    width={25}
                    height={25}
                    className="mx-2 rounded-full"
                  />
                  <div>
                    <div>{event.title}</div>
                    <div>{formatDate(event.startDate)}</div>
                  </div>
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default AttendedEventList;
