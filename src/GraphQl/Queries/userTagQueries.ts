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
  ) {
    getUserTag(id: $id) {
      name
      usersAssignedTo(
        after: $after
        before: $before
        first: $first
        last: $last
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
  ) {
    getUserTag(id: $id) {
      name
      childTags(after: $after, before: $before, first: $first, last: $last) {
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

/**
 * GraphQL query to retrieve the ancestor tags of a certain tag.
 *
 * @param id - The ID of the current tag.
 * @returns The list of ancestor tags.
 */

export const USER_TAG_ANCESTORS = gql`
  query GetUserTagAncestors($id: ID!) {
    getUserTagAncestors(id: $id) {
      _id
      name
    }
  }
`;
