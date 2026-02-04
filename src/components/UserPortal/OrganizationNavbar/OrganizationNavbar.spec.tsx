import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrganizationNavbar from './OrganizationNavbar';
import userEvent from '@testing-library/user-event';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';

import { createMemoryHistory } from 'history';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * Unit tests for the OrganizationNavbar component.
 *
 * These tests validate the rendering and behavior of the component, ensuring it renders correctly,
 * handles user interactions, and manages language updates.
 *
 * 1. **Component rendering**: Verifies correct rendering with provided props and organization details.
 * 2. **Language switch to English**: Tests if the language changes to English.
 * 3. **Language switch to French**: Tests if the language changes to French.
 * 4. **Language switch to Hindi**: Tests if the language changes to Hindi.
 * 5. **Language switch to Spanish**: Tests if the language changes to Spanish.
 * 6. **Language switch to Chinese**: Tests if the language changes to Chinese.
 * 7. **Should handle logout properly**: Ensures that local storage is cleared and user is redirected to home screen when logout button is clicked
 * 8. **Should navigate to home page on home link click**: Ensures that browser history is correctly updated and navigates to oraganization home page.
 * 9. **Should use fallback "en" when cookies.get returns null: Ensures component fallsback to "en" language when i18next cookie is absent.
 *
 * Mocked GraphQL queries and subscriptions simulate backend behavior.
 */

const organizationId = 'org1234';

const MOCK_ORGANIZATION_CONNECTION = {
  request: {
    query: ORGANIZATION_LIST,
    variables: {
      id: organizationId,
    },
  },
  result: {
    data: {
      organizations: [
        {
          __typename: 'Organization',
          id: '6401ff65ce8e8406b8f07af2',
          avatarURL: '',
          addressLine1: 'abc',
          name: 'anyOrganization1',
          description: 'desc',
          userRegistrationRequired: true,
          createdAt: '12345678900',
          creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
          members: [
            {
              _id: '56gheqyr7deyfuiwfewifruy8',
              user: {
                _id: '45ydeg2yet721rtgdu32ry',
              },
            },
          ],
          admins: [
            {
              _id: '45gj5678jk45678fvgbhnr4rtgh',
            },
          ],
          membershipRequests: [
            {
              _id: '56gheqyr7deyfuiwfewifruy8',
              user: {
                _id: '45ydeg2yet721rtgdu32ry',
              },
            },
          ],
        },
      ],
    },
  },
};

const MOCKS = [MOCK_ORGANIZATION_CONNECTION];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);

const navbarProps = {
  currentPage: 'home',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: organizationId }),
  };
});

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    clearAllItems: vi.fn(),
    getItem: vi.fn(),
  })),
}));

describe('Testing OrganizationNavbar Component [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
    vi.clearAllMocks();
  });

  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryByText('anyOrganization1')).toBeInTheDocument();
    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    // expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('The language is switched to English', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));

    await userEvent.click(screen.getByTestId('language-item-en'));

    await wait();

    expect(cookies.get('i18next')).toBe('en');
    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('The language is switched to fr', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-fr'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  it('The language is switched to hi', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-hi'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  it('The language is switched to es', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-es'));

    await wait();

    expect(cookies.get('i18next')).toBe('es');
  });

  it('The language is switched to zh', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-zh'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });

  it('Should handle logout properly', async () => {
    const mockLocation = {
      replace: vi.fn(),
    };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
    });

    const mockClearAllItems = vi.fn();
    const mockGetItems = vi.fn(() => 'Test user');
    (useLocalStorage as Mock).mockReturnValue({
      clearAllItems: mockClearAllItems,
      getItem: mockGetItems,
    });

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await userEvent.click(screen.getByTestId('user-toggle'));

    await userEvent.click(screen.getByTestId('user-item-logout'));

    await waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
    });

    expect(mockLocation.replace).toHaveBeenCalledWith('/');
  });

  it('Should navigate to home page on home link click', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/initial'],
    });
    render(
      <MockedProvider link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    await userEvent.click(homeLink);
    await wait();
    expect(history.location.pathname).toBe(
      `/user/organization/${organizationId}`,
    );
  });

  it('Should navigate to settings page when settings option is clicked', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/initial'],
    });

    render(
      <MockedProvider link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('user-toggle'));
    await userEvent.click(screen.getByTestId('user-item-settings'));

    await wait();

    expect(history.location.pathname).toBe('/user/settings');
  });
});

describe('Testing OrganizationNavbar Cookie Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use fallback "en" when cookies.get returns null', async () => {
    vi.spyOn(cookies, 'get').mockReturnValue(
      null as unknown as { [key: string]: string },
    );
    render(
      <MockedProvider>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar currentPage="home" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(cookies.get).toHaveBeenCalledWith('i18next');
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
