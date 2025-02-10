import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import AddOnRegister from './AddOnRegister';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import { client, mocks, wait, pluginData } from 'components/AddOn/mocks';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
let mockId: string | undefined = 'id';

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: mockId }),
    useNavigate: () => mockNavigate,
  };
});

describe('Testing AddOnRegister', () => {
  const props = {
    id: '6234d8bf6ud937ddk70ecc5c9',
  };

  it('should render modal and take info to add plugin for registered organization', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={client}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18nForTest}>
                <AddOnRegister {...props} />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </ApolloProvider>,
      );
    });
    // Wait for the button to be in the document
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Add New/i }),
      ).toBeInTheDocument(),
    );

    // Simulate user interactions
    await userEvent.click(screen.getByRole('button', { name: /Add New/i }));
    await userEvent.type(
      screen.getByPlaceholderText(/Ex: Donations/i),
      'myplugin',
    );
    await userEvent.type(
      screen.getByPlaceholderText(/This Plugin enables UI for/i),
      'test description',
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Ex: john Doe/i),
      'test creator',
    );
  });

  it('Expect toast.success to be called on successful plugin addition', async () => {
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
        </MockedProvider>,
      );
    });
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

    await userEvent.click(screen.getByRole('button', { name: /Add New/i }));
    await wait(100);
    expect(screen.getByTestId('addonregisterBtn')).toBeInTheDocument();
    await userEvent.type(
      screen.getByTestId('pluginName'),
      pluginData.pluginName,
    );
    await userEvent.type(
      screen.getByTestId('pluginCreatedBy'),
      pluginData.pluginCreatedBy,
    );
    await userEvent.type(
      screen.getByTestId('pluginDesc'),
      pluginData.pluginDesc,
    );
    await userEvent.click(screen.getByTestId('addonregisterBtn'));

    await wait(100);
    expect(toast.success).toHaveBeenCalledWith('Plugin added Successfully');
  });

  it('Expect the window to reload after successful plugin addition', async () => {
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
        </MockedProvider>,
      );
    });
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));

    await userEvent.click(screen.getByRole('button', { name: /Add New/i }));
    await wait(100);
    expect(screen.getByTestId('addonregisterBtn')).toBeInTheDocument();
    await userEvent.type(
      screen.getByTestId('pluginName'),
      pluginData.pluginName,
    );
    await userEvent.type(
      screen.getByTestId('pluginCreatedBy'),
      pluginData.pluginCreatedBy,
    );
    await userEvent.type(
      screen.getByTestId('pluginDesc'),
      pluginData.pluginDesc,
    );
    await userEvent.click(screen.getByTestId('addonregisterBtn'));

    await wait(3000); // Waiting for 3 seconds to reload the page as timeout is set to 2 seconds in the component
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });

  it('should be redirected to /orglist if orgId is undefined', async () => {
    mockId = undefined;
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AddOnRegister {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );
    expect(window.location.pathname).toEqual('/orglist');
  });
});
