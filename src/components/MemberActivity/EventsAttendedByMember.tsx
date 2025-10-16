/**
 * Component to display the details of events attended by a member.
 *
 * This component fetches event details using the `EVENT_DETAILS` GraphQL query
 * and displays the information in a card format using the `EventAttendedCard` component.
 * It handles loading and error states gracefully.
 *
 * @component
 * @param {InterfaceEventsAttendedByMember} props - The props for the component.
 * @param {string} props.eventsId - The ID of the event to fetch details for.
 *
 * @returns {JSX.Element} A React component that displays event details or appropriate
 * loading/error messages.
 *
 * @example
 * ```tsx
 * <EventsAttendedByMember eventsId="12345" />
 * ```
 *
 * @remarks
 * - Uses the `useQuery` hook from Apollo Client to fetch event details.
 * - Displays a loading spinner while the data is being fetched.
 * - Shows an error message if the query fails.
 */
import React from 'react';
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './Card/EventsAttendedCardItem';
import { Spinner } from 'react-bootstrap';

interface InterfaceEventsAttendedByMember {
  eventsId: string;
}

function EventsAttendedByMember({
  eventsId,
}: InterfaceEventsAttendedByMember): JSX.Element {
  const {
    data: events,
    loading,
    error,
  } = useQuery(EVENT_DETAILS_BASIC, {
    variables: { eventId: eventsId },
  });

  if (loading)
    return (
      <div data-testid="loading" className="loading-state">
        <Spinner />
        <p>Loading event details...</p>
      </div>
    );
  if (error)
    return (
      <div data-testid="error" className="error-state">
        <p>Unable to load event details. Please try again later.</p>
      </div>
    );

  // Support both legacy and current schema fields from EVENT_DETAILS
  const { organization, id, _id, startAt, startDate, name, title, location } =
    events.event;

  return (
    <EventAttendedCard
      orgId={organization._id ?? organization.id}
      eventId={_id ?? id}
      key={_id ?? id}
      startdate={startDate ?? startAt}
      title={title ?? name}
      location={location}
    />
  );
}

export default EventsAttendedByMember;
