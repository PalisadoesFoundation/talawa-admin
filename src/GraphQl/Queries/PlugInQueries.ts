import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve all plugins.
 *
 * @returns The list of plugins with details such as id, pluginId, isActivated, isInstalled, createdAt, and updatedAt.
 */
export const GET_ALL_PLUGINS = gql`
  query GetAllPlugins {
    getPlugins(input: {}) {
      id
      pluginId
      isActivated
      isInstalled
      backup
      createdAt
      updatedAt
    }
  }
`;

/**
 * GraphQL query to retrieve a single plugin by ID.
 *
 * @param id - The ID of the plugin to retrieve.
 * @returns The plugin object with details such as id, pluginId, isActivated, isInstalled, createdAt, and updatedAt.
 */

/**
 * GraphQL query to retrieve a list of advertisements.
 *
 * @returns The list of advertisements with details such as ID, name, type, organization ID, link, start date, and end date.
 */

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

// Ensure query matches backend schema
export const IS_SAMPLE_ORGANIZATION_QUERY = gql`
  query Organization($id: String!) {
    organization(input: { id: $id }) {
      id
      name
      description
      isSampleOrganization
    }
  }
`;
