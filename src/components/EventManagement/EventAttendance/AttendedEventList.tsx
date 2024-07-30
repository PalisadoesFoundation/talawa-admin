import React from 'react';
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
} from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';


interface InterfaceEventsAttended {
  eventId: string;
}

const AttendedEventList: React.FC<InterfaceEventsAttended> = ({ eventId }) => {
  const { data, loading } = useQuery(EVENT_DETAILS, {
    variables: { id: eventId },
  });

  if (loading) return <p>Loading...</p>;

  const event = data?.event;

  return (
    <React.Fragment>
      <Table className="bg-primary">
        <TableBody className="bg-primary">
          {event && (
            <TableRow key={event._id} className="bg-white rounded">
              <Link to={`/event/6437904485008f171cf29924/${event._id}`}>
                <TableCell style={{ color: 'blue' }}>
                  {event.title}
                </TableCell>
              </Link>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default AttendedEventList;
