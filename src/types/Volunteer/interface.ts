/**
 * Defines the structure for volunteer data used in mutations.
 * @param event - The event ID.
 * @param group - The group ID, or null for individual volunteering.
 * @param status - The status of the volunteer request.
 * @param userId - The user ID of the volunteer.
 * @param scope - (Optional) Scope for recurring events.
 * @param recurringEventInstanceId - (Optional) Instance ID for recurring events.
 */
export interface InterfaceVolunteerData {
  event: string;
  group: string | null;
  status: string;
  userId: string;
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  recurringEventInstanceId?: string;
}

/**
 * Defines the structure for volunteer group data used in mutations.
 * @param eventId - The event ID, can be undefined for recurring events when baseEvent is used.
 * @param leaderId - (Optional) leader ID for the volunteer group.
 * @param name - The name of the volunteer group.
 * @param description - The description of the volunteer group.
 * @param volunteersRequired - The number of volunteers required, or null if not specified.
 * @param volunteerUserIds - Array of user IDs for volunteer group members.
 * @param scope - (Optional) scope for recurring events.
 * @param recurringEventInstanceId - (Optional) instance ID for recurring events.
 */
export interface InterfaceVolunteerGroupData {
  eventId: string | undefined;
  leaderId?: string;
  name: string;
  description: string;
  volunteersRequired: number | null;
  volunteerUserIds: string[];
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  recurringEventInstanceId?: string;
}

/**
 * Defines the structure for GraphQL event edge from queries.
 * @param node - The event node containing all event data.
 */
export interface InterfaceEventEdge {
  node: {
    id: string;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    location: string | null;
    allDay: boolean;
    isRecurringEventTemplate: boolean;
    baseEvent?: {
      id: string;
      name: string;
      isRecurringEventTemplate: boolean;
    } | null;
    recurrenceRule?: {
      id: string;
      frequency: string;
    } | null;
    volunteers: Array<{
      id: string;
      hasAccepted: boolean;
      volunteerStatus: string;
      user: {
        id: string;
        name: string;
      };
    }>;
    volunteerGroups: Array<{
      id: string;
      name: string;
      description: string | null;
      volunteersRequired: number | null;
      volunteers: Array<{
        id: string;
        hasAccepted: boolean;
        user: {
          id: string;
          name: string;
        };
      }>;
    }>;
  };
}

/**
 * Defines the structure for mapped event objects used in the UI.
 * @param _id - Legacy ID format.
 * @param id - The unique identifier of the event.
 * @param name - The name of the event.
 * @param title - The title of the event (mapped from name).
 * @param description - The description of the event.
 * @param startDate - The start date (mapped from startAt).
 * @param endDate - The end date (mapped from endAt).
 * @param startAt - The original startAt field.
 * @param endAt - The original endAt field.
 * @param location - The location of the event.
 * @param recurring - Indicates if the event is recurring.
 * @param isRecurringInstance - Indicates if this is a recurring instance.
 * @param baseEventId - The base event ID for recurring events.
 * @param recurrenceRule - (Optional) The recurrence rule for recurring events.
 * @param volunteerGroups - Array of volunteer groups with mapped structure.
 * @param volunteers - Array of volunteers.
 */
export interface InterfaceMappedEvent {
  _id: string;
  id: string;
  name: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  startAt: string;
  endAt: string;
  location: string | null;
  recurring: boolean;
  isRecurringInstance: boolean;
  baseEventId: string | null;
  recurrenceRule?: {
    id: string;
    frequency: string;
  } | null;
  volunteerGroups: Array<{
    _id: string;
    name: string;
    description: string | null;
    volunteersRequired: number | null;
    volunteers: Array<{
      id: string;
      hasAccepted: boolean;
      user: {
        id: string;
        name: string;
      };
    }>;
  }>;
  volunteers: Array<{
    id: string;
    hasAccepted: boolean;
    user: {
      id: string;
      name: string;
    };
  }>;
}

/**
 * Defines the structure for volunteer status button configuration.
 * @param status - The status of the volunteer membership.
 * @param buttonText - The text to display on the button.
 * @param buttonVariant - The Bootstrap variant for the button.
 * @param disabled - Whether the button should be disabled.
 * @param icon - The icon component to display.
 */
export interface InterfaceVolunteerStatus {
  status: string;
  buttonText: string;
  buttonVariant:
    | 'outline-success'
    | 'outline-warning'
    | 'outline-danger'
    | 'outline-secondary';
  disabled: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

/**
 * Defines the structure for volunteer membership information.
 * @param id - The unique identifier of the volunteer membership.
 * @param status - The status of the volunteer membership.
 * @param createdAt - The creation date of the volunteer membership record.
 * @param updatedAt - The last update date of the volunteer membership record.
 * @param event - The event object associated with the volunteer membership.
 * @param volunteer - The volunteer object associated with the membership.
 * @param group - (Optional) The group object associated with the membership.
 * @param createdBy - The user object who created this membership.
 * @param updatedBy - The user object who last updated this membership.
 */
export interface InterfaceVolunteerMembership {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  event: {
    /** The unique identifier of the event */
    id: string;
    /** The name of the event */
    name: string;
    /** The start of the event */
    startAt: string;
    /** The end of the event */
    endAt: string;
    recurrenceRule?: {
      id: string;
    } | null;
  };
  volunteer: {
    /** The unique identifier of the event */
    id: string;
    /** Whether the volunteer has accepted */
    hasAccepted: boolean;
    /** Hours volunteered */
    hoursVolunteered: number;
    /** The user information of the volunteer */
    user: {
      /** The unique identifier of the user */
      id: string;
      /** The name of the user */
      name: string;
      /** The email address of the user */
      emailAddress: string;
      /** The avatar URL of the user (optional) */
      avatarURL?: string | null;
    };
  };
  group?: {
    /** The unique identifier of the group */
    id: string;
    /** The name of the group */
    name: string;
  } | null;
  createdBy: {
    /** The unique identifier of the creator */
    id: string;
    /** The name of the creator */
    name: string;
  };
  updatedBy: {
    /** The unique identifier of the updater */
    id: string;
    /** The name of the updater */
    name: string;
  };
}

/**
 * Defines the structure for event volunteer information.
 * @param id - The unique identifier of the event volunteer.
 * @param hasAccepted - Indicates if the volunteer has accepted.
 * @param volunteerStatus - The status of the volunteer.
 * @param hoursVolunteered - The number of hours volunteered.
 * @param isPublic - Indicates if the volunteer profile is public.
 * @param createdAt - The creation date of the volunteer record.
 * @param updatedAt - The last update date of the volunteer record.
 * @param user - The user object information of the volunteer.
 * @param event - The event object associated with the volunteer.
 * @param creator - The user object who created this volunteer record.
 * @param updater - The user object who last updated this volunteer record.
 * @param groups - Array of groups associated with the volunteer.
 */
export interface InterfaceEventVolunteerInfo {
  id: string;
  hasAccepted: boolean;
  volunteerStatus: 'accepted' | 'rejected' | 'pending';
  hoursVolunteered: number;
  isPublic: boolean;
  isTemplate: boolean;
  isInstanceException: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    /** The unique identifier of the user */
    id: string;
    /** The name of the user */
    name: string;
    /** The avatar URL of the user (optional) */
    avatarURL?: string | null;
  };
  event: {
    /** The unique identifier of the event */
    id: string;
    /** The name of the event */
    name: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
  };
  creator: {
    /** The unique identifier of the creator */
    id: string;
    /** The name of the creator */
    name: string;
  };
  updater: {
    /** The unique identifier of the updater */
    id: string;
    /** The name of the updater */
    name: string;
  };
  groups: {
    id: string;
    name: string;
    description: string | null;
    volunteers: {
      id: string;
    }[];
  }[];
}

/**
 * Defines the structure for create volunteer group mutation data.
 * @param eventId - The event ID.
 * @param leaderId - (Optional) The ID of the group leader.
 * @param name - The name of the volunteer group.
 * @param description - (Optional) The description of the volunteer group.
 * @param volunteersRequired - (Optional) Number of volunteers required.
 * @param volunteerUserIds - Array of volunteer user IDs.
 * @param scope - (Optional) Scope for recurring events.
 * @param recurringEventInstanceId - (Optional) Instance ID for recurring events.
 */
export interface InterfaceCreateVolunteerGroupData {
  eventId: string | undefined;
  leaderId?: string;
  name: string;
  description?: string | null;
  volunteersRequired?: number | null;
  volunteerUserIds: string[];
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  recurringEventInstanceId?: string;
}
