import { store } from './store';
describe('Testing src/state/store.ts', () => {
  test('Testing Store Component', () => {
    const state = store.getState();
    expect(state).toHaveProperty('appRoutes');
    expect(state).toHaveProperty('plugins');
    expect(state).toMatchObject({
      appRoutes: expect.any(Object),
      plugins: expect.any(Object),
    });
    expect(state.appRoutes).toMatchObject({
      targets: expect.any(Array),
      configUrl: expect.any(String),
      components: expect.any(Array),
    });
    expect(state.plugins).toMatchObject({
      installed: expect.any(Array),
      addonStore: expect.any(Array),
      extras: expect.any(Array),
    });
  });
});
