import { vi } from 'vitest';
import {
  updateInstalled,
  installPlugin,
  removePlugin,
  updatePluginLinks,
} from './index';
describe('Testing rc/state/action-creators/index.ts', () => {
  test('updateInstalled Should call the dispatch function provided', () => {
    //checking if the updateInstalled returns a valid function or not
    const temp = updateInstalled('testPlug');
    expect(typeof temp).toBe('function');
    //stubbing the childfunction to check execution
    const childFunction = vi.fn();
    temp(childFunction);
    expect(childFunction).toHaveBeenCalled();
  });

  test('installPlugin Should call the dispatch function provided', () => {
    //checking if the installPlugin returns a valid function or not
    const temp = installPlugin('testPlug');
    expect(typeof temp).toBe('function');
    //stubbing the childfunction to check execution
    const childFunction = vi.fn();
    temp(childFunction);
    expect(childFunction).toHaveBeenCalled();
  });

  test('removePlugin Should call the dispatch function provided', () => {
    //checking if the removePlugin returns a valid function or not
    const temp = removePlugin('testPlug');
    expect(typeof temp).toBe('function');
    //stubbing the childfunction to check execution
    const childFunction = vi.fn();
    temp(childFunction);
    expect(childFunction).toHaveBeenCalled();
  });

  test('updatePluginLinks Should call the dispatch function provided', () => {
    //checking if the updatePluginLinks returns a valid function or not
    const temp = updatePluginLinks('testPlug');
    expect(typeof temp).toBe('function');
    //stubbing the childfunction to check execution
    const childFunction = vi.fn();
    temp(childFunction);
    expect(childFunction).toHaveBeenCalled();
  });
});
