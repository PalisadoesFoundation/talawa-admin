import { actionCreators } from './index';

test('Testing Index File of "src/state/"', () => {
    // testing that the functions should  be properly exported from /src/state/index.ts
    expect(actionCreators.installPlugin).toBeTruthy()
    expect(actionCreators.removePlugin).toBeTruthy()
    expect(actionCreators.updateInstalled).toBeTruthy()
    expect(actionCreators.updatePluginLinks).toBeTruthy()
});
