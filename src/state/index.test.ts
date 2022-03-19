import { actionCreators } from './index';

test('Testing Index File of "src/state/"', () => {
  expect(actionCreators.installPlugin).toBeTruthy();
  expect(actionCreators.removePlugin).toBeTruthy();
  expect(actionCreators.updateInstalled).toBeTruthy();
  expect(actionCreators.updatePluginLinks).toBeTruthy();
});
