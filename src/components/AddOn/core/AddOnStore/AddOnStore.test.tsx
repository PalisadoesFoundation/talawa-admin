import { act, render } from '@testing-library/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import AddOnStore from './AddOnStore';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import { PLUGIN_GET } from 'GraphQl/Queries/PlugInQueries';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';

const { getItem } = useLocalStorage();

jest.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    fetchStore: jest.fn().mockResolvedValue([
      {
        _id: '1',
        pluginName: 'Plugin 1',
        pluginDesc: 'Description 1',
        pluginCreatedBy: 'User 1',
        pluginInstallStatus: true,
      },
      {
        _id: '2',
        pluginName: 'Plugin 2',
        pluginDesc: 'Description 2',
        pluginCreatedBy: 'User 2',
        pluginInstallStatus: false,
      },
      // Add more mock data as needed
    ]),
    fetchInstalled: jest.fn().mockResolvedValue([
      {
        _id: '1',
        pluginName: 'Installed Plugin 1',
        pluginDesc: 'Installed Description 1',
        pluginCreatedBy: 'User 3',
        pluginInstallStatus: true,
      },
      {
        _id: '3',
        pluginName: 'Installed Plugin 3',
        pluginDesc: 'Installed Description 3',
        pluginCreatedBy: 'User 4',
        pluginInstallStatus: true,
      },
      // Add more mock data as needed
    ]),
    generateLinks: jest.fn().mockImplementation((plugins) => {
      return plugins
        .filter((plugin: { enabled: any }) => plugin.enabled)
        .map((installedPlugin: { pluginName: any; component: string }) => {
          return {
            name: installedPlugin.pluginName,
            url: `/plugin/${installedPlugin.component.toLowerCase()}`,
          };
        });
    }),
  })),
}));

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const mocks = [
  {
    request: {
      query: PLUGIN_GET,
    },
    result: {
      data: {
        getPlugins: [
          {
            _id: '1',
            pluginName: 'Chats 1',
            pluginCreatedBy: 'Talawa Team',
            pluginInstallStatus: true,
            pluginDesc:
              'User can share messages with other users in a chat user interface.',
            uninstalledOrgs: [],
            __typename: 'Plugin',
          },
          {
            _id: '2',
            pluginName: 'Chats 2',
            pluginCreatedBy: 'Talawa Team',
            pluginDesc:
              'User can share messages with other users in a chat user interface.',
            uninstalledOrgs: [],
            pluginInstallStatus: false,
            __typename: 'Plugin',
          },
          {
            _id: '3',
            pluginName: 'Chats 3',
            pluginCreatedBy: 'Talawa Team',
            pluginInstallStatus: true,
            pluginDesc:
              'User can share messages with other users in a chat user interface.',
            uninstalledOrgs: [],
            __typename: 'Plugin',
          },
          {
            _id: '4',
            pluginName: 'Chats 4',
            pluginCreatedBy: 'Talawa Team',
            pluginDesc:
              'User can share messages with other users in a chat user interface.',
            uninstalledOrgs: [],
            pluginInstallStatus: false,
            __typename: 'Plugin',
          },
        ],
      },
      loading: false,
    },
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {
        id: 'undefined',
      },
    },
    result: {
      data: {
        organizations: [
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
  },
];

describe('Testing AddOnStore Component', () => {
  test('for render with no loading', async () => {
    render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await wait();
  });

  test('for button functionality', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(getByText('Installed'));
  });

  test('for Filter functionality - Disabled', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(getByText('Installed'));
    userEvent.click(getByText('Disabled'));
  });

  test('for search functionality - Non Existing', async () => {
    const { getByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchInput = getByPlaceholderText('Ex: Donations');
    userEvent.type(searchInput, 'non existent plugin');
  });

  test('for search functionality - Empty search', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    let searchInput = getByPlaceholderText('Ex: Donations');
    userEvent.type(searchInput, '1');
    userEvent.type(searchInput, '{backspace}');

    await wait();
    userEvent.click(getByText('Installed'));

    await wait();
    searchInput = getByPlaceholderText('Ex: Donations');
    userEvent.type(searchInput, '1');
    userEvent.type(searchInput, '{backspace}');
  });

  test('for search functionality - Installed Plugins', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    let searchInput = getByPlaceholderText('Ex: Donations');
    userEvent.click(getByText('Installed'));

    await wait();

    searchInput = getByPlaceholderText('Ex: Donations');
    userEvent.type(searchInput, 'Chats');
  });

  test('for loading is data is not fetched', () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnStore />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(getByTestId('AddOnEntryStore')).toBeInTheDocument();
  });
});
