/**
 * GraphQL service for plugin operations
 */

import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PLUGINS } from '../GraphQl/Queries/PlugInQueries';
import {
  CREATE_PLUGIN_MUTATION,
  UPDATE_PLUGIN_MUTATION,
  DELETE_PLUGIN_MUTATION,
  INSTALL_PLUGIN_MUTATION,
} from '../GraphQl/Mutations/PluginMutations';

export interface IPlugin {
  id: string;
  pluginId: string;
  isActivated: boolean;
  isInstalled: boolean;
  backup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePluginInput {
  pluginId: string;
}

export interface InstallPluginInput {
  pluginId: string;
}

export interface UpdatePluginInput {
  id: string;
  isActivated?: boolean;
  isInstalled?: boolean;
  backup?: boolean;
}

export interface DeletePluginInput {
  id: string;
}

export const useGetAllPlugins = () => {
  return useQuery<{ getPlugins: IPlugin[] }>(GET_ALL_PLUGINS);
};

export const useCreatePlugin = () => {
  return useMutation<{ createPlugin: IPlugin }, { input: CreatePluginInput }>(
    CREATE_PLUGIN_MUTATION,
  );
};

export const useInstallPlugin = () => {
  return useMutation<{ installPlugin: IPlugin }, { input: InstallPluginInput }>(
    INSTALL_PLUGIN_MUTATION,
  );
};

export const useUpdatePlugin = () => {
  return useMutation<{ updatePlugin: IPlugin }, { input: UpdatePluginInput }>(
    UPDATE_PLUGIN_MUTATION,
  );
};

export const useDeletePlugin = () => {
  return useMutation<
    { deletePlugin: { id: string; pluginId: string } },
    { input: DeletePluginInput }
  >(DELETE_PLUGIN_MUTATION);
};

export class PluginGraphQLService {
  private client: any;

  constructor(apolloClient: any) {
    this.client = apolloClient;
  }

  async getAllPlugins(): Promise<IPlugin[]> {
    try {
      const result = await this.client.query({
        query: GET_ALL_PLUGINS,
        fetchPolicy: 'cache-first',
      });
      return result.data?.getPlugins || [];
    } catch (error) {
      console.error('Failed to fetch plugins:', error);
      return [];
    }
  }

  async createPlugin(input: CreatePluginInput): Promise<IPlugin | null> {
    try {
      const result = await this.client.mutate({
        mutation: CREATE_PLUGIN_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_ALL_PLUGINS }],
      });
      return result.data?.createPlugin || null;
    } catch (error) {
      console.error('Failed to create plugin:', error);
      return null;
    }
  }

  async installPlugin(input: InstallPluginInput): Promise<IPlugin | null> {
    try {
      const result = await this.client.mutate({
        mutation: INSTALL_PLUGIN_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_ALL_PLUGINS }],
      });
      return result.data?.installPlugin || null;
    } catch (error) {
      console.error('Failed to install plugin:', error);
      return null;
    }
  }

  async updatePlugin(input: UpdatePluginInput): Promise<IPlugin | null> {
    try {
      const result = await this.client.mutate({
        mutation: UPDATE_PLUGIN_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_ALL_PLUGINS }],
      });
      return result.data?.updatePlugin || null;
    } catch (error) {
      console.error('Failed to update plugin:', error);
      return null;
    }
  }

  async deletePlugin(
    input: DeletePluginInput,
  ): Promise<{ id: string; pluginId: string } | null> {
    try {
      const result = await this.client.mutate({
        mutation: DELETE_PLUGIN_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_ALL_PLUGINS }],
      });
      return result.data?.deletePlugin || null;
    } catch (error) {
      console.error('Failed to delete plugin:', error);
      return null;
    }
  }
}
