import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve a list of plugins.
 *
 * @returns The list of plugins with details such as ID, name, creator, description, and uninstalled organizations.
 */

export const PLUGIN_GET = gql`
  query getPluginList {
    getPlugins {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      uninstalledOrgs
    }
  }
`;

/**
 * GraphQL query to retrieve a list of advertisements.
 *
 * @returns The list of advertisements with details such as ID, name, type, organization ID, link, start date, and end date.
 */

export const ADVERTISEMENTS_GET = gql`
  query getAdvertisements {
    advertisementsConnection {
      edges {
        node {
          _id
          name
          type
          organization {
            _id
          }
          mediaUrl
          endDate
          startDate
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve a list of events based on organization connection.
 *
 * @param organization_id - The ID of the organization for which events are being retrieved.
 * @param title_contains - Optional. Filter events by title containing a specified string.
 * @param description_contains - Optional. Filter events by description containing a specified string.
 * @param location_contains - Optional. Filter events by location containing a specified string.
 * @param first - Optional. Number of events to retrieve in the first batch.
 * @param skip - Optional. Number of events to skip before starting to collect the result set.
 * @returns The list of events associated with the organization based on the applied filters.
 */

export const ORGANIZATION_EVENTS_CONNECTION = gql`
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
      creator {
        _id
        firstName
        lastName
      }
      attendees {
        _id
      }
    }
  }
`;

export const USER_EVENTS_VOLUNTEER = gql`
  query UserEventsVolunteer(
    $organization_id: ID!
    $title_contains: String
    $location_contains: String
    $first: Int
    $skip: Int
    $upcomingOnly: Boolean
  ) {
    eventsByOrganizationConnection(
      where: {
        organization_id: $organization_id
        title_contains: $title_contains
        location_contains: $location_contains
      }
      first: $first
      skip: $skip
      upcomingOnly: $upcomingOnly
    ) {
      _id
      title
      startDate
      endDate
      location
      startTime
      endTime
      allDay
      recurring
      volunteerGroups {
        _id
        name
        volunteersRequired
        description
        volunteers {
          _id
        }
      }
      volunteers {
        _id
        user {
          _id
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve a list of chats based on user ID.
 *
 * @param id - The ID of the user for which chats are being retrieved.
 * @returns The list of chats associated with the user, including details such as ID, creator, messages, organization, and participating users.
 */

export const CHAT_BY_ID = gql`
  query chatById($id: ID!) {
    chatById(id: $id) {
      _id
      isGroup
      name
      organization {
        _id
      }
      createdAt
      messages {
        _id
        createdAt
        messageContent
        media
        replyTo {
          _id
          createdAt
          messageContent
          sender {
            _id
            firstName
            lastName
            email
            image
          }
        }
        sender {
          _id
          firstName
          lastName
          email
          image
        }
      }
      users {
        _id
        firstName
        lastName
        email
        image
      }
      admins {
        _id
        firstName
        lastName
        email
        image
      }
      unseenMessagesByUsers
    }
  }
`;

export const GROUP_CHAT_LIST = gql`
  query groupChatsByUserId {
    getGroupChatsByUserId {
      _id
      isGroup
      name
      creator {
        _id
        firstName
        lastName
        email
      }
      messages {
        _id
        createdAt
        messageContent
        media
        sender {
          _id
          firstName
          lastName
          email
        }
      }
      organization {
        _id
        name
      }
      users {
        _id
        firstName
        lastName
        email
        image
      }
      admins {
        _id
        firstName
        lastName
        email
        image
      }
      unseenMessagesByUsers
    }
  }
`;

export const UNREAD_CHAT_LIST = gql`
  query unreadChatList {
    getUnreadChatsByUserId {
      _id
      isGroup
      name
      creator {
        _id
        firstName
        lastName
        email
      }
      messages {
        _id
        createdAt
        messageContent
        media
        sender {
          _id
          firstName
          lastName
          email
        }
      }
      organization {
        _id
        name
      }
      users {
        _id
        firstName
        lastName
        email
        image
      }
      admins {
        _id
        firstName
        lastName
        email
        image
      }
      unseenMessagesByUsers
    }
  }
`;

export const CHATS_LIST = gql`
  query ChatsByUserId($id: ID!, $searchString: String) {
    chatsByUserId(
      id: $id
      where: {
        name_contains: $searchString
        user: {
          firstName_contains: $searchString
          lastName_contains: $searchString
        }
      }
    ) {
      _id
      isGroup
      name
      image
      creator {
        _id
        firstName
        lastName
        email
      }
      messages {
        _id
        createdAt
        messageContent
        sender {
          _id
          firstName
          lastName
          email
        }
      }
      organization {
        _id
        name
      }
      users {
        _id
        firstName
        lastName
        email
        image
      }
      admins {
        _id
        firstName
        lastName
        email
        image
      }
      unseenMessagesByUsers
    }
  }
`;
/**
 * GraphQL query to check if an organization is a sample organization.
 *
 * @param isSampleOrganizationId - The ID of the organization being checked.
 * @returns A boolean indicating whether the organization is a sample organization.
 */

export const IS_SAMPLE_ORGANIZATION_QUERY = gql`
  query ($isSampleOrganizationId: ID!) {
    isSampleOrganization(id: $isSampleOrganizationId)
  }
`;

/**
 * GraphQL query to retrieve custom fields for a specific organization.
 *
 * @param customFieldsByOrganizationId - The ID of the organization for which custom fields are being retrieved.
 * @returns The list of custom fields associated with the organization, including details such as ID, type, and name.
 */

export const ORGANIZATION_CUSTOM_FIELDS = gql`
  query ($customFieldsByOrganizationId: ID!) {
    customFieldsByOrganization(id: $customFieldsByOrganizationId) {
      _id
      type
      name
    }
  }
`;
