/**
 * CustomTableCell Component
 *
 * This component is a custom table cell that displays event details
 * fetched from a GraphQL query. It handles loading, error, and empty
 * states gracefully and renders event information in a table row.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.eventId - The unique identifier of the event to fetch details for.
 *
 * @returns {JSX.Element} A table row containing event details or appropriate
 * fallback UI for loading, error, or missing event states.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` hook to fetch event details.
 * - Displays a loading spinner while fetching data.
 * - Shows an error message if the query fails.
 * - Renders event details including title, start date, recurrence status,
 *   and the number of attendees.
 *
 * @example
 * ```tsx
 * <CustomTableCell eventId="12345" />
 * ```
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries.
 * - `@mui/material` for UI components like `TableCell` and `CircularProgress`.
 * - `react-router-dom` for navigation links.
 * - `style/app-fixed.module.css` for custom styles.
 *
 */
import { useQuery } from '@apollo/client';
import { CircularProgress, TableCell, TableRow } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { Link } from 'react-router';

export const CustomTableCell: React.FC<{ eventId: string }> = ({ eventId }) => {
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: { id: eventId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
    pollInterval: 30000,
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
    return (
      <TableRow data-testid="error-state">
        <TableCell colSpan={4} align="center">
          {`Unable to load event details. Please try again later.`}
        </TableCell>
      </TableRow>
    );
  }
  const event = data?.event;
  if (!event) {
    return (
      <TableRow data-testid="no-event-state">
        <TableCell colSpan={4} align="center">
          Event not found or has been deleted
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
