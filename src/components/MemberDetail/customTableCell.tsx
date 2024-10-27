import { useQuery } from '@apollo/client';
import { CircularProgress, TableCell, TableRow } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import React from 'react';
import styles from '../../screens/MemberDetail/MemberDetail.module.css';
import { Link } from 'react-router-dom';

export const CustomTableCell: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: {
      id: eventId,
    },
  });

  if (loading)
    return (
      <TableRow>
        <TableCell colSpan={4}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    );

  if (error) {
    /*istanbul ignore next*/
    return (
      <tr>
        <td>Error loading event details</td>
      </tr>
    );
  }
  const event = data?.event;
  /*istanbul ignore next*/
  if (!event) {
    return (
      <TableRow>
        <TableCell colSpan={4} align="center">
          No event found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="my-6" data-testid="custom-row">
      <TableCell align="left">
        <Link
          to={`/event/${event.organization._id}/${event._id}`}
          state={{ id: event._id }}
          className={styles.membername}
        >
          {event.title}
        </Link>
      </TableCell>
      <TableCell align="left">
        {new Date(event.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell align="left">{event.recurring ? 'Yes' : 'No'}</TableCell>
      <TableCell align="left">
        {event.attendees ? event.attendees.length : '0'}
      </TableCell>
    </TableRow>
  );
};
