import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve organization members assigned a certain tag.
 *
 * @param id - The ID of the tag that is assigned.
 * @returns The list of organization members.
 */

export const USER_TAGS_ASSIGNED_MEMBERS = gql`
  query UserTagDetails(
    $id: ID!
    $after: String
    $before: String
    $first: PositiveInt
    $last: PositiveInt
    $where: UserTagUsersAssignedToWhereInput
    $sortedBy: UserTagUsersAssignedToSortedByInput
  ) {
    getAssignedUsers: getUserTag(id: $id) {
      name
      usersAssignedTo(
        after: $after
        before: $before
        first: $first
        last: $last
        where: $where
        sortedBy: $sortedBy
      ) {
        edges {
          node {
            _id
            firstName
            lastName
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
      ancestorTags {
        _id
        name
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the sub tags of a certain tag.
 *
 * @param id - The ID of the parent tag.
 * @returns The list of sub tags.
 */

export const USER_TAG_SUB_TAGS = gql`
  query GetChildTags(
    $id: ID!
    $after: String
    $before: String
    $first: PositiveInt
    $last: PositiveInt
    $where: UserTagWhereInput
    $sortedBy: UserTagSortedByInput
  ) {
    getChildTags: getUserTag(id: $id) {
      name
      childTags(
        after: $after
        before: $before
        first: $first
        last: $last
        where: $where
        sortedBy: $sortedBy
      ) {
        edges {
          node {
            _id
            name
            usersAssignedTo(first: $first, last: $last) {
              totalCount
            }
            childTags(first: $first, last: $last) {
              totalCount
            }
            ancestorTags {
              _id
              name
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
      ancestorTags {
        _id
        name
      }
    }
  }
`;

/**
 * GraphQL query to retrieve organization members that aren't assigned a certain tag.
 *
 * @param id - The ID of the tag.
 * @returns The list of organization members.
 */

export const USER_TAGS_MEMBERS_TO_ASSIGN_TO = gql`
  query GetMembersToAssignTo(
    $id: ID!
    $after: String
    $before: String
    $first: PositiveInt
    $last: PositiveInt
    $where: UserTagUsersToAssignToWhereInput
  ) {
    getUsersToAssignTo: getUserTag(id: $id) {
      name
      usersToAssignTo(
        after: $after
        before: $before
        first: $first
        last: $last
        where: $where
      ) {
        edges {
          node {
            _id
            firstName
            lastName
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
    }
  }
`;
