import React from 'react'
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './EventsAttendedCardItem';

function EventsAttendedByMember({ eventsId }) {
    const {data:events} = useQuery(EVENT_DETAILS, {
      variables: { id: eventsId },
      });
  return (
    <div>
      <EventAttendedCard 
       data-testid="cardItem"
       type="Event"
       orgId={events?.event?.organization._id}
       eventId={events?.event?._id}
       key={events?.event?._id}  
       startdate={events?.event?.startDate}
       title={events?.event?.title}
       location={events?.event?.location}
      />
    </div>
  );
}

export default EventsAttendedByMember;
