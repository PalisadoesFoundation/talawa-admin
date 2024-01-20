class PluginHelper {
  fetchStore = async (): Promise<any> => {
    const result = await fetch(`http://localhost:3000/store`);
    return await result.json();
  };

  fetchInstalled = async (): Promise<any> => {
    const result = await fetch(`http://localhost:3005/installed`);
    return await result.json();
  };

  generateLinks = (plugins: any[]): { name: string; url: string }[] => {
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
