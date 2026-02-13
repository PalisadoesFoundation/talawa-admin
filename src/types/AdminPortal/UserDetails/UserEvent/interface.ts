/**
 * Represents a UI-friendly event payload with formatted date/time
 * and minimal fields required for rendering user events.
 */
export interface InterfaceUserEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  creatorId: string;
}
/**
 * Represents a lightweight GraphQL user object containing
 * basic identity details used in event relationships.
 */
export interface InterfaceGQLUser {
  id: string;
  name: string;
}
/**
 * Represents a minimal GraphQL event reference used
 * for relational fields such as attended events.
 */
export interface InterfaceGQLEventLite {
  id: string;
}
/**
 * Represents a GraphQL organization entity associated
 * with events and user participation.
 */
export interface InterfaceGQLOrganization {
  id: string;
  name: string;
}
/**
 * GraphQL response payload containing events fetched
 * for a specific organization.
 */
export interface InterfaceGetUserEventsData {
  eventsByOrganizationId: InterfaceUserEventsGQL[];
}
/**
 * Represents detailed event data returned by GraphQL,
 * including metadata, attendees, creator, and organization.
 */
export interface InterfaceUserEventsGQL {
  id: string;
  name: string;
  description: string | null;
  startAt: string;
  endAt: string;
  allDay: boolean;
  location: string | null;
  isPublic: boolean;
  isRecurringEventTemplate: boolean;
  isRegisterable: boolean;
  createdAt: string;
  updatedAt: string;

  attendees: InterfaceGQLUser[];

  creator: InterfaceGQLUser & {
    eventsAttended: InterfaceGQLEventLite[];
  };

  organization: InterfaceGQLOrganization;
}
