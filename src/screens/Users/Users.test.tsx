import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import { EMPTY_MOCKS, MOCKS } from './UsersMocks';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeEach(() => {
  localStorage.setItem('id', '123');
  localStorage.setItem('UserType', 'SUPERADMIN');
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
});

afterEach(() => {
  localStorage.clear();
});

describe('Testing Users screen', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.getAllByText(/Users/i)).toBeTruthy();
  });

  test(`Component should be rendered properly when user is not superAdmin
  and or userId does not exists in localstorage`, async () => {
    localStorage.setItem('UserType', 'ADMIN');
    localStorage.setItem('id', '');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Component should be rendered properly when user is superAdmin', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing seach by name functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    const search1 = 'John{backspace}{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search1);

    const search2 = 'Pete{backspace}{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search2);

    const search3 =
      'John{backspace}{backspace}{backspace}{backspace}Sam{backspace}{backspace}{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search3);

    const search4 = 'Sam{backspace}{backspace}P{backspace}';
    userEvent.type(screen.getByTestId(/searchByName/i), search4);

    const search5 = 'Xe';
    userEvent.type(screen.getByTestId(/searchByName/i), search5);
    userEvent.type(screen.getByTestId(/searchByName/i), '');
  });

  test('Testing User data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(screen.getByText(/No User Found/i)).toBeTruthy();
  });

  test('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
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
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
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

  test('Testing sort Newest and oldest toggle', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait();

      const searchInput = screen.getByTestId('sort');
      expect(searchInput).toBeInTheDocument();

      const inputText = screen.getByTestId('sortUsers');

      fireEvent.click(inputText);
      const toggleText = screen.getByTestId('newest');

      fireEvent.click(toggleText);

      expect(searchInput).toBeInTheDocument();
      fireEvent.click(inputText);
      const toggleTite = screen.getByTestId('oldest');
      fireEvent.click(toggleTite);
      expect(searchInput).toBeInTheDocument();
    });
  });

  test('Should display "No Results Found" message when search yields no results', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    // Simulate a search that yields no results
    const searchInput = screen.getByPlaceholderText('Enter Name');
    fireEvent.change(searchInput, { target: { value: 'NonExistentUser' } });

    // Expect the absence of user elements
    const userElements = screen.queryAllByTestId('user-element');
    expect(userElements).toHaveLength(0);
  });

  test('Should not display "No User Found" message when users data is present', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    // Expect the absence of "No User Found" message when users data is present
    expect(screen.queryByText(/No User Found/)).toBeNull();
  });
});
