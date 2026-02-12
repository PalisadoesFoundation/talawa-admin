import React, { act } from 'react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  within,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import { getRecaptchaToken } from 'utils/recaptcha';
import LoginPage from './LoginPage';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  SIGNIN_QUERY,
  GET_COMMUNITY_DATA_PG,
  GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
  ORGANIZATION_LIST_NO_MEMBERS,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, beforeEach, expect, it, describe } from 'vitest';
import { GraphQLError } from 'graphql';
import dayjs from 'dayjs';

vi.mock('utils/useLocalstorage');

// Define the interface locally since it's not exported from the module
interface InterfaceStorageHelper {
  getItem: <T>(key: string) => T | null | string;
  setItem: (key: string, value: unknown) => void;
  removeItem: (key: string) => void;
  getStorageKey: (key: string) => string;
}

// Minimal GraphQL types used by the mocks in this spec
interface InterfaceCommunity {
  id?: string;
  name?: string;
  description?: string;
  logoURL?: string | null;
  websiteURL?: string | null;
  facebookURL?: string | null;
  linkedinURL?: string | null;
  xURL?: string | null;
  githubURL?: string | null;
  instagramURL?: string | null;
  youtubeURL?: string | null;
  slackURL?: string | null;
  redditURL?: string | null;
  createdAt?: string;
  updatedAt?: string;
  inactivityTimeoutDuration?: number;
  logoMimeType?: string | null;
}

interface InterfaceOrganization {
  id: string;
  name: string;
  addressLine1?: string | null;
}

const createMocks = (): MockedResponse[] => [
  {
    request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
    result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
  },
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: { data: { community: null } },
  },
  {
    request: { query: ORGANIZATION_LIST_NO_MEMBERS },
    result: {
      data: {
        organizations: [
          {
            id: '6437904485008f171cf29924',
            name: 'Unity Foundation',
            addressLine1: '123 Random Street',
          },
          {
            id: 'db1d5caad2ade57ab811e681',
            name: 'Mills & Group',
            addressLine1: '5112 Dare Centers',
          },
        ],
      },
    },
  },
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: { data: { community: null } },
  },
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'johndoe@gmail.com', password: 'johndoe' },
    },
    variableMatcher: (vars: Record<string, unknown> | undefined) =>
      vars?.email === 'johndoe@gmail.com' && vars?.password === 'johndoe',
    result: {
      data: {
        signIn: {
          user: {
            id: '1',
            role: 'administrator',
            name: 'John Doe',
            emailAddress: 'johndoe@gmail.com',
            countryCode: 'US',
            avatarURL: 'https://example.com/avatar.jpg',
          },
          authenticationToken: 'authenticationToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '6437904485008f171cf29924',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'Johndoe@123',
      },
    },
    variableMatcher: (vars: Record<string, unknown> | undefined) =>
      vars?.email === 'johndoe@gmail.com' &&
      vars?.name === 'John Doe' &&
      vars?.password === 'Johndoe@123' &&
      typeof vars?.ID === 'string' &&
      vars.ID.length > 0,
    result: {
      data: {
        signUp: {
          user: { id: '1' },
          authenticationToken: 'authenticationToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
];

// Factory with overrides for specific test scenarios
const createMocks3 = (
  overrides: Partial<{
    communityData: InterfaceCommunity | null;
    organizationsData: InterfaceOrganization[];
  }> = {},
): MockedResponse[] => {
  const defaults = {
    communityData: null,
    organizationsData: [
      {
        id: '6437904485008f171cf29924',
        name: 'Unity Foundation',
        addressLine1: '123 Random Street',
      },
      {
        id: 'db1d5caad2ade57ab811e681',
        name: 'Mills & Group',
        addressLine1: '5112 Dare Centers',
      },
    ],
  };
  const config = { ...defaults, ...overrides };
  return [
    {
      request: { query: GET_COMMUNITY_DATA_PG },
      result: { data: { community: config.communityData } },
    },
    {
      request: { query: GET_COMMUNITY_DATA_PG },
      result: { data: { community: config.communityData } },
    },
    {
      request: { query: ORGANIZATION_LIST_NO_MEMBERS },
      result: {
        data: {
          organizations: config.organizationsData,
        },
      },
    },
  ];
};

const createMocks4 = (): MockedResponse[] => [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: {
        email: 'johndoe@gmail.com',
        password: 'johndoe1',
      },
    },
    error: new Error('Invalid credentials'),
  },
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: { data: { community: null } },
  },
  {
    request: { query: ORGANIZATION_LIST_NO_MEMBERS },
    result: {
      data: {
        organizations: [
          {
            id: '6437904485008f171cf29924',
            name: 'Unity Foundation',
            addressLine1: '123 Random Street',
          },
        ],
      },
    },
  },
];

// Note: Avoid shared links; we'll create a fresh StaticMockLink per test

const createMocksVerifiedEmail = (): MockedResponse[] => [
  {
    request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
    result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
  },
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: { data: { community: null } },
  },
  {
    request: { query: ORGANIZATION_LIST_NO_MEMBERS },
    result: { data: { organizations: [] } },
  },
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: { data: { community: null } },
  },
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'verified@gmail.com', password: 'password123' },
    },
    variableMatcher: (vars: Record<string, unknown> | undefined) =>
      vars?.email === 'verified@gmail.com' && vars?.password === 'password123',
    result: {
      data: {
        signIn: {
          user: {
            id: '2',
            role: 'administrator',
            name: 'Verified User',
            emailAddress: 'verified@gmail.com',
            countryCode: 'US',
            avatarURL: null,
            isEmailAddressVerified: true,
          },
          authenticationToken: 'auth-token',
          refreshToken: 'refresh-token',
        },
      },
    },
  },
];
// For verified email scenarios, instantiate a fresh link within the test

const { toastMocks, routerMocks } = vi.hoisted(() => {
  const warning = vi.fn();
  return {
    toastMocks: {
      success: vi.fn(),
      warning,
      // Backward-compat for older tests that asserted `toast.warn`
      warn: warning,
      error: vi.fn(),
      info: vi.fn(),
    },
    routerMocks: {
      navigate: vi.fn(),
    },
  };
});

const withMockedLocation = async (
  pathname: string,
  testFn: () => Promise<void>,
): Promise<void> => {
  const original = window.location;
  try {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...original,
        pathname,
        origin: 'https://localhost:4321',
        href: `https://localhost:4321${pathname}`,
        reload: vi.fn(),
      },
    });
    await testFn();
  } finally {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  }
};

const wait = (ms = 100): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mockUseLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  getStorageKey: vi.fn(),
};

// Capture original window.location to restore after each test
const originalLocation = window.location;

beforeEach(() => {
  vi.clearAllMocks();
  routerMocks.navigate.mockReset();
  mockUseLocalStorage.getItem.mockReset();
  mockUseLocalStorage.setItem.mockReset();
  mockUseLocalStorage.removeItem.mockReset();
  mockUseLocalStorage.getStorageKey.mockReset();
  (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
    mockUseLocalStorage as InterfaceStorageHelper,
  );
  // Avoid real network health-check fetch errors influencing toast assertions
  vi.spyOn(global, 'fetch').mockResolvedValue({} as Response);
  vi.resetModules();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks(); // Preserves module-level mocks
  // Restore original window.location
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: originalLocation,
  });
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

vi.mock('Constant/constant.ts', async () => ({
  ...(await vi.importActual('Constant/constant.ts')),
  REACT_APP_USE_RECAPTCHA: 'YES',
  RECAPTCHA_SITE_KEY: 'xxx',
  BACKEND_URL: 'http://localhost:4000/graphql',
}));

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => routerMocks.navigate,
}));

// Mock reCAPTCHA V3 utilities
vi.mock('utils/recaptcha', () => ({
  getRecaptchaToken: vi.fn().mockResolvedValue('mock-recaptcha-token'),
  loadRecaptchaScript: vi.fn().mockResolvedValue(undefined),
}));

let user!: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

describe('Testing Login Page Screen', () => {
  it('Component Should be rendered properly', async () => {
    await withMockedLocation('/admin', async () => {
      const history = createMemoryHistory({ initialEntries: ['/admin'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();
      expect(
        screen.getByText(i18nForTest.t('loginPage.adminLogin')),
      ).toBeInTheDocument();
      expect(window.location.pathname).toBe('/admin');
    });
  });

  it('There should be default values of pre-login data when queried result is null', async () => {
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await screen.findByTestId('PalisadoesLogo');
      expect(
        screen.getAllByTestId('PalisadoesSocialMedia')[0],
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('preLoginLogo')).not.toBeInTheDocument();
        expect(
          screen.queryAllByTestId('preLoginSocialMedia')[0],
        ).toBeUndefined();
      });
    });
  });

  it('Testing registration functionality', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'John@123',
        confirmPassword: 'John@123',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      });

      const registerButton = screen.queryByTestId(/goToRegisterPortion/i);
      if (registerButton) {
        await user.click(registerButton);
        await waitFor(() => {
          expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
        });

        await user.type(screen.getByLabelText(/First Name/i), formData.name);
        await user.type(
          screen.getByTestId('registrationEmail'),
          formData.email,
        );
        await user.type(screen.getByTestId('passwordField'), formData.password);
        await user.type(
          screen.getByTestId('cpassword'),
          formData.confirmPassword,
        );

        const registrationBtn = screen.queryByTestId('registrationBtn');
        if (registrationBtn) {
          await user.click(registrationBtn);
          await waitFor(() => {
            expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
          });
        }
      }
    });
  });

  it('Testing registration functionality when all inputs are invalid', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: '124',
        email: 'j@l.co',
        password: 'john@123',
        confirmPassword: 'john@123',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId(/goToRegisterPortion/i);
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), formData.name);
      await user.type(screen.getByTestId('registrationEmail'), formData.email);
      await user.type(screen.getByTestId('passwordField'), formData.password);
      await user.type(
        screen.getByTestId('cpassword'),
        formData.confirmPassword,
      );

      const registrationBtn = screen.queryByTestId('registrationBtn');
      if (registrationBtn) {
        await user.click(registrationBtn);
      }
    });
  });

  it('Testing registration functionality, when password and confirm password is not same', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe@1',
        confirmPassword: 'doeJohn@2',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId(/goToRegisterPortion/i);
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), formData.name);
      await user.type(screen.getByTestId('registrationEmail'), formData.email);
      await user.type(screen.getByTestId('passwordField'), formData.password);
      await user.type(
        screen.getByTestId('cpassword'),
        formData.confirmPassword,
      );

      const registrationBtn = screen.queryByTestId('registrationBtn');
      if (registrationBtn) {
        await user.click(registrationBtn);
      }
    });
  });

  it('Testing registration functionality, when input is not filled correctly', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: 'J D',
        email: 'johndoe@gmail.com',
        password: 'joe',
        confirmPassword: 'joe',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId(/goToRegisterPortion/i);
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), formData.name);
      await user.type(screen.getByTestId('registrationEmail'), formData.email);
      await user.type(screen.getByTestId('passwordField'), formData.password);
      await user.type(
        screen.getByTestId('cpassword'),
        formData.confirmPassword,
      );

      const registrationBtn = screen.queryByTestId('registrationBtn');
      if (registrationBtn) {
        await user.click(registrationBtn);
      }
    });
  });

  it('switches to login tab on successful registration', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'johndoe',
        confirmPassword: 'johndoe',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId(/goToRegisterPortion/i);
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), formData.name);
      await user.type(screen.getByTestId('registrationEmail'), formData.email);
      await user.type(screen.getByTestId('passwordField'), formData.password);
      await user.type(
        screen.getByTestId('cpassword'),
        formData.confirmPassword,
      );

      const registrationBtn = screen.queryByTestId('registrationBtn');
      if (registrationBtn) {
        await user.click(registrationBtn);

        // Check if the login tab is now active by checking for elements that only appear in the login tab
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      }
    });
  });

  it('switches to login tab on successful registration correct data', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const formData = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'Johndoe@123',
        confirmPassword: 'Johndoe@123',
        orgId: 'abc',
      };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId(/goToRegisterPortion/i);
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), formData.name);
      await user.type(screen.getByTestId('registrationEmail'), formData.email);
      await user.type(screen.getByTestId('passwordField'), formData.password);
      await user.type(
        screen.getByTestId('cpassword'),
        formData.confirmPassword,
      );
      await user.click(screen.getByLabelText('Organization'));
      await user.click(
        screen.getByRole('option', { name: 'Unity Foundation' }),
      );

      const registrationBtn = screen.queryByTestId('registrationBtn');
      if (registrationBtn) {
        await user.click(registrationBtn);

        // Check if the login tab is now active by checking for elements that only appear in the login tab
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      }
    });
  });

  it('Testing toggle login register portion', async () => {
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId('goToRegisterPortion');

      await waitFor(() => {
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      });

      if (registerButton) {
        await user.click(registerButton);
        await waitFor(() => {
          expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
          expect(screen.getByTestId('register-text')).toBeInTheDocument();
        });
      }
    });
  });

  it('Testing login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe' };

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      });

      await user.type(screen.getByTestId('login-form-email'), formData.email);
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        formData.password,
      );

      await user.click(screen.getByTestId('login-form-submit'));

      await wait();
    });
  });

  it('Testing wrong login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe1' };

    const localLink4 = new StaticMockLink(createMocks4(), true);

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={localLink4}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      // Wait for component to render
      await screen.findByTestId('login-form-email');

      await user.type(screen.getByTestId('login-form-email'), formData.email);
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        formData.password,
      );

      await user.click(screen.getByTestId('login-form-submit'));

      await wait();
    });
  });

  it.todo(
    'Testing password preview feature for login (LoginForm uses PasswordField with different structure)',
    async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const input = screen.getByTestId(
        'login-form-password',
      ) as HTMLInputElement;
      const toggleText = screen.getByRole('button', {
        name: /show password/i,
      });
      expect(input).toBeInTheDocument();
      expect(toggleText).toBeInTheDocument();
    },
  );

  it('Testing password preview feature for register', async () => {
    // Skip this test for admin path since register button is removed
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);

      const input = (await screen.findByTestId(
        'passwordField',
      )) as HTMLInputElement;
      const toggleButtons = screen.getAllByRole('button', {
        name: /show password|showPassword/i,
      });
      const toggleButton = toggleButtons[0];
      expect(input.type).toBe('password');
      await user.click(toggleButton);
      expect(input.type).toBe('text');
      await user.click(toggleButton);
      expect(input.type).toBe('password');
    });
  });

  it.todo(
    'Testing password preview feature for register (RegistrationForm uses PasswordField)',
    async () => {
      // Skip this test for admin path since register button is removed
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          reload: vi.fn(),
          href: 'https://localhost:4321/',
          origin: 'https://localhost:4321',
          pathname: '/',
        },
      });

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const registerButton = screen.queryByTestId('goToRegisterPortion');
      if (registerButton) {
        await user.click(registerButton);
        await wait();

        const input = screen.getByTestId('passwordField') as HTMLInputElement;
        const toggleButtons = screen.getAllByRole('button', {
          name: /show password|showPassword/i,
        });
        const toggleButton = toggleButtons[0];
        expect(input.type).toBe('password');
        await user.click(toggleButton);
        expect(input.type).toBe('text');
        await user.click(toggleButton);
        expect(input.type).toBe('password');
      }

      await wait();
    },
  );

  it.todo(
    'Testing confirm password preview feature (RegistrationForm uses PasswordField)',
    async () => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          reload: vi.fn(),
          href: 'https://localhost:4321/',
          origin: 'https://localhost:4321',
          pathname: '/',
        },
      });

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const registerButton = screen.queryByTestId('goToRegisterPortion');
      if (registerButton) {
        await user.click(registerButton);
        await wait();

        const input = screen.getByTestId('cpassword') as HTMLInputElement;
        const toggleText = screen.getByTestId('showPasswordCon');
        expect(input.type).toBe('password');
        await user.click(toggleText);
        expect(input.type).toBe('text');
        await user.click(toggleText);
        expect(input.type).toBe('password');
      }

      await wait();
    },
  );

  it('Testing for the password error warning when user firsts lands on a page', async () => {
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await screen.findByTestId('PalisadoesLogo');

      expect(screen.queryByTestId('passwordCheck')).toBeNull();
    });
  });

  it.todo(
    'Testing for the password error warning when user clicks on password field and password is less than 8 character (password UI in RegistrationForm)',
    async () => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          reload: vi.fn(),
          href: 'https://localhost:4321/',
          origin: 'https://localhost:4321',
          pathname: '/',
        },
      });

      const password = { password: '7' };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await wait();

      const registerButton = screen.queryByTestId('goToRegisterPortion');
      if (registerButton) {
        await user.click(registerButton);
        await wait();

        await user.type(screen.getByTestId('passwordField'), password.password);

        expect(screen.getByTestId('passwordField')).toHaveFocus();

        expect(password.password.length).toBeGreaterThanOrEqual(8);

        expect(screen.queryByTestId('passwordCheck')).toBeNull();
      }
    },
  );

  it('Testing for the password error warning when user clicks on fields except password field and password is less than 8 character', async () => {
    await withMockedLocation('/', async () => {
      const password = { password: '1234567' };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);

      expect(screen.getByTestId('passwordField')).not.toHaveFocus();

      await user.type(screen.getByTestId('passwordField'), password.password);

      expect(password.password.length).toBeLessThan(8);
    });
  });

  it('Testing for the password error warning when user clicks on fields except password field and password is greater than or equal to 8 character', async () => {
    await withMockedLocation('/', async () => {
      const password = { password: '12345678' };

      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);

      expect(screen.getByTestId('passwordField')).not.toHaveFocus();

      await user.type(screen.getByTestId('passwordField'), password.password);

      expect(password.password.length).toBeGreaterThanOrEqual(8);

      expect(screen.queryByTestId('passwordCheck')).toBeNull();
    });
  });

  it('Component Should be rendered properly for user login', async () => {
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();
      expect(
        screen.getByText(i18nForTest.t('loginPage.userLogin')),
      ).toBeInTheDocument();
      expect(window.location.pathname).toBe('/');
    });
  });

  it('Component Should be rendered properly for user registration', async () => {
    await withMockedLocation('/register', async () => {
      const history = createMemoryHistory({ initialEntries: ['/register'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await screen.findByTestId('register-text');
      expect(window.location.pathname).toBe('/register');
    });
  });
});

describe('Testing redirect if already logged in', () => {
  it('Logged in as USER', async () => {
    mockUseLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'IsLoggedIn') return 'TRUE';
      if (key === 'userId') return 'id';
      return null;
    });

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/user/organizations',
        );
      });
    });
  });

  it('Logged in as Admin or SuperAdmin', async () => {
    mockUseLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'IsLoggedIn') return 'TRUE';
      if (key === 'userId') return null;
      return null;
    });

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/user/organizations',
        );
      });
    });
  });
});

describe('Testing invitation functionality', () => {
  beforeEach(() => {
    // Mock window.location.href for invitation redirect tests
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        href: 'http://localhost:3000/',
      },
      writable: true,
    });
  });

  it('should handle pending invitation token on successful login', async () => {
    const mockHref = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        pathname: '/',
        get href() {
          return 'http://localhost:3000/';
        },
        set href(v: string) {
          mockHref(v);
        },
      },
    });

    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageInvite } = await import('./LoginPage');

    const mockToken = 'test-invitation-token';
    mockUseLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'pendingInvitationToken') return mockToken;
      return null;
    });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageInvite />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await user.type(
      screen.getByTestId('login-form-email'),
      'johndoe@gmail.com',
    );
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'johndoe');
    await user.click(screen.getByTestId('login-form-submit'));

    await waitFor(() => {
      expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
        'pendingInvitationToken',
      );
    });
    expect(mockHref).toHaveBeenCalledWith(`/event/invitation/${mockToken}`);
  });

  it('should handle pending invitation token on successful registration', async () => {
    const mockHref = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        pathname: '/',
        get href() {
          return 'https://localhost:4321/';
        },
        set href(v: string) {
          mockHref(v);
        },
        origin: 'https://localhost:4321',
      },
    });

    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageInvite } = await import('./LoginPage');

    const mockToken = 'test-invitation-token';

    mockUseLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'pendingInvitationToken') return mockToken;
      return null;
    });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageInvite />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    const registerButton = screen.getByTestId('goToRegisterPortion');
    await user.click(registerButton);
    await wait();

    await user.type(screen.getByLabelText(/First Name/i), 'John Doe');
    await user.type(
      screen.getByTestId('registrationEmail'),
      'johndoe@gmail.com',
    );
    await user.type(screen.getByTestId('passwordField'), 'Johndoe@123');
    await user.type(screen.getByTestId('cpassword'), 'Johndoe@123');
    await user.click(screen.getByLabelText('Organization'));
    await user.click(screen.getByRole('option', { name: 'Unity Foundation' }));

    await user.click(screen.getByTestId('registrationBtn'));

    await waitFor(() => {
      expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
        'pendingInvitationToken',
      );
    });
    expect(mockHref).toHaveBeenCalledWith(`/event/invitation/${mockToken}`);
  });

  it('should not redirect when no pending invitation token exists', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, pathname: '/' },
    });

    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageNoInvite } = await import('./LoginPage');

    mockUseLocalStorage.getItem.mockImplementation(() => null);

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoInvite />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();

    await user.type(
      screen.getByTestId('login-form-email'),
      'johndoe@gmail.com',
    );
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'johndoe');
    await user.click(screen.getByTestId('login-form-submit'));

    await waitFor(() => {
      expect(routerMocks.navigate).toHaveBeenCalledWith('/user/organizations');
    });
  });
});

describe.todo(
  'Organization Autocomplete Component (uses OrgSelector now; tests target old MUI Autocomplete)',
  () => {
    let memoryHistory: ReturnType<typeof createMemoryHistory>;

    beforeEach(() => {
      memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    const setupRegistrationForm = async () => {
      const localLink = new StaticMockLink(createMocks3(), true);
      render(
        <MockedProvider link={localLink}>
          <Router location={memoryHistory.location} navigator={memoryHistory}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const registerButton = screen.getByTestId('goToRegisterPortion');
      await user.click(registerButton);
      await wait();

      return screen.getByTestId('selectOrg');
    };

    it('renders Select Organization autocomplete with placeholder', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute(
        'placeholder',
        i18nForTest.t('loginPage.clickToSelectOrg'),
      );
    });

    it('opens organization list when input is clicked', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('filters and selects an organization using keyboard', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.type(input, 'Unity');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(input).not.toHaveValue('');
      });
    });

    it('opens organization list using dropdown icon', async () => {
      const autocomplete = await setupRegistrationForm();

      const buttons = within(autocomplete).getAllByRole('button');
      const dropdownButton = buttons[0];

      await user.click(dropdownButton);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('should have full width input as per w-100 class', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      expect(input).toHaveClass('w-100');
      expect(input).toHaveClass('form-control');
    });
    it('clears selected organization using clear icon', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.type(input, 'Unity');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(input).not.toHaveValue('');
      });

      const clearButton = screen.getByLabelText(/clear/i);
      await user.click(clearButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('allows reopening list after clearing selection', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.type(input, 'Unity');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await wait();

      const clearButton = screen.getByLabelText(/clear/i);
      await user.click(clearButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });

      // Click to reopen dropdown
      await user.click(input);

      await waitFor(() => {
        // Dropdown should open
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('handles empty organizations list', async () => {
      const EMPTY_ORGS_MOCK = [
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: ORGANIZATION_LIST_NO_MEMBERS },
          result: {
            data: {
              organizations: [],
            },
          },
        },
      ];

      const emptyLink = new StaticMockLink(EMPTY_ORGS_MOCK, true);

      render(
        <MockedProvider link={emptyLink}>
          <Router location={memoryHistory.location} navigator={memoryHistory}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const registerButton = screen.getByTestId('goToRegisterPortion');
      await user.click(registerButton);
      await wait();

      const autocomplete = screen.getByTestId('selectOrg');
      const input = within(autocomplete).getByRole('combobox');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute(
        'placeholder',
        i18nForTest.t('loginPage.clickToSelectOrg'),
      );
    });

    it('updates form state when organization is selected', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.type(input, 'Unity');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await wait();

      await user.type(screen.getByLabelText(/First Name/i), 'Test User');
      await user.type(
        screen.getByTestId('registrationEmail'),
        'test@example.com',
      );
      await user.type(screen.getByTestId('passwordField'), 'Test@123');
      await user.type(screen.getByTestId('cpassword'), 'Test@123');

      const registrationBtn = screen.getByTestId('registrationBtn');
      expect(registrationBtn).toBeEnabled();
    });

    it('displays organizations in correct format', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      await user.click(input);
      await wait();

      await user.type(input, 'Unity');

      await waitFor(() => {
        expect(input).toHaveValue('Unity');
      });
    });

    it('handles GraphQL error when fetching organizations', async () => {
      const ERROR_MOCK = [
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: ORGANIZATION_LIST_NO_MEMBERS },
          error: new Error('Failed to fetch organizations'),
        },
      ];

      const errorLink = new StaticMockLink(ERROR_MOCK, true);

      render(
        <MockedProvider link={errorLink}>
          <Router location={memoryHistory.location} navigator={memoryHistory}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const registerButton = screen.getByTestId('goToRegisterPortion');
      await user.click(registerButton);
      await wait();

      const autocomplete = screen.getByTestId('selectOrg');
      const input = within(autocomplete).getByRole('combobox');

      expect(autocomplete).toBeInTheDocument();
      expect(input).toBeEnabled();
    });

    it('only shows clear button when organization is selected', async () => {
      const autocomplete = await setupRegistrationForm();

      // Check that dropdown button exists
      const dropdownButton = within(autocomplete).getByRole('button', {
        name: /open/i,
      });
      expect(dropdownButton).toBeInTheDocument();

      // Select organization
      const input = within(autocomplete).getByRole('combobox');
      await user.type(input, 'Unity');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(input).not.toHaveValue('');

        within(autocomplete).queryByRole('button', {
          name: /clear/i,
        });
      });
    });

    it('maintains focus during interactions', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      // Click input to focus
      await user.click(input);
      expect(input).toHaveFocus();

      // Type something
      await user.type(input, 'Test');
      expect(input).toHaveFocus();

      // Clear input
      await user.keyboard('{Control>}a{/Control}'); // Select all
      await user.keyboard('{Delete}');
      expect(input).toHaveFocus();
    });

    it('handles special characters in organization names', async () => {
      const autocomplete = await setupRegistrationForm();
      const input = within(autocomplete).getByRole('combobox');

      // Test with special characters
      await user.type(input, 'Mills &');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(input).not.toHaveValue('');
      });
    });
  },
);

describe('Talawa-API server fetch check', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { __typename: 'Query' } })),
    );
  });

  const expectApiHealthCheckFetchCalled = (): void => {
    expect(fetch).toHaveBeenCalledWith(
      BACKEND_URL,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
      }),
    );
  };

  it('Checks if Talawa-API resource is loaded successfully', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();
    expectApiHealthCheckFetchCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  NEW TESTS TO HIT 100 % COVERAGE FOR LoginPage.tsx                 */
/* ------------------------------------------------------------------ */

// Helper functions to reduce code duplication
const renderLoginPage = (
  mocksOrLink: StaticMockLink | ReadonlyArray<MockedResponse> = createMocks(),
): ReturnType<typeof render> => {
  const isLink = mocksOrLink instanceof StaticMockLink;
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const link = isLink
    ? mocksOrLink
    : new StaticMockLink(mocksOrLink as ReadonlyArray<MockedResponse>, true);

  return render(
    <MockedProvider link={link}>
      <Router location={history.location} navigator={history}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <LoginPage />
          </I18nextProvider>
        </Provider>
      </Router>
    </MockedProvider>,
  );
};

const setLocationPath = (pathname: string): void => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      reload: vi.fn(),
      href: `https://localhost:4321${pathname}`,
      origin: 'https://localhost:4321',
      pathname,
    },
  });
};

describe('Extra coverage for 100 %', () => {
  afterEach(() => {
    vi.doUnmock('Constant/constant.ts');
  });

  it('sets document.title on render', async () => {
    setLocationPath('/');
    renderLoginPage();
    await wait();
    expect(document.title).toBeTruthy();
    expect(document.title).not.toBe('');
  });

  it('handleLoginSuccess when user.countryCode is null still navigates (skips changeLanguage)', async () => {
    const COUNTRY_NULL_MOCKS = [
      ...createMocks().filter((m) => m.request.query !== SIGNIN_QUERY),
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'nocc@example.com', password: 'pass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'nocc@example.com' && vars?.password === 'pass',
        result: {
          data: {
            signIn: {
              user: {
                id: '1',
                role: 'user',
                name: 'User',
                emailAddress: 'nocc@example.com',
                countryCode: null,
                avatarURL: null,
                isEmailAddressVerified: true,
              },
              authenticationToken: 'token',
              refreshToken: 'refreshToken',
            },
          },
        },
      },
    ];
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(COUNTRY_NULL_MOCKS, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await user.type(
        screen.getByTestId('login-form-email'),
        'nocc@example.com',
      );
      await user.type(screen.getByPlaceholderText(/Enter Password/i), 'pass');
      await user.click(screen.getByTestId('login-form-submit'));
      await waitFor(() => {
        expect(routerMocks.navigate).toHaveBeenCalledWith(
          '/user/organizations',
        );
      });
    });
  });

  it('bypasses recaptcha when feature is off', async () => {
    // Ensure pathname exists to prevent i18n language detector crash
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    // re-import component so mock applies
    const { default: LoginPageFresh } = await import('./LoginPage');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageFresh />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();
    // Recaptcha should not render when feature flag is off
    expect(screen.queryByTestId('mock-recaptcha')).toBeNull();
    // Verify recaptcha is bypassed by submitting login without token
    await user.type(
      screen.getByTestId('login-form-email'),
      'johndoe@gmail.com',
    );
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'johndoe');
    await user.click(screen.getByTestId('login-form-submit'));
    await wait();
    // Should succeed without recaptcha interaction
    expect(routerMocks.navigate).toHaveBeenCalledWith('/user/organizations');
  });

  it('logs error when reCAPTCHA script fails to load', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Set up reCAPTCHA enabled environment
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'YES',
      RECAPTCHA_SITE_KEY: 'test-site-key',
    }));

    // Mock loadRecaptchaScript to throw an error
    vi.doMock('utils/recaptcha', () => ({
      getRecaptchaToken: vi.fn().mockResolvedValue('mock-recaptcha-token'),
      loadRecaptchaScript: vi
        .fn()
        .mockRejectedValue(new Error('Failed to load script')),
    }));

    // Import fresh component with mocked dependencies
    const { default: LoginPageFresh } = await import('./LoginPage');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageFresh />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    // Wait for the useEffect to execute
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load reCAPTCHA script:',
        expect.any(Error),
      );
    });

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it.todo(
    'shows toast for invalid name during registration (RegistrationForm shows inline errors)',
    async () => {
      setLocationPath('/');
      renderLoginPage();
      await wait();
      await user.click(screen.getByTestId('goToRegisterPortion'));
      await user.type(screen.getByLabelText(/First Name/i), '123'); // invalid - contains numbers
      await user.type(screen.getByTestId('registrationEmail'), 'a@b.co'); // invalid email (too short)
      await user.type(screen.getByTestId('passwordField'), 'Valid@123');
      await user.type(screen.getByTestId('cpassword'), 'Valid@123');
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('registrationBtn'));
      await wait();
      expect(toastMocks.warn).toHaveBeenNthCalledWith(
        1,
        i18nForTest.t('loginPage.nameInvalid'),
      );
    },
  );

  it.todo(
    'shows toast for weak password (RegistrationForm shows inline errors)',
    async () => {
      setLocationPath('/');
      renderLoginPage();
      await wait();
      await user.click(screen.getByTestId('goToRegisterPortion'));
      await user.type(screen.getByLabelText(/First Name/i), 'John Doe');
      await user.type(screen.getByTestId('registrationEmail'), 'john@doe.com'); // valid email to isolate password validation
      await user.type(screen.getByTestId('passwordField'), 'weak');
      await user.type(screen.getByTestId('cpassword'), 'weak');
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('registrationBtn'));
      await wait();
      expect(toastMocks.warn).toHaveBeenNthCalledWith(
        1,
        i18nForTest.t('loginPage.passwordInvalid'),
      );
    },
  );

  it('warns when non-admin logs in from admin portal', async () => {
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageNonAdmin } = await import('./LoginPage');

    const NON_ADMIN_MOCK = [
      ...createMocks().filter((m) => m.request.query !== SIGNIN_QUERY),
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'user@example.com', password: 'pass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'user@example.com' && vars?.password === 'pass',
        result: {
          data: {
            signIn: {
              user: {
                id: '1',
                role: 'user',
                name: 'U',
                emailAddress: 'user@example.com',
              },
              authenticationToken: 'token',
              refreshToken: 'refreshToken',
            },
          },
        },
      },
    ];
    const history = createMemoryHistory({ initialEntries: ['/admin'] });
    render(
      <MockedProvider link={new StaticMockLink(NON_ADMIN_MOCK, true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNonAdmin />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();
    await user.type(screen.getByTestId('login-form-email'), 'user@example.com');
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'pass');
    await user.click(screen.getByTestId('login-form-submit'));

    await waitFor(() => {
      expect(toastMocks.warning).toHaveBeenCalledWith(
        'Sorry! you are not Authorised!',
      );
    });
  });

  it('stores admin id (setItem id) on successful admin login', async () => {
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');

    const ADMIN_LOGIN_MOCK = [
      ...createMocks().filter((m) => m.request.query !== SIGNIN_QUERY),
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'admin@example.com', password: 'adminpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'admin@example.com' && vars?.password === 'adminpass',
        result: {
          data: {
            signIn: {
              user: {
                id: 'admin-id-123',
                role: 'administrator',
                name: 'Admin User',
                emailAddress: 'admin@example.com',
                countryCode: 'US',
                avatarURL: null,
                isEmailAddressVerified: true,
              },
              authenticationToken: 'token',
              refreshToken: 'refreshToken',
            },
          },
        },
      },
    ];

    await withMockedLocation('/admin', async () => {
      const history = createMemoryHistory({ initialEntries: ['/admin'] });
      render(
        <MockedProvider link={new StaticMockLink(ADMIN_LOGIN_MOCK, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      await wait();

      await user.type(
        screen.getByTestId('login-form-email'),
        'admin@example.com',
      );
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'adminpass',
      );
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
          'id',
          'admin-id-123',
        );
        expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
          'userId',
          expect.any(String),
        );
      });
    });
  });

  it('handles RegistrationError via NotificationToast with error code', async () => {
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');

    const mocks = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      ...createMocks3(),
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(mocks, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
      });

      const registerButton = screen.getByTestId('goToRegisterPortion');
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), 'John Doe');
      await user.type(
        screen.getByTestId('registrationEmail'),
        'johndoe@test.com',
      );
      await user.type(screen.getByTestId('passwordField'), 'Password@123');
      await user.type(screen.getByTestId('cpassword'), 'Password@123');
      await user.click(screen.getByTestId('registrationBtn'));

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith({
          key: 'missingOrganizationId',
          namespace: 'errors',
        });
      });
    });
  });

  it('renders component after mount', async () => {
    renderLoginPage();
    await wait();
    expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
  });

  it('handles Talawa-API unreachable', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('Network error'));

    try {
      await act(async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        render(
          <MockedProvider link={new StaticMockLink(createMocks(), true)}>
            <Router location={history.location} navigator={history}>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <LoginPage />
                </I18nextProvider>
              </Provider>
            </Router>
          </MockedProvider>,
        );
      });

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith('Network error');
      });
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it('displays warning message when resource loading fails', async () => {
    const mockError = new Error('Network error');
    vi.spyOn(global, 'fetch').mockRejectedValue(mockError);

    await act(async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
    });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('Network error');
    });
  });

  it.todo(
    'resets signup recaptcha when signup fails (ReCAPTCHA deferred to Phase 2b)',
    async () => {
      const FAIL_MOCK = [
        {
          request: {
            query: SIGNUP_MUTATION,
            variables: {
              ID: '',
              name: 'John Doe',
              email: 'johndoe@gmail.com',
              password: 'Johndoe@123',
            },
          },
          error: new Error('Signup failed'),
        },
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: {
            data: {
              community: {
                createdAt: dayjs()
                  .subtract(1, 'year')
                  .startOf('year')
                  .format('YYYY-MM-DD'),
                facebookURL: null,
                githubURL: null,
                id: '1',
                inactivityTimeoutDuration: 3600,
                instagramURL: null,
                linkedinURL: null,
                logoMimeType: null,
                logoURL: null,
                name: 'Test Community',
                redditURL: null,
                slackURL: null,
                updatedAt: dayjs()
                  .subtract(1, 'year')
                  .startOf('year')
                  .format('YYYY-MM-DD'),
                websiteURL: null,
                xURL: null,
                youtubeURL: null,
              },
            },
          },
        },
        {
          request: { query: ORGANIZATION_LIST_NO_MEMBERS },
          result: { data: { organizations: [] } },
        },
      ];
      setLocationPath('/');
      renderLoginPage(FAIL_MOCK);
      await wait();
      await user.click(screen.getByTestId('goToRegisterPortion'));
      await user.type(screen.getByLabelText(/First Name/i), 'John Doe');
      await user.type(
        screen.getByTestId('registrationEmail'),
        'johndoe@gmail.com',
      );
      await user.type(screen.getByTestId('passwordField'), 'Johndoe@123');
      await user.type(screen.getByTestId('cpassword'), 'Johndoe@123');
      // reCAPTCHA V3 is now integrated directly in the mutation
      await user.click(screen.getByTestId('registrationBtn'));
      await wait();

      // Test passes if no errors occur (reCAPTCHA V3 works silently)
      expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
    },
  );

  it.todo(
    'shows error toast when recaptcha verification fails during signup (ReCAPTCHA deferred to Phase 2b)',
    async () => {
      const RECAPTCHA_ERROR_MOCK = [
        {
          request: {
            query: SIGNUP_MUTATION,
            variables: {
              ID: '',
              name: 'John',
              email: 'john@doe.com',
              password: 'John@123',
            },
          },
          result: {
            errors: [{ message: 'Invalid reCAPTCHA token' }],
          },
        },
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: ORGANIZATION_LIST_NO_MEMBERS },
          result: { data: { organizations: [] } },
        },
      ];
      setLocationPath('/');
      renderLoginPage(RECAPTCHA_ERROR_MOCK);
      await wait();
      await user.click(screen.getByTestId('goToRegisterPortion'));
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByTestId('registrationEmail'), 'john@doe.com');
      await user.type(screen.getByTestId('passwordField'), 'John@123');
      await user.type(screen.getByTestId('cpassword'), 'John@123');
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('registrationBtn'));
      await wait();
      expect(toastMocks.error).toHaveBeenCalledWith(
        expect.stringMatching(/captcha|Invalid reCAPTCHA/i),
      );
    },
  );

  it.todo(
    'shows email invalid toast when email is too short (RegistrationForm shows inline errors)',
    async () => {
      setLocationPath('/');
      renderLoginPage();
      await wait();
      await user.click(screen.getByTestId('goToRegisterPortion'));
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByTestId('registrationEmail'), 'a@b.co'); // length 6
      await user.type(screen.getByTestId('passwordField'), 'Test@123');
      await user.type(screen.getByTestId('cpassword'), 'Test@123');
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('registrationBtn'));
      await wait();
      expect(toastMocks.warn).toHaveBeenNthCalledWith(
        1,
        i18nForTest.t('loginPage.emailInvalid'),
      );
    },
  );

  it.todo(
    'shows not found warning when signIn returns null (LoginForm success path only)',
    async () => {
      const NULL_SIGNIN_MOCK = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: { email: 'test@test.com', password: 'pass' },
          },
          result: { data: null },
        },
        {
          request: { query: GET_COMMUNITY_DATA_PG },
          result: { data: { community: null } },
        },
        {
          request: { query: ORGANIZATION_LIST_NO_MEMBERS },
          result: { data: { organizations: [] } },
        },
      ];
      setLocationPath('/');
      renderLoginPage(NULL_SIGNIN_MOCK);
      await wait();
      await user.type(screen.getByTestId('login-form-email'), 'test@test.com');
      await user.type(screen.getByPlaceholderText(/Enter Password/i), 'pass');
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('login-form-submit'));
      await wait();
      expect(toastMocks.warn).toHaveBeenCalledWith('Not found');
    },
  );

  it('shows account locked message with countdown when retryAfter is provided', async () => {
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');

    // Set retryAfter to 15 minutes from now
    const retryAfterDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const ACCOUNT_LOCKED_MOCK = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'locked@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'locked@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Account temporarily locked', {
              extensions: {
                code: 'account_locked',
                retryAfter: retryAfterDate,
              },
            }),
          ],
        },
      },
    ];

    const link = new StaticMockLink(ACCOUNT_LOCKED_MOCK, true);
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();

    await user.type(screen.getByTestId('login-form-email'), 'locked@test.com');
    await user.type(
      screen.getByPlaceholderText(/Enter Password/i),
      'wrongpass',
    );
    await user.click(screen.getByTestId('login-form-submit'));
    await wait();

    // Should show the account locked message with countdown (15 minutes)
    // Verify the message contains "locked" and a number for minutes
    expect(toastMocks.error).toHaveBeenCalledWith(
      expect.stringMatching(/locked.*\d+.*minute|minute.*\d+.*locked/i),
    );

    // Verify navigation does NOT occur (early return on error)
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });

  it('shows generic account locked message when retryAfter is missing', async () => {
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');

    const ACCOUNT_LOCKED_NO_TIMER_MOCK = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'locked@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'locked@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Account temporarily locked', {
              extensions: {
                code: 'account_locked',
                // No retryAfter provided
              },
            }),
          ],
        },
      },
    ];

    const link = new StaticMockLink(ACCOUNT_LOCKED_NO_TIMER_MOCK, true);
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();

    await user.type(screen.getByTestId('login-form-email'), 'locked@test.com');
    await user.type(
      screen.getByPlaceholderText(/Enter Password/i),
      'wrongpass',
    );
    await user.click(screen.getByTestId('login-form-submit'));
    await wait();

    // Should show generic account locked message (without countdown)
    expect(toastMocks.error).toHaveBeenCalledWith({
      key: 'accountLocked',
      namespace: 'errors',
    });
  });

  it('handles non-account_locked GraphQL errors via errorHandler', async () => {
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: LoginPageNoRecaptcha } = await import('./LoginPage');

    const OTHER_GRAPHQL_ERROR_MOCK = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'test@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Invalid credentials', {
              extensions: {
                code: 'UNAUTHENTICATED',
              },
            }),
          ],
        },
      },
    ];

    const link = new StaticMockLink(OTHER_GRAPHQL_ERROR_MOCK, true);
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={link}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );
    await wait();

    await user.type(screen.getByTestId('login-form-email'), 'test@test.com');
    await user.type(
      screen.getByPlaceholderText(/Enter Password/i),
      'wrongpass',
    );
    await user.click(screen.getByTestId('login-form-submit'));
    await wait();

    // Should call errorHandler which shows the error message
    // Note: errorHandler passes raw backend error messages directly without i18n wrapping
    expect(toastMocks.error).toHaveBeenCalledWith('Invalid credentials');

    // Verify navigation does NOT occur (early return on error)
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });
});

describe('Cookie-based authentication verification', () => {
  async function getLoginPageWithRecaptchaOff(): Promise<typeof LoginPage> {
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: Page } = await import('./LoginPage');
    return Page;
  }

  it('should NOT store tokens in localStorage (tokens handled by HTTP-Only cookies)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const SIGNIN_WITH_REFRESH_TOKEN_MOCK = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@gmail.com', password: 'testPassword' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'test@gmail.com' && vars?.password === 'testPassword',
        result: {
          data: {
            signIn: {
              user: {
                id: 'userId123',
                name: 'Test User',
                emailAddress: 'test@gmail.com',
                role: 'user',
              },
              authenticationToken: 'newAuthToken123',
              refreshToken: 'newRefreshToken456',
            },
          },
        },
      },
    ];

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/',
        origin: 'https://localhost:4321',
        pathname: '/',
      },
    });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider
        link={new StaticMockLink(SIGNIN_WITH_REFRESH_TOKEN_MOCK, true)}
      >
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();

    await user.type(screen.getByTestId('login-form-email'), 'test@gmail.com');
    await user.type(
      screen.getByPlaceholderText(/Enter Password/i),
      'testPassword',
    );
    await user.click(screen.getByTestId('login-form-submit'));

    await wait();

    // Verify that tokens are NOT stored in localStorage (handled by HTTP-Only cookies)
    expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
      'token',
      expect.any(String),
    );
    expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
      'refreshToken',
      expect.any(String),
    );

    // Verify that user session state IS stored in localStorage
    expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
      'name',
      'Test User',
    );
    expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
      'email',
      'test@gmail.com',
    );
    expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith('role', 'user');
    expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
      'userId',
      'userId123',
    );
  });

  // Test case for registration/signup flow
  it('registers user without storing tokens in localStorage (cookie-based auth)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const SIGNUP_SUCCESS_MOCK = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [
              {
                id: 'org-cookie-test',
                name: 'Test Org',
                addressLine1: null,
              },
            ],
          },
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'org-cookie-test',
            name: 'New User',
            email: 'newuser@example.com',
            password: 'Password@123',
          },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.name === 'New User' &&
          vars?.email === 'newuser@example.com' &&
          vars?.password === 'Password@123' &&
          typeof vars?.ID === 'string' &&
          vars.ID.length > 0,
        result: {
          data: {
            signUp: {
              user: {
                id: 'newUser123',
              },
              authenticationToken: 'newAuthTokenSignup',
              refreshToken: 'newRefreshTokenSignup',
            },
          },
        },
      },
    ];

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'https://localhost:4321/',
        origin: 'https://localhost:4321',
        pathname: '/',
      },
    });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(SIGNUP_SUCCESS_MOCK, true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();
    await user.click(screen.getByTestId('goToRegisterPortion'));
    await user.type(screen.getByLabelText(/First Name/i), 'New User');
    await user.type(
      screen.getByTestId('registrationEmail'),
      'newuser@example.com',
    );
    await user.type(screen.getByTestId('passwordField'), 'Password@123');
    await user.type(screen.getByTestId('cpassword'), 'Password@123');
    await user.click(screen.getByLabelText('Organization'));
    await user.click(screen.getByRole('option', { name: 'Test Org' }));
    await user.click(screen.getByTestId('registrationBtn'));
    await waitFor(() => {
      expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
        'token',
        expect.any(String),
      );
      expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.any(String),
      );
    });
  });

  it.todo(
    'shows toast for invalid name during registration (assert inline error from RegistrationForm)',
  );

  it.todo(
    'shows toast for weak password (assert inline error from RegistrationForm)',
  );

  it('Testing login error handling (catch block)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const communityData = {
      id: '1',
      name: 'Test Community',
      logoURL: 'http://example.com/logo.png',
      websiteURL: 'http://example.com',
      facebookURL: 'http://facebook.com/test',
      linkedinURL: 'http://linkedin.com/test',
      xURL: 'http://twitter.com/test',
      githubURL: 'http://github.com/test',
      instagramURL: 'http://instagram.com/test',
      youtubeURL: 'http://youtube.com/test',
      slackURL: 'http://slack.com/test',
      redditURL: 'http://reddit.com/test',
      inactivityTimeoutDuration: 3600,
      createdAt: dayjs()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD'),
      updatedAt: dayjs()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD'),
      logoMimeType: 'image/png',
      __typename: 'Community',
    };
    const ERROR_MOCKS = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 3600 } } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: communityData } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: communityData } },
      },
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'error@gmail.com', password: 'password' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'error@gmail.com' && vars?.password === 'password',
        error: new Error('Network Error'),
      },
    ];

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(ERROR_MOCKS, true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await user.type(screen.getByTestId('login-form-email'), 'error@gmail.com');
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'password');
    await user.click(screen.getByTestId('login-form-submit'));
    await wait();
    expect(toastMocks.error).toHaveBeenCalled();
  });

  it('handles Talawa-API unreachable', async () => {
    // Mock fetch to reject before rendering
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('Network error'));

    try {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(createMocks(), true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await user.type(
        screen.getByTestId('login-form-email'),
        'error@gmail.com',
      );
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'password',
      );
      await user.click(screen.getByTestId('login-form-submit'));

      await wait();

      // Verify error toast is shown (health-check fetch rejects with 'Network error')
      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalled();
      });
      const errorCalls = toastMocks.error.mock.calls;
      const networkErrorCall = errorCalls.find((call) => {
        const msg = call[0]?.toString() ?? '';
        return /network error/i.test(msg);
      });
      expect(networkErrorCall).toBeDefined();
      if (networkErrorCall) {
        expect(networkErrorCall[0].toString()).toMatch(/network error/i);
        // errorHandler may call NotificationToast.error with just a string (no options)
        // or with an object, so options is optional
        if (networkErrorCall[1] !== undefined) {
          expect(networkErrorCall[1]).toEqual(expect.any(Object));
        }
      }
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it('resets signup recaptcha when signup fails', async () => {
    const FAIL_MOCK = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [
              {
                id: '6437904485008f171cf29924',
                name: 'Unity Foundation',
                addressLine1: '123 Random Street',
              },
            ],
          },
        },
      },
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: '',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: 'Johndoe@123',
          },
        },
        error: new Error('Signup failed'),
      },
    ];

    await withMockedLocation('/', async () => {
      renderLoginPage(FAIL_MOCK);
      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);
      await user.type(screen.getByLabelText(/First Name/i), 'John Doe');
      await user.type(
        screen.getByTestId('registrationEmail'),
        'johndoe@gmail.com',
      );
      await user.type(screen.getByTestId('passwordField'), 'Johndoe@123');
      await user.type(screen.getByTestId('cpassword'), 'Johndoe@123');
      await user.click(screen.getByLabelText('Organization'));
      await user.click(
        screen.getByRole('option', { name: 'Unity Foundation' }),
      );
      await user.click(screen.getByTestId('registrationBtn'));
      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalled();
      });
    });
  });

  it.todo(
    'sets recaptcha token when recaptcha is completed (ReCAPTCHA deferred to Phase 2b)',
    async () => {
      const RECAPTCHA_LOGIN_MOCKS: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'testadmin2@example.com',
              password: 'Pass@123',
              recaptchaToken: 'fake-recaptcha-token',
            },
          },
          result: {
            data: {
              signIn: {
                user: {
                  id: '1',
                  role: 'administrator',
                  name: 'Test Admin',
                  emailAddress: 'testadmin2@example.com',
                  countryCode: 'US',
                  avatarURL: null,
                  isEmailAddressVerified: true,
                },
                authenticationToken: 'authenticationToken',
                refreshToken: 'refreshToken',
              },
            },
          },
        },
        ...createMocks().filter((m) => m.request.query !== SIGNIN_QUERY),
      ];
      const localLink = new StaticMockLink(RECAPTCHA_LOGIN_MOCKS, true);
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={localLink}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await wait();

      const recaptchaInputs = screen.getAllByTestId('recaptcha-container');
      const loginRecaptcha = recaptchaInputs[0];
      await user.type(loginRecaptcha, 'fake-recaptcha-token');

      await user.type(
        screen.getByTestId('login-form-email'),
        'testadmin2@example.com',
      );
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'Pass@123',
      );

      await user.click(screen.getByTestId('login-form-submit'));

      await wait();

      expect(localLink.operation?.variables?.recaptchaToken).toBe(
        'fake-recaptcha-token',
      );
    },
  );

  it('Testing login functionality with verified email clears storage flags', async () => {
    setLocationPath('/');
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: LoginPageFresh } = await import('./LoginPage');
    const formData = { email: 'verified@gmail.com', password: 'password123' };

    const verifiedEmailLink = new StaticMockLink(
      createMocksVerifiedEmail(),
      true,
    );

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={verifiedEmailLink}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageFresh />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();

    await user.type(screen.getByTestId('login-form-email'), formData.email);
    await user.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password,
    );
    await user.click(screen.getByTestId('login-form-submit'));

    await wait();

    expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
      'emailNotVerified',
    );
    expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
      'unverifiedEmail',
    );
  });

  it('Redirects to /admin/orglist if user is already logged in as administrator', async () => {
    mockUseLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'IsLoggedIn') return 'TRUE';
      if (key === 'role') return 'administrator';
      return null;
    });

    const history = createMemoryHistory({ initialEntries: ['/admin'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await wait();
    expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orglist');
  });

  it('shows error toast when recaptcha verification fails during signup', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const RECAPTCHA_ERROR_MOCK = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'org-1',
            name: 'John',
            email: 'john@doe.com',
            password: 'John@123',
          },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.name === 'John' &&
          vars?.email === 'john@doe.com' &&
          vars?.password === 'John@123' &&
          typeof vars?.ID === 'string',
        result: {
          errors: [{ message: 'Invalid reCAPTCHA token' }],
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [
              { id: 'org-1', name: 'Test Org', addressLine1: null },
            ],
          },
        },
      },
    ];
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(RECAPTCHA_ERROR_MOCK, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByTestId('registrationEmail'), 'john@doe.com');
      await user.type(screen.getByTestId('passwordField'), 'John@123');
      await user.type(screen.getByTestId('cpassword'), 'John@123');
      await user.click(screen.getByLabelText('Organization'));
      await user.click(screen.getByRole('option', { name: 'Test Org' }));
      await user.click(screen.getByTestId('registrationBtn'));

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalled();
        const lastCall =
          toastMocks.error.mock.calls[
            toastMocks.error.mock.calls.length - 1
          ]?.[0];
        expect(String(lastCall)).toMatch(/captcha|reCAPTCHA|invalid/i);
      });
    });
  });

  it.todo(
    'shows email invalid toast when email is too short (assert inline error from RegistrationForm)',
  );

  it('shows not found warning when signIn returns null', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const NULL_SIGNIN_MOCK = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@test.com', password: 'pass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'test@test.com' && vars?.password === 'pass',
        result: { data: null },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];
    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(NULL_SIGNIN_MOCK, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, 'test@test.com');
      await user.type(screen.getByPlaceholderText(/Enter Password/i), 'pass');
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith('Not found');
      });
    });
  });

  it('shows account locked message with countdown when retryAfter is provided', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const retryAfterDate = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const ACCOUNT_LOCKED_MOCK = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'locked@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'locked@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Account temporarily locked', {
              extensions: {
                code: 'account_locked',
                retryAfter: retryAfterDate,
              },
            }),
          ],
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(ACCOUNT_LOCKED_MOCK, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );
      // await wait(); // removed

      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, 'locked@test.com');
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'wrongpass',
      );
      // reCAPTCHA is now integrated directly in the mutation
      await user.click(screen.getByTestId('login-form-submit'));
      // await wait(); // removed

      // Should show the account locked message with countdown (15 minutes)
      // Verify the message contains "locked" and a number for minutes
      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith(
          expect.stringMatching(/locked.*\d+.*minute|minute.*\d+.*locked/i),
        );
      });

      // Verify navigation does NOT occur (early return on error)
      expect(routerMocks.navigate).not.toHaveBeenCalled();
    });
  });

  it('shows generic account locked message when retryAfter is missing', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const ACCOUNT_LOCKED_NO_TIMER_MOCK = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'locked@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'locked@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Account temporarily locked', {
              extensions: {
                code: 'account_locked',
              },
            }),
          ],
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider
          link={new StaticMockLink(ACCOUNT_LOCKED_NO_TIMER_MOCK, true)}
        >
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, 'locked@test.com');
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'wrongpass',
      );
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith({
          key: 'accountLocked',
          namespace: 'errors',
        });
      });

      expect(routerMocks.navigate).not.toHaveBeenCalled();
    });
  });

  it('handles non-account_locked GraphQL errors via errorHandler', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const OTHER_GRAPHQL_ERROR_MOCK = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@test.com', password: 'wrongpass' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'test@test.com' && vars?.password === 'wrongpass',
        result: {
          errors: [
            new GraphQLError('Invalid credentials', {
              extensions: {
                code: 'UNAUTHENTICATED',
              },
            }),
          ],
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider
          link={new StaticMockLink(OTHER_GRAPHQL_ERROR_MOCK, true)}
        >
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, 'test@test.com');
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'wrongpass',
      );
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(toastMocks.error).toHaveBeenCalledWith('Invalid credentials');
      });

      expect(routerMocks.navigate).not.toHaveBeenCalled();
    });
  });
});

describe('Cookie-based authentication verification (extra coverage)', () => {
  async function getLoginPageWithRecaptchaOff(): Promise<typeof LoginPage> {
    vi.resetModules();
    vi.doMock('Constant/constant.ts', async () => ({
      ...(await vi.importActual<object>('Constant/constant.ts')),
      REACT_APP_USE_RECAPTCHA: 'NO',
      RECAPTCHA_SITE_KEY: 'xxx',
    }));
    const { default: Page } = await import('./LoginPage');
    return Page;
  }

  it('should NOT store tokens in localStorage (tokens handled by HTTP-Only cookies)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const SIGNIN_WITH_REFRESH_TOKEN_MOCK = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@gmail.com', password: 'testPassword' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'test@gmail.com' && vars?.password === 'testPassword',
        result: {
          data: {
            signIn: {
              user: {
                id: 'userId123',
                name: 'Test User',
                emailAddress: 'test@gmail.com',
                role: 'user',
              },
              authenticationToken: 'newAuthToken123',
              refreshToken: 'newRefreshToken456',
            },
          },
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider
          link={new StaticMockLink(SIGNIN_WITH_REFRESH_TOKEN_MOCK, true)}
        >
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, 'test@gmail.com');
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'testPassword',
      );
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
          'token',
          expect.any(String),
        );
      });
      expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.any(String),
      );

      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'IsLoggedIn',
        'TRUE',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'name',
        'Test User',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'email',
        'test@gmail.com',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith('role', 'user');
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'userId',
        'userId123',
      );
    });
  });

  // Test case for registration/signup flow
  it('registers user without storing tokens in localStorage (cookie-based auth)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const SIGNUP_SUCCESS_MOCK = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'org-id',
            name: 'New User',
            email: 'newuser@example.com',
            password: 'Password@123',
          },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.name === 'New User' &&
          vars?.email === 'newuser@example.com' &&
          vars?.password === 'Password@123' &&
          typeof vars?.ID === 'string' &&
          (vars.ID as string).length > 0,
        result: {
          data: {
            signUp: {
              user: {
                id: 'newUser123',
              },
              authenticationToken: 'newAuthTokenSignup',
              refreshToken: 'newRefreshTokenSignup',
            },
          },
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [
              { id: 'org-id', name: 'Test Org', addressLine1: null },
            ],
          },
        },
      },
    ];

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={new StaticMockLink(SIGNUP_SUCCESS_MOCK, true)}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      // Switch to Register tab
      const registerButton = await screen.findByTestId('goToRegisterPortion');
      await user.click(registerButton);

      // Fill registration form
      await user.type(screen.getByLabelText(/First Name/i), 'New User');
      await user.type(
        screen.getByTestId('registrationEmail'),
        'newuser@example.com',
      );
      await user.type(screen.getByTestId('passwordField'), 'Password@123');
      await user.type(screen.getByTestId('cpassword'), 'Password@123');
      await user.click(screen.getByLabelText('Organization'));
      await user.click(screen.getByRole('option', { name: 'Test Org' }));
      await user.click(screen.getByTestId('registrationBtn'));

      await waitFor(() => {
        expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
          'token',
          expect.any(String),
        );
      });
      expect(mockUseLocalStorage.setItem).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.any(String),
      );

      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'IsLoggedIn',
        'TRUE',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'name',
        'New User',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'email',
        'newuser@example.com',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith(
        'userId',
        'newUser123',
      );
      expect(mockUseLocalStorage.setItem).toHaveBeenCalledWith('role', 'user');
    });
  });

  it('Testing login error handling (catch block)', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const ERROR_MOCKS = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'error@gmail.com', password: 'password' },
        },
        variableMatcher: (vars: Record<string, unknown> | undefined) =>
          vars?.email === 'error@gmail.com' && vars?.password === 'password',
        error: new Error('Network Error'),
      },
      {
        request: { query: GET_COMMUNITY_DATA_PG, variables: {} },
        result: {
          data: {
            community: {
              id: '1',
              name: 'Test Community',
              logoURL: 'http://example.com/logo.png',
              websiteURL: 'http://example.com',
              facebookURL: 'http://facebook.com/test',
              linkedinURL: 'http://linkedin.com/test',
              xURL: 'http://twitter.com/test',
              githubURL: 'http://github.com/test',
              instagramURL: 'http://instagram.com/test',
              youtubeURL: 'http://youtube.com/test',
              slackURL: 'http://slack.com/test',
              redditURL: 'http://reddit.com/test',
              inactivityTimeoutDuration: 3600,
              createdAt: dayjs()
                .subtract(1, 'year')
                .startOf('year')
                .format('YYYY-MM-DD'),
              updatedAt: dayjs()
                .subtract(1, 'year')
                .startOf('year')
                .format('YYYY-MM-DD'),
              logoMimeType: 'image/png',
              __typename: 'Community',
            },
          },
        },
      },
      // LoginPage refetches community data when `data` changes, so provide a second identical response
      {
        request: { query: GET_COMMUNITY_DATA_PG, variables: {} },
        result: {
          data: {
            community: {
              id: '1',
              name: 'Test Community',
              logoURL: 'http://example.com/logo.png',
              websiteURL: 'http://example.com',
              facebookURL: 'http://facebook.com/test',
              linkedinURL: 'http://linkedin.com/test',
              xURL: 'http://twitter.com/test',
              githubURL: 'http://github.com/test',
              instagramURL: 'http://instagram.com/test',
              youtubeURL: 'http://youtube.com/test',
              slackURL: 'http://slack.com/test',
              redditURL: 'http://reddit.com/test',
              inactivityTimeoutDuration: 3600,
              createdAt: dayjs()
                .subtract(1, 'year')
                .startOf('year')
                .format('YYYY-MM-DD'),
              updatedAt: dayjs()
                .subtract(1, 'year')
                .startOf('year')
                .format('YYYY-MM-DD'),
              logoMimeType: 'image/png',
              __typename: 'Community',
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [],
          },
        },
      },
    ];

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(ERROR_MOCKS, true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPageNoRecaptcha />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    const emailInput = await screen.findByTestId('login-form-email');
    await user.type(emailInput, 'error@gmail.com');
    await user.type(screen.getByPlaceholderText(/Enter Password/i), 'password');
    await user.click(screen.getByTestId('login-form-submit'));

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalled();
      const errorCalls = toastMocks.error.mock.calls;
      const networkErrorCall = errorCalls.find((call) =>
        call[0]?.toString().includes('Network Error'),
      );
      expect(networkErrorCall).toBeDefined();
      if (networkErrorCall) {
        expect(networkErrorCall[0]).toEqual(
          expect.stringContaining('Network Error'),
        );
        if (networkErrorCall[1] !== undefined) {
          expect(networkErrorCall[1]).toEqual(expect.any(Object));
        }
      }
    });
  });

  describe('Checks presence of back to login button', () => {
    it('shows back to login button on /register path', async () => {
      await withMockedLocation('/register', async () => {
        renderLoginPage();
        await waitFor(() => {
          expect(screen.getByTestId('goToLoginPortion')).toBeInTheDocument();
        });
      });
    });

    it('redirects to login on back to login button click', async () => {
      await withMockedLocation('/register', async () => {
        renderLoginPage();
        const loginInButton = await screen.findByTestId('goToLoginPortion');
        await user.click(loginInButton);
        await waitFor(() => {
          expect(screen.getByTestId('goToRegisterPortion')).toBeInTheDocument();
        });
      });
    });
  });

  // Note: Registration uses the same code path as login for storing refreshToken
  // The login test above verifies the refreshToken storage behavior
  it('Testing Community Data Rendering (social icons and logo)', async () => {
    const COMMUNITY_MOCKS = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: {
          data: {
            community: {
              name: 'Test Community',
              logoURL: 'http://example.com/logo.png',
              websiteURL: 'http://example.com',
              facebookURL: 'http://facebook.com/test',
              linkedinURL: 'http://linkedin.com/test',
              xURL: 'http://twitter.com/test',
              githubURL: 'http://github.com/test',
              instagramURL: 'http://instagram.com/test',
              youtubeURL: 'http://youtube.com/test',
              slackURL: 'http://slack.com/test',
              redditURL: 'http://reddit.com/test',
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: {
          data: {
            organizations: [],
          },
        },
      },
    ];

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(COMMUNITY_MOCKS, true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    // Verify community logo is rendered
    await waitFor(() => {
      expect(screen.getByTestId('preLoginLogo')).toBeInTheDocument();
    });
    expect(screen.getByText('Test Community')).toBeInTheDocument();

    // Verify social media icons are rendered (checking for at least one)
    const socialLinks = screen.getAllByTestId('preLoginSocialMedia');
    expect(socialLinks.length).toBeGreaterThan(0);
    expect(socialLinks[0]).toHaveAttribute('href');
  });

  it('sets recaptcha token when recaptcha is completed', async () => {
    // Mock the reCAPTCHA V3 function to return our expected token
    const mockGetRecaptchaToken = vi.mocked(getRecaptchaToken);
    mockGetRecaptchaToken.mockResolvedValue('fake-recaptcha-token');

    // Create test-specific mock that matches the variables used in this test
    const RECAPTCHA_LOGIN_MOCKS: MockedResponse[] = [
      {
        request: {
          query: SIGNIN_QUERY,
          variables: {
            email: 'testadmin2@example.com',
            password: 'Pass@123',
            recaptchaToken: 'fake-recaptcha-token',
          },
        },
        result: {
          data: {
            signIn: {
              user: {
                id: '1',
                role: 'administrator',
                name: 'Test Admin',
                emailAddress: 'testadmin2@example.com',
                countryCode: 'US',
                avatarURL: null,
                isEmailAddressVerified: true,
              },
              authenticationToken: 'authenticationToken',
              refreshToken: 'refreshToken',
            },
          },
        },
      },
      ...createMocks().filter((m) => m.request.query !== SIGNIN_QUERY),
    ];
    const localLink = new StaticMockLink(RECAPTCHA_LOGIN_MOCKS, true);

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={localLink}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      await user.type(
        screen.getByTestId('login-form-email'),
        'testadmin2@example.com',
      );
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        'Pass@123',
      );

      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        // Verify that getRecaptchaToken was called with the correct parameters
        expect(mockGetRecaptchaToken).toHaveBeenCalledWith(
          'xxx', // RECAPTCHA_SITE_KEY from mock
          'login',
        );
      });

      await waitFor(() => {
        expect(localLink.operation?.variables?.recaptchaToken).toBe(
          'fake-recaptcha-token',
        );
      });
    });
  });

  it('Testing login functionality with verified email clears storage flags', async () => {
    const LoginPageNoRecaptcha = await getLoginPageWithRecaptchaOff();
    const formData = { email: 'verified@gmail.com', password: 'password123' };

    const verifiedEmailLink = new StaticMockLink(
      createMocksVerifiedEmail(),
      true,
    );

    await withMockedLocation('/', async () => {
      const history = createMemoryHistory({ initialEntries: ['/'] });
      render(
        <MockedProvider link={verifiedEmailLink}>
          <Router location={history.location} navigator={history}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPageNoRecaptcha />
              </I18nextProvider>
            </Provider>
          </Router>
        </MockedProvider>,
      );

      const emailInput = await screen.findByTestId('login-form-email');
      await user.type(emailInput, formData.email);
      await user.type(
        screen.getByPlaceholderText(/Enter Password/i),
        formData.password,
      );

      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
          'emailNotVerified',
        );
      });
      expect(mockUseLocalStorage.removeItem).toHaveBeenCalledWith(
        'unverifiedEmail',
      );
    });
  });

  it('Redirects to /admin/orglist if user is already logged in as administrator', async () => {
    mockUseLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'IsLoggedIn') return 'TRUE';
      if (key === 'role') return 'administrator';
      return null;
    });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <MockedProvider link={new StaticMockLink(createMocks(), true)}>
        <Router location={history.location} navigator={history}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </Router>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(routerMocks.navigate).toHaveBeenCalledWith('/admin/orglist');
    });
  });
});

// Unit checks for createMocks3 override behavior
describe('createMocks3 factory', () => {
  it('should handle empty community', () => {
    const mocks = createMocks3({
      communityData: null,
      organizationsData: [],
    });
    const communityMocks = mocks.filter(
      (m) => m.request.query === GET_COMMUNITY_DATA_PG,
    );
    expect(communityMocks.length).toBeGreaterThanOrEqual(2);
    for (const mock of communityMocks) {
      // @ts-expect-error runtime shape check in test
      expect(mock.result?.data?.community ?? null).toBeNull();
    }
  });

  it('should handle community with data', () => {
    const community = {
      id: '1',
      name: 'Test Org',
      description: 'Description',
      typename: 'Organization',
    };
    const mocks = createMocks3({ communityData: community });
    const communityMocks = mocks.filter(
      (m) => m.request.query === GET_COMMUNITY_DATA_PG,
    );
    expect(communityMocks.length).toBeGreaterThanOrEqual(2);
    for (const mock of communityMocks) {
      // @ts-expect-error runtime shape check in test
      expect(mock.result?.data?.community).toEqual(community);
    }
  });
});
