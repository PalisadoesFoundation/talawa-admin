// OrganizationQueries.js
import gql from 'graphql-tag';

// display posts

/**
 * GraphQL query to retrieve posts by organization.
 *
 * @param id - The ID of the organization for which posts are being retrieved.
 * @returns The list of posts associated with the organization.
 */

export const ORGANIZATION_POST_LIST = gql`
  query PostsByOrganization($id: ID!) {
    postsByOrganization(id: $id) {
      _id
      title
      text
      imageUrl
      videoUrl
      creator {
        _id
        firstName
        lastName
        email
      }
      createdAt
    }
  }
`;

/**
 * GraphQL query to retrieve posts by organization with additional filtering options.
 *
 * @param id - The ID of the organization for which posts are being retrieved.
 * @param title_contains - Optional. Filter posts by title containing a specified string.
 * @param text_contains - Optional. Filter posts by text containing a specified string.
 * @returns The list of posts associated with the organization based on the applied filters.
 */

export const ORGANIZATION_POST_CONNECTION_LIST = gql`
  query PostsByOrganizationConnection(
    $id: ID!
    $title_contains: String
    $text_contains: String
  ) {
    postsByOrganizationConnection(
      id: $id
      where: { title_contains: $title_contains, text_contains: $text_contains }
      orderBy: createdAt_DESC
    ) {
      edges {
        _id
        title
        text
        imageUrl
        videoUrl
        creator {
          _id
          firstName
          lastName
          email
        }
        createdAt
        likeCount
        commentCount
        comments {
          _id
          creator {
            _id
            firstName
            lastName
            email
          }
          likeCount
          likedBy {
            _id
          }
          text
        }
        likedBy {
          _id
          firstName
          lastName
        }
        pinned
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

export const USER_ORGANIZATION_CONNECTION = gql`
  query organizationsConnection(
    $first: Int
    $skip: Int
    $filter: String
    $id: ID
  ) {
    organizationsConnection(
      first: $first
      skip: $skip
      where: { name_contains: $filter, id: $id }
      orderBy: name_ASC
    ) {
      _id
      name
      image
      description
      userRegistrationRequired
      creator {
        firstName
        lastName
      }
      members {
        _id
      }
      admins {
        _id
      }
      createdAt
      address {
        city
        countryCode
        dependentLocality
        line1
        line2
        postalCode
        sortingCode
        state
      }
      membershipRequests {
        _id
        user {
          _id
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve organizations joined by a user.
 *
 * @param id - The ID of the user for which joined organizations are being retrieved.
 * @returns The list of organizations joined by the user.
 */

export const USER_JOINED_ORGANIZATIONS = gql`
  query UserJoinedOrganizations($id: ID!) {
    users(where: { id: $id }) {
      joinedOrganizations {
        _id
        name
        description
        image
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
  query UserJoinedOrganizations($id: ID!) {
    users(where: { id: $id }) {
      createdOrganizations {
        _id
        name
        description
        image
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
