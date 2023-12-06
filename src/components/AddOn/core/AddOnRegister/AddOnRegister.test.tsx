import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { ADD_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import AddOnRegister from './AddOnRegister';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';
import { BACKEND_URL } from 'Constant/constant';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

const mocks = [
  {
    request: {
      query: ADD_PLUGIN_MUTATION,
      variables: {
        pluginName: 'Test Plugin',
        pluginCreatedBy: 'Test Creator',
        pluginDesc: 'Test Description',
        pluginInstallStatus: false,
        installedOrgs: [undefined],
      },
    },
    result: {
      data: {
        createPlugin: {
          _id: '1',
          pluginName: 'Test Plugin',
          pluginCreatedBy: 'Test Creator',
          pluginDesc: 'Test Description',
        },
      },
    },
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const pluginData = {
  pluginName: 'Test Plugin',
  pluginCreatedBy: 'Test Creator',
  pluginDesc: 'Test Description',
};

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('Testing AddOnRegister', () => {
  const props = {
    id: '6234d8bf6ud937ddk70ecc5c9',
  };

  const original = window.location;
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  test('should render modal and take info to add plugin for registered organization', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                {<AddOnRegister {...props} />}
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>
      );

      await wait(100);

      userEvent.click(screen.getByRole('button', { name: /Add New/i }));
      userEvent.type(screen.getByPlaceholderText(/Ex: Donations/i), 'myplugin');
      userEvent.type(
        screen.getByPlaceholderText(/This Plugin enables UI for/i),
        'test description'
      );
      userEvent.type(
        screen.getByPlaceholderText(/Ex: john Doe/i),
        'test creator'
      );
    });
  });

  test('Expect toast.success to be called on successful plugin addition', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={mocks}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <AddOnRegister {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

      userEvent.click(screen.getByRole('button', { name: /Add New/i }));
      await wait(100);
      expect(screen.getByTestId('addonregisterBtn')).toBeInTheDocument();
      userEvent.type(screen.getByTestId('pluginName'), pluginData.pluginName);
      userEvent.type(
        screen.getByTestId('pluginCreatedBy'),
        pluginData.pluginCreatedBy
      );
      userEvent.type(screen.getByTestId('pluginDesc'), pluginData.pluginDesc);
      userEvent.click(screen.getByTestId('addonregisterBtn'));

      await wait(100);
      expect(toast.success).toBeCalledWith('Plugin Added Successfully');
    });
  });

  test('Expect the window to reload after successful plugin addition', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={mocks}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <AddOnRegister {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
      await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

      userEvent.click(screen.getByRole('button', { name: /Add New/i }));
      await wait(100);
      expect(screen.getByTestId('addonregisterBtn')).toBeInTheDocument();
      userEvent.type(screen.getByTestId('pluginName'), pluginData.pluginName);
      userEvent.type(
        screen.getByTestId('pluginCreatedBy'),
        pluginData.pluginCreatedBy
      );
      userEvent.type(screen.getByTestId('pluginDesc'), pluginData.pluginDesc);
      userEvent.click(screen.getByTestId('addonregisterBtn'));

      await wait(3000); // Waiting for 3 seconds to reload the page as timeout is set to 2 seconds in the component
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
