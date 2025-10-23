// OrganizationQueries.js
import gql from 'graphql-tag';

// display posts

/**
 * GraphQL query to retrieve the list of organizations.
 *
 * @param first - Optional. Number of organizations to retrieve in the first batch.
 * @param skip - Optional. Number of organizations to skip before starting to collect the result set.
 * @param filter - Optional. Filter organizations by a specified string.
 * @param id - Optional. The ID of a specific organization to retrieve.
 * @returns The list of organizations based on the applied filters.
 */

export const ORGANIZATION_POST_LIST = gql`
  query OrganizationPostList(
    $input: QueryOrganizationInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organization(input: $input) {
      id
      postsCount
      posts(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            id
            caption
            commentsCount
            pinnedAt
            downVotesCount
            upVotesCount
            creator {
              id
              name
              avatarURL
            }
            createdAt
            comments(first: 10) {
              edges {
                node {
                  id
                  body
                  creator {
                    id
                    name
                    avatarURL
                  }
                  downVotesCount
                  upVotesCount
                }
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

export const ORGANIZATION_POST_LIST_WITH_VOTES = gql`
  query OrganizationPostList(
    $input: QueryOrganizationInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $userId: ID!
  ) {
    organization(input: $input) {
      id
      postsCount
      posts(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            hasUserVoted(userId: $userId) {
              hasVoted
              voteType
            }
            id
            caption
            commentsCount
            pinnedAt
            downVotesCount
            upVotesCount
            creator {
              id
              name
              avatarURL
            }
            createdAt
            comments(first: 10) {
              edges {
                node {
                  hasUserVoted(userId: $userId) {
                    hasVoted
                    voteType
                  }
                  id
                  body
                  creator {
                    id
                    name
                    avatarURL
                  }
                  downVotesCount
                  upVotesCount
                }
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

// GraphQL query to retrieve all the Organizations user is Part of with filter by name
export const USER_JOINED_ORGANIZATIONS_PG = gql`
  query UserJoinedOrganizations($id: String!, $filter: String, $first: Int) {
    user(input: { id: $id }) {
      organizationsWhereMember(first: $first, filter: $filter) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            name
            city
            countryCode
            addressLine1
            postalCode
            state
            description
            avatarURL
            members(first: $first) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the list of user tags belonging to an organization.
 *
 * @param id - ID of the organization.
 * @param first - Number of tags to retrieve "after" (if provided) a certain tag.
 * @param after - Id of the last tag on the current page.
 * @param last - Number of tags to retrieve "before" (if provided) a certain tag.
 * @param before - Id of the first tag on the current page.
 * @returns The list of organizations based on the applied filters.
 */

export const ORGANIZATION_USER_TAGS_LIST = gql`
  query Organizations(
    $id: ID!
    $after: String
    $before: String
    $first: PositiveInt
    $last: PositiveInt
    $where: UserTagWhereInput
    $sortedBy: UserTagSortedByInput
  ) {
    organizations(id: $id) {
      userTags(
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
            parentTag {
              _id
            }
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
          cursor
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

export const ORGANIZATION_USER_TAGS_LIST_PG = gql`
  query OrganizationTags(
    $input: QueryOrganizationInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organization(input: $input) {
      id
      name
      tags(after: $after, before: $before, first: $first, last: $last) {
        edges {
          cursor
          node {
            id
            name
            createdAt
            updater {
              id
              name
            }
            folder {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve organizations created by a user.
 *
 * @param id - The ID of the user for which created organizations are being retrieved.
 * @returns The list of organizations created by the user.
 */

export const USER_CREATED_ORGANIZATIONS = gql`
  query UserCreatedOrganizations($id: String!, $filter: String) {
    user(input: { id: $id }) {
      id
      createdOrganizations(filter: $filter) {
        id
        name
        description
        createdAt
        avatarMimeType
        isMember
        membersCount
        adminsCount
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the list of admins for a specific organization.
 *
 * @param id - The ID of the organization for which admins are being retrieved.
 * @returns The list of admins associated with the organization.
 */

/**
 * GraphQL query to retrieve the list of members for a specific organization.
 *
 * @param id - The ID of the organization for which members are being retrieved.
 * @returns The list of members associated with the organization.
 */

/**
 * GraphQL query to retrieve the list of venues for a specific organization.
 *
 * @param id - The ID of the organization for which venues are being retrieved.
 * @returns The list of venues associated with the organization.
 */
export const VENUE_LIST = gql`
  query venuesByOrganization($orgId: String!) {
    organization(input: { id: $orgId }) {
      venues(first: 32) {
        edges {
          node {
            id
            name
            description
            createdAt
            capacity
            attachments {
              url
              mimeType
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
      }
    }
  }
`;
