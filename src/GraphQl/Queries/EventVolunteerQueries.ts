import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve event volunteers.
 *
 * @param where - The filter to apply to the query.
 * @param orderBy - The order in which to return the results.
 * @returns The list of event volunteers.
 *
 **/

export const EVENT_VOLUNTEER_LIST = gql`
  query GetEventVolunteers(
    $where: EventVolunteerWhereInput!
    $orderBy: EventVolunteersOrderByInput
  ) {
    getEventVolunteers(where: $where, orderBy: $orderBy) {
      _id
      hasAccepted
      hoursVolunteered
      user {
        _id
        firstName
        lastName
        image
      }
      assignments {
        _id
      }
      groups {
        _id
        name
        volunteers {
          _id
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
      _id
      name
      description
      volunteersRequired
      createdAt
      creator {
        _id
        firstName
        lastName
        image
      }
      leader {
        _id
        firstName
        lastName
        image
      }
      volunteers {
        _id
        user {
          _id
          firstName
          lastName
          image
        }
      }
      assignments {
        _id
        actionItemCategory {
          _id
          name
        }
        allotedHours
        isCompleted
      }
      event {
        _id
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
      _id
      status
      createdAt
      event {
        _id
        title
        startDate
      }
      volunteer {
        _id
        user {
          _id
          firstName
          lastName
          image
        }
      }
      group {
        _id
        name
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
        _id
        lastName
        firstName
        image
        email
      }
    }
  }
`;
