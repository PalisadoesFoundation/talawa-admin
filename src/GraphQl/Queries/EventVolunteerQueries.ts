import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve event volunteers.
 *
 * @param where - The filter to apply to the query.
 * @param orderBy - The order in which to return the results.
 * @returns The list of event volunteers.
 *
 **/

export const GET_EVENT_VOLUNTEERS = gql`
  query GetEventVolunteers(
    $input: QueryEventInput!
    $where: EventVolunteerWhereInput!
    $orderBy: EventVolunteersOrderByInput
  ) {
    event(input: $input) {
      id
      recurrenceRule {
        id
      }
      baseEvent {
        id
      }
      volunteers(where: $where, orderBy: $orderBy) {
        id
        hasAccepted
        volunteerStatus
        hoursVolunteered
        isPublic
        isTemplate
        isInstanceException
        createdAt
        updatedAt
        user {
          id
          name
          avatarURL
        }
        event {
          id
          name
        }
        creator {
          id
          name
        }
        updater {
          id
          name
        }
        groups {
          id
          name
          description
          volunteers {
            id
          }
        }
      }
    }
  }
`;
export const EVENT_VOLUNTEER_GROUP_LIST = gql`
  query GetEventVolunteerGroups(
    $where: EventVolunteerGroupWhereInput!
    $orderBy: EventVolunteerGroupOrderByInput
  ) {
    getEventVolunteerGroups(where: $where, orderBy: $orderBy) {
      id
      name
      description
      volunteersRequired
      createdAt
      creator {
        id
        name
        avatarURL
      }
      leader {
        id
        name
        avatarURL
      }
      volunteers {
        id
        hasAccepted
        user {
          id
          name
          avatarURL
        }
      }
      event {
        id
      }
    }
  }
`;

export const GET_EVENT_VOLUNTEER_GROUPS = gql`
  query GetEventVolunteerGroups($input: QueryEventInput!) {
    event(input: $input) {
      id
      recurrenceRule {
        id
      }
      baseEvent {
        id
      }
      volunteerGroups {
        id
        name
        description
        volunteersRequired
        isTemplate
        isInstanceException
        createdAt
        creator {
          id
          name
          avatarURL
        }
        leader {
          id
          name
          avatarURL
        }
        volunteers {
          id
          hasAccepted
          user {
            id
            name
            avatarURL
          }
        }
        event {
          id
        }
      }
    }
  }
`;

export const USER_VOLUNTEER_MEMBERSHIP = gql`
  query GetVolunteerMembership(
    $where: VolunteerMembershipWhereInput!
    $orderBy: VolunteerMembershipOrderByInput
  ) {
    getVolunteerMembership(where: $where, orderBy: $orderBy) {
      id
      status
      createdAt
      updatedAt
      event {
        id
        name
        startAt
        endAt
        recurrenceRule {
          id
        }
      }
      volunteer {
        id
        hasAccepted
        hoursVolunteered
        user {
          id
          name
          avatarURL
        }
      }
      createdBy {
        id
        name
      }
      updatedBy {
        id
        name
      }
      group {
        id
        name
        description
      }
    }
  }
`;

export const USER_EVENTS_VOLUNTEER = gql`
  query UserEventsVolunteer(
    $organizationId: String!
    $upcomingOnly: Boolean
    $first: Int
  ) {
    organization(input: { id: $organizationId }) {
      id
      events(upcomingOnly: $upcomingOnly, first: $first) {
        edges {
          node {
            id
            name
            description
            startAt
            endAt
            location
            allDay
            isRecurringEventTemplate
            baseEvent {
              id
              name
              isRecurringEventTemplate
            }
            recurrenceRule {
              id
              frequency
            }
            volunteers {
              id
              hasAccepted
              volunteerStatus
              user {
                id
                name
              }
            }
            volunteerGroups {
              id
              name
              description
              volunteersRequired
              volunteers {
                id
                hasAccepted
                user {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const VOLUNTEER_RANKING = gql`
  query GetVolunteerRanks($orgId: ID!, $where: VolunteerRankWhereInput!) {
    getVolunteerRanks(orgId: $orgId, where: $where) {
      rank
      hoursVolunteered
      user {
        id
        name
        avatarURL
      }
    }
  }
`;
