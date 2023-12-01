import { UPDATE_INSTALL_STATUS_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';

// Mock data representing the response structure of the mutation
const updatePluginStatus = {
  _id: '123',
  pluginName: 'Sample Plugin',
  pluginCreatedBy: 'John Doe',
  pluginDesc: 'This is a sample plugin description.',
  uninstalledOrgs: [],
};

// Creating the mock entry
export const ADD_ON_ENTRY_MOCK = [
  {
    request: {
      query: UPDATE_INSTALL_STATUS_PLUGIN_MUTATION,
      variables: { id: '1', orgId: 'undefined' },
    },
    result: {
      data: {
        updatePluginStatus: updatePluginStatus,
      },
    },
  },
];
