import reducer from './pluginReducer';
import * as types from '../action-creators/index';
import expect from 'expect';

describe('Testing Plugin Reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {
        type: '',
        payload: undefined,
      })
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
        }
      )
    ).toEqual({
      installed: [{ name: 'testplug' }],
      addonStore: [],
      extras: [],
    });
  });
  it('should handle REMOVE_PLUGIN', () => {
    expect(
      reducer(
        { installed: [], addonStore: [], extras: [] },
        {
          type: 'REMOVE_PLUGIN',
          payload: { name: 'testplug' },
        }
      )
    ).toEqual({
      installed: [],
      addonStore: [],
      extras: [],
    });
  });
});
