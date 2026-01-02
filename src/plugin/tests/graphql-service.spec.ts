import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import {
  PluginGraphQLService,
  useGetAllPlugins,
  useCreatePlugin,
  useInstallPlugin,
  useUpdatePlugin,
  useDeletePlugin,
} from '../graphql-service';
import {
  type ApolloClient,
  useQuery,
  useMutation,
  type QueryResult,
} from '@apollo/client';

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

// Mock i18n to prevent initialization errors
vi.mock('../../utils/i18n', () => ({
  default: {
    getFixedT: () => (key: string) => key,
  },
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
    vi.restoreAllMocks();
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
          createdAt: dayjs.utc().subtract(1, 'year').format('YYYY-MM-DD'),
          updatedAt: dayjs.utc().subtract(1, 'year').format('YYYY-MM-DD'),
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
        createdAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        updatedAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
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

  describe('installPlugin', () => {
    it('should install plugin successfully', async () => {
      const mockPlugin = {
        id: '1',
        pluginId: 'test-plugin',
        isActivated: true,
        isInstalled: true,
        backup: false,
        createdAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        updatedAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
      };
      const input = { orgId: 'org1', pluginId: 'test-plugin' };

      mockApolloClient.mutate.mockResolvedValue({
        data: { installPlugin: mockPlugin },
      });

      const result = await graphqlService.installPlugin(input);
      expect(result).toEqual(mockPlugin);
      expect(mockApolloClient.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
          variables: { input },
          refetchQueries: expect.any(Array),
        }),
      );
    });

    it('should return null when install result is null', async () => {
      const input = { orgId: 'org1', pluginId: 'test-plugin' };
      mockApolloClient.mutate.mockResolvedValue({
        data: { installPlugin: null },
      });

      const result = await graphqlService.installPlugin(input);
      expect(result).toBeNull();
    });

    it('should handle errors and return null', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const input = { orgId: 'org1', pluginId: 'test-plugin' };
      mockApolloClient.mutate.mockRejectedValue(new Error('Install failed'));

      const result = await graphqlService.installPlugin(input);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to install plugin:',
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
        createdAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        updatedAt: dayjs()
          .subtract(1, 'year')
          .add(1, 'day')
          .format('YYYY-MM-DD'),
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetAllPlugins', () => {
    it('should call useQuery with correct query and return the result', () => {
      const mockData = {
        getPlugins: [
          {
            id: '1',
            pluginName: 'Test Plugin',
            pluginCreatedBy: 'Admin',
            pluginDesc: 'Test Description',
            uninstalledOrgs: [],
          },
        ],
      };

      const mockQueryResult = {
        data: mockData,
        loading: false,
        error: undefined,
        refetch: vi.fn(),
        fetchMore: vi.fn(),
        networkStatus: 7,
        called: true,
      };

      vi.mocked(useQuery).mockReturnValue(
        mockQueryResult as unknown as QueryResult,
      );

      const { result } = renderHook(() => useGetAllPlugins());

      expect(vi.mocked(useQuery)).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle loading state', () => {
      const mockQueryResult = {
        data: undefined,
        loading: true,
        error: undefined,
        refetch: vi.fn(),
        fetchMore: vi.fn(),
        networkStatus: 1,
        called: true,
      };

      vi.mocked(useQuery).mockReturnValue(
        mockQueryResult as unknown as QueryResult,
      );

      const { result } = renderHook(() => useGetAllPlugins());

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle error state', () => {
      const mockError = new Error('Failed to fetch plugins');
      const mockQueryResult = {
        data: undefined,
        loading: false,
        error: mockError,
        refetch: vi.fn(),
        fetchMore: vi.fn(),
        networkStatus: 8,
        called: true,
      };

      vi.mocked(useQuery).mockReturnValue(
        mockQueryResult as unknown as QueryResult,
      );

      const { result } = renderHook(() => useGetAllPlugins());

      expect(result.current.error).toEqual(mockError);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useCreatePlugin', () => {
    it('should call useMutation and return mutation function', () => {
      const mockMutationFn = vi.fn();
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useCreatePlugin());

      expect(vi.mocked(useMutation)).toHaveBeenCalled();
      expect(result.current[0]).toBe(mockMutationFn);
      expect(result.current[1]).toEqual(mockMutationResult);
    });

    it('should pass correct variables when mutation function is called', async () => {
      const mockMutationFn = vi.fn().mockResolvedValue({
        data: { createPlugin: { id: '1', pluginId: 'plugin-1' } },
      });
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useCreatePlugin());

      const input = { pluginId: 'plugin-1' };
      await result.current[0]({ variables: { input } });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables: { input } });
    });
  });

  describe('useInstallPlugin', () => {
    it('should call useMutation and return mutation function', () => {
      const mockMutationFn = vi.fn();
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useInstallPlugin());

      expect(vi.mocked(useMutation)).toHaveBeenCalled();
      expect(result.current[0]).toBe(mockMutationFn);
      expect(result.current[1]).toEqual(mockMutationResult);
    });

    it('should pass correct variables when mutation function is called', async () => {
      const mockMutationFn = vi.fn().mockResolvedValue({
        data: { installPlugin: { id: '1', isInstalled: true } },
      });
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useInstallPlugin());

      const input = { orgId: 'org1', pluginId: 'test-plugin' };
      await result.current[0]({ variables: { input } });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables: { input } });
    });
  });

  describe('useUpdatePlugin', () => {
    it('should call useMutation and return mutation function', () => {
      const mockMutationFn = vi.fn();
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useUpdatePlugin());

      expect(vi.mocked(useMutation)).toHaveBeenCalled();
      expect(result.current[0]).toBe(mockMutationFn);
      expect(result.current[1]).toEqual(mockMutationResult);
    });

    it('should pass correct variables when mutation function is called', async () => {
      const mockMutationFn = vi.fn().mockResolvedValue({
        data: { updatePlugin: { id: '1', pluginName: 'Updated Plugin' } },
      });
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useUpdatePlugin());

      const input = {
        id: '1',
        pluginName: 'Updated Plugin',
        pluginDesc: 'Updated Description',
      };
      await result.current[0]({ variables: { input } });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables: { input } });
    });
  });

  describe('useDeletePlugin', () => {
    it('should call useMutation and return mutation function', () => {
      const mockMutationFn = vi.fn();
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useDeletePlugin());

      expect(vi.mocked(useMutation)).toHaveBeenCalled();
      expect(result.current[0]).toBe(mockMutationFn);
      expect(result.current[1]).toEqual(mockMutationResult);
    });

    it('should pass correct variables when mutation function is called', async () => {
      const mockMutationFn = vi.fn().mockResolvedValue({
        data: { deletePlugin: { success: true } },
      });
      const mockMutationResult = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };

      vi.mocked(useMutation).mockReturnValue([
        mockMutationFn,
        mockMutationResult,
      ] as unknown as ReturnType<typeof useMutation>);

      const { result } = renderHook(() => useDeletePlugin());

      const input = { id: '1' };
      await result.current[0]({ variables: { input } });

      expect(mockMutationFn).toHaveBeenCalledWith({ variables: { input } });
    });
  });
});
