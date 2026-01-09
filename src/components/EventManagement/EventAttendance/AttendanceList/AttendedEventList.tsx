/**
 * AttendedEventList Component
 *
 * This component renders a list of attended events in a table format.
 * It fetches event details using the `EVENT_DETAILS` GraphQL query and displays
 * the event title and start date. Each event is linked to its detailed page.
 *
 * @remarks
 * - Uses the `useQuery` hook from Apollo Client to fetch event details.
 * - Displays a loading message while fetching data and an error message if the query fails.
 * - Utilizes Material-UI components for table rendering.
 * - The `formatDate` utility is used to format the event's start date.
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import { TableBody, TableCell, TableRow, Table } from '@mui/material';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from 'utils/dateFormatter';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
import type { InterfaceEvent } from 'types/Event/interface';

const AttendedEventList: React.FC<Partial<InterfaceEvent>> = ({ id }) => {
  const { orgId: currentOrg } = useParams();
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: { eventId: id },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  if (error || data?.error) {
    return <p>Error loading event details. Please try again later.</p>;
  }

  const event = data?.event ?? null;

  if (loading) return <p>Loading...</p>;
  return (
    <React.Fragment>
      <Table className="bg-primary" aria-label="Attended events list">
        <TableBody className="bg-primary">
          {event && (
            <TableRow
              key={event.id}
              className="bg-white rounded"
              role="row"
              aria-label={`Event: ${event.name}`}
            >
              <TableCell>
                <Link
                  to={`/event/${currentOrg}/${event.id}`}
                  className={`d-flex justify-items-center align-items-center ${styles.blueTextNone}`}
                >
                  <DateIcon
                    title="Event Date"
                    fill="var(--bs-gray-600)"
                    width={25}
                    height={25}
                    className="mx-2 rounded-full"
                  />
                  <div>
                    <div>{event.name}</div>
                    <div>{formatDate(event.startAt)}</div>
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
