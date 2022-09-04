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

// Query to take the Organization list with filter option
export const ORGANIZATION_CONNECTION_LIST = gql`
  query OrganizationsConnection($filter: String) {
    organizationsConnection(where: { name_contains: $filter }) {
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
  query Users($filter: String) {
    users(where: { firstName_contains: $filter }) {
      firstName
      lastName
      image
      _id
      email
      userType
      adminApproved
      spamInOrganizations {
        _id
        name
      }
      organizationsBlockedBy {
        _id
        name
      }
      createdAt
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
      location
      members {
        _id
        firstName
        lastName
        email
      }
      admins {
        _id
        firstName
        lastName
        email
      }
      membershipRequests {
        _id
        user {
          firstName
          lastName
          email
        }
      }
      blockedUsers {
        _id
        firstName
        lastName
        email
      }
      tags
      spamCount {
        _id
        user {
          _id
          firstName
          lastName
          email
        }
        isReaded
        groupchat {
          _id
          title
        }
      }
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
        email
        createdAt
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
  query EventsByOrganization(
    $id: ID!
    $filterByTitle: String
    $filterByDescription: String
  ) {
    eventsByOrganization(
      id: $id
      where: {
        title_contains: $filterByTitle
        description_contains: $filterByDescription
      }
    ) {
      _id
      title
      description
      startDate
      endDate
      location
      startTime
      endTime
      allDay
      recurring
      isPublic
      isRegisterable
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
        email
        createdAt
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
  query PostsByOrganization(
    $id: ID!
    $filterByTitle: String
    $filterByText: String
  ) {
    postsByOrganization(
      id: $id
      where: { title_contains: $filterByTitle, text_contains: $filterByText }
    ) {
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
    }
  }
`;
/**
 * @name PLUGIN_GET
 * @description used to fetch list of plugins
 */
export const PLUGIN_GET = gql`
  query getPluginList {
    getPlugins {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      pluginInstallStatus
    }
  }
`;
