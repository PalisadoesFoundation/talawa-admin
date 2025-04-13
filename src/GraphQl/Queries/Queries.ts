import gql from 'graphql-tag';
import 'style/app.module.css';
//Query List
// Check Auth

// Query to get info about current user
export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      addressLine1
      addressLine2
      avatarMimeType
      avatarURL
      birthDate
      city
      countryCode
      createdAt
      description
      educationGrade
      emailAddress
      employmentStatus
      homePhoneNumber
      id
      isEmailAddressVerified
      maritalStatus
      mobilePhoneNumber
      name
      natalSex
      naturalLanguageCode
      postalCode
      role
      state
      updatedAt
      workPhoneNumber
    }
  }
`;

// Query to take the Organization list
export const ORGANIZATION_LIST = gql`
  query {
    organizations {
      id
      name
      addressLine1
      description
      avatarURL
      members(first: 32) {
        edges {
          node {
            id
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

export const USER_JOINED_ORGANIZATIONS_PG = gql`
  query UserJoinedOrganizations($id: String!, $first: Int!) {
    user(input: { id: $id }) {
      organizationsWhereMember(first: $first) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            id
            name
            addressLine1
            description
            avatarURL
            members(first: 32) {
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

export const ALL_ORGANIZATIONS_PG = gql`
  query UserJoinedOrganizations {
    organizations {
      id
      name
      addressLine1
      description
      avatarURL
      members(first: 32) {
        edges {
          node {
            id
          }
        }
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
  query allUsers(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $where: QueryAllUsersWhereInput
  ) {
    allUsers(
      first: $first
      after: $after
      last: $last
      before: $before
      where: $where
    ) {
      pageInfo {
        endCursor
        hasPreviousPage
        hasNextPage
        startCursor
      }
      edges {
        cursor
        node {
          id
          name
          role
          avatarURL
          emailAddress
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

export const GET_ORGANIZATION_POSTS_COUNT_PG = gql`
  query getOrganizationPostsCount($id: String!) {
    organization(input: { id: $id }) {
      id
      postsCount
    }
  }
`;

export const GET_POSTS_BY_ORG = gql`
  query GetPostsByOrg($input: GetPostsByOrgInput!) {
    postsByOrganization(input: $input) {
      id
      caption
      pinnedAt
      createdAt
      updatedAt
      attachments {
        url
      }
      creator {
        id
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($input: QueryUserInput!) {
    user(input: $input) {
      id
      name
    }
  }
`;

export const GET_ORGANIZATION_MEMBERS_PG = gql`
  query GetOrganizationMembers($id: String!, $first: Int, $after: String) {
    organization(input: { id: $id }) {
      members(first: $first, after: $after) {
        edges {
          node {
            id
            name
            emailAddress
            role
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
`;

export const GET_ORGANIZATION_BLOCKED_USERS_PG = gql`
  query GetOrganizationBlockedUsers($id: String!, $first: Int, $after: String) {
    organization(input: { id: $id }) {
      blockedUsers(first: $first, after: $after) {
        edges {
          node {
            id
            name
            emailAddress
            role
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
`;

export const GET_ORGANIZATION_EVENTS_PG = gql`
  query GetOrganizationEvents($id: String!, $first: Int, $after: String) {
    organization(input: { id: $id }) {
      events(first: $first, after: $after) {
        edges {
          node {
            id
            name
            description
            startAt
            endAt
            creator {
              id
              name
            }
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
`;

export const GET_ORGANIZATION_POSTS_PG = gql`
  query GetOrganizationPosts($id: String!, $first: Int) {
    organization(input: { id: $id }) {
      posts(first: $first) {
        edges {
          node {
            id
            caption
            createdAt
            creator {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_ORGANIZATION_DATA_PG = gql`
  query getOrganizationData($id: String!) {
    organization(input: { id: $id }) {
      id
      avatarURL
      name
      city
    }
  }
`;

export const ORGANIZATIONS_LIST = gql`
  query getOrganization($id: String!) {
    organization(input: { id: $id }) {
      id
      name
      description
      addressLine1
      addressLine2
      city
      state
      postalCode
      countryCode
      avatarURL
      createdAt
      updatedAt
      creator {
        id
        name
        emailAddress
      }
      updater {
        id
        name
        emailAddress
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
    $orgId: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
    $where: MembersWhereInput
  ) {
    organization(input: { id: $orgId }) {
      members(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
      ) {
        pageInfo {
          endCursor
          hasPreviousPage
          hasNextPage
          startCursor
        }
        edges {
          cursor
          node {
            id
            name
            role
            avatarURL
            emailAddress
            createdAt
          }
        }
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
  query Organization($input: QueryOrganizationInput!) {
    organization(input: $input) {
      id
      events {
        edges {
          node {
            id
            name
            description
            startAt
            endAt
            location
          }
        }
      }
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
  query Organization(
    $input: QueryOrganizationInput!
    $skip: Int
    $first: Int
    $name_contains: String
  ) {
    organization(input: $input) {
      id
      membershipRequests(
        skip: $skip
        first: $first
        where: { user: { name_contains: $name_contains } }
      ) {
        membershipRequestId
        createdAt
        status
        user {
          id
          name
          emailAddress
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

export const GET_COMMUNITY_DATA_PG = gql`
  query getCommunityData {
    community {
      createdAt
      facebookURL
      githubURL
      id
      inactivityTimeoutDuration
      instagramURL
      linkedInURL
      logoMimeType
      logoURL
      name
      redditURL
      slackURL
      updatedAt
      updater
      websiteURL
      xURL
      youtubeURL
    }
  }
`;

export const GET_COMMUNITY_DATA = gql`
  query CommunityInfo {
    community {
      id
      name
      websiteLink
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

export const SIGNIN_QUERY = gql`
  query SignIn($email: EmailAddress!, $password: String!) {
    signIn(input: { emailAddress: $email, password: $password }) {
      user {
        id
        name
        emailAddress
        role
        countryCode
        avatarURL
      }
      authenticationToken
    }
  }
`;

export const GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG = gql`
  query getCommunityData {
    community {
      inactivityTimeoutDuration
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
  ORGANIZATION_EVENTS_CONNECTION,
} from './PlugInQueries';

// display posts
export {
  ORGANIZATION_POST_LIST,
  ORGANIZATION_ADVERTISEMENT_LIST,
} from './OrganizationQueries';

export {
  ORGANIZATION_ADMINS_LIST,
  USER_CREATED_ORGANIZATIONS,
} from './OrganizationQueries';

export const GET_ORGANIZATION_EVENTS = gql`
  query Organization($input: QueryOrganizationInput!) {
    organization(input: $input) {
      id
      events {
        id
        name
        description
        startAt
        endAt
      }
    }
  }
`;
