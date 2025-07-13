import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new plugin.
 *
 * @param pluginId - The ID of the plugin to create.
 * @returns The created plugin object with id, pluginId, isActivated, isInstalled, and backup status.
 */
export const CREATE_PLUGIN_MUTATION = gql`
  mutation CreatePlugin($input: CreatePluginInput!) {
    createPlugin(input: $input) {
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
 * GraphQL mutation to update a plugin.
 *
 * @param id - The ID of the plugin to update.
 * @param isActivated - Whether the plugin is activated.
 * @param isInstalled - Whether the plugin is installed.
 * @param backup - Whether the plugin is backed up.
 * @returns The updated plugin object.
 */
export const UPDATE_PLUGIN_MUTATION = gql`
  mutation UpdatePlugin($input: UpdatePluginInput!) {
    updatePlugin(input: $input) {
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
 * GraphQL mutation to delete a plugin.
 *
 * @param id - The ID of the plugin to delete.
 * @returns The deleted plugin object with id and pluginId.
 */
export const DELETE_PLUGIN_MUTATION = gql`
  mutation DeletePlugin($input: DeletePluginInput!) {
    deletePlugin(input: $input) {
      id
      pluginId
    }
  }
`;
