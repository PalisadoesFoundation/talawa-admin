import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve organization members assigned a certain tag.
 *
 * @param id - The ID of the tag that is assigned.
 * @returns The list of organization members.
 */

export const USER_TAGS_ASSIGNED_MEMBERS = gql`
  query GetAssignedUsers($input: QueryTagInput!, $first: Int, $after: String) {
    tag(input: $input) {
      id
      name
      assignees(first: $first, after: $after) {
        edges {
          node {
            id
            name
          }
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
      }
      organization {
        id
      }
    }
  }
`;

export const USER_TAG_SUB_TAGS = gql`
  query Tag($input: QueryTagInput!) {
    tag(input: $input) {
      id
      name
      organization {
        id
      }
      assignees(first: 10) {
        edges {
          cursor
          node {
            id
            name
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
      folder {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * GraphQL query to retrieve organization members that aren't assigned a certain tag.
 */

export const USER_TAGS_MEMBERS_TO_ASSIGN_TO = gql`
  query GetMembersToAssignTo($id: String!, $first: Int, $after: String) {
    tag(input: { id: $id }) {
      id
      name
      organization {
        id
        members(first: $first, after: $after) {
          edges {
            node {
              id
              name
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`;
