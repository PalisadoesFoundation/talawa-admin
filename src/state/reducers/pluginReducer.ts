import type { InterfaceAction } from 'state/helpers/Action';

const reducer = (
  state = INITIAL_STATE,
<<<<<<< HEAD
  action: InterfaceAction,
=======
  action: InterfaceAction
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
): typeof INITIAL_STATE => {
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
<<<<<<< HEAD
            (plugin: any) => plugin.id !== action.payload.id,
=======
            (plugin: any) => plugin.id !== action.payload.id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
