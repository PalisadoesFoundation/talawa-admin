interface InterfacePluginHelper {
  _id: string;
  pluginName?: string;
  pluginDesc?: string;
  pluginCreatedBy: string;
  pluginInstallStatus?: boolean;
  uninstalledOrgs: string[];
  installed: boolean;
  enabled: boolean;
  name: string;
  component: string;
}

class PluginHelper {
  fetchStore = async (): Promise<InterfacePluginHelper[]> => {
    const port = process.env.PORT || '4321'; // Default to 4321 if PORT is not defined
    const result = await fetch(`http://localhost:${port}/store`);
    return (await result.json()) as InterfacePluginHelper[];
  };

  fetchInstalled = async (): Promise<InterfacePluginHelper[]> => {
    const result = await fetch(`http://localhost:3005/installed`);
    return (await result.json()) as InterfacePluginHelper[];
  };

  generateLinks = (
    plugins: InterfacePluginHelper[],
  ): { name: string; url: string }[] => {
    return plugins
      .filter((plugin) => plugin.enabled)
      .map((installedPlugin) => {
        return {
          name: installedPlugin.name,
          url: `/plugin/${installedPlugin.component.toLowerCase()}`,
        };
      });
  };
}

export default PluginHelper;
