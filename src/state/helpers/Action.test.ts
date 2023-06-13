import type { InterfaceAction } from './Action';

test('Testing Reducer Action Interface', () => {
  ({
    type: 'STRING_ACTION_TYPE',
    payload: 'ANY_PAYLOAD',
  }) as InterfaceAction;
});
