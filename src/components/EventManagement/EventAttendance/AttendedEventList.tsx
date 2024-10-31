import React from 'react';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from 'utils/dateFormatter';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
interface InterfaceEventsAttended {
  eventId: string;
}

const AttendedEventList: React.FC<InterfaceEventsAttended> = ({ eventId }) => {
  const { orgId: currentOrg } = useParams();
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: { id: eventId },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  if (error || data?.error) {
    return <p>Error loading event details. Please try again later.</p>;
  }

  const event = data?.event;

  if (loading) return <p>Loading...</p>;
  return (
    <React.Fragment>
      <Table className="bg-primary" aria-label="Attended events list">
        <TableBody className="bg-primary">
          {event && (
            <TableRow
              key={event._id}
              className="bg-white rounded"
              role="row"
              aria-label={`Event: ${event.title}`}
            >
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
