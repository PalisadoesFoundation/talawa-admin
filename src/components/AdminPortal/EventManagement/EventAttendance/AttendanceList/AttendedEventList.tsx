/**
 * AttendedEventList Component
 *
 * This component renders a list of attended events in a table format.
 * It fetches event details using the `EVENT_DETAILS` GraphQL query and displays
 * the event title and start date. Each event is linked to its detailed page.
 *
 * @param _id - The unique identifier of the event to fetch details for.
 *
 * @returns A React component that displays a list of attended events.
 *
 * @remarks
 * - Uses the `useQuery` hook from Apollo Client to fetch event details.
 * - Displays a loading message while fetching data and an error message if the query fails.
 * - Uses the shared DataTable component for table rendering.
 * - The `formatDate` utility is used to format the event's start date.
 *
 * @example
 * ```tsx
 * <AttendedEventList _id="event123" />
 * ```
 *
 * Dependencies:
 * - `@apollo/client` for GraphQL query handling.
 * - `react-router-dom` for navigation links.
 * - `utils/dateFormatter` for date formatting.
 * - `assets/svgs/cardItemDate.svg` for the date icon.
 * - `shared-components/DataTable` for table display.
 *
 */
import React, { useMemo } from 'react';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router';
import { formatDate } from 'utils/dateFormatter';
import DateIcon from 'assets/svgs/cardItemDate.svg?react';
import type { InterfaceEvent } from 'types/Event/interface';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'shared-components/DataTable/DataTable';
import type { IColumnDef } from 'types/shared-components/DataTable/interface';

const AttendedEventList: React.FC<Partial<InterfaceEvent>> = ({ id }) => {
  const { t: tCommon } = useTranslation('common');
  const { orgId: currentOrg } = useParams();
  const { data, loading, error } = useQuery(EVENT_DETAILS, {
    variables: { eventId: id },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  const event = data?.event ?? null;
  const tableData = useMemo(() => (event ? [event] : []), [event]);
  const columns = useMemo<IColumnDef<InterfaceEvent>[]>(
    () => [
      {
        id: 'event',
        header: '',
        accessor: 'name',
        render: (_, row) => (
          <Link
            to={`/admin/event/${currentOrg}/${row.id}`}
            className="d-flex justify-items-center align-items-center text-primary text-decoration-none"
            aria-label={`${tCommon('event')}: ${row.name}`}
          >
            <DateIcon
              title={tCommon('eventDate')}
              fill="var(--bs-gray-600)"
              width={25}
              height={25}
              className="mx-2 rounded-full"
            />
            <div>
              <div>{row.name}</div>
              <div>{formatDate(row.startAt)}</div>
            </div>
          </Link>
        ),
      },
    ],
    [currentOrg, tCommon],
  );

  if (error || data?.error) {
    return <p>{tCommon('errorLoadingEventDetails')}</p>;
  }

  if (loading)
    return (
      <LoadingState isLoading={loading} variant="spinner">
        <div />
      </LoadingState>
    );

  return (
    <DataTable<InterfaceEvent>
      data={tableData}
      columns={columns}
      rowKey="id"
      paginationMode="none"
      ariaLabel={tCommon('attendedEventsList')}
      tableClassName="bg-primary"
    />
  );
};
export default AttendedEventList;
