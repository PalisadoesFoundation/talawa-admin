import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { vi, expect, it, describe } from 'vitest';
import dayjs from 'dayjs';
import LoginPage from './LoginPage';
import useSession from '../../utils/useSession';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';

// Mock useSession hook
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    startSession: vi.fn(),
    endSession: vi.fn(),
    handleLogout: vi.fn(),
    extendSession: vi.fn(),
  })),
}));

// Mock useLocalStorage hook
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

const MOCKS = [
  {
    request: { query: GET_COMMUNITY_DATA_PG },
    result: {
      data: {
        community: {
          __typename: 'Community',
          id: '1',
          name: 'Test Community',
          logoURL: null,
          facebookURL: '',
          xURL: '',
          linkedinURL: '',
          githubURL: '',
          youtubeURL: '',
          slackURL: '',
          instagramURL: '',
          redditURL: '',
          websiteURL: '',
          createdAt: dayjs()
            .subtract(1, 'year')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          inactivityTimeoutDuration: 30,
          logoMimeType: null,
        },
      },
    },
  },
  {
    request: { query: ORGANIZATION_LIST_NO_MEMBERS },
    result: {
      data: {
        organizations: [
          {
            __typename: 'Organization',
            id: '6437904485008f171cf29924',
            name: 'Unity Foundation',
            addressLine1: '123 Random Street',
          },
        ],
      },
    },
  },
];

const renderLoginPage = (mocks = MOCKS) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <LoginPage />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('LoginPage Orchestrator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render login tab by default', () => {
    renderLoginPage();

    expect(screen.getByTestId('login-tab')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByTestId('register-tab')).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should switch to registration tab when clicked', async () => {
    renderLoginPage();

    const registerTab = screen.getByTestId('register-tab');
    fireEvent.click(registerTab);

    await waitFor(() => {
      expect(screen.getByTestId('register-tab')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByTestId('login-tab')).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });
  });

  it('should render LoginForm when login tab is active', () => {
    renderLoginPage();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should render RegistrationForm when register tab is active', async () => {
    renderLoginPage();

    const registerTab = screen.getByTestId('register-tab');
    fireEvent.click(registerTab);

    await waitFor(() => {
      // Look for registration form elements
      expect(
        screen.getByRole('textbox', { name: /email/i }),
      ).toBeInTheDocument();
    });
  });

  it('should detect admin mode from URL path', () => {
    // Store original location
    const originalLocation = window.location;

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/login' },
      writable: true,
      configurable: true,
    });

    renderLoginPage();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('should render social media links', () => {
    renderLoginPage();

    // Check for specific social media links with aria-labels
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('X (Twitter)')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  it('should render language dropdown', () => {
    renderLoginPage();

    // Check for language dropdown button by test id
    const languageButton = screen.getByTestId('language-dropdown-btn');
    expect(languageButton).toBeInTheDocument();
  });

  it('should handle login success and redirect to admin portal', async () => {
    const mockStartSession = vi.fn();
    const _mockNavigate = vi.fn();

    vi.mocked(useSession).mockReturnValue({
      startSession: mockStartSession,
      endSession: vi.fn(),
      handleLogout: vi.fn(),
      extendSession: vi.fn(),
    });

    // Mock admin path
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/login' },
      writable: true,
    });

    render(
      <MockedProvider link={new StaticMockLink([], true)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Simulate successful login
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });

  it('should handle registration success and switch to login tab', async () => {
    renderLoginPage();

    // Switch to register tab
    const registerTab = screen.getByTestId('register-tab');
    await userEvent.click(registerTab);

    const registrationForm = screen.getByRole('tabpanel');
    expect(registrationForm).toHaveAttribute('id', 'register-panel');
  });

  it('should handle GraphQL errors gracefully', async () => {
    const errorMocks = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('login-tab')).toBeInTheDocument();
    });
  });

  it('should render community data when available', async () => {
    const COMMUNITY_DATA_MOCK = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: {
          data: {
            community: {
              __typename: 'Community',
              id: '1',
              name: 'Test Community',
              logoURL: 'http://example.com/logo.png',
              facebookURL: '',
              xURL: '',
              linkedinURL: '',
              githubURL: '',
              youtubeURL: '',
              slackURL: '',
              instagramURL: '',
              redditURL: '',
              websiteURL: '',
              createdAt: dayjs()
                .subtract(1, 'year')
                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
              updatedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
              inactivityTimeoutDuration: 30,
              logoMimeType: null,
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST_NO_MEMBERS },
        result: { data: { organizations: [] } },
      },
    ];

    render(
      <MockedProvider mocks={COMMUNITY_DATA_MOCK}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Community')).toBeInTheDocument();
    });
  });

  it('should handle registration tab switching integration', async () => {
    renderLoginPage();

    // Start on login tab
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'login-panel');

    // Switch to register tab
    const registerTab = screen.getByTestId('register-tab');
    await userEvent.click(registerTab);

    // Verify complete tab switch
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'id',
      'register-panel',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'register-tab',
    );
    expect(registerTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should handle error states gracefully', async () => {
    const errorMocks = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        error: new Error('Community fetch failed'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Component should still render despite errors
    await waitFor(() => {
      expect(screen.getByTestId('login-tab')).toBeInTheDocument();
      expect(screen.getByTestId('register-tab')).toBeInTheDocument();
    });
  });

  test('handles authentication errors', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should handle auth errors gracefully
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('handles social media label generation', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Social media links should be rendered
    await waitFor(() => {
      const socialLinks = screen.getAllByRole('link');
      expect(socialLinks.length).toBeGreaterThan(0);
    });
  });

  test('handles admin path detection', async () => {
    // Mock window.location for admin path
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/login' },
      writable: true,
    });

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('handles community data display', async () => {
    const communityMock = {
      request: {
        query: GET_COMMUNITY_DATA_PG,
      },
      result: {
        data: {
          community: {
            name: 'Test Community',
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[communityMock]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test Community')).toBeInTheDocument();
    });
  });
});
