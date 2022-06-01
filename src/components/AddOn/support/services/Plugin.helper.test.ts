import PluginHelper from './Plugin.helper';
describe('Testing src/components/AddOn/support/services/Plugin.helper.ts', () => {
  test('Class should contain the required method definitions', () => {
    const pluginHelper = new PluginHelper();
    expect(pluginHelper).toHaveProperty('fetchStore');
    expect(pluginHelper).toHaveProperty('fetchInstalled');
    expect(pluginHelper).toHaveProperty('generateLinks');
    expect(pluginHelper).toHaveProperty('generateLinks');
  });
  test('Fetchstore function should return a promise', async () => {
    const pluginHelper = new PluginHelper();
    await expect(pluginHelper.fetchStore()).rejects.toThrow();
  });
  test('FetchInstalled Should Return a promise', async () => {
    const pluginHelper = new PluginHelper();
    await expect(pluginHelper.fetchInstalled()).rejects.toThrow();
  });
  test('generateLinks should return proper objects', () => {
    const obj = { enabled: true, name: 'demo', component: 'samplecomponent' };
    const objToMatch = { name: 'demo', url: '/plugin/samplecomponent' };
    const pluginHelper = new PluginHelper();
    const val = pluginHelper.generateLinks([obj]);
    expect(val).toMatchObject([objToMatch]);
  });
  test('fetchInstalled Mock function should return correct data', async () => {
    const pluginHelper = new PluginHelper();
    const tempJSON = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };
    jest.spyOn(pluginHelper, 'fetchInstalled').mockImplementation(async () => {
      const result = await fetch(
        `https://jsonplaceholder.typicode.com/todos/1`
      );
      return await result.json();
    });
    await expect(pluginHelper.fetchInstalled()).resolves.toMatchObject(
      tempJSON
    );
  });
  test('fetchStore Mock function should return correct data', async () => {
    const pluginHelper = new PluginHelper();
    const tempJSON = {
      userId: 1,
      id: 2,
      title: 'quis ut nam facilis et officia qui',
      completed: false,
    };
    jest.spyOn(pluginHelper, 'fetchStore').mockImplementation(async () => {
      const result = await fetch(
        `https://jsonplaceholder.typicode.com/todos/2`
      );
      return await result.json();
    });
    await expect(pluginHelper.fetchStore()).resolves.toMatchObject(tempJSON);
  });
});
