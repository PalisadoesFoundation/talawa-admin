import gql from 'graphql-tag';

// Query to get info about current user
export const CURRENT_USER = gql`
  query CurrentUser {
    user: currentUser {
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
      eventsAttended {
        id
      }
    }
  }
`;

// Shared fields
const ORG_FIELDS = gql`
  fragment OrgFields on Organization {
    id
    name
    addressLine1
    description
    avatarURL
    membersCount
    adminsCount
    createdAt
  }
`;

// Full query with members
export const ORGANIZATION_LIST = gql`
  query GetOrganizations($filter: String, $limit: Int, $offset: Int) {
    organizations(filter: $filter, limit: $limit, offset: $offset) {
      ...OrgFields
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
  ${ORG_FIELDS}
`;

export const ORGANIZATION_FILTER_LIST = gql`
  query OrganizationFilterList($filter: String) {
    organizations(filter: $filter) {
      ...OrgFields
      isMember
    }
  }
  ${ORG_FIELDS}
`;

// Lightweight version without members and other fields for registration page
export const ORGANIZATION_LIST_NO_MEMBERS = gql`
  query OrganizationListBasic {
    organizations {
      id
      name
      addressLine1
    }
  }
`;

export const ORGANIZATION_MEMBER_ADMIN_COUNT = gql`
  query OrganizationMemberAdminCounts($id: String!) {
    organization(input: { id: $id }) {
      id
      membersCount
      adminsCount
    }
  }
`;

export const USER_JOINED_ORGANIZATIONS_NO_MEMBERS = gql`
  query UserJoinedOrganizations($id: String!, $first: Int!, $filter: String) {
    user(input: { id: $id }) {
      organizationsWhereMember(first: $first, filter: $filter) {
        pageInfo {
          hasNextPage
        }
        edges {
          node {
            ...OrgFields
          }
        }
      }
    }
  }
  ${ORG_FIELDS}
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
  query UsersByIds($input: UsersByIdsInput!) {
    usersByIds(input: $input) {
      id
      name
      emailAddress
      avatarURL
      createdAt
      city
      state
      countryCode
      postalCode
      organizationsWhereMember(first: 10) {
        edges {
          node {
            id
            name
            avatarURL
            createdAt
            city
            state
            countryCode
            creator {
              id
              name
              emailAddress
              avatarURL
            }
          }
        }
      }
      createdOrganizations {
        id
        name
        avatarURL
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

export const USER_LIST_FOR_ADMIN = gql`
  query allUsers(
    $first: Int
    $after: String
    $orgFirst: Int
    $last: Int
    $before: String
    $where: QueryAllUsersWhereInput
  ) {
    allUsers(
      first: $first
      after: $after
      where: $where
      last: $last
      before: $before
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
          city
          state
          countryCode
          postalCode
          orgsWhereUserIsBlocked(first: 16) {
            edges {
              node {
                id
                createdAt
                organization {
                  name
                  createdAt
                  city
                  avatarURL
                  creator {
                    name
                  }
                }
              }
            }
          }
          organizationsWhereMember(first: $orgFirst) {
            edges {
              node {
                id
                name
                avatarURL
                createdAt
                city
                state
                countryCode
                creator {
                  id
                  name
                  emailAddress
                  avatarURL
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const EVENT_DETAILS = gql`
  query GetEvent($eventId: String!) {
    event(input: { id: $eventId }) {
      id
      name
      description
      location
      allDay
      isPublic
      isRegisterable
      isInviteOnly
      startAt
      endAt
      createdAt
      updatedAt
      isRecurringEventTemplate
      baseEvent {
        id
      }
      recurrenceRule {
        id
      }
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
      organization {
        id
        name
      }
    }
  }
`;

export const RECURRING_EVENTS = gql`
  query RecurringEvents($baseRecurringEventId: ID!) {
    getRecurringEvents(baseRecurringEventId: $baseRecurringEventId) {
      id
      startAt
      name
      attendees {
        id
        natalSex
      }
    }
  }
`;

export const EVENT_ATTENDEES = gql`
  query Event($eventId: String!) {
    event(input: { id: $eventId }) {
      attendees {
        id
        name
        emailAddress
        avatarURL
        createdAt
        role
        natalSex
        birthDate
        eventsAttended {
          id
        }
      }
    }
  }
`;

export const EVENT_REGISTRANTS = gql`
  query GetEventAttendeesByEventId(
    $eventId: ID
    $recurringEventInstanceId: ID
  ) {
    getEventAttendeesByEventId(
      eventId: $eventId
      recurringEventInstanceId: $recurringEventInstanceId
    ) {
      id
      user {
        id
        name
        emailAddress
        avatarURL
      }
      isRegistered
      isInvited
      createdAt
    }
  }
`;

export const EVENT_CHECKINS = gql`
  query eventCheckIns($eventId: String!) {
    event(input: { id: $eventId }) {
      id
      attendeesCheckInStatus {
        id
        user {
          id
          name
          emailAddress
        }
        checkInTime
        checkOutTime
        isCheckedIn
        isCheckedOut
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

export const GET_USER_BY_ID = gql`
  query GetUserById($input: QueryUserInput!) {
    user(input: $input) {
      id
      name
      emailAddress
      addressLine1
      addressLine2
      birthDate
      city
      avatarURL
      countryCode
      description
      educationGrade
      employmentStatus
      homePhoneNumber
      maritalStatus
      mobilePhoneNumber
      natalSex
      naturalLanguageCode
      postalCode
      state
      workPhoneNumber
    }
  }
`;

export const GET_ORGANIZATION_MEMBERS_PG = gql`
  query GetOrganizationMembers(
    $id: String!
    $first: Int
    $after: String
    $where: MembersWhereInput
  ) {
    organization(input: { id: $id }) {
      members(first: $first, after: $after, where: $where) {
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

export const GET_ORGANIZATION_BLOCKED_USERS_COUNT = gql`
  query GetBlockedUsersCount($id: String!) {
    organization(input: { id: $id }) {
      id
      blockedUsersCount
    }
  }
`;

export const GET_ORGANIZATION_VENUES_COUNT = gql`
  query GetVenuesCount($id: String!) {
    organization(input: { id: $id }) {
      id
      venuesCount
    }
  }
`;

export const GET_ORGANIZATION_EVENTS_PG = gql`
  query GetOrganizationEvents(
    $id: String!
    $first: Int
    $after: String
    $startDate: DateTime
    $endDate: DateTime
    $includeRecurring: Boolean
  ) {
    organization(input: { id: $id }) {
      eventsCount
      events(
        first: $first
        after: $after
        startDate: $startDate
        endDate: $endDate
        includeRecurring: $includeRecurring
      ) {
        edges {
          node {
            id
            name
            description
            startAt
            endAt
            allDay
            location
            isPublic
            isRegisterable
            isInviteOnly
            # Recurring event fields
            isRecurringEventTemplate
            attendees {
              id
              name
            }
            baseEvent {
              id
              name
            }
            sequenceNumber
            totalCount
            hasExceptions
            progressLabel
            # New recurrence description fields
            recurrenceDescription
            recurrenceRule {
              id
              frequency
              interval
              recurrenceStartDate
              recurrenceEndDate
              count
              byDay
              byMonth
              byMonthDay
            }
            # Attachments
            attachments {
              url
              mimeType
            }
            # Creator information
            creator {
              id
              name
            }
            # Organization
            organization {
              id
              name
            }
            # Timestamps
            createdAt
            updatedAt
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

export const GET_ORGANIZATION_EVENTS_USER_PORTAL_PG = gql`
  query GetOrganizationEventsUserPortal(
    $id: String!
    $first: Int
    $after: String
    $startDate: DateTime
    $endDate: DateTime
    $includeRecurring: Boolean
  ) {
    organization(input: { id: $id }) {
      events(
        first: $first
        after: $after
        startDate: $startDate
        endDate: $endDate
        includeRecurring: $includeRecurring
      ) {
        edges {
          node {
            id
            name
            description
            startAt
            endAt
            allDay
            location
            isPublic
            isRegisterable
            isInviteOnly
            creator {
              id
              name
            }
            attendees {
              id
              name
            }
            # Recurring event fields
            isRecurringEventTemplate
            baseEvent {
              id
              name
            }
            sequenceNumber
            totalCount
            hasExceptions
            progressLabel
            # New recurrence description fields
            recurrenceDescription
            recurrenceRule {
              id
              frequency
              interval
              recurrenceStartDate
              recurrenceEndDate
              count
              byDay
              byMonth
              byMonthDay
            }
            # Attachments
            attachments {
              url
              mimeType
            }
            # Organization
            organization {
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

// Organization fragments for reusability
const ORGANIZATION_BASIC_FIELDS = gql`
  fragment OrganizationBasicFields on Organization {
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
    isUserRegistrationRequired
  }
`;

const ORGANIZATION_DETAILED_FIELDS = gql`
  fragment OrganizationDetailedFields on Organization {
    ...OrganizationBasicFields
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
  ${ORGANIZATION_BASIC_FIELDS}
`;

// Query to get basic organization data for updates
export const GET_ORGANIZATION_BASIC_DATA = gql`
  query getOrganizationBasicData($id: String!) {
    organization(input: { id: $id }) {
      ...OrganizationBasicFields
    }
  }
  ${ORGANIZATION_BASIC_FIELDS}
`;

// Query to take the Organization with data (keeping same name for compatibility)
export const GET_ORGANIZATION_DATA_PG = gql`
  query getOrganizationData($id: String!, $first: Int, $after: String) {
    organization(input: { id: $id }) {
      ...OrganizationDetailedFields
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
  ${ORGANIZATION_DETAILED_FIELDS}
`;

// Shared fragment with common organization fields
export const ORGANIZATION_FIELDS = gql`
  fragment OrganizationFields on Organization {
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
  }
`;

// Full query with all fields (metadata, creator, updater, etc.)
export const ORGANIZATIONS_LIST = gql`
  query Organizations {
    organizations {
      ...OrganizationFields
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
  ${ORGANIZATION_FIELDS}
`;

// Basic query using only the shared fragment (no metadata)
export const ORGANIZATIONS_LIST_BASIC = gql`
  query Organizations {
    organizations {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FIELDS}
`;

export const MEMBERS_LIST_PG = gql`
  query Organization($input: QueryOrganizationInput!) {
    organization(input: $input) {
      id
      members(first: 32) {
        edges {
          node {
            id
            name
            avatarURL
            createdAt
          }
        }
      }
    }
  }
`;

// Query to take the Members of a particular organization
export const MEMBERS_LIST = gql`
  query GetMembersByOrganization($organizationId: ID!) {
    usersByOrganizationId(organizationId: $organizationId) {
      id
      name
      emailAddress
      role
      avatarURL
      createdAt
      updatedAt
    }
  }
`;

export const MEMBERS_LIST_WITH_DETAILS = gql`
  query GetMembersByOrganizationWithDetails($organizationId: ID!) {
    usersByOrganizationId(organizationId: $organizationId) {
      id
      name
      firstName
      lastName
      emailAddress
      role
      avatarURL
      createdAt
      updatedAt
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
  query User($input: QueryUserInput!) {
    user(input: $input) {
      id
      name
      emailAddress
      avatarURL
      birthDate
      city
      countryCode
      createdAt
      updatedAt
      educationGrade
      employmentStatus
      isEmailAddressVerified
      maritalStatus
      natalSex
      naturalLanguageCode
      postalCode
      role
      state
      mobilePhoneNumber
      homePhoneNumber
      workPhoneNumber
      eventsAttended {
        id
      }
      organizationsWhereMember(first: 10) {
        edges {
          node {
            id
            name
            membersCount
            adminsCount
            description
            avatarURL
          }
        }
      }

      createdOrganizations {
        id
        name
        membersCount
        adminsCount
        description
        avatarURL
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
        natalSex
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

// to take the membership request
export const MEMBERSHIP_REQUEST_PG = gql`
  query Organization(
    $input: QueryOrganizationInput!
    $skip: Int
    $first: Int
    $name_contains: String
  ) {
    organization(input: $input) {
      id
      # membershipRequestsCount
      membershipRequests(
        skip: $skip
        first: $first
        where: { user: { name_contains: $name_contains } }
      ) {
        membershipRequestId
        createdAt
        status
        user {
          avatarURL
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
      linkedinURL
      logoMimeType
      logoURL
      name
      redditURL
      slackURL
      updatedAt
      websiteURL
      xURL
      youtubeURL
    }
  }
`;

export const SIGNIN_QUERY = gql`
  query SignIn(
    $email: EmailAddress!
    $password: String!
    $recaptchaToken: String
  ) {
    signIn(
      input: {
        emailAddress: $email
        password: $password
        recaptchaToken: $recaptchaToken
      }
    ) {
      user {
        id
        name
        emailAddress
        role
        countryCode
        avatarURL
        isEmailAddressVerified
      }
      authenticationToken
      refreshToken
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

export const GET_ORGANIZATION_VENUES_PG = gql`
  query GetOrganizationVenues($id: String!, $first: Int, $after: String) {
    organization(input: { id: $id }) {
      venues(first: $first, after: $after) {
        edges {
          node {
            id
            name
            description
            capacity
            attachments {
              url
              mimeType
            }
            createdAt
            updatedAt
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

/** Fetches tags assigned to a user, including assignees (capped), creator, and folder. */
export const GET_USER_TAGS = gql`
  query GetUserTags($userId: ID!) {
    userTags(userId: $userId) {
      id
      name
      createdAt
      folder {
        id
      }
      assignees(first: 10) {
        edges {
          node {
            id
          }
        }
      }

      creator {
        id
        name
      }
    }
  }
`;

export const GET_EVENTS_BY_ORGANIZATION_ID = gql`
  query GetEventsByOrganizationId($organizationId: ID!) {
    eventsByOrganizationId(input: { organizationId: $organizationId }) {
      id
      name
      description
      startAt
      endAt
      creator {
        id
      }
    }
  }
`;

// get the list of Action Item Categories
export { ACTION_ITEM_CATEGORY_LIST } from './ActionItemCategoryQueries';

// get the list of Action Items
export { ACTION_ITEM_LIST } from './ActionItemQueries';

export { AGENDA_ITEM_CATEGORY_LIST } from './AgendaCategoryQueries';
export { AGENDA_FOLDER_LIST } from './AgendaFolderQueries';
// to take the list of the blocked users
export { IS_SAMPLE_ORGANIZATION_QUERY } from './PlugInQueries';

// display posts
export { ORGANIZATION_POST_LIST_WITH_VOTES } from './OrganizationQueries';

// comments
export { GET_POST_COMMENTS } from './CommentQueries';

export { ORGANIZATION_ADVERTISEMENT_LIST } from './AdvertisementQueries';

export { USER_CREATED_ORGANIZATIONS } from './OrganizationQueries';
