import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an event volunteer.
 *
 * @param data - The data required to create an event volunteer.
 * @returns The created event volunteer with full details.
 *
 */

export const ADD_VOLUNTEER = gql`
  mutation CreateEventVolunteer($data: EventVolunteerInput!) {
    createEventVolunteer(data: $data) {
      id
      hasAccepted
      hoursVolunteered
      isPublic
      createdAt
      user {
        id
        name
        avatarURL
      }
      event {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to delete an event volunteer.
 *
 * @param id - The ID of the event volunteer being deleted.
 * @returns The deleted event volunteer.
 *
 */
export const DELETE_VOLUNTEER = gql`
  mutation DeleteEventVolunteer($id: ID!) {
    deleteEventVolunteer(id: $id) {
      id
      user {
        id
        name
      }
      event {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to create an event volunteer group.
 *
 * @param data - The data required to create an event volunteer group.
 *  - data contains following fileds:
 *      - eventId: string
 *      - leaderId: string
 *      - name: string
 *      - description?: string
 *      - volunteers: [string]
 *      - volunteersRequired?: number
 * @returns The ID of the created event volunteer group.
 *
 */
export const CREATE_VOLUNTEER_GROUP = gql`
  mutation CreateEventVolunteerGroup($data: EventVolunteerGroupInput!) {
    createEventVolunteerGroup(data: $data) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update an event volunteer group.
 * @param id - The ID of the event volunteer group being updated.
 * @param data - The data required to update an event volunteer group.
 * @returns The ID of the updated event volunteer group.
 *
 */

export const UPDATE_VOLUNTEER_GROUP = gql`
  mutation UpdateEventVolunteerGroup(
    $id: ID!
    $data: UpdateEventVolunteerGroupInput!
  ) {
    updateEventVolunteerGroup(id: $id, data: $data) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete an event volunteer group.
 *
 * @param id - The ID of the event volunteer group being deleted.
 * @returns The ID of the deleted event volunteer group.
 *
 */
export const DELETE_VOLUNTEER_GROUP = gql`
  mutation DeleteEventVolunteerGroup($id: ID!) {
    deleteEventVolunteerGroup(id: $id) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete a volunteer from a specific recurring event instance.
 *
 * @param input - The input containing volunteerId and recurringEventInstanceId.
 * @returns The deleted volunteer information.
 */
export const DELETE_VOLUNTEER_FOR_INSTANCE = gql`
  mutation DeleteEventVolunteerForInstance(
    $input: DeleteEventVolunteerForInstanceInput!
  ) {
    deleteEventVolunteerForInstance(input: $input) {
      id
      hasAccepted
      isPublic
      hoursVolunteered
      user {
        id
        name
        avatarURL
      }
    }
  }
`;

/**
 * GraphQL mutation to delete a volunteer group from a specific recurring event instance.
 *
 * @param input - The input containing volunteerGroupId and recurringEventInstanceId.
 * @returns The deleted volunteer group information.
 */
export const DELETE_VOLUNTEER_GROUP_FOR_INSTANCE = gql`
  mutation DeleteEventVolunteerGroupForInstance(
    $input: DeleteEventVolunteerGroupForInstanceInput!
  ) {
    deleteEventVolunteerGroupForInstance(input: $input) {
      id
      name
      description
      volunteersRequired
      createdAt
      leader {
        id
        name
        avatarURL
      }
      creator {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to update an event volunteer group.
 *
 * @param id - The ID of the event volunteer group being updated.
 * @param data - The data required to update an event volunteer group.
 * @returns The ID of the updated event volunteer group.
 *
 */
export const UPDATE_VOLUNTEER_MEMBERSHIP = gql`
  mutation UpdateVolunteerMembership($id: ID!, $status: String!) {
    updateVolunteerMembership(id: $id, status: $status) {
      id
      status
      updatedAt
      volunteer {
        id
        hasAccepted
        user {
          id
          name
        }
      }
      event {
        id
        name
      }
      updatedBy {
        id
        name
      }
    }
  }
`;
