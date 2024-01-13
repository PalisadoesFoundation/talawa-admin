import gql from 'graphql-tag';

export const ADD_EVENT_ATTENDEE = gql`
  mutation addEventAttendee($userId: ID!, $eventId: ID!) {
    addEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

export const REMOVE_EVENT_ATTENDEE = gql`
  mutation removeEventAttendee($userId: ID!, $eventId: ID!) {
    removeEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

export const MARK_CHECKIN = gql`
  mutation checkIn(
    $userId: ID!
    $eventId: ID!
    $allotedRoom: String
    $allotedSeat: String
  ) {
    checkIn(
      data: {
        userId: $userId
        eventId: $eventId
        allotedRoom: $allotedRoom
        allotedSeat: $allotedSeat
      }
    ) {
      _id
    }
  }
`;
