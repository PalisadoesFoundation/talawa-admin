class PluginHelper {
  fetchStore = async () => {
    const result = await fetch(`http://localhost:3005/store`);
    return await result.json();
  };

  fetchInstalled = async () => {
    const result = await fetch(`http://localhost:3005/installed`);
    return await result.json();
  };

  generateLinks = (plugins: any[]) => {
    return plugins
      .filter((plugin: any) => plugin.enabled)
      .map((installedPlugin: any) => {
        return {
          name: installedPlugin.name,
          url: `/plugin/${installedPlugin.component.toLowerCase()}`,
        };
      });
  };
}

export default PluginHelper;
