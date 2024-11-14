import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import 'jest-localstorage-mock';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrganizationNavbar from './OrganizationNavbar';
import userEvent from '@testing-library/user-event';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/Queries';
import { PLUGIN_SUBSCRIPTION } from 'GraphQl/Mutations/mutations';

import { createMemoryHistory } from 'history';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, removeItem } = useLocalStorage();

const organizationId = 'org1234';

const MOCK_ORGANIZATION_CONNECTION = {
  request: {
    query: USER_ORGANIZATION_CONNECTION,
    variables: {
      id: organizationId,
    },
  },
  result: {
    data: {
      organizationsConnection: [
        {
          __typename: 'Organization',
          _id: '6401ff65ce8e8406b8f07af2',
          image: '',
          address: {
            city: 'abc',
            countryCode: '123',
            postalCode: '456',
            state: 'def',
            dependentLocality: 'ghi',
            line1: 'asdfg',
            line2: 'dfghj',
            sortingCode: '4567',
          },
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

const PLUGIN_SUBSCRIPTION_1 = [
  MOCK_ORGANIZATION_CONNECTION,
  {
    request: {
      query: PLUGIN_SUBSCRIPTION,
    },
    result: {
      data: {
        onPluginUpdate: {
          pluginName: 'TestPlugin1',
          _id: '123',
          pluginDesc: 'desc',
          uninstalledOrgs: [organizationId],
        },
      },
      _loadingSub: false,
    },
  },
];

const PLUGIN_SUBSCRIPTION_2 = [
  MOCK_ORGANIZATION_CONNECTION,
  {
    request: {
      query: PLUGIN_SUBSCRIPTION,
    },
    result: {
      data: {
        onPluginUpdate: {
          pluginName: 'TestPlugin1',
          _id: '123',
          pluginDesc: 'desc',
          uninstalledOrgs: [],
        },
      },
      _loadingSub: false,
    },
  },
];

const PLUGIN_SUBSCRIPTION_3 = [
  MOCK_ORGANIZATION_CONNECTION,
  {
    request: {
      query: PLUGIN_SUBSCRIPTION,
    },
    result: {
      data: {
        onPluginUpdate: {
          pluginName: 'TestPlugin100',
          _id: '123',
          pluginDesc: 'desc',
          uninstalledOrgs: [organizationId],
        },
      },
      _loadingSub: false,
    },
  },
];

const testPlugins = [
  {
    pluginName: 'TestPlugin1',
    alias: 'testPlugin1',
    link: '/testPlugin1',
    translated: 'Test Plugin 1',
    view: true,
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(PLUGIN_SUBSCRIPTION_1, true);
const link3 = new StaticMockLink(PLUGIN_SUBSCRIPTION_2, true);
const link4 = new StaticMockLink(PLUGIN_SUBSCRIPTION_3, true);

const navbarProps = {
  currentPage: 'home',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: organizationId }),
}));

describe('Testing OrganizationNavbar Component [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Donate')).toBeInTheDocument();
    // expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  test('should navigate correctly on clicking a plugin', async () => {
    const history = createMemoryHistory();
    render(
      <MockedProvider addTypename={false} link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationNavbar {...navbarProps} />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    const peoplePlugin = screen.getByText('People');
    expect(peoplePlugin).toBeInTheDocument();

    userEvent.click(peoplePlugin);

    await wait();
    expect(history.location.pathname).toBe(`/user/people/${organizationId}`);
  });

  test('The language is switched to English', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn0'));

    await wait();

    expect(cookies.get('i18next')).toBe('en');
    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Donate')).toBeInTheDocument();
    // expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  test('The language is switched to fr', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  test('The language is switched to hi', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn2'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  test('The language is switched to sp', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn3'));

    await wait();

    expect(cookies.get('i18next')).toBe('sp');
  });

  test('The language is switched to zh', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('languageIcon'));

    userEvent.click(screen.getByTestId('changeLanguageBtn4'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });

  test('Component should be rendered properly if plugins are present in localStorage', async () => {
    setItem('talawaPlugins', JSON.stringify(testPlugins));

    render(
      <MockedProvider addTypename={false} link={link}>
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

    testPlugins.forEach((plugin) => {
      expect(screen.queryByText(plugin.translated)).toBeInTheDocument();
    });

    removeItem('talawaPlugins');
  });

  test('should remove plugin if uninstalledOrgs contains organizationId', async () => {
    setItem('talawaPlugins', JSON.stringify(testPlugins));

    render(
      <MockedProvider addTypename={false} link={link2}>
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

    testPlugins.forEach((plugin) => {
      expect(screen.queryByText(plugin.translated)).not.toBeInTheDocument();
    });
  });

  test('should render plugin if uninstalledOrgs does not contain organizationId', async () => {
    setItem('talawaPlugins', JSON.stringify(testPlugins));

    render(
      <MockedProvider addTypename={false} link={link3}>
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

    testPlugins.forEach((plugin) => {
      expect(screen.queryByText(plugin.translated)).toBeInTheDocument();
    });
  });

  test('should do nothing if pluginName is not found in the rendered plugins', async () => {
    render(
      <MockedProvider addTypename={false} link={link4}>
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
  });
});
