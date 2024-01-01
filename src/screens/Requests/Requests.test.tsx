import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Requests from './Requests';
import {
  EMPTY_ORG_MOCKS,
  EMPTY_REQUEST_MOCKS,
  MOCKS,
  ORG_LIST_MOCK,
} from './RequestsMocks';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_ORG_MOCKS, true);
const link3 = new StaticMockLink(ORG_LIST_MOCK, true);
const link4 = new StaticMockLink(EMPTY_REQUEST_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  localStorage.setItem('UserType', 'SUPERADMIN');
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
});

afterEach(() => {
  localStorage.clear();
});

describe('Testing Request screen', () => {
  test('Component should be rendered properly', async () => {
    window.location.assign('/orglist');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.getByTestId(/searchByName/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing, If userType is not SUPERADMIN', async () => {
    localStorage.setItem('UserType', 'USER');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing seach by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.click(searchBtn);
  });

  test('Testing empty user requests', async () => {
    render(
      <MockedProvider addTypename={false} link={link4}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    const searchInput = screen.getByTestId('searchByName');
    userEvent.type(searchInput, 'l{enter}');

    await screen.findByTestId('searchAndNotFound');
  });

  test('Testing search latest and oldest toggle', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait();

      const searchInput = screen.getByTestId('sort');
      expect(searchInput).toBeInTheDocument();

      const inputText = screen.getByTestId('sortDropdown');

      fireEvent.click(inputText);
      const toggleText = screen.getByTestId('latest');

      fireEvent.click(toggleText);

      expect(searchInput).toBeInTheDocument();
      fireEvent.click(inputText);
      const toggleTite = screen.getByTestId('oldest');
      fireEvent.click(toggleTite);
      expect(searchInput).toBeInTheDocument();
    });
  });

  test('Testing accept user functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId(/acceptUser456/i));
  });

  test('Testing reject user functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId(/rejectUser456/i));
  });

  test('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait(200);

    expect(container.textContent).toMatch(
      'Organizations not found, please create an organization through dashboard'
    );
  });

  test('Should not render warning alert when there are organizations present', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(container.textContent).not.toMatch(
      'Organizations not found, please create an organization through dashboard'
    );
  });
});
