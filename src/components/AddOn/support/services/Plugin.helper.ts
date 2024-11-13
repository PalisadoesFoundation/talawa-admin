/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.
 */
class PluginHelper {
  /**
   * Fetches the store data from a local server.
   *
   * @returns A promise that resolves to the store data in JSON format.
   */
  fetchStore = async (): Promise<any> => {
    const result = await fetch(`http://localhost:${process.env.PORT}/store`);
    return await result.json();
  };

  /**
   * Fetches the list of installed plugins from a local server.
   *
   * @returns A promise that resolves to the installed plugins data in JSON format.
   */
  fetchInstalled = async (): Promise<any> => {
    const result = await fetch(`http://localhost:3005/installed`);
    return await result.json();
  };

  /**
   * Generates an array of links for the enabled plugins.
   *
   * @param  plugins - An array of plugin objects.
   * @returns  An array of objects containing the name and URL of each enabled plugin.
   */
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
