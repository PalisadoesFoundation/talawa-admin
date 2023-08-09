import type { InterfaceAction } from 'state/helpers/Action';

const reducer = (
  state = INITIAL_STATE,
  action: InterfaceAction
): typeof INITIAL_STATE => {
  switch (action.type) {
    case 'REFETCH_ORG_POST_LIST_DATA':
      return action.payload;
    default:
      return state;
  }
};

const INITIAL_STATE: any = null;

export default reducer;
// Todo: Write Test
