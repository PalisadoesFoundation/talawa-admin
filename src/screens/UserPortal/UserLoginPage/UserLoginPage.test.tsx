import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';

import UserLoginPage from './UserLoginPage';
import userEvent from '@testing-library/user-event';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink([], true);

describe('Testing User Login Page Screen [User Portal]', () => {
  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Expect the defualt language to be en', async () => {
    cookies.remove('i18next');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/English/i)).toBeInTheDocument();
  });

  test('Expect the language to be changed to fr', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText('English'));

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  test('Expect the language to be changed to hi', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText('English'));

    userEvent.click(screen.getByTestId('changeLanguageBtn2'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  test('Expect the language to be changed to sp', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText('English'));

    userEvent.click(screen.getByTestId('changeLanguageBtn3'));

    await wait();

    expect(cookies.get('i18next')).toBe('sp');
  });

  test('Expect the language to be changed to zh', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserLoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText('English'));

    userEvent.click(screen.getByTestId('changeLanguageBtn4'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });
});
