import React from 'react';
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './EventsAttendedCardItem';
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
  } = useQuery(EVENT_DETAILS, {
    variables: { id: eventsId },
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

  const { organization, _id, startDate, title, location } = events.event;

  return (
    <EventAttendedCard
      data-testid="EventsAttendedCard"
      type="Event"
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
