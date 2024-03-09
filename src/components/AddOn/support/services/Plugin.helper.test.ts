import PluginHelper, { changeBackendUrl } from './Plugin.helper';

describe('Testing src/components/AddOn/support/services/Plugin.helper.ts', () => {
  it('should return the correct URL when on localhost', () => {
    const result = changeBackendUrl('localhost', {
      remoteHost: 'example.com',
      backendUrl: 'http://localhost:3000',
    });

    expect(result).toBe('http://localhost:');
  });

  it('should return the correct URL when not on localhost(contains slash)', () => {
    const result = changeBackendUrl('example.com/', {
      remoteHost: 'example.com/',
      backendUrl: 'http://localhost:3000',
    });

    expect(result).toBe('example.com:');
  });

  it('should return the correct URL when not on localhost', () => {
    const result = changeBackendUrl('example.com', {
      remoteHost: 'example.com',
      backendUrl: 'http://localhost:3000',
    });

    expect(result).toBe('example.com:');
  });

  it('should return the correct URL when not on localhost(remote host is undefined)', () => {
    const result = changeBackendUrl('example.com', {
      remoteHost: undefined,
      backendUrl: 'http://localhost:3000',
    });

    expect(result).toBe(':');
  });

  test('Class should contain the required method definitions', () => {
    const pluginHelper = new PluginHelper();
    expect(pluginHelper).toHaveProperty('fetchStore');
    expect(pluginHelper).toHaveProperty('fetchInstalled');
    expect(pluginHelper).toHaveProperty('generateLinks');
    expect(pluginHelper).toHaveProperty('generateLinks');
  });
  test('generateLinks should return proper objects', () => {
    const obj = { enabled: true, name: 'demo', component: 'samplecomponent' };
    const objToMatch = { name: 'demo', url: '/plugin/samplecomponent' };
    const pluginHelper = new PluginHelper();
    const val = pluginHelper.generateLinks([obj]);
    expect(val).toMatchObject([objToMatch]);
  });
  it('fetchStore should return expected JSON', async () => {
    const helper = new PluginHelper();
    const spy = jest.spyOn(global, 'fetch').mockImplementation(() => {
      const response = new Response();
      response.json = jest
        .fn()
        .mockReturnValue(Promise.resolve({ data: 'mock data' }));
      return Promise.resolve(response);
    });

    const result = await helper.fetchStore();
    expect(result).toEqual({ data: 'mock data' });
    spy.mockRestore();
  });
  it('fetchInstalled() should return expected JSON', async () => {
    const pluginHelper = new PluginHelper();
    const mockResponse = [
      { name: 'plugin1', component: 'Component1', enabled: true },
      { name: 'plugin2', component: 'Component2', enabled: false },
    ];
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      const response = new Response();
      response.json = jest.fn().mockReturnValue(Promise.resolve(mockResponse));
      return Promise.resolve(response);
    }) as jest.Mock;
    const result = await pluginHelper.fetchInstalled();
    expect(result).toEqual(mockResponse);
  });
});
