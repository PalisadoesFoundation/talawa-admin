/**
 * @file volunteerQueries.ts
 * @description Defines TypeScript interfaces for volunteer-related GraphQL query results.
 */

import type { InterfaceVolunteerMembership } from 'types/Volunteer/interface';

export interface IGetVolunteerMembershipResult {
  getVolunteerMembership: InterfaceVolunteerMembership[];
}

export interface IGetEventVolunteerGroupsResult {
  event: {
    id: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
    volunteerGroups: Array<{
      id: string;
      name: string;
      description: string | null;
      volunteersRequired: number | null;
      isTemplate: boolean;
      isInstanceException: boolean;
      createdAt: string;
      creator: {
        id: string;
        name: string;
        avatarURL?: string | null;
      };
      leader: {
        id: string;
        name: string;
        avatarURL?: string | null;
      };
      volunteers: Array<{
        id: string;
        hasAccepted: boolean;
        user: {
          id: string;
          name: string;
          avatarURL?: string | null;
        };
      }>;
      event: {
        id: string;
      };
    }>;
  };
}

export interface IGetEventVolunteersResult {
  event: {
    id: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
    volunteers: Array<{
      id: string;
      hasAccepted: boolean;
      volunteerStatus: string;
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
      };
      creator: {
        id: string;
        name: string;
      };
      updater: {
        id: string;
        name: string;
      };
      groups: Array<{
        id: string;
        name: string;
        description: string | null;
        volunteers: Array<{
          id: string;
        }>;
      }>;
    }>;
  };
}

export interface IUserEventsVolunteerResult {
  organization: {
    id: string;
    events: {
      edges: Array<{
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
      }>;
    };
  };
}
