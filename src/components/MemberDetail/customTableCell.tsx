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
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  if (loading)
    return (
      <TableRow data-testid="loading-state">
        <TableCell colSpan={4}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    );

  if (error) {
    /*istanbul ignore next*/
    return (
      <TableRow data-testid="error-state">
        <TableCell colSpan={4} align="center">
          {`Error loading event details: ${error.message}`}
        </TableCell>
      </TableRow>
    );
  }
  const event = data?.event;
  /*istanbul ignore next*/
  if (!event) {
    return (
      <TableRow data-testid="no-event-state">
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
          className={styles.membername}
        >
          {event.title}
        </Link>
      </TableCell>
      <TableCell align="left">
        {new Date(event.startDate).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </TableCell>
      <TableCell align="left">{event.recurring ? 'Yes' : 'No'}</TableCell>
      <TableCell align="left">
        <span title="Number of attendees">{event.attendees?.length ?? 0}</span>
      </TableCell>
    </TableRow>
  );
};
