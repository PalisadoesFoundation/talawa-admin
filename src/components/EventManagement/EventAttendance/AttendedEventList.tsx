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
import { formatDate } from 'utils/dateFormatter';
import { ReactComponent as DateIcon } from 'assets/svgs/cardItemDate.svg';


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
                <TableCell style={{ color: 'blue' }} className='d-flex justify-items-center align-items-center'>
                <DateIcon
                  title="Event Date"
                  fill="var(--bs-gray-600)"
                  width={25}
                  height={25}
                  className='mx-2 rounded-full'
                />
                <div>
                <div>{event.title}</div>
                <div>{formatDate(event.startDate)}</div>
                </div>
                  
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
