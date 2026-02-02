/**
 * CustomTableCell Component
 *
 * This component is a custom table cell that displays event details
 * fetched from a GraphQL query. It handles loading, error, and empty
 * states gracefully and renders event information in a table row.
 *
 * @param props - Component props.
 * @param eventId - The unique identifier of the event to fetch details for.
 *
 * @returns A table row containing event details or appropriate
 * fallback UI for loading, error, or missing event states.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` hook to fetch event details.
 * - Displays a loading spinner while fetching data.
 * - Shows an error message if the query fails.
 * - Renders event details including title, start date,
 *   and the number of attendees.
 *
 * @example
 * ```tsx
 * <CustomTableCell eventId="12345" />
 * ```
 *
 */
import { useQuery } from '@apollo/client';
import { CircularProgress, TableCell, TableRow } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import React from 'react';
import styles from './customTableCell.module.css';
import { Link } from 'react-router';
import type { InterfaceCustomTableCellProps } from 'types/MemberActivity/interface';
import { useTranslation } from 'react-i18next';

export const CustomTableCell: React.FC<InterfaceCustomTableCellProps> = ({
  eventId,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberActivity' });
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: { eventId: eventId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
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
          {t('unableToLoadEventDetails')}
        </TableCell>
      </TableRow>
    );
  }
  const event = data?.event;
  if (!event) {
    return (
      <TableRow data-testid="no-event-state">
        <TableCell colSpan={4} align="center">
          {t('eventNotFound')}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="my-6" data-testid="custom-row">
      <TableCell align="left">
        <Link
          to={`/admin/event/${event.organization.id}/${event.id}`}
          className={styles.membername}
        >
          {event.name}
        </Link>
      </TableCell>
      <TableCell align="left">
        {new Date(event.startAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })}
      </TableCell>
      <TableCell align="left">
        {event.isRecurringEventTemplate ? t('yes') : t('no')}
      </TableCell>
      <TableCell align="left">
        <span title={t('numberOfAttendees')}>
          {event.attendees?.length ?? 0}
        </span>
      </TableCell>
    </TableRow>
  );
};
