import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  PluginGraphQLService,
  useGetAllPlugins,
  useCreatePlugin,
  useUpdatePlugin,
  useDeletePlugin,
} from '../graphql-service';
import { type ApolloClient } from '@apollo/client';

// Mock Apollo client
const mockApolloClient = {
  query: vi.fn(),
  mutate: vi.fn(),
};

// Mock GraphQL queries and mutations
vi.mock('../GraphQl/Queries/PlugInQueries', () => ({
  GET_ALL_PLUGINS: 'GET_ALL_PLUGINS_QUERY',
}));

vi.mock('../GraphQl/Mutations/PluginMutations', () => ({
  CREATE_PLUGIN_MUTATION: 'CREATE_PLUGIN_MUTATION',
  UPDATE_PLUGIN_MUTATION: 'UPDATE_PLUGIN_MUTATION',
  DELETE_PLUGIN_MUTATION: 'DELETE_PLUGIN_MUTATION',
}));

// Mock Apollo hooks and gql
vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  gql: vi.fn((strings: readonly string[]) => strings.join('')),
}));

describe('PluginGraphQLService', () => {
  let graphqlService: PluginGraphQLService;

  beforeEach(() => {
    vi.clearAllMocks();
    graphqlService = new PluginGraphQLService(
      mockApolloClient as unknown as ApolloClient<unknown>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a new PluginGraphQLService instance', () => {
      expect(graphqlService).toBeInstanceOf(PluginGraphQLService);
    });
  });

  describe('getAllPlugins', () => {
    it('should fetch all plugins successfully', async () => {
      const mockPlugins = [
        {
          id: '1',
          pluginId: 'test-plugin',
          isActivated: true,
          isInstalled: true,
          backup: false,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockApolloClient.query.mockResolvedValue({
        data: { getPlugins: mockPlugins },
      });

      const result = await graphqlService.getAllPlugins();
      expect(result).toEqual(mockPlugins);
      expect(mockApolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.anything(),
          fetchPolicy: 'cache-first',
        }),
      );
    });

    it('should return empty array when no plugins found', async () => {
      mockApolloClient.query.mockResolvedValue({
        data: { getPlugins: [] },
      });

      const result = await graphqlService.getAllPlugins();
      expect(result).toEqual([]);
    });

    it('should return empty array when data is undefined', async () => {
      mockApolloClient.query.mockResolvedValue({
        data: undefined,
      });

      const result = await graphqlService.getAllPlugins();
      expect(result).toEqual([]);
    });

    it('should handle errors and return empty array', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockApolloClient.query.mockRejectedValue(new Error('Network error'));

      const result = await graphqlService.getAllPlugins();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch plugins:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('createPlugin', () => {
    it('should create plugin successfully', async () => {
      const mockPlugin = {
        id: '1',
        pluginId: 'new-plugin',
        isActivated: true,
        isInstalled: true,
        backup: false,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      const input = { pluginId: 'new-plugin', isActivated: true };

      mockApolloClient.mutate.mockResolvedValue({
        data: { createPlugin: mockPlugin },
      });

      const result = await graphqlService.createPlugin(input);
      expect(result).toEqual(mockPlugin);
      expect(mockApolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
          variables: { input },
          refetchQueries: expect.any(Array),
        }),
      );
    });

    it('should return null when creation fails', async () => {
      const input = { pluginId: 'new-plugin' };
      mockApolloClient.mutate.mockResolvedValue({
        data: { createPlugin: null },
      });

      const result = await graphqlService.createPlugin(input);
      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const input = { pluginId: 'new-plugin' };
      mockApolloClient.mutate.mockRejectedValue(new Error('Creation failed'));

      const result = await graphqlService.createPlugin(input);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to create plugin:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('updatePlugin', () => {
    it('should update plugin successfully', async () => {
      const mockPlugin = {
        id: '1',
        pluginId: 'test-plugin',
        isActivated: false,
        isInstalled: true,
        backup: true,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-02',
      };
      const input = { id: '1', isActivated: false, backup: true };

      mockApolloClient.mutate.mockResolvedValue({
        data: { updatePlugin: mockPlugin },
      });

      const result = await graphqlService.updatePlugin(input);
      expect(result).toEqual(mockPlugin);
      expect(mockApolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
          variables: { input },
          refetchQueries: expect.any(Array),
        }),
      );
    });

    it('should return null when update fails', async () => {
      const input = { id: '1', isActivated: false };
      mockApolloClient.mutate.mockResolvedValue({
        data: { updatePlugin: null },
      });

      const result = await graphqlService.updatePlugin(input);
      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const input = { id: '1', isActivated: false };
      mockApolloClient.mutate.mockRejectedValue(new Error('Update failed'));

      const result = await graphqlService.updatePlugin(input);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update plugin:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('deletePlugin', () => {
    it('should delete plugin successfully', async () => {
      const mockResult = { id: '1', pluginId: 'test-plugin' };
      const input = { id: '1' };

      mockApolloClient.mutate.mockResolvedValue({
        data: { deletePlugin: mockResult },
      });

      const result = await graphqlService.deletePlugin(input);
      expect(result).toEqual(mockResult);
      expect(mockApolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
          variables: { input },
          refetchQueries: expect.any(Array),
        }),
      );
    });

    it('should return null when deletion fails', async () => {
      const input = { id: '1' };
      mockApolloClient.mutate.mockResolvedValue({
        data: { deletePlugin: null },
      });

      const result = await graphqlService.deletePlugin(input);
      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const input = { id: '1' };
      mockApolloClient.mutate.mockRejectedValue(new Error('Deletion failed'));

      const result = await graphqlService.deletePlugin(input);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to delete plugin:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});

describe('GraphQL Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetAllPlugins', () => {
    it('should be callable without throwing', () => {
      const { result } = renderHook(() => useGetAllPlugins());
      expect(result).toBeDefined();
    });
  });

  describe('useCreatePlugin', () => {
    it('should be callable without throwing', () => {
      const { result } = renderHook(() => useCreatePlugin());
      expect(result).toBeDefined();
    });
  });

  describe('useUpdatePlugin', () => {
    it('should be callable without throwing', () => {
      const { result } = renderHook(() => useUpdatePlugin());
      expect(result).toBeDefined();
    });
  });

  describe('useDeletePlugin', () => {
    it('should be callable without throwing', () => {
      const { result } = renderHook(() => useDeletePlugin());
      expect(result).toBeDefined();
    });
  });
});
