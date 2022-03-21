import { actionCreators } from './index';

describe('Testing Index File of "src/state/', () => {
  test('Testing Index File of "src/state/"', () => {
    expect(actionCreators.installPlugin).toBeTruthy();
    expect(actionCreators.removePlugin).toBeTruthy();
    expect(actionCreators.updateInstalled).toBeTruthy();
    expect(actionCreators.updatePluginLinks).toBeTruthy();
  });
})