class PluginHelper {
  fetchStore = async (): Promise<any> => {
<<<<<<< HEAD
    const result = await fetch(`http://localhost:${process.env.PORT}/store`);
=======
    const result = await fetch(`http://localhost:3005/store`);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
