import React, { act } from 'react';
import 'jest-location-mock';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AddOnStore from './AddOnStore';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_LIST, PLUGIN_GET } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import useLocalStorage from 'utils/useLocalstorage';
import { MockedProvider } from '@apollo/react-testing';

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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

jest.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    fetchInstalled: jest.fn().mockResolvedValue([]),
    fetchStore: jest.fn().mockResolvedValue([]),
  })),
}));

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

const PLUGIN_GET_MOCK = {
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

const PLUGIN_LOADING_MOCK = {
  request: {
    query: PLUGIN_GET,
  },
  result: {
    data: {
      getPlugins: [],
    },
    loading: true,
  },
};
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: 'undefined' }),
}));
const ORGANIZATIONS_LIST_MOCK = {
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
};

describe('Testing AddOnStore Component', () => {
  test('for the working of the tabs', async () => {
    const mocks = [ORGANIZATIONS_LIST_MOCK, PLUGIN_GET_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    userEvent.click(screen.getByText('Installed'));

    await wait();
    userEvent.click(screen.getByText('Available'));
  });

  test('check the working search bar when on Available tab', async () => {
    const mocks = [ORGANIZATIONS_LIST_MOCK, PLUGIN_GET_MOCK];

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    userEvent.click(screen.getByText('Available'));

    await wait();
    let searchText = '';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });
    expect(screen.getAllByText('Plugin 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Plugin 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Plugin 3').length).toBeGreaterThanOrEqual(1);

    searchText = 'Plugin 1';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });
    const plugin1Elements = screen.queryAllByText('Plugin 1');
    expect(plugin1Elements.length).toBeGreaterThan(1);

    searchText = 'Test Plugin';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });

    const message = screen.getAllByText('Plugin does not exists');
    expect(message.length).toBeGreaterThanOrEqual(1);
  });

  test('check filters enabled and disabled under Installed tab', async () => {
    const mocks = [ORGANIZATIONS_LIST_MOCK, PLUGIN_GET_MOCK];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();
    userEvent.click(screen.getByText('Installed'));

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Enabled')).toBeInTheDocument();
    expect(screen.getByLabelText('Disabled')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Enabled'));
    expect(screen.getByLabelText('Enabled')).toBeChecked();
    fireEvent.click(screen.getByLabelText('Disabled'));
    expect(screen.getByLabelText('Disabled')).toBeChecked();
  });

  test('check the working search bar when on Installed tab', async () => {
    const mocks = [ORGANIZATIONS_LIST_MOCK, PLUGIN_GET_MOCK];

    const { container } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    await wait();
    userEvent.click(screen.getByText('Installed'));

    await wait();
    let searchText = '';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });
    expect(container).toHaveTextContent('Plugin 1');
    expect(container).toHaveTextContent('Plugin 3');

    searchText = 'Plugin 1';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });
    const plugin1Elements = screen.queryAllByText('Plugin 1');
    expect(plugin1Elements.length).toBeGreaterThan(1);

    searchText = 'Test Plugin';
    fireEvent.change(screen.getByPlaceholderText('Ex: Donations'), {
      target: { value: searchText },
    });
    const message = screen.getAllByText('Plugin does not exists');
    expect(message.length).toBeGreaterThanOrEqual(1);
  });

  test('AddOnStore loading test', async () => {
    expect(true).toBe(true);
    const mocks = [ORGANIZATIONS_LIST_MOCK, PLUGIN_LOADING_MOCK];
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={mocks} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('AddOnEntryStore')).toBeInTheDocument();
  });
});
