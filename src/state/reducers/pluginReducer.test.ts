import reducer from './pluginReducer';
import expect from 'expect';

describe('Testing Plugin Reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      }),
    ).toEqual({
      installed: [],
      addonStore: [],
      extras: [],
    });
  });
  it('should handle INSTALL_PLUGIN', () => {
    expect(
      reducer(
        { installed: [], addonStore: [], extras: [] },
        {
          type: 'INSTALL_PLUGIN',
          payload: { name: 'testplug' },
        },
      ),
    ).toEqual({
      installed: [{ name: 'testplug' }],
      addonStore: [],
      extras: [],
    });
  });
  it('should handle REMOVE_PLUGIN', () => {
    expect(
      reducer(
        {
          installed: [
            { name: 'testplug2', id: 3 },
            { name: 'testplug3', id: 5 },
          ],
          addonStore: [],
          extras: [],
        },
        {
          type: 'REMOVE_PLUGIN',
          payload: { id: 3 },
        },
      ),
    ).toEqual({
      installed: [{ name: 'testplug3', id: 5 }],
      addonStore: [],
      extras: [],
    });
  });
  it('should handle UPDATE_INSTALLED', () => {
    expect(
      reducer(
        { installed: [], addonStore: [], extras: [] },
        {
          type: 'UPDATE_INSTALLED',
          //Here payload is expected to be as array
          payload: [{ name: 'testplug-updated' }],
        },
      ),
    ).toEqual({
      installed: [{ name: 'testplug-updated' }],
      addonStore: [],
      extras: [],
    });
  });
  it('should handle UPDATE_STORE', () => {
    expect(
      reducer(
        { installed: [], addonStore: [], extras: [] },
        {
          type: 'UPDATE_STORE',
          //Here payload is expected to be as array
          payload: [{ name: 'sample-addon' }],
        },
      ),
    ).toEqual({
      installed: [],
      addonStore: [{ name: 'sample-addon' }],
      extras: [],
    });
  });
  it('should handle UPDATE_EXTRAS', () => {
    expect(
      reducer(
        { installed: [], addonStore: [], extras: [] },
        {
          type: 'UPDATE_EXTRAS',
          //Here payload is expected to be as array
          payload: [{ name: 'sample-addon-extra' }],
        },
      ),
    ).toEqual({
      installed: [],
      addonStore: [{ name: 'sample-addon-extra' }],
      extras: [],
    });
  });
});
