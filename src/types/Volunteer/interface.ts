/**
 * Defines the structure for volunteer data used in mutations.
 */
export interface InterfaceVolunteerData {
  /** The event ID. */
  event: string;
  /** The group ID, or null for individual volunteering. */
  group: string | null;
  /** The status of the volunteer request. */
  status: string;
  /** The user ID of the volunteer. */
  userId: string;
  /** (Optional) Scope for recurring events. */
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  /** (Optional) Instance ID for recurring events. */
  recurringEventInstanceId?: string;
}

/**
 * Defines the structure for volunteer group data used in mutations.
 */
export interface InterfaceVolunteerGroupData {
  /** The event ID, can be undefined for recurring events when baseEvent is used. */
  eventId: string | undefined;
  /** (Optional) leader ID for the volunteer group. */
  leaderId?: string;
  /** The name of the volunteer group. */
  name: string;
  /** The description of the volunteer group. */
  description: string;
  /** The number of volunteers required, or null if not specified. */
  volunteersRequired: number | null;
  /** Array of user IDs for volunteer group members. */
  volunteerUserIds: string[];
  /** (Optional) scope for recurring events. */
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  /** (Optional) instance ID for recurring events. */
  recurringEventInstanceId?: string;
}

/**
 * Defines the structure for GraphQL event edge from queries.
 */
export interface InterfaceEventEdge {
  /** The event node containing all event data. */
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
 */
export interface InterfaceMappedEvent {
  /** Legacy ID format. */
  _id: string;
  /** The unique identifier of the event. */
  id: string;
  /** The name of the event. */
  name: string;
  /** The title of the event (mapped from name). */
  title: string;
  /** The description of the event. */
  description: string | null;
  /** The start date (mapped from startAt). */
  startDate: string;
  /** The end date (mapped from endAt). */
  endDate: string;
  /** The original startAt field. */
  startAt: string;
  /** The original endAt field. */
  endAt: string;
  /** The location of the event. */
  location: string | null;
  /** Indicates if the event is recurring. */
  recurring: boolean;
  /** Indicates if this is a recurring instance. */
  isRecurringInstance: boolean;
  /** The base event ID for recurring events. */
  baseEventId: string | null;
  /** (Optional) The recurrence rule for recurring events. */
  recurrenceRule?: {
    id: string;
    frequency: string;
  } | null;
  /** Array of volunteer groups with mapped structure. */
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
  /** Array of volunteers. */
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
 */
export interface InterfaceVolunteerStatus {
  /** The status of the volunteer membership. */
  status: string;
  /** The text to display on the button. */
  buttonText: string;
  /** The Bootstrap variant for the button. */
  buttonVariant:
    | 'outline-success'
    | 'outline-warning'
    | 'outline-danger'
    | 'outline-secondary';
  /** Whether the button should be disabled. */
  disabled: boolean;
  /** The icon component to display. */
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

/**
 * Defines the structure for volunteer membership information.
 */
export interface InterfaceVolunteerMembership {
  /** The unique identifier of the volunteer membership. */
  id: string;
  /** The status of the volunteer membership. */
  status: string;
  /** The creation date of the volunteer membership record. */
  createdAt: string;
  /** The last update date of the volunteer membership record. */
  updatedAt: string;
  /** The event object associated with the volunteer membership. */
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
  /** The volunteer object associated with the membership. */
  volunteer: {
    /** The unique identifier of the volunteer */
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
  /** (Optional) The group object associated with the membership. */
  group?: {
    /** The unique identifier of the group */
    id: string;
    /** The name of the group */
    name: string;
  } | null;
  /** The user object who created this membership. */
  createdBy: {
    /** The unique identifier of the creator */
    id: string;
    /** The name of the creator */
    name: string;
  };
  /** The user object who last updated this membership. */
  updatedBy: {
    /** The unique identifier of the updater */
    id: string;
    /** The name of the updater */
    name: string;
  };
}

/**
 * Defines the structure for event volunteer information.
 */
export interface InterfaceEventVolunteerInfo {
  /** The unique identifier of the event volunteer. */
  id: string;
  /** Indicates if the volunteer has accepted. */
  hasAccepted: boolean;
  /** The status of the volunteer. */
  volunteerStatus: 'accepted' | 'rejected' | 'pending';
  /** The number of hours volunteered. */
  hoursVolunteered: number;
  /** Indicates if the volunteer profile is public. */
  isPublic: boolean;
  /** Indicates if this is a template volunteer record. */
  isTemplate: boolean;
  /** Indicates if this is an exception to a recurring instance. */
  isInstanceException: boolean;
  /** The creation date of the volunteer record. */
  createdAt: string;
  /** The last update date of the volunteer record. */
  updatedAt: string;
  /** The user object information of the volunteer. */
  user: {
    /** The unique identifier of the user */
    id: string;
    /** The name of the user */
    name: string;
    /** The avatar URL of the user (optional) */
    avatarURL?: string | null;
  };
  /** The event object associated with the volunteer. */
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
  /** The user object who created this volunteer record. */
  creator: {
    /** The unique identifier of the creator */
    id: string;
    /** The name of the creator */
    name: string;
  };
  /** The user object who last updated this volunteer record. */
  updater: {
    /** The unique identifier of the updater */
    id: string;
    /** The name of the updater */
    name: string;
  };
  /** Array of groups associated with the volunteer. */
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
 */
export interface InterfaceCreateVolunteerGroupData {
  /** The event ID. */
  eventId: string | undefined;
  /** (Optional) The ID of the group leader. */
  leaderId?: string;
  /** The name of the volunteer group. */
  name: string;
  /** (Optional) The description of the volunteer group. */
  description?: string | null;
  /** (Optional) Number of volunteers required. */
  volunteersRequired?: number | null;
  /** Array of volunteer user IDs. */
  volunteerUserIds: string[];
  /** (Optional) Scope for recurring events. */
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  /** (Optional) Instance ID for recurring events. */
  recurringEventInstanceId?: string;
}
