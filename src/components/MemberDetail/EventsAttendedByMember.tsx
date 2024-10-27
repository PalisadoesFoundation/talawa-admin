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
  const { data: events } = useQuery(EVENT_DETAILS, {
    variables: { id: eventsId },
  });

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
