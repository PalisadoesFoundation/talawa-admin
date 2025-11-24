/**
 * Custom hook for handling plugin actions (install, uninstall, toggle status)
 */
import { useState, useCallback } from 'react';
import { getPluginManager } from 'plugin/manager';
import type { IPluginMeta } from 'plugin';
import {
  useUpdatePlugin,
  useDeletePlugin,
  useInstallPlugin,
} from 'plugin/graphql-service';
import { adminPluginFileService } from 'plugin/services/AdminPluginFileService';

interface IPluginGraphQLItem {
  id: string;
  pluginId: string;
  isActivated?: boolean;
}

interface IUsePluginActionsProps {
  pluginData?: {
    getPlugins?: IPluginGraphQLItem[];
  };
  refetch: () => Promise<unknown>;
}

export function usePluginActions({
  pluginData,
  refetch,
}: IUsePluginActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showUninstallModal, setShowUninstallModal] = useState(false);
  const [pluginToUninstall, setPluginToUninstall] =
    useState<IPluginMeta | null>(null);

  // SAFELY normalize pluginData
  const plugins = pluginData?.getPlugins ?? [];

  const [updatePlugin] = useUpdatePlugin();
  const [deletePlugin] = useDeletePlugin();
  const [installPlugin] = useInstallPlugin();

  const handleInstallPlugin = useCallback(
    async (plugin: IPluginMeta) => {
      setLoading(true);
      try {
        await installPlugin({
          variables: {
            input: { pluginId: plugin.id },
          },
        });

        const success = await getPluginManager().installPlugin(plugin.id);
        if (!success) throw new Error('Failed to install plugin');

        await refetch();
        window.location.reload();
      } catch (error) {
        console.error('Failed to install plugin:', error);
      } finally {
        setLoading(false);
      }
    },
    [installPlugin, refetch],
  );

  const togglePluginStatus = useCallback(
    async (plugin: IPluginMeta, status: 'active' | 'inactive') => {
      setLoading(true);
      try {
        const existingPlugin = plugins.find((p) => p.pluginId === plugin.id);

        if (existingPlugin) {
          await updatePlugin({
            variables: {
              input: {
                id: existingPlugin.id,
                isActivated: status === 'active',
              },
            },
          });
        }

        const success = await getPluginManager().togglePluginStatus(
          plugin.id,
          status,
        );
        if (!success) throw new Error('Failed to toggle plugin');

        await refetch();
        window.location.reload();
      } catch (error) {
        console.error('Failed to toggle plugin status:', error);
      } finally {
        setLoading(false);
      }
    },
    [plugins, updatePlugin, refetch],
  );

  const uninstallPlugin = useCallback((plugin: IPluginMeta) => {
    setPluginToUninstall(plugin);
    setShowUninstallModal(true);
  }, []);

  const handleUninstallConfirm = useCallback(async () => {
    if (!pluginToUninstall) return;

    setLoading(true);
    try {
      const existingPlugin = plugins.find(
        (p) => p.pluginId === pluginToUninstall.id,
      );

      if (existingPlugin) {
        await deletePlugin({
          variables: {
            input: { id: existingPlugin.id },
          },
        });

        try {
          await adminPluginFileService.removePlugin(pluginToUninstall.id);
        } catch (err) {
          console.error('Failed to remove plugin directory:', err);
        }
      }

      const success = await getPluginManager().uninstallPlugin(
        pluginToUninstall.id,
      );
      if (!success) throw new Error('Failed to uninstall plugin');

      await refetch();
      window.location.reload();
    } catch (error) {
      console.error('Failed to uninstall plugin:', error);
    } finally {
      setLoading(false);
      setShowUninstallModal(false);
      setPluginToUninstall(null);
    }
  }, [plugins, pluginToUninstall, deletePlugin, refetch]);

  const closeUninstallModal = useCallback(() => {
    setShowUninstallModal(false);
    setPluginToUninstall(null);
  }, []);

  return {
    loading,
    showUninstallModal,
    pluginToUninstall,
    handleInstallPlugin,
    togglePluginStatus,
    uninstallPlugin,
    handleUninstallConfirm,
    closeUninstallModal,
  };
}
