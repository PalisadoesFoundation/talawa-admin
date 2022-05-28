import PluginHelper from './Plugin.helper';
describe('Testing src/components/AddOn/support/services/Plugin.helper.ts', () => {
  test('Class should contain the required method definitions', () => {
    const pluginHelper = new PluginHelper();
    expect(pluginHelper).toHaveProperty('fetchStore');
    expect(pluginHelper).toHaveProperty('fetchInstalled');
    expect(pluginHelper).toHaveProperty('generateLinks');
    expect(pluginHelper).toHaveProperty('generateLinks');
  });
});
