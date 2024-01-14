// OrganizationQueries.js
import gql from 'graphql-tag';

// display posts
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
    }
  }
`;

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
