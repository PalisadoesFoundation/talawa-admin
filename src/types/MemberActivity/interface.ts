export interface InterfaceCustomTableCellProps {
  eventId: string;
}

/**
 * Props for EventsAttendedByMember component.
 */
export interface InterfaceEventsAttendedByMemberProps {
  eventsId: string;
}

export interface InterfaceCardItem {
  title: string;
  time?: string;
  startdate?: string;
  creator?: string;
  location?: string;
  eventId?: string;
  orgId?: string;
}
