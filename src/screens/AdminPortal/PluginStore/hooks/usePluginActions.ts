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
  type IPlugin,
} from 'plugin/graphql-service';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';

const getAdminPluginFileService = async () => {
  const { adminPluginFileService } =
    await import('plugin/services/AdminPluginFileService');
  return adminPluginFileService;
};

interface IUsePluginActionsProps {
  pluginData?: { getPlugins?: IPlugin[] };
  refetch: () => Promise<unknown>;
}

export function usePluginActions({
  pluginData,
  refetch,
}: IUsePluginActionsProps) {
  const [loading, setLoading] = useState(false);
  const [pluginToUninstall, setPluginToUninstall] =
    useState<IPluginMeta | null>(null);
  const uninstallModal = useModalState();

  const [updatePlugin] = useUpdatePlugin();
  const [deletePlugin] = useDeletePlugin();
  const [installPlugin] = useInstallPlugin();

  const handleInstallPlugin = useCallback(
    async (plugin: IPluginMeta) => {
      setLoading(true);
      try {
        // First, call the API to mark the plugin as installed
        await installPlugin({
          variables: {
            input: {
              pluginId: plugin.id,
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
    [installPlugin, refetch],
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

  const uninstallPlugin = useCallback(
    (plugin: IPluginMeta) => {
      setPluginToUninstall(plugin);
      uninstallModal.open();
    },
    [uninstallModal],
  );

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
          const adminPluginFileService = await getAdminPluginFileService();
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
      uninstallModal.close();
      setPluginToUninstall(null);
    }
  }, [pluginToUninstall, pluginData, deletePlugin, refetch, uninstallModal]);

  const closeUninstallModal = useCallback(() => {
    uninstallModal.close();
    setPluginToUninstall(null);
  }, [uninstallModal]);

  return {
    loading,
    showUninstallModal: uninstallModal.isOpen,
    pluginToUninstall,
    handleInstallPlugin,
    togglePluginStatus,
    uninstallPlugin,
    handleUninstallConfirm,
    closeUninstallModal,
  };
}
