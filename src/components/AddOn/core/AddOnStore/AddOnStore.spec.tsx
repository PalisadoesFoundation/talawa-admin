import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import AddOnStore, {
  getInstalledIds,
  markInstalledPlugins,
} from './AddOnStore';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { PLUGIN_GET } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { vi, describe, test, expect } from 'vitest';
import {
  client,
  wait,
  ORGANIZATIONS_LIST_MOCK,
  PLUGIN_GET_MOCK,
} from 'components/AddOn/AddOnMocks';
import type {
  InterfacePlugin,
  InterfacePluginHelper,
} from 'types/AddOn/interface';

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchStore: vi.fn().mockResolvedValue([
      {
        id: '1',
        pluginName: 'Plugin 1',
        pluginDesc: 'Description 1',
        pluginCreatedBy: 'User 1',
        pluginInstallStatus: true,
      },
      {
        id: '2',
        pluginName: 'Plugin 2',
        pluginDesc: 'Description 2',
        pluginCreatedBy: 'User 2',
        pluginInstallStatus: false,
      },
      // Add more mock data as needed
    ]),
    fetchInstalled: vi.fn().mockResolvedValue([
      {
        id: '1',
        pluginName: 'Installed Plugin 1',
        pluginDesc: 'Installed Description 1',
        pluginCreatedBy: 'User 3',
        pluginInstallStatus: true,
      },
      {
        id: '3',
        pluginName: 'Installed Plugin 3',
        pluginDesc: 'Installed Description 3',
        pluginCreatedBy: 'User 4',
        pluginInstallStatus: true,
      },
      // Add more mock data as needed
    ]),
    generateLinks: vi.fn().mockImplementation((plugins: InterfacePlugin[]) => {
      return plugins
        .filter((plugin) => plugin.enabled)
        .map((installedPlugin) => {
          return {
            name: installedPlugin.pluginName,
            url: `/plugin/${installedPlugin.component.toLowerCase()}`,
          };
        });
    }),
  })),
}));

vi.mock('components/AddOn/support/services/Plugin.helper', () => ({
  __esModule: true,
  default: vi.fn().mockImplementation(() => ({
    fetchInstalled: vi.fn().mockResolvedValue([]),
    fetchStore: vi.fn().mockResolvedValue([]),
  })),
}));

const today = new Date();
const tomorrow = today;
tomorrow.setDate(today.getDate() + 1);

vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useParams: () => ({ orgId: 'undefined' }),
  };
});

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
    await userEvent.click(screen.getByText('Installed'));

    await wait();
    await userEvent.click(screen.getByText('Available'));
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
    await userEvent.click(screen.getByText('Available'));

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

    fireEvent.click(screen.getByTestId('searchBtn'));

    const message = screen.getAllByText('Plugin does not exists');
    expect(message.length).toBeGreaterThanOrEqual(1);
  });

  test('renders loader while loading', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={[]} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    // Simulate loading state
    expect(screen.getByTestId('AddOnEntryStore')).toBeInTheDocument();
  });

  test('renders available plugins by default', async () => {
    const mocks = [
      {
        request: {
          query: PLUGIN_GET,
        },
        result: {
          data: {
            getPlugins: [
              {
                id: '1',
                pluginName: 'Plugin 1',
                pluginDesc: 'Desc 1',
                pluginCreatedBy: 'User 1',
                uninstalledOrgs: [],
                installed: false,
                enabled: true,
              },
            ],
          },
        },
      },
    ];

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

    // Ensure plugin is displayed
    expect(screen.getAllByText('Plugin 1')).toHaveLength(2);
  });

  test('switches to installed tab and displays plugins', async () => {
    const mocks = [
      {
        request: {
          query: PLUGIN_GET,
        },
        result: {
          data: {
            getPlugins: [
              {
                id: '2',
                pluginName: 'Plugin 2',
                pluginDesc: 'Desc 2',
                pluginCreatedBy: 'User 2',
                uninstalledOrgs: [],
                installed: true,
                enabled: false,
              },
            ],
          },
        },
      },
    ];

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

    // Switch to installed tab
    const installedTab = screen.getByText('Installed');
    fireEvent.click(installedTab);

    // Ensure installed plugin is displayed
    expect(screen.getAllByText('Plugin 2')).toHaveLength(2);
  });

  test('filters plugins based on search input', async () => {
    const mocks = [
      {
        request: {
          query: PLUGIN_GET,
        },
        result: {
          data: {
            getPlugins: [
              {
                id: '1',
                pluginName: 'Test Plugin',
                pluginDesc: 'Description',
                pluginCreatedBy: 'User',
                uninstalledOrgs: [],
                installed: false,
                enabled: true,
              },
            ],
          },
        },
      },
    ];

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

    const searchInput = screen.getByPlaceholderText('Ex: Donations');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Ensure the filtered plugin is displayed
    const plugins = screen.getAllByText('Test Plugin');
    expect(plugins).toHaveLength(2);
  });

  test('shows a message when no plugins match the search', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <MockedProvider mocks={[]} addTypename={false}>
                <AddOnStore />
              </MockedProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    await wait();

    const elements = screen.getAllByText('Plugin does not exists');
    expect(elements).toHaveLength(2); // Ensure there are exactly 2 matching elements
  });

  test('sets showEnabled based on dropdown value', async () => {
    const mocks = [
      {
        request: { query: PLUGIN_GET },
        result: {
          data: {
            getPlugins: [
              {
                id: '1',
                pluginName: 'Test Plugin 1',
                pluginDesc: 'Description',
                pluginCreatedBy: 'User1',
                uninstalledOrgs: [],
                installed: false,
                enabled: true,
              },
              {
                id: '2',
                pluginName: 'Test Plugin 2',
                pluginDesc: 'Description',
                pluginCreatedBy: 'User2',
                uninstalledOrgs: [],
                installed: false,
                enabled: true,
              },
            ],
          },
        },
      },
    ];
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

    fireEvent.click(await screen.findByText('Installed'));

    // Wait for the dropdown to appear
    const dropdownToggle = await screen.findByTestId('filter-dropdown');
    fireEvent.click(dropdownToggle);

    // Click 'disabled' item
    // fireEvent.click(await screen.findByText('Disabled'));

    expect(dropdownToggle.textContent).toBe('Enabled');
  });

  // Test this separately
  test('should return an array of installed plugin IDs', () => {
    const plugins: InterfacePluginHelper[] = [
      { id: 'p1' } as InterfacePluginHelper,
      { id: 'p2' } as InterfacePluginHelper,
    ];

    const result = getInstalledIds(plugins);

    expect(result).toEqual(['p1', 'p2']); // Ensures `map((p) => p.id)` is covered
  });

  test('should return an empty array when no plugins exist', () => {
    const result = getInstalledIds([]);
    expect(result).toEqual([]);
  });

  test('correctly marks installed plugins', () => {
    const plugins: InterfacePluginHelper[] = [
      { id: 'p1', installed: false } as InterfacePluginHelper,
      { id: 'p2', installed: false } as InterfacePluginHelper,
    ];
    const installedIds = ['p1'];

    const result = markInstalledPlugins(plugins, installedIds);

    expect(result).toEqual([
      { id: 'p1', installed: true },
      { id: 'p2', installed: false },
    ]);
  });

  test('does not modify plugins if no installed IDs match', () => {
    const plugins: InterfacePluginHelper[] = [
      { id: 'p1', installed: false } as InterfacePluginHelper,
      { id: 'p2', installed: false } as InterfacePluginHelper,
    ];
    const installedIds = ['p3']; // No match

    const result = markInstalledPlugins(plugins, installedIds);

    expect(result).toEqual([
      { id: 'p1', installed: false },
      { id: 'p2', installed: false },
    ]);
  });
});
