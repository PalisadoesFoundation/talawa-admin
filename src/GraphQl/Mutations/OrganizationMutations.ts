import gql from 'graphql-tag';

// Changes the role of a user in an organization
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

export const CREATE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    createSampleOrganization
  }
`;

export const REMOVE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    removeSampleOrganization
  }
`;

export const CREATE_DIRECT_CHAT = gql`
  mutation createDirectChat($userIds: [ID!]!, $organizationId: ID!) {
    createDirectChat(
      data: { userIds: $userIds, organizationId: $organizationId }
    ) {
      _id
    }
  }
`;
//Plugin WebSocket listner

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

export const TOGGLE_PINNED_POST = gql`
  mutation TogglePostPin($id: ID!) {
    togglePostPin(id: $id) {
      _id
    }
  }
`;

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
