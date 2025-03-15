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
      posts(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            id
            caption
            creator {
              id
            }
            createdAt
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

export const GET_POSTS_BY_ORG = gql`
  query GetPostsByOrganization($input: GetPostsByOrgInput!) {
    postsByOrganization(input: $input) {
      id
      createdAt
      updatedAt
      caption
      attachments {
        url
      }
      creator {
        id
      }
    }
  }
`;

export const FILTERED_ORGANIZATION_POSTS = gql`
  query FilteredOrganizationPosts(
    $input: QueryOrganizationInput!
    $title_contains: String
    $text_contains: String
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organization(input: $input) {
      id
      posts(
        title_contains: $title_contains
        text_contains: $text_contains
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        edges {
          node {
            id
            title
            text
            imageUrl
            creator {
              id
              name
            }
            createdAt
            updatedAt
            likeCount
            commentCount
            pinned
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

export const ORGANIZATION_ADVERTISEMENT_LIST = gql`
  query Organizations(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organizations(id: $id) {
      _id
      advertisements(
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        edges {
          node {
            _id
            name
            startDate
            endDate
            mediaUrl
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

/**
 * GraphQL query to retrieve organizations based on user connection.
 *
 * @param first - Optional. Number of organizations to retrieve in the first batch.
 * @param skip - Optional. Number of organizations to skip before starting to collect the result set.
 * @param filter - Optional. Filter organizations by a specified string.
 * @param id - Optional. The ID of a specific organization to retrieve.
 * @returns The list of organizations based on the applied filters.
 */

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

export const ORGANIZATION_ADMINS_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      admins {
        _id
        image
        firstName
        lastName
        email
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the list of members for a specific organization.
 *
 * @param id - The ID of the organization for which members are being retrieved.
 * @returns The list of members associated with the organization.
 */
export const ORGANIZATION_FUNDS = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      funds {
        _id
        name
        refrenceNumber
        taxDeductible
        isArchived
        isDefault
        createdAt
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the list of venues for a specific organization.
 *
 * @param id - The ID of the organization for which venues are being retrieved.
 * @returns The list of venues associated with the organization.
 */

export const VENUE_LIST = gql`
  query getAllVenues(
    $id: String!
    $first: Int
    $where: QueryVenuesInput
    $isInversed: Boolean
  ) {
    organization(input: { id: $id }) {
      name
      venues(first: $first, where: $where, isInversed: $isInversed) {
        edges {
          node {
            capacity
            description
            name
            id
            attachments {
              url
              mimeType
            }
          }
        }
      }
    }
  }
`;
