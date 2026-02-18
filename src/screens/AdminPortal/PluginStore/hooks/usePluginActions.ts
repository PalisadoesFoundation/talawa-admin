/**
 * Custom hook for handling plugin actions (install, uninstall, toggle status)
 */
import { useState, useCallback } from 'react';
import { getPluginManager } from 'plugin/manager';
import type { IPluginMeta } from 'plugin';
import { useUpdatePlugin, useDeletePlugin } from 'plugin/graphql-service';
import { adminPluginFileService } from 'plugin/services/AdminPluginFileService';

import type { IPlugin } from 'plugin/graphql-service';

interface IUsePluginActionsProps {
  pluginData?: { getPlugins: IPlugin[] };
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

  const [updatePlugin] = useUpdatePlugin();
  const [deletePlugin] = useDeletePlugin();

  const handleInstallPlugin = useCallback(
    async (plugin: IPluginMeta) => {
      setLoading(true);
      try {
        // Find the existing plugin in the database
        const existingPlugin = pluginData?.getPlugins?.find(
          (p: IPlugin) => p.pluginId === plugin.id,
        );

        if (!existingPlugin) {
          throw new Error(
            'Plugin not found in database. Please upload it first.',
          );
        }

        // Mark the plugin as installed using updatePlugin mutation
        await updatePlugin({
          variables: {
            input: {
              id: existingPlugin.id,
              isInstalled: true,
            },
          },
        });

        // Then, call the admin plugin manager to handle the installation lifecycle
        const success = await getPluginManager().installPlugin(plugin.id);
        if (!success) {
          throw new Error('Failed to install plugin in admin plugin manager');
        }

        // Refetch plugin data to update UI
        await refetch();

        // Reload the page to ensure all plugin states are properly updated
        window.location.reload();
      } catch (error) {
        console.error('Failed to install plugin:', error);
      } finally {
        setLoading(false);
      }
    },
    [pluginData, updatePlugin, refetch],
  );

  const togglePluginStatus = useCallback(
    async (plugin: IPluginMeta, status: 'active' | 'inactive') => {
      setLoading(true);
      try {
        // Update plugin status in GraphQL
        const existingPlugin = pluginData?.getPlugins?.find(
          (p: IPlugin) => p.pluginId === plugin.id,
        );
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

        // Update plugin manager status
        const success = await getPluginManager().togglePluginStatus(
          plugin.id,
          status,
        );
        if (!success) {
          throw new Error('Failed to toggle plugin status');
        }

        // Refetch plugin data to update UI
        await refetch();

        // Reload the page to ensure all plugin states are properly updated
        window.location.reload();
      } catch (error) {
        console.error('Failed to toggle plugin status:', error);
      } finally {
        setLoading(false);
      }
    },
    [pluginData, updatePlugin, refetch],
  );

  const uninstallPlugin = useCallback((plugin: IPluginMeta) => {
    setPluginToUninstall(plugin);
    setShowUninstallModal(true);
  }, []);

  const handleUninstallConfirm = useCallback(async () => {
    if (!pluginToUninstall) return;

    setLoading(true);
    try {
      const existingPlugin = pluginData?.getPlugins?.find(
        (p: IPlugin) => p.pluginId === pluginToUninstall.id,
      );
      if (existingPlugin) {
        // Remove permanently - delete from database
        await deletePlugin({
          variables: {
            input: {
              id: existingPlugin.id,
            },
          },
        });

        // Remove plugin folder from admin filesystem
        try {
          const success = await adminPluginFileService.removePlugin(
            pluginToUninstall.id,
          );
          if (!success) {
            console.error(
              `Failed to remove admin plugin directory for ${pluginToUninstall.id}`,
            );
          }
        } catch (error) {
          console.error(
            `Failed to remove admin plugin directory for ${pluginToUninstall.id}:`,
            error,
          );
          // Don't throw error - plugin is already deleted from database
        }
      }

      // Call admin plugin manager uninstall lifecycle
      const success = await getPluginManager().uninstallPlugin(
        pluginToUninstall.id,
      );
      if (!success) {
        throw new Error('Failed to uninstall plugin');
      }

      // Refetch plugin data to update UI
      await refetch();

      // Reload the page to ensure all plugin states are properly updated
      window.location.reload();
    } catch (error) {
      console.error('Failed to uninstall plugin:', error);
    } finally {
      setLoading(false);
      setShowUninstallModal(false);
      setPluginToUninstall(null);
    }
  }, [pluginToUninstall, pluginData, deletePlugin, refetch]);

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
