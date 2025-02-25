/**
 * Helper class for managing plugin-related tasks such as fetching store data, installed plugins, and generating plugin links.
 */
class PluginHelper {
  /**
   * Fetches the store data from a local server.
   *
   * @returns A promise that resolves to the store data in JSON format.
   */
  async fetchStore(): Promise<unknown> {
    const result = await fetch(`http://localhost:${process.env.PORT}/store`);
    return result.json();
  }

  /**
   * Fetches the list of installed plugins from a local server.
   *
   * @returns A promise that resolves to the installed plugins data in JSON format.
   */
  async fetchInstalled(): Promise<unknown> {
    const result = await fetch(
      `http://localhost:${process.env.PORT}/installed`,
    );
    return result.json();
  }

  /**
   * Generates an array of links for the enabled plugins.
   *
   * @param plugins - An array of plugin objects.
   * @returns An array of objects containing the name and URL of each enabled plugin.
   */
  generateLinks(
    plugins: { name: string; component: string; enabled: boolean }[],
  ): { name: string; url: string }[] {
    return plugins
      .filter((plugin) => plugin.enabled)
      .map((installedPlugin) => ({
        name: installedPlugin.name,
        url: `/plugin/${installedPlugin.component.toLowerCase()}`,
      }));
  }
}

export default PluginHelper;
