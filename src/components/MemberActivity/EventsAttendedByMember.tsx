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
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './Card/EventsAttendedCardItem';
import Loader from 'components/Loader/Loader';

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
  } = useQuery(EVENT_DETAILS, {
    variables: { id: eventsId },
  });

  if (loading) return <Loader size="xl" />;
  if (error)
    return (
      <div data-testid="error" className="error-state">
        <p>Unable to load event details. Please try again later.</p>
      </div>
    );

  const { organization, _id, startDate, title, location } = events.event;

  return (
    <EventAttendedCard
      orgId={organization._id}
      eventId={_id}
      key={_id}
      startdate={startDate}
      title={title}
      location={location}
    />
  );
}

export default EventsAttendedByMember;
