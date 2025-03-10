import { store } from './store';
describe('Testing src/state/store.ts', () => {
  const state = store.getState();
  test('appRoutes schema should contain targets, configUrl and components', () => {
    expect(state.appRoutes).toMatchObject({
      targets: expect.any(Array),
      components: expect.any(Array),
    });
  });
});
