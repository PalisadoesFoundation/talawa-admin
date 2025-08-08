import gql from 'graphql-tag';

// to create the event by any organization

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: MutationCreateEventInput!) {
    createEvent(input: $input) {
      id
      name
      description
      startAt
      endAt
      allDay
      location
      isPublic
      isRegisterable
      createdAt
      updatedAt
      # Recurring event fields (available for recurring events)
      isRecurringEventTemplate

      hasExceptions
      sequenceNumber
      totalCount
      progressLabel
      # Attachments
      attachments {
        url
        mimeType
      }
      # Relationships
      creator {
        id
        name
      }
      organization {
        id
        name
      }
      # Base event relationships (for recurring events)
      baseEvent {
        id
        name
      }
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($input: MutationUpdateEventInput!) {
    updateEvent(input: $input) {
      id
      name
      description
      startAt
      endAt
      allDay
      location
      isPublic
      isRegisterable
      createdAt
      updatedAt
      creator {
        id
        name
      }
      updater {
        id
        name
      }
      organization {
        id
        name
      }
    }
  }
`;

export const DELETE_STANDALONE_EVENT_MUTATION = gql`
  mutation DeleteEvent($input: MutationDeleteStandaloneEventInput!) {
    deleteStandaloneEvent(input: $input) {
      id
    }
  }
`;

export const DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION = gql`
  mutation DeleteEntireRecurringEventSeries(
    $input: MutationDeleteEntireRecurringEventSeriesInput!
  ) {
    deleteEntireRecurringEventSeries(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_SINGLE_EVENT_INSTANCE_MUTATION = gql`
  mutation DeleteSingleEventInstance(
    $input: MutationDeleteSingleEventInstanceInput!
  ) {
    deleteSingleEventInstance(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION = gql`
  mutation DeleteThisAndFollowingEvents(
    $input: MutationDeleteThisAndFollowingEventsInput!
  ) {
    deleteThisAndFollowingEvents(input: $input) {
      id
      name
    }
  }
`;

export const REGISTER_EVENT = gql`
  mutation registerForEvent($eventId: ID!) {
    registerForEvent(id: $eventId) {
      id
    }
  }
`;
