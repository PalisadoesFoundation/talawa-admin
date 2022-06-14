import gql from 'graphql-tag';

//Query List

// Check Auth

export const CHECK_AUTH = gql`
  query {
    checkAuth {
      _id
      firstName
      lastName
      image
      email
      userType
    }
  }
`;

// Query to take the Organization list
export const ORGANIZATION_LIST = gql`
  query {
    organizations {
      _id
      image
      creator {
        firstName
        lastName
      }
      name
      members {
        _id
      }
      admins {
        _id
      }
      createdAt
      location
    }
  }
`;

// Query to take the User list

export const USER_LIST = gql`
  query {
    users {
      firstName
      lastName
      image
      _id
    }
  }
`;

// Query to take the Organization with data

export const ORGANIZATIONS_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      image
      creator {
        firstName
        lastName
        email
      }
      name
      description
    }
  }
`;

// Query to take the Members of a particular organization

export const MEMBERS_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      members {
        _id
        firstName
        lastName
        image
      }
    }
  }
`;

// To take the list of the oranization joined by a user
export const USER_ORGANIZATION_LIST = gql`
  query User($id: ID!) {
    user(id: $id) {
      firstName
      lastName
      image
      email
      userType
      adminFor {
        _id
        name
        image
      }
    }
  }
`;

// to take the organization event list
export const ORGANIZATION_EVENT_LIST = gql`
  query EventsByOrganization($id: ID!) {
    eventsByOrganization(id: $id) {
      _id
      title
      description
      startDate
    }
  }
`;

// to take the list of the admins of a particular

export const ADMIN_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      admins {
        _id
        firstName
        lastName
        image
      }
    }
  }
`;

// to take the membership request

export const MEMBERSHIP_REQUEST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      membershipRequests {
        _id
        user {
          _id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

// display posts

export const ORGANIZATION_POST_LIST = gql`
  query PostsByOrganization($id: ID!) {
    postsByOrganization(id: $id) {
      _id
      title
      text
      imageUrl
      videoUrl
    }
  }
`;
