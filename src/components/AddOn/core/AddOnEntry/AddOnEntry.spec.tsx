/**
 * Unit tests for the AddOnEntry component.
 *
 * This file contains tests for the AddOnEntry component to ensure it behaves as expected
 * under various scenarios.
 */
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import AddOnEntry from './AddOnEntry';
import { ApolloProvider } from '@apollo/client';
import { describe, test, vi, expect } from 'vitest';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { MockedProvider, wait } from '@apollo/react-testing';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ToastContainer } from 'react-toastify';
import { client, ADD_ON_ENTRY_MOCK } from 'components/AddOn/AddOnMocks';
import { UPDATE_INSTALL_STATUS_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';

const link = new StaticMockLink(ADD_ON_ENTRY_MOCK, true);

console.error = vi.fn();

let mockID: string | undefined = '1';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useParams: () => ({ orgId: mockID }),
}));

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'string',
    description: 'string',
    createdBy: 'string',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
    isInstalled: true,
    getInstalledPlugins: (): { sample: string } => {
      return { sample: 'sample' };
    },
  };

  test('should render modal and take info to add plugin for registered organization', () => {
    const { getByTestId } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry uninstalledOrgs={[]} {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  });

  test('uses default values for title and description when not provided', () => {
    const mockGetInstalledPlugins = vi.fn();
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry
                id="123"
                createdBy="user1"
                uninstalledOrgs={['Org1']}
                getInstalledPlugins={mockGetInstalledPlugins}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    const titleElement = screen.getByText('No title provided');
    const descriptionElement = screen.getByText('Description not available');
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders correctly', () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: [],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };

    const { getByText } = render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(getByText('Test Addon')).toBeInTheDocument();
    expect(getByText('Test addon description')).toBeInTheDocument();
    expect(getByText('Test User')).toBeInTheDocument();
  });

  test('Uninstall Button works correctly', async () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: [], // Initially empty, meaning the button shows "Uninstall"
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };

    mockID = 'cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a';

    // Create mocks for the mutation
    const mocks = [
      {
        request: {
          query: UPDATE_INSTALL_STATUS_PLUGIN_MUTATION,
          variables: {
            pluginId: '1',
            orgId: 'cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a',
          },
        },
        result: {
          data: {
            updatePluginStatus: {
              id: '1',
              pluginName: 'Test Addon',
              pluginCreatedBy: 'Test User',
              pluginDesc: 'Test addon description',
              uninstalledOrgs: ['cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a'], // Now includes the org ID
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddOnEntry {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Find the specific AddOnEntry container
    const addOnEntry = screen.getByTestId('AddOnEntry');

    // Then find the button within that specific container
    const btn = within(addOnEntry).getByTestId('AddOnEntry_btn_install');

    // Initially the button should show "Uninstall" since uninstalledOrgs is empty
    expect(btn.innerHTML).toContain('Uninstall');

    // First click - should change to "Install" in an ideal world, but the component doesn't update the button text
    await userEvent.click(btn);

    // Wait for the toast message
    await waitFor(() => {
      expect(
        screen.getByText('This feature is now removed from your organization'),
      ).toBeInTheDocument();
    });

    // The button text should still be "Uninstall" because the component doesn't update the uninstalledOrgs prop
    expect(btn.innerHTML).toContain('Uninstall');
  });

  test('Install/Uninstall Button works correctly', async () => {
    mockID = 'cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a';

    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: [],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => ({ sample: 'sample' }),
    };

    const mocks = [
      {
        request: {
          query: UPDATE_INSTALL_STATUS_PLUGIN_MUTATION,
          variables: {
            pluginId: '1',
            orgId: 'cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a',
          },
        },
        result: {
          data: {
            updatePluginStatus: {
              id: '1',
              pluginName: 'Test Addon',
              pluginCreatedBy: 'Test User',
              pluginDesc: 'Test addon description',
              uninstalledOrgs: ['cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a'],
            },
          },
        },
      },
    ];

    const { rerender } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddOnEntry {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const btn = screen.getByTestId('AddOnEntry_btn_install');
    expect(btn.innerHTML).toContain('Uninstall');

    await userEvent.click(btn);

    await waitFor(() => {
      expect(
        screen.getByText('This feature is now removed from your organization'),
      ).toBeInTheDocument();
    });

    rerender(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <AddOnEntry
                {...props}
                uninstalledOrgs={['cd3e4f5b-6a7c-8d9e-0f1a-2b3c4d5e6f7a']}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByTestId('AddOnEntry_btn_install').innerHTML).toContain(
      'Install',
    );
  });

  it('Check if uninstalled orgs includes current org', async () => {
    const props = {
      id: '1',
      title: 'Test Addon',
      description: 'Test addon description',
      createdBy: 'Test User',
      component: 'string',
      installed: true,
      configurable: true,
      modified: true,
      isInstalled: true,
      uninstalledOrgs: ['undefined'],
      enabled: true,
      getInstalledPlugins: (): { sample: string } => {
        return { sample: 'sample' };
      },
    };

    const { getByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<AddOnEntry {...props} />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait(100);
    const btn = getByTestId('AddOnEntry_btn_install');
    expect(btn.innerHTML).toMatch(/install/i);
  });

  test('should redirect to /orglist if orgId is undefined', async () => {
    mockID = undefined;
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnEntry uninstalledOrgs={[]} {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(window.location.pathname).toEqual('/orglist');
  });
});
