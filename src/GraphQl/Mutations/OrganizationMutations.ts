import gql from 'graphql-tag';

// Changes the role of a user in an organization
/**
 * GraphQL mutation to update the role of a user in an organization.
 *
 * @param organizationId - The ID of the organization in which the user's role is being updated.
 * @param userId - The ID of the user whose role is being updated.
 * @param role - The new role to be assigned to the user in the organization.
 * @returns The updated user object with the new role in the organization.
 */
export const UPDATE_USER_ROLE_IN_ORG_MUTATION = gql`
  mutation updateUserRoleInOrganization(
    $organizationId: ID!
    $userId: ID!
    $role: String!
  ) {
    updateUserRoleInOrganization(
      organizationId: $organizationId
      userId: $userId
      role: $role
    ) {
      _id
    }
  }
`;

export const DELETE_CHAT_MESSAGE = gql`
  mutation DeleteChatMessage($input: MutationDeleteChatMessageInput!) {
    deleteChatMessage(input: $input) {
      id
      body
      createdAt
    }
  }
`;
/**
 * GraphQL mutation to create a sample organization.
 *
 * @returns The created sample organization object.
 */

export const CREATE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    createSampleOrganization
  }
`;

/**
 * GraphQL mutation to remove a sample organization.
 *
 * @returns The removed sample organization object.
 */

export const REMOVE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    removeSampleOrganization
  }
`;

/**
 * GraphQL mutation to create a chat between users in an organization.
 *
 * @param userIds - An array of user IDs participating in the direct chat.
 * @param organizationId - The ID of the organization where the direct chat is created.
 * @returns The created direct chat object.
 */

export const CREATE_CHAT = gql`
  mutation CreateChat($input: MutationCreateChatInput!) {
    createChat(input: $input) {
      id
      name
      description
      organization {
        id
        name
      }
    }
  }
`;

export const CREATE_CHAT_MEMBERSHIP = gql`
  mutation CreateChatMembership($input: MutationCreateChatMembershipInput!) {
    createChatMembership(input: $input) {
      id
      name
      description
    }
  }
`;

// export const ADD_USER_TO_GROUP_CHAT = gql`
//   mutation addUserToGroupChat($userId: ID!, $chatId: ID!) {
//     addUserToGroupChat(userId: $userId, chatId: $chatId) {
//       _id
//     }
//   }
// `;

// TODO: Update this mutation to match the new schema - markChatMessagesAsRead not found in schema
// export const MARK_CHAT_MESSAGES_AS_READ = gql`
//   mutation markChatMessagesAsRead($chatId: ID!, $userId: ID!) {
//     markChatMessagesAsRead(chatId: $chatId, userId: $userId) {
//       _id
//     }
//   }
// `;

export const UPDATE_CHAT = gql`
  mutation UpdateChat($input: MutationUpdateChatInput!) {
    updateChat(input: $input) {
      id
      name
      description
      avatar {
        uri
      }
    }
  }
`;

export const EDIT_CHAT_MESSAGE = gql`
  mutation UpdateChatMessage($input: MutationUpdateChatMessageInput!) {
    updateChatMessage(input: $input) {
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
`;

export const SEND_MESSAGE_TO_CHAT = gql`
  mutation CreateChatMessage($input: MutationCreateChatMessageInput!) {
    createChatMessage(input: $input) {
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
`;

export const MESSAGE_SENT_TO_CHAT = gql`
  subscription ChatMessageCreate($input: SubscriptionChatMessageCreateInput!) {
    chatMessageCreate(input: $input) {
      id
      body
      createdAt
      updatedAt
      chat {
        id
      }
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
`;

export const MARK_CHAT_MESSAGES_AS_READ = gql`
  mutation MarkChatAsRead($input: MutationMarkChatAsReadInput!) {
    markChatAsRead(input: $input)
  }
`;

/**
 * GraphQL mutation to toggle the pinned status of a post.
 *
 * @param id - The ID of the post to be toggled.
 * @returns The updated post object with the new pinned status.
 */

export const TOGGLE_PINNED_POST = gql`
  mutation UpdatePost($input: MutationUpdatePostInput!) {
    updatePost(input: $input) {
      id
      caption
      pinnedAt
      attachments {
        id
        name
        mimeType
        objectName
      }
    }
  }
`;

/**
 * GraphQL mutation to remove a custom field from an organization.
 *
 * @param organizationId - The ID of the organization from which the custom field is being removed.
 * @param customFieldId - The ID of the custom field to be removed.
 * @returns The removed organization custom field object.
 */

export const SEND_MEMBERSHIP_REQUEST = gql`
  mutation ($organizationId: ID!) {
    sendMembershipRequest(organizationId: $organizationId) {
      _id
      organization {
        _id
        name
      }
      user {
        _id
      }
    }
  }
`;

export const JOIN_PUBLIC_ORGANIZATION = gql`
  mutation JoinPublicOrganization(
    $input: MutationJoinPublicOrganizationInput!
  ) {
    joinPublicOrganization(input: $input) {
      organizationId
    }
  }
`;

export const CANCEL_MEMBERSHIP_REQUEST = gql`
  mutation ($membershipRequestId: ID!) {
    cancelMembershipRequest(membershipRequestId: $membershipRequestId) {
      _id
    }
  }
`;

export const UPDATE_CHAT_MEMBERSHIP = gql`
  mutation UpdateChatMembership($input: MutationUpdateChatMembershipInput!) {
    updateChatMembership(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($input: MutationDeleteChatInput!) {
    deleteChat(input: $input) {
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
    }
  }
`;

export const DELETE_CHAT_MEMBERSHIP = gql`
  mutation DeleteChatMembership($input: MutationDeleteChatMembershipInput!) {
    deleteChatMembership(input: $input) {
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
      members(first: 10) {
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
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;
