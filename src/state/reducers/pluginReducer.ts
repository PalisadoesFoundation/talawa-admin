import { Action } from 'state/helpers/Action';

const reducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case 'UPDATE_INSTALLED':
      return Object.assign({}, INITIAL_STATE, {
        installed: [...action.payload],
      });
    case 'INSTALL_PLUGIN':
      return Object.assign({}, INITIAL_STATE, {
        installed: [...INITIAL_STATE.installed, action.payload],
      });
    case 'REMOVE_PLUGIN':
      return Object.assign({}, INITIAL_STATE, {
        installed: [
          ...INITIAL_STATE.installed.filter(
            (plugin: any) => plugin.id !== action.payload.id
          ),
        ],
      });
    case 'UPDATE_STORE':
      return Object.assign({}, INITIAL_STATE, {
        addonStore: [...action.payload],
      });
    case 'UPDATE_EXTRAS':
      return Object.assign({}, INITIAL_STATE, {
        addonStore: [...action.payload],
      });
    default:
      return state;
  }
};

// Installed { id, name, install datetime, installed by, component, enabled }
const INITIAL_STATE: any = {
  installed: [
    {
      id: 'dummy-plugin',
      name: 'Dummy Plugin',
      description: 'This is a plugin for a demo',
      createdBy: 'Admin',
      installDatetime: new Date(),
      installedBy: 'Admin',
      component: 'DummyPlugin',
      enabled: true,
    },
  ],
  addonStore: [
    {
      id: 'dummy-plugin2',
      name: 'Dummy Plugin 2',
      description: 'This is a plugin for a demo',
      createdBy: 'Admin',
      component: 'DummyPlugin2',
    },
  ],
  extras: [],
};

export default reducer;
