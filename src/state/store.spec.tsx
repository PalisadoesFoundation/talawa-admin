import { store } from './store';
describe('Testing src/state/store.ts', () => {
  const state = store.getState();
  test('State should contain the properties appRoutes and plugins', () => {
    expect(state).toHaveProperty('appRoutes');
    expect(state).toHaveProperty('plugins');
  });
  test('State schema should contain appRoutes and plugins', () => {
    expect(state).toMatchObject({
      appRoutes: expect.any(Object),
      plugins: expect.any(Object),
    });
  });
  test('appRoutes schema should contain targets, configUrl and components', () => {
    expect(state.appRoutes).toMatchObject({
      targets: expect.any(Array),
      components: expect.any(Array),
    });
  });
  test('plugins schema should contain installed, addOnStore and extras', () => {
    expect(state.plugins).toMatchObject({
      installed: expect.any(Array),
      addonStore: expect.any(Array),
      extras: expect.any(Array),
    });
  });
});
