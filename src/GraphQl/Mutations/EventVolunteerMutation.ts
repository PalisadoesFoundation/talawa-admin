import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an event volunteer.
 *
 * @param data - The data required to create an event volunteer.
 * @returns The ID of the created event volunteer.
 *
 */

export const ADD_VOLUNTEER = gql`
  mutation CreateEventVolunteer($data: EventVolunteerInput!) {
    createEventVolunteer(data: $data) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to delete an event volunteer.
 *
 * @param id - The ID of the event volunteer being deleted.
 * @returns The ID of the deleted event volunteer.
 *
 */
export const DELETE_VOLUNTEER = gql`
  mutation RemoveEventVolunteer($id: ID!) {
    removeEventVolunteer(id: $id) {
      _id
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
      _id
    }
  }
`;

export const UPDATE_VOLUNTEER_GROUP = gql`
  mutation CreateEventVolunteerGroup($data: EventVolunteerGroupInput!) {
    createEventVolunteerGroup(data: $data) {
      _id
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
  mutation RemoveEventVolunteerGroup($id: ID!) {
    removeEventVolunteerGroup(id: $id) {
      _id
    }
  }
`;

export const CREATE_VOLUNTEER_MEMBERSHIP = gql`
  mutation CreateVolunteerMembership($data: VolunteerMembershipInput!) {
    createVolunteerMembership(data: $data) {
      _id
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
      _id
    }
  }
`;
