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
  mutation createChat(
    $userIds: [ID!]!
    $organizationId: ID
    $isGroup: Boolean!
    $name: String
    $image: String
  ) {
    createChat(
      data: {
        userIds: $userIds
        organizationId: $organizationId
        isGroup: $isGroup
        name: $name
        image: $image
      }
    ) {
      _id
    }
  }
`;

export const ADD_USER_TO_GROUP_CHAT = gql`
  mutation addUserToGroupChat($userId: ID!, $chatId: ID!) {
    addUserToGroupChat(userId: $userId, chatId: $chatId) {
      _id
    }
  }
`;

export const MARK_CHAT_MESSAGES_AS_READ = gql`
  mutation markChatMessagesAsRead($chatId: ID!, $userId: ID!) {
    markChatMessagesAsRead(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;

export const UPDATE_CHAT = gql`
  mutation updateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      _id
    }
  }
`;

export const EDIT_CHAT_MESSAGE = gql`
  mutation updateChatMessage(
    $messageId: ID!
    $messageContent: String!
    $chatId: ID!
  ) {
    updateChatMessage(
      input: {
        messageId: $messageId
        messageContent: $messageContent
        chatId: $chatId
      }
    ) {
      _id
      messageContent
      updatedAt
    }
  }
`;

export const SEND_MESSAGE_TO_CHAT = gql`
  mutation sendMessageToChat(
    $chatId: ID!
    $replyTo: ID
    $media: String
    $messageContent: String
  ) {
    sendMessageToChat(
      chatId: $chatId
      replyTo: $replyTo
      messageContent: $messageContent
      media: $media
    ) {
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
        }
        updatedAt
      }
      sender {
        _id
        firstName
        lastName
      }
      updatedAt
    }
  }
`;

export const MESSAGE_SENT_TO_CHAT = gql`
  subscription messageSentToChat($userId: ID!) {
    messageSentToChat(userId: $userId) {
      _id
      createdAt
      chatMessageBelongsTo {
        _id
      }
      messageContent
      replyTo {
        _id
        createdAt
        messageContent
        sender {
          _id
          firstName
          lastName
        }
        updatedAt
      }
      sender {
        _id
        firstName
        lastName
      }
      updatedAt
    }
  }
`;

//Plugin WebSocket listner

/**
 * GraphQL subscription to listen for updates on plugins.
 *
 * @returns An object containing information about the updated plugin.
 */

export const PLUGIN_SUBSCRIPTION = gql`
  subscription onPluginUpdate {
    onPluginUpdate {
      pluginName
      _id
      pluginDesc
      uninstalledOrgs
    }
  }
`;

/**
 * GraphQL mutation to toggle the pinned status of a post.
 *
 * @param id - The ID of the post to be toggled.
 * @returns The updated post object with the new pinned status.
 */

export const TOGGLE_PINNED_POST = gql`
  mutation TogglePostPin($id: ID!) {
    togglePostPin(id: $id) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to add a custom field to an organization.
 *
 * @param organizationId - The ID of the organization where the custom field is being added.
 * @param type - The type of the custom field (e.g., String, Number).
 * @param name - The name of the custom field.
 * @returns The added organization custom field object.
 */

export const ADD_CUSTOM_FIELD = gql`
  mutation ($organizationId: ID!, $type: String!, $name: String!) {
    addOrganizationCustomField(
      organizationId: $organizationId
      type: $type
      name: $name
    ) {
      name
      type
    }
  }
`;

// Handles custom organization fields

/**
 * GraphQL mutation to remove a custom field from an organization.
 *
 * @param organizationId - The ID of the organization from which the custom field is being removed.
 * @param customFieldId - The ID of the custom field to be removed.
 * @returns The removed organization custom field object.
 */

export const REMOVE_CUSTOM_FIELD = gql`
  mutation ($organizationId: ID!, $customFieldId: ID!) {
    removeOrganizationCustomField(
      organizationId: $organizationId
      customFieldId: $customFieldId
    ) {
      type
      name
    }
  }
`;

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
  mutation ($organizationId: ID!) {
    joinPublicOrganization(organizationId: $organizationId) {
      _id
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
