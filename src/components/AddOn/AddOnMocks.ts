import {
  UPDATE_INSTALL_STATUS_PLUGIN_MUTATION,
  ADD_PLUGIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { act } from 'react';
import type { NormalizedCacheObject } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { ORGANIZATIONS_LIST, PLUGIN_GET } from 'GraphQl/Queries/Queries';

const { getItem } = useLocalStorage();

export const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

export async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

export const updatePluginStatus = {
  _id: '123',
  pluginName: 'Sample Plugin',
  pluginCreatedBy: 'John Doe',
  pluginDesc: 'This is a sample plugin description.',
  uninstalledOrgs: [],
};

export const pluginData = {
  pluginName: 'Test Plugin',
  pluginCreatedBy: 'Test Creator',
  pluginDesc: 'Test Description',
};

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

export const PLUGIN_GET_MOCK = {
  request: {
    query: PLUGIN_GET,
  },
  result: {
    data: {
      getPlugins: [
        {
          _id: '6581be50e88e74003aab436c',
          pluginName: 'Plugin 1',
          pluginCreatedBy: 'Talawa Team',
          pluginDesc:
            'User can share messages with other users in a chat user interface.',
          uninstalledOrgs: [
            '62ccfccd3eb7fd2a30f41601',
            '62ccfccd3eb7fd2a30f41601',
          ],
          __typename: 'Plugin',
        },
        {
          _id: '6581be50e88e74003aab436d',
          pluginName: 'Plugin 2',
          pluginCreatedBy: 'Talawa Team',
          pluginDesc:
            'User can share messages with other users in a chat user interface.',
          uninstalledOrgs: ['6537904485008f171cf29924'],
          __typename: 'Plugin',
        },
        {
          _id: '6581be50e88e74003aab436e',
          pluginName: 'Plugin 3',
          pluginCreatedBy: 'Talawa Team',
          pluginDesc:
            'User can share messages with other users in a chat user interface.',
          uninstalledOrgs: [
            '62ccfccd3eb7fd2a30f41601',
            '62ccfccd3eb7fd2a30f41601',
          ],
          __typename: 'Plugin',
        },
      ],
    },
    loading: false,
  },
};

export const ORGANIZATIONS_LIST_MOCK = {
  request: {
    query: ORGANIZATIONS_LIST,
    variables: {
      id: 'undefined',
    },
  },
  result: {
    data: {
      organization: [
        {
          _id: 'undefined',
          image: '',
          creator: {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          name: 'name',
          description: 'description',
          userRegistrationRequired: true,

          visibleInSearch: true,
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          members: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          admins: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
          membershipRequests: {
            _id: 'id',
            user: {
              firstName: 'firstName',
              lastName: 'lastName',
              email: 'email',
            },
          },
          blockedUsers: {
            _id: 'id',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
          },
        },
      ],
    },
  },
};

export const mocks = [
  {
    request: {
      query: ADD_PLUGIN_MUTATION,
      variables: {
        pluginName: 'Test Plugin',
        pluginCreatedBy: 'AdminTest Creator',
        pluginDesc: 'Test Description',
        pluginInstallStatus: false,
        installedOrgs: ['id'],
      },
    },
    result: {
      data: {
        createPlugin: {
          _id: '1',
          pluginName: 'Test Plugin',
          pluginCreatedBy: 'AdminTest Creator',
          pluginDesc: 'Test Description',
        },
      },
    },
  },
];
