import gql from 'graphql-tag';

//Query List
// Check Auth
export const CHECK_AUTH = gql`
  query {
    checkAuth {
      _id
      firstName
      lastName
      createdAt
      image
      email
      birthDate
      educationGrade
      employmentStatus
      gender
      maritalStatus
      phone {
        mobile
      }
      address {
        line1
        state
        countryCode
      }
      eventsAttended {
        _id
      }
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
    $order: UserOrderByInput
  ) {
    users(
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
      skip: $skip
      first: $first
      orderBy: $order
    ) {
      user {
        _id
        joinedOrganizations {
          _id
          name
          image
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
          creator {
            _id
            firstName
            lastName
            image
            email
          }
        }
        firstName
        lastName
        email
        image
        createdAt
        registeredEvents {
          _id
        }
        organizationsBlockedBy {
          _id
          name
          image
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
          creator {
            _id
            firstName
            lastName
            image
            email
          }
          createdAt
        }
        membershipRequests {
          _id
        }
      }
      appUserProfile {
        _id
        adminFor {
          _id
        }
        isSuperAdmin
        createdOrganizations {
          _id
        }
        createdEvents {
          _id
        }
        eventAdmin {
          _id
        }
      }
    }
  }
`;
export const USER_LIST_FOR_TABLE = gql`
  query Users($firstName_contains: String, $lastName_contains: String) {
    users(
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
    ) {
      user {
        _id
        firstName
        lastName
        email
        image
        createdAt
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
  ) {
    users(
      where: {
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
      skip: $skip
      first: $first
    ) {
      user {
        firstName
        lastName
        image
        _id
        email
        createdAt
      }
      appUserProfile {
        _id
        adminFor {
          _id
        }
        isSuperAdmin
        createdOrganizations {
          _id
        }
        createdEvents {
          _id
        }
        eventAdmin {
          _id
        }
      }
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
      recurring
      baseRecurringEvent {
        _id
      }
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

export const RECURRING_EVENTS = gql`
  query RecurringEvents($baseRecurringEventId: ID!) {
    getRecurringEvents(baseRecurringEventId: $baseRecurringEventId) {
      _id
      startDate
      title
      attendees {
        _id
        gender
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
        createdAt
        gender
        birthDate
        eventsAttended {
          _id
        }
      }
    }
  }
`;

export const EVENT_REGISTRANTS = gql`
  query GetEventAttendeesByEventId($eventId: ID!) {
    getEventAttendeesByEventId(eventId: $eventId) {
      userId
      isRegistered
      _id
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
        createdAt
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
  query User($userId: ID!) {
    user(id: $userId) {
      user {
        firstName
        email
        image
        lastName
      }
    }
  }
`;

// To take the details of a user
export const USER_DETAILS = gql`
  query User(
    $id: ID!
    $after: String
    $before: String
    $first: PositiveInt
    $last: PositiveInt
  ) {
    user(id: $id) {
      user {
        _id
        eventsAttended {
          _id
        }
        joinedOrganizations {
          _id
        }
        firstName
        lastName
        email
        image
        createdAt
        birthDate
        educationGrade
        employmentStatus
        gender
        maritalStatus
        phone {
          mobile
        }
        address {
          line1
          countryCode
          city
          state
        }
        tagsAssignedWith(
          after: $after
          before: $before
          first: $first
          last: $last
        ) {
          edges {
            node {
              _id
              name
              parentTag {
                _id
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
        registeredEvents {
          _id
        }
        membershipRequests {
          _id
        }
      }
      appUserProfile {
        _id
        adminFor {
          _id
        }
        isSuperAdmin
        appLanguageCode
        pluginCreationAllowed
        createdOrganizations {
          _id
        }
        createdEvents {
          _id
        }
        eventAdmin {
          _id
        }
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
      attendees {
        _id
        createdAt
        firstName
        lastName
        gender
        eventsAttended {
          _id
          endDate
        }
      }
      recurrenceRule {
        recurrenceStartDate
        recurrenceEndDate
        frequency
        weekDays
        interval
        count
        weekDayOccurenceInMonth
      }
      isRecurringEventException
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
      updatedAt
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
  query Organizations(
    $id: ID!
    $skip: Int
    $first: Int
    $firstName_contains: String
  ) {
    organizations(id: $id) {
      _id
      membershipRequests(
        skip: $skip
        first: $first
        where: { user: { firstName_contains: $firstName_contains } }
      ) {
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

export const USERS_CONNECTION_LIST = gql`
  query usersConnection(
    $id_not_in: [ID!]
    $firstName_contains: String
    $lastName_contains: String
  ) {
    users(
      where: {
        id_not_in: $id_not_in
        firstName_contains: $firstName_contains
        lastName_contains: $lastName_contains
      }
    ) {
      user {
        firstName
        lastName
        image
        _id
        email
        createdAt
        organizationsBlockedBy {
          _id
          name
          image
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
      appUserProfile {
        _id
        adminFor {
          _id
        }
        isSuperAdmin
        createdOrganizations {
          _id
        }
        createdEvents {
          _id
        }
        eventAdmin {
          _id
        }
      }
    }
  }
`;

export const GET_COMMUNITY_DATA = gql`
  query getCommunityData {
    getCommunityData {
      _id
      websiteLink
      name
      logoUrl
      socialMediaUrls {
        facebook
        gitHub
        instagram
        X
        linkedIn
        youTube
        reddit
        slack
      }
    }
  }
`;

export const GET_COMMUNITY_SESSION_TIMEOUT_DATA = gql`
  query getCommunityData {
    getCommunityData {
      timeout
    }
  }
`;

// get the list of Action Item Categories
export { ACTION_ITEM_CATEGORY_LIST } from './ActionItemCategoryQueries';

// get the list of Action Items
export { ACTION_ITEM_LIST } from './ActionItemQueries';

export {
  AgendaItemByEvent,
  AgendaItemByOrganization,
} from './AgendaItemQueries';

export { AGENDA_ITEM_CATEGORY_LIST } from './AgendaCategoryQueries';
// to take the list of the blocked users
export {
  ADVERTISEMENTS_GET,
  IS_SAMPLE_ORGANIZATION_QUERY,
  ORGANIZATION_CUSTOM_FIELDS,
  ORGANIZATION_EVENTS_CONNECTION,
  PLUGIN_GET,
} from './PlugInQueries';

// display posts
export {
  ORGANIZATION_POST_LIST,
  ORGANIZATION_ADVERTISEMENT_LIST,
} from './OrganizationQueries';

export {
  ORGANIZATION_ADMINS_LIST,
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from './OrganizationQueries';
