import { Action } from 'state/helpers/Action';

const reducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case 'UPDATE_INSTALLED':
      return Object.assign({}, state, {
        installed: [...action.payload],
      });
    case 'INSTALL_PLUGIN':
      return Object.assign({}, state, {
        installed: [...state.installed, action.payload],
      });
    case 'REMOVE_PLUGIN':
      return Object.assign({}, state, {
        installed: [
          ...state.installed.filter(
            (plugin: any) => plugin.id !== action.payload.id
          ),
        ],
      });
    case 'UPDATE_STORE':
      return Object.assign({}, state, {
        addonStore: [...action.payload],
      });
    case 'UPDATE_EXTRAS':
      return Object.assign({}, state, {
        addonStore: [...action.payload],
      });
    default:
      return state;
  }
};

const INITIAL_STATE: any = {
  installed: [],
  addonStore: [],
  extras: [],
};

export default reducer;
