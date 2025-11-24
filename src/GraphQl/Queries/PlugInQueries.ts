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
  query Chat(
    $input: QueryChatInput!
    $first: Int
    $after: String
    $firstMessages: Int
    $afterMessages: String
    $lastMessages: Int
    $beforeMessages: String
  ) {
    chat(input: $input) {
      id
      name
      description
      avatarMimeType
      avatarURL
      createdAt
      updatedAt
      organization {
        id
        name
        countryCode
      }
      creator {
        id
        name
        avatarMimeType
        avatarURL
      }
      updater {
        id
        name
        avatarMimeType
        avatarURL
      }
      members(first: $first, after: $after) {
        edges {
          cursor
          node {
            user {
              id
              name
              avatarMimeType
              avatarURL
            }
            role
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      messages(
        first: $firstMessages
        after: $afterMessages
        last: $lastMessages
        before: $beforeMessages
      ) {
        edges {
          cursor
          node {
            id
            body
            createdAt
            updatedAt
            creator {
              id
              name
              avatarMimeType
              avatarURL
            }
            parentMessage {
              id
              body
              createdAt
              creator {
                id
                name
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

// export const GROUP_CHAT_LIST = gql`
//   query ChatsByUser {
//     chatsByUser {
//       id
//       name
//       description
//       isGroup
//       avatarMimeType
//       avatarURL
//       createdAt
//       updatedAt
//       organization {
//         id
//         name
//         countryCode
//       }
//       members(first: 10) {
//         edges {
//           node {
//             user {
//               id
//               name
//               avatarMimeType
//               avatarURL
//             }
//             role
//           }
//         }
//       }
//       creator {
//         id
//         name
//         avatarMimeType
//         avatarURL
//       }
//       updater {
//         id
//         name
//         avatarMimeType
//         avatarURL
//       }
//     }
//   }
// `;

// export const UNREAD_CHAT_LIST = gql`
//   query ChatsByUser {
//     chatsByUser {
//       id
//       name
//       description
//       isGroup
//       avatarMimeType
//       avatarURL
//       createdAt
//       updatedAt
//       organization {
//         id
//         name
//         countryCode
//       }
//       members(first: 10) {
//         edges {
//           node {
//             user {
//               id
//               name
//               avatarMimeType
//               avatarURL
//             }
//             role
//           }
//         }
//       }
//       creator {
//         id
//         name
//         avatarMimeType
//         avatarURL
//       }
//       updater {
//         id
//         name
//         avatarMimeType
//         avatarURL
//       }
//     }
//   }
// `;

export const CHATS_LIST = gql`
  query GetUserChats($first: Int, $after: String) {
    chatsByUser {
      id
      name
      description
      createdAt
      organization {
        id
        name
      }
      members(first: $first, after: $after) {
        edges {
          node {
            user {
              id
              name
              avatarMimeType
              avatarURL
            }
            role
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
      lastMessage {
        id
        body
        createdAt
        updatedAt
        creator {
          id
          name
          avatarMimeType
          avatarURL
        }
        parentMessage {
          id
          body
          createdAt
          creator {
            id
            name
          }
        }
      }
      unreadMessagesCount
    }
  }
`;

// New: Unread chats list leveraging backend computed fields
export const UNREAD_CHATS = gql`
  query UnreadChats {
    unreadChats {
      id
      name
      description
      avatarMimeType
      avatarURL
      createdAt
      updatedAt
      organization {
        id
        name
        countryCode
      }
      creator {
        id
        name
        avatarMimeType
        avatarURL
      }
      updater {
        id
        name
        avatarMimeType
        avatarURL
      }
      unreadMessagesCount
      hasUnread
      firstUnreadMessageId
      lastMessage {
        id
        body
        createdAt
        updatedAt
        creator {
          id
          name
          avatarMimeType
          avatarURL
        }
        parentMessage {
          id
          body
          createdAt
          creator {
            id
            name
          }
        }
      }
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
