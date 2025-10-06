/**
 * @interface InterfaceVolunteerData
 * @description Defines the structure for volunteer data used in mutations.
 * @property {string} event - The event ID.
 * @property {string | null} group - The group ID, or null for individual volunteering.
 * @property {string} status - The status of the volunteer request.
 * @property {string} userId - The user ID of the volunteer.
 * @property {'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY'} [scope] - Optional scope for recurring events.
 * @property {string} [recurringEventInstanceId] - Optional instance ID for recurring events.
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
 * @interface InterfaceVolunteerGroupData
 * @description Defines the structure for volunteer group data used in mutations.
 * @property {string | undefined} eventId - The event ID, can be undefined for recurring events when baseEvent is used.
 * @property {string} [leaderId] - Optional leader ID for the volunteer group.
 * @property {string} name - The name of the volunteer group.
 * @property {string} description - The description of the volunteer group.
 * @property {number | null} volunteersRequired - The number of volunteers required, or null if not specified.
 * @property {string[]} volunteerUserIds - Array of user IDs for volunteer group members.
 * @property {'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY'} [scope] - Optional scope for recurring events.
 * @property {string} [recurringEventInstanceId] - Optional instance ID for recurring events.
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
 * @interface InterfaceEventEdge
 * @description Defines the structure for GraphQL event edge from queries.
 * @property {object} node - The event node containing all event data.
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
 * @interface InterfaceMappedEvent
 * @description Defines the structure for mapped event objects used in the UI.
 * @property {string} _id - Legacy ID format.
 * @property {string} id - The unique identifier of the event.
 * @property {string} name - The name of the event.
 * @property {string} title - The title of the event (mapped from name).
 * @property {string | null} description - The description of the event.
 * @property {string} startDate - The start date (mapped from startAt).
 * @property {string} endDate - The end date (mapped from endAt).
 * @property {string} startAt - The original startAt field.
 * @property {string} endAt - The original endAt field.
 * @property {string | null} location - The location of the event.
 * @property {boolean} recurring - Indicates if the event is recurring.
 * @property {boolean} isRecurringInstance - Indicates if this is a recurring instance.
 * @property {string | null} baseEventId - The base event ID for recurring events.
 * @property {object | null} [recurrenceRule] - The recurrence rule for recurring events.
 * @property {Array} volunteerGroups - Array of volunteer groups with mapped structure.
 * @property {Array} volunteers - Array of volunteers.
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
 * @interface InterfaceVolunteerStatus
 * @description Defines the structure for volunteer status button configuration.
 * @property {string} status - The status of the volunteer membership.
 * @property {string} buttonText - The text to display on the button.
 * @property {string} buttonVariant - The Bootstrap variant for the button.
 * @property {boolean} disabled - Whether the button should be disabled.
 * @property {React.ComponentType} icon - The icon component to display.
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
 * @interface InterfaceVolunteerMembership
 * @description Defines the structure for volunteer membership information.
 * @property {string} id - The unique identifier of the volunteer membership.
 * @property {string} status - The status of the volunteer membership.
 * @property {string} createdAt - The creation date of the volunteer membership record.
 * @property {string} updatedAt - The last update date of the volunteer membership record.
 * @property {object} event - The event associated with the volunteer membership.
 * @property {string} event.id - The unique identifier of the event.
 * @property {string} event.name - The name of the event.
 * @property {string} event.startAt - The start date of the event.
 * @property {string} event.endAt - The end date of the event.
 * @property {object} volunteer - The volunteer associated with the membership.
 * @property {string} volunteer.id - The unique identifier of the volunteer.
 * @property {boolean} volunteer.hasAccepted - Whether the volunteer has accepted.
 * @property {number} volunteer.hoursVolunteered - Hours volunteered.
 * @property {object} volunteer.user - The user information of the volunteer.
 * @property {string} volunteer.user.id - The unique identifier of the user.
 * @property {string} volunteer.user.name - The name of the user.
 * @property {string} volunteer.user.emailAddress - The email address of the user.
 * @property {string | null} [volunteer.user.avatarURL] - The avatar URL of the user.
 * @property {object | null} [group] - The group associated with the membership.
 * @property {string} group.id - The unique identifier of the group.
 * @property {string} group.name - The name of the group.
 * @property {object} createdBy - The user who created this membership.
 * @property {string} createdBy.id - The unique identifier of the creator.
 * @property {string} createdBy.name - The name of the creator.
 * @property {object} updatedBy - The user who last updated this membership.
 * @property {string} updatedBy.id - The unique identifier of the updater.
 * @property {string} updatedBy.name - The name of the updater.
 */
export interface InterfaceVolunteerMembership {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    startAt: string;
    endAt: string;
    recurrenceRule?: {
      id: string;
    } | null;
  };
  volunteer: {
    id: string;
    hasAccepted: boolean;
    hoursVolunteered: number;
    user: {
      id: string;
      name: string;
      emailAddress: string;
      avatarURL?: string | null;
    };
  };
  group?: {
    id: string;
    name: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
  };
  updatedBy: {
    id: string;
    name: string;
  };
}

/**
 * @interface InterfaceEventVolunteerInfo
 * @description Defines the structure for event volunteer information.
 * @property {string} id - The unique identifier of the event volunteer.
 * @property {boolean} hasAccepted - Indicates if the volunteer has accepted.
 * @property {'accepted' | 'rejected' | 'pending'} volunteerStatus - The status of the volunteer.
 * @property {number} hoursVolunteered - The number of hours volunteered.
 * @property {boolean} isPublic - Indicates if the volunteer profile is public.
 * @property {string} createdAt - The creation date of the volunteer record.
 * @property {string} updatedAt - The last update date of the volunteer record.
 * @property {object} user - The user information of the volunteer.
 * @property {string} user.id - The unique identifier of the user.
 * @property {string} user.name - The name of the user.
 * @property {string | null} [user.avatarURL] - The avatar URL of the user.
 * @property {object} event - The event associated with the volunteer.
 * @property {string} event.id - The unique identifier of the event.
 * @property {string} event.name - The name of the event.
 * @property {object} creator - The user who created this volunteer record.
 * @property {string} creator.id - The unique identifier of the creator.
 * @property {string} creator.name - The name of the creator.
 * @property {object} updater - The user who last updated this volunteer record.
 * @property {string} updater.id - The unique identifier of the updater.
 * @property {string} updater.name - The name of the updater.
 * @property {Array} groups - Array of groups associated with the volunteer.
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
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  event: {
    id: string;
    name: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
  };
  creator: {
    id: string;
    name: string;
  };
  updater: {
    id: string;
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
 * @interface InterfaceCreateVolunteerGroupData
 * @description Defines the structure for create volunteer group mutation data.
 * @property {string} eventId - The event ID.
 * @property {string} [leaderId] - The ID of the group leader (optional).
 * @property {string} name - The name of the volunteer group.
 * @property {string | null} [description] - The description of the volunteer group (optional).
 * @property {number | null} [volunteersRequired] - Number of volunteers required (optional).
 * @property {string[]} volunteerUserIds - Array of volunteer user IDs.
 * @property {'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY'} [scope] - Optional scope for recurring events.
 * @property {string} [recurringEventInstanceId] - Optional instance ID for recurring events.
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
