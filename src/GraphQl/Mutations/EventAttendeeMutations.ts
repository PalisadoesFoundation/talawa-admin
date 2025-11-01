import gql from 'graphql-tag';

/**
 * GraphQL mutation to add an attendee to an event.
 *
 * @param userId - The ID of the user being added as an attendee.
 * @param eventId - The ID of the event to which the user is being added as an attendee.
 * @returns The updated event object with the added attendee.
 */

export const ADD_EVENT_ATTENDEE = gql`
  mutation addEventAttendee(
    $userId: ID!
    $eventId: ID
    $recurringEventInstanceId: ID
  ) {
    addEventAttendee(
      data: {
        userId: $userId
        eventId: $eventId
        recurringEventInstanceId: $recurringEventInstanceId
      }
    ) {
      id
      name
      emailAddress
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
  mutation removeEventAttendee(
    $userId: ID!
    $eventId: ID
    $recurringEventInstanceId: ID
  ) {
    removeEventAttendee(
      data: {
        userId: $userId
        eventId: $eventId
        recurringEventInstanceId: $recurringEventInstanceId
      }
    ) {
      id
      name
      emailAddress
    }
  }
`;

/**
 * GraphQL mutation to check out a user from an event.
 *
 * @param userId - The ID of the user checking out.
 * @param eventId - The ID of the event from which the user is checking out.
 * @param recurringEventInstanceId - The ID of the recurring event instance (optional).
 * @returns The check-out record.
 */

/**
 * GraphQL mutation to register current user for an event.
 *
 * @param id - The ID of the event or recurring event instance to register for.
 * @returns The event attendee record.
 */

/**
 * GraphQL mutation to register a user for an event (admin operation).
 *
 * @param userId - The ID of the user to register.
 * @param eventId - The ID of the standalone event (optional).
 * @param recurringEventInstanceId - The ID of the recurring event instance (optional).
 * @returns The event attendee record.
 */

/**
 * GraphQL mutation to invite a user to an event.
 *
 * @param userId - The ID of the user to invite.
 * @param eventId - The ID of the standalone event (optional).
 * @param recurringEventInstanceId - The ID of the recurring event instance (optional).
 * @returns The event attendee record.
 */

/**
 * GraphQL mutation to unregister current user from an event.
 *
 * @param id - The ID of the event or recurring event instance to unregister from.
 * @returns Success indicator.
 */

/**
 * GraphQL mutation to mark a user's check-in at an event.
 *
 * @param userId - The ID of the user checking in.
 * @param eventId - The ID of the event at which the user is checking in.
 * @returns The updated event object with the user's check-in information.
 */

export const MARK_CHECKIN = gql`
  mutation checkIn($userId: ID!, $eventId: ID, $recurringEventInstanceId: ID) {
    checkIn(
      data: {
        userId: $userId
        eventId: $eventId
        recurringEventInstanceId: $recurringEventInstanceId
      }
    ) {
      id
      user {
        id
      }
      checkinTime
      checkoutTime
      isCheckedIn
      isCheckedOut
      feedbackSubmitted
    }
  }
`;
