import type { InterfaceAction } from './Action';

test('Testing Reducer Action Interface', () => {
  const action = {
    type: 'STRING_ACTION_TYPE',
    payload: 'ANY_PAYLOAD',
  } as InterfaceAction;

  expect(action.type).toBe('STRING_ACTION_TYPE');
  expect(action.payload).toBe('ANY_PAYLOAD');
});
