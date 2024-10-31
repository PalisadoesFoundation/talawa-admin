import React from 'react';
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './EventsAttendedCardItem';

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

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">Error: {error.message}</div>;

  return (
    <React.Fragment>
      <EventAttendedCard
        data-testid="EventsAttendedCard"
        type="Event"
        orgId={events?.event?.organization._id}
        eventId={events?.event?._id}
        key={events?.event?._id}
        startdate={events?.event?.startDate}
        title={events?.event?.title}
        location={events?.event?.location}
      />
    </React.Fragment>
  );
}

export default EventsAttendedByMember;
