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

// Query to take the Organization list with filter  and sort option
export const ORGANIZATION_CONNECTION_LIST = gql`
  query OrganizationsConnection(
    $filter: String
    $first: Int
    $skip: Int
    $orderBy: OrganizationOrderByInput
  ) {
    organizationsConnection(
      where: { name_contains: $filter }
      first: $first
      skip: $skip
      orderBy: $orderBy
    ) {
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
  query Users(
    $firstName_contains: String
    $lastName_contains: String
    $skip: Int
    $first: Int
  ) {
    users(
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
      skip: $skip
      first: $first
    ) {
      firstName
      lastName
      image
      _id
      email
      userType
      adminApproved
      adminFor {
        _id
      }
      createdAt
      organizationsBlockedBy {
        _id
        name
        image
        location
        createdAt
        creator {
          _id
          firstName
          lastName
          image
          email
          createdAt
        }
      }
      joinedOrganizations {
        _id
        name
        image
        location
        createdAt
        creator {
          _id
          firstName
          lastName
          image
          email
          createdAt
        }
      }
    }
  }
`;

export const USER_LIST_REQUEST = gql`
  query Users(
    $firstName_contains: String
    $lastName_contains: String
    $first: Int
    $skip: Int
    $userType: String
    $adminApproved: Boolean
  ) {
    users(
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
      skip: $skip
      first: $first
      userType: $userType
      adminApproved: $adminApproved
    ) {
      firstName
      lastName
      image
      _id
      email
      userType
      adminApproved
      createdAt
    }
  }
`;

export const EVENT_DETAILS = gql`
  query Event($id: ID!) {
    event(id: $id) {
      _id
      title
      description
      startDate
      endDate
      startTime
      endTime
      allDay
      location
      organization {
        _id
        members {
          _id
          firstName
          lastName
        }
      }
      attendees {
        _id
      }
    }
  }
`;

export const EVENT_ATTENDEES = gql`
  query Event($id: ID!) {
    event(id: $id) {
      attendees {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const EVENT_CHECKINS = gql`
  query eventCheckIns($id: ID!) {
    event(id: $id) {
      _id
      attendeesCheckInStatus {
        _id
        user {
          _id
          firstName
          lastName
        }
        checkIn {
          _id
          time
          allotedRoom
          allotedSeat
        }
      }
    }
  }
`;

export const EVENT_FEEDBACKS = gql`
  query eventFeedback($id: ID!) {
    event(id: $id) {
      _id
      feedback {
        _id
        rating
        review
      }
      averageFeedbackScore
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
      userRegistrationRequired
      visibleInSearch
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
        organizationsBlockedBy {
          _id
        }
      }
    }
  }
`;

export const BLOCK_PAGE_MEMBER_LIST = gql`
  query Organizations(
    $orgId: ID!
    $firstName_contains: String
    $lastName_contains: String
  ) {
    organizationsMemberConnection(
      orgId: $orgId
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
    ) {
      edges {
        _id
        firstName
        lastName
        email
        organizationsBlockedBy {
          _id
        }
      }
    }
  }
`;

// Query to filter out all the members with the macthing query and a particular OrgId
export const ORGANIZATIONS_MEMBER_CONNECTION_LIST = gql`
  query Organizations(
    $orgId: ID!
    $firstName_contains: String
    $lastName_contains: String
    $admin_for: ID
    $event_title_contains: String
    $first: Int
    $skip: Int
  ) {
    organizationsMemberConnection(
      orgId: $orgId
      first: $first
      skip: $skip
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
        admin_for: $admin_for
        event_title_contains: $event_title_contains
      }
    ) {
      edges {
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

// To take the details of a user
export const USER_DETAILS = gql`
  query User($id: ID!) {
    user(id: $id) {
      image
      firstName
      lastName
      email
      appLanguageCode
      userType
      pluginCreationAllowed
      adminApproved
      createdAt
      adminFor {
        _id
      }
      createdOrganizations {
        _id
      }
      joinedOrganizations {
        _id
      }
      organizationsBlockedBy {
        _id
      }
      createdEvents {
        _id
      }
      registeredEvents {
        _id
      }
      eventAdmin {
        _id
      }
      membershipRequests {
        _id
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

export const ORGANIZATION_EVENT_CONNECTION_LIST = gql`
  query EventsByOrganizationConnection(
    $organization_id: ID!
    $title_contains: String
    $description_contains: String
    $location_contains: String
    $first: Int
    $skip: Int
  ) {
    eventsByOrganizationConnection(
      where: {
        organization_id: $organization_id
        title_contains: $title_contains
        description_contains: $description_contains
        location_contains: $location_contains
      }
      first: $first
      skip: $skip
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

export const ORGANIZATION_DONATION_CONNECTION_LIST = gql`
  query GetDonationByOrgIdConnection(
    $orgId: ID!
    $id: ID
    $name_of_user_contains: String
  ) {
    getDonationByOrgIdConnection(
      orgId: $orgId
      where: { id: $id, name_of_user_contains: $name_of_user_contains }
    ) {
      _id
      nameOfUser
      amount
      userId
      payPalId
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

// to take the list of the blocked users
export { PLUGIN_GET } from './PlugInQueries';
export { ADVERTISEMENTS_GET } from './PlugInQueries';
export { ORGANIZATION_EVENTS_CONNECTION } from './PlugInQueries';
export { DIRECT_CHATS_LIST } from './PlugInQueries';
export { IS_SAMPLE_ORGANIZATION_QUERY } from './PlugInQueries';
export { ORGANIZATION_CUSTOM_FIELDS } from './PlugInQueries';

// display posts
export { ORGANIZATION_POST_LIST } from './OrganizationQueries';
export { ORGANIZATION_POST_CONNECTION_LIST } from './OrganizationQueries';
export { USER_ORGANIZATION_CONNECTION } from './OrganizationQueries';
export { USER_JOINED_ORGANIZATIONS } from './OrganizationQueries';
export { USER_CREATED_ORGANIZATIONS } from './OrganizationQueries';
export { ORGANIZATION_ADMINS_LIST } from './OrganizationQueries';
