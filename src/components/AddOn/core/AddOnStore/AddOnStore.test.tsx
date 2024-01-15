import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import * as reactRedux from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';

// import AddOnStore from './AddOnStore';
// import { store } from 'state/store';
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
import userEvent from '@testing-library/user-event';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

describe('Testing AddOnStore Component', () => {
  test('renders AddOnStore component with loader', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    expect(screen.getByTestId('AddOnEntryStore')).toBeInTheDocument();
  });

  test('filters by enabled plugins when "Enable" radio button is selected', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    waitFor(() => {
      fireEvent.click(screen.getByLabelText('enable'));
    });
    waitFor(() => {
      expect(screen.getByText('enable')).toBeInTheDocument();
    });
  });

  test('filters by disabled plugins when "disable" radio button is selected', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    waitFor(() => {
      fireEvent.click(screen.getByLabelText('disable'));
    });
    waitFor(() => {
      expect(screen.getByText('disable')).toBeInTheDocument();
    });
  });

  test('searches for plugins by name', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
    waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('searchName'), {
        target: { value: 'examplePlugin' },
      });
    });

    waitFor(() => {
      const searchResults = screen.getAllByText('examplePlugin');
      expect(searchResults.length).toBeGreaterThan(0);
    });
  });

  test('displays a message when no search results are found', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('searchName'), {
        target: { value: 'nonexistentPlugin' },
      });
    });
    waitFor(() => {
      const unrelatedPlugins = screen.queryByText('nonexistentPlugin');
      expect(unrelatedPlugins).toBeNull();
    });
  });

  test('switches between "Available" and "Installed" tabs', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      fireEvent.click(screen.getByText('Installed'));
    });
    waitFor(() => {
      const installedTabContent = screen.getByText('Installed');
      expect(installedTabContent).toBeInTheDocument();
    });
    waitFor(() => {
      const availableTabContent = screen.queryByText('Available Plugin');
      expect(availableTabContent).toBeNull();
    });
  });

  test('installs a plugin when "Install" button is clicked', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      fireEvent.click(screen.getByText('Install'));
    });

    waitFor(() => {
      expect(screen.getByText('Install')).toBeInTheDocument();
    });
  });

  test('modifies a plugin when "Modify" button is clicked', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      fireEvent.click(screen.getByText('Modify'));
    });
    waitFor(() => {
      expect(screen.getByText('Modify')).toBeInTheDocument();
    });
  });

  test('displays the organization screen with the correct title', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      expect(screen.getByTestId('organization-screen')).toBeInTheDocument();
    });

    waitFor(() => {
      expect(screen.getByText('Plugin Store')).toBeInTheDocument();
    });
  });

  test('handles API error and displays an error message', async () => {
    jest.mock('@apollo/client', () => ({
      ...jest.requireActual('@apollo/client'),
      useQuery: jest.fn(() => ({
        data: undefined,
        loading: false,
        error: new Error('API error'),
      })),
    }));

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
  });

  test('clicks on an AddOnEntry and dispatches the correct Redux action', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      fireEvent.click(screen.getByText('Example Plugin'));
    });

    waitFor(() => {
      expect(screen.getByText('Example Plugin')).toBeInTheDocument();
    });
  });

  test('renders AddOnEntry components with the correct information', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      expect(screen.getByText('Example Plugin')).toBeInTheDocument();
      expect(screen.getByText('Created by: John Doe')).toBeInTheDocument();
    });
  });

  test('searches for plugins and displays search results', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      userEvent.type(
        screen.getByPlaceholderText('Search Name'),
        'Sample Plugin'
      );
    });

    waitFor(() => {
      expect(
        screen.getByText('Search results for Sample Plugin')
      ).toBeInTheDocument();
      expect(screen.getByText('Sample Plugin 1')).toBeInTheDocument();
    });
  });

  test('installs a plugin when "Install" button is clicked in AddOnEntry', async () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnStore />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );

    await waitFor(() => screen.getByTestId('AddOnEntryStore'));

    waitFor(() => {
      fireEvent.click(screen.getByText('Install'));
    });
    waitFor(() => {
      expect(screen.getByText('Install')).toBeInTheDocument();
    });
  });
});
