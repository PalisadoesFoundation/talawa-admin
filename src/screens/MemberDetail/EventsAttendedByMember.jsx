import React from 'react'
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './EventsAttendedCardItem';

function EventsAttendedByMember({eventsId}) {
    console.log(eventsId)
    const {data:events} = useQuery(EVENT_DETAILS, {
      variables: { id: eventsId },
      });
      console.log(events)
  return (
    <div>
      <EventAttendedCard 
       data-testid="cardItem"
       type="Event"
       key={events?.event?._id}  
       startdate={events?.event?.startDate}
       title={events?.event?.title}
       location={events?.event?.location}
      />
        {/* <CardItem
                  data-testid="cardItem"
                  type="Event"
                  key={events?.event?._id}  
                  startdate={events?.event?.startDate}
                  enddate={events?.event?.endDate}
                  title={events?.event?.title}
                  location={events?.event?.location}
        /> */}
    </div>
  )
}

export default EventsAttendedByMember