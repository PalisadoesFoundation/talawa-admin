import gql from 'graphql-tag';

/**
 * GraphQL mutation to add an attendee to an event.
 *
 * @param userId - The ID of the user being added as an attendee.
 * @param eventId - The ID of the event to which the user is being added as an attendee.
 * @returns The updated event object with the added attendee.
 */

export const ADD_EVENT_ATTENDEE = gql`
  mutation addEventAttendee($userId: ID!, $eventId: ID!) {
    addEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove an attendee from an event.
 *
 * @param userId - The ID of the user being removed as an attendee.
 * @param eventId - The ID of the event from which the user is being removed as an attendee.
 * @returns The updated event object without the removed attendee.
 */

export const REMOVE_EVENT_ATTENDEE = gql`
  mutation removeEventAttendee($userId: ID!, $eventId: ID!) {
    removeEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to mark a user's check-in at an event.
 *
 * @param userId - The ID of the user checking in.
 * @param eventId - The ID of the event at which the user is checking in.
 * @param allotedRoom - The room assigned to the user during check-in (optional).
 * @param allotedSeat - The seat assigned to the user during check-in (optional).
 * @returns The updated event object with the user's check-in information.
 */

export const MARK_CHECKIN = gql`
  mutation checkIn($userId: ID!, $eventId: ID!) {
    checkIn(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;
