import gql from 'graphql-tag';

/**
 * Note on isInviteOnly field:
 * The isInviteOnly field is conditionally included in mutation response selections using GraphQL's @include directive.
 * By default, includeInviteOnly defaults to false, ensuring mutations work with backends that don't support this field.
 * To enable the field, pass includeInviteOnly: true in mutation variables, or use the addInviteOnlyVariable helper
 * from utils/graphqlVariables.ts which automatically sets it based on REACT_APP_ENABLE_INVITE_ONLY environment variable.
 */

// to create the event by any organization

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent(
    $input: MutationCreateEventInput!
    $includeInviteOnly: Boolean = false
  ) {
    createEvent(input: $input) {
      id
      name
      description
      startAt
      endAt
      allDay
      location
      isInviteOnly @include(if: $includeInviteOnly)
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
  mutation UpdateStandaloneEvent(
    $input: MutationUpdateEventInput!
    $includeInviteOnly: Boolean = false
  ) {
    updateStandaloneEvent(input: $input) {
      id
      name
      description
      startAt
      endAt
      allDay
      location
      isInviteOnly @include(if: $includeInviteOnly)
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

export const UPDATE_SINGLE_RECURRING_EVENT_INSTANCE_MUTATION = gql`
  mutation UpdateSingleRecurringEventInstance(
    $input: MutationUpdateSingleRecurringEventInstanceInput!
    $includeInviteOnly: Boolean = false
  ) {
    updateSingleRecurringEventInstance(input: $input) {
      id
      name
      description
      startAt
      endAt
      location
      isInviteOnly @include(if: $includeInviteOnly)
      isPublic
      isRegisterable
      allDay
      progressLabel
      sequenceNumber
      totalCount
      updatedAt
    }
  }
`;

export const UPDATE_THIS_AND_FOLLOWING_EVENTS_MUTATION = gql`
  mutation UpdateThisAndFollowingEvents(
    $input: MutationUpdateThisAndFollowingEventsInput!
    $includeInviteOnly: Boolean = false
  ) {
    updateThisAndFollowingEvents(input: $input) {
      id
      name
      description
      startAt
      endAt
      location
      isInviteOnly @include(if: $includeInviteOnly)
      isPublic
      isRegisterable
      allDay
      progressLabel
      sequenceNumber
      totalCount
      updatedAt
    }
  }
`;

export const UPDATE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION = gql`
  mutation UpdateEntireRecurringEventSeries(
    $input: MutationUpdateEntireRecurringEventSeriesInput!
    $includeInviteOnly: Boolean = false
  ) {
    updateEntireRecurringEventSeries(input: $input) {
      id
      name
      description
      isInviteOnly @include(if: $includeInviteOnly)
      updatedAt
    }
  }
`;

export const REGISTER_EVENT = gql`
  mutation registerForEvent($id: ID!) {
    registerForEvent(id: $id) {
      id
    }
  }
`;
