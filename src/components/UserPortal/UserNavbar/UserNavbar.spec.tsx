import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';
import UserNavbar from './UserNavbar';
import userEvent from '@testing-library/user-event';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

/**
 * Unit tests for UserNavbar component [User Portal]:
 *
 * 1. **Rendering UserNavbar**: Verifies that the `UserNavbar` component renders correctly.
 * 2. **Switching language to English**: Ensures that clicking the language dropdown and selecting 'English' updates the language cookie to 'en'.
 * 3. **Switching language to French**: Verifies that selecting 'French' updates the language cookie to 'fr'.
 * 4. **Switching language to Hindi**: Confirms that choosing 'Hindi' updates the language cookie to 'hi'.
 * 5. **Switching language to Spanish**: Ensures that selecting 'Spanish' sets the language cookie to 'sp'.
 * 6. **Switching language to Chinese**: Verifies that selecting 'Chinese' changes the language cookie to 'zh'.
 * 7. **Interacting with the dropdown menu**: Ensures the user can open the dropdown and see available options like 'Settings' and 'Logout'.
 * 8. **Navigating to the 'Settings' page**: Confirms that clicking 'Settings' in the dropdown correctly navigates the user to the "/user/settings" page.
 *
 * The tests simulate interactions with the language dropdown and the user dropdown menu to ensure proper functionality of language switching and navigation.
 * Mocked GraphQL mutation (`REVOKE_REFRESH_TOKEN`) and mock store are used to test the component in an isolated environment.
 */

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {},
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing UserNavbar Component [User Portal]', () => {
  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  it('The language is switched to English', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn0'));

    await wait();

    expect(cookies.get('i18next')).toBe('en');
  });

  it('The language is switched to fr', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  it('The language is switched to hi', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn2'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  it('The language is switched to sp', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn3'));

    await wait();

    expect(cookies.get('i18next')).toBe('sp');
  });

  it('The language is switched to zh', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn4'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });

  it('User can see and interact with the dropdown menu', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('logoutDropdown'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('logoutBtn')).toBeInTheDocument();
  });

  it('User can navigate to the "Settings" page', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('logoutDropdown'));
    userEvent.click(screen.getByText('Settings'));
    expect(window.location.pathname).toBe('/user/settings');
  });
  it('Logs out the user and clears local storage', async () => {
    const clearSpy = vi.spyOn(Storage.prototype, 'clear');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('logoutDropdown'));
    userEvent.click(screen.getByTestId('logoutBtn'));

    await wait();

    expect(clearSpy).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');
  });
});
