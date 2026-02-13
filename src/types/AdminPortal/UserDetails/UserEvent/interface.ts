export interface InterfaceUserEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isRecurringEventTemplate: boolean;
  creatorId: string;
}

export interface InterfaceGQLUser {
  id: string;
  name: string;
}

export interface InterfaceGQLEventLite {
  id: string;
}
export interface InterfaceGQLOrganization {
  id: string;
  name: string;
}

export interface InterfaceGetUserTagsData {
  eventsByOrganizationId: InterfaceUserTagGQL[];
}

export interface InterfaceUserTagGQL {
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
