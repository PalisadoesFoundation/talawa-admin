import PluginHelper from './Plugin.helper';
import { vi } from 'vitest';

/**
 * This file contains unit tests for the PluginHelper component.
 *
 * The tests cover:
 * - Verification that the class contains the required method definitions.
 * - Correct functionality of the `generateLinks` method, including returning proper objects.
 * - Proper behavior of the `fetchStore` method, including handling of mocked JSON responses.
 * - Functionality of the `fetchInstalled` method, verifying it returns the expected JSON data.
 *
 * These tests use Vitest for test execution and mock the global `fetch` function for asynchronous tests.
 */

describe('Testing src/components/AddOn/support/services/Plugin.helper.ts', () => {
  it('Class should contain the required method definitions', () => {
    const pluginHelper = new PluginHelper();
    expect(pluginHelper).toHaveProperty('fetchStore');
    expect(pluginHelper).toHaveProperty('fetchInstalled');
    expect(pluginHelper).toHaveProperty('generateLinks');
    expect(pluginHelper).toHaveProperty('generateLinks');
  });
  it('generateLinks should return proper objects', () => {
    const obj = {
      enabled: true,
      name: 'demo',
      component: 'samplecomponent',
      _id: 'someId',
      pluginName: 'pluginName',
      pluginDesc: 'pluginDesc',
      pluginCreatedBy: 'creator',
      pluginInstallStatus: true,
      uninstalledOrgs: ['org1', 'org2'],
      installed: true,
    };
    const objToMatch = { name: 'demo', url: '/plugin/samplecomponent' };
    const pluginHelper = new PluginHelper();
    const val = pluginHelper.generateLinks([obj]);
    expect(val).toMatchObject([objToMatch]);
  });
  it('fetchStore should return expected JSON', async () => {
    const helper = new PluginHelper();
    const spy = vi.spyOn(global, 'fetch').mockImplementation(() => {
      const response = new Response();
      response.json = vi
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
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      const response = new Response();
      response.json = vi.fn().mockReturnValue(Promise.resolve(mockResponse));
      return Promise.resolve(response);
    });
    const result = await pluginHelper.fetchInstalled();
    expect(result).toEqual(mockResponse);
  });
});
