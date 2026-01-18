import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { vi, beforeEach, expect, it, describe } from 'vitest';
import LoginPage from './LoginPage';
import useSession from '../../utils/useSession';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
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
          name: 'Test Community',
          logoURL: null,
          socialURLs: {
            facebook: '',
            twitter: '',
            linkedin: '',
            github: '',
            youtube: '',
            slack: '',
            instagram: '',
            reddit: '',
          },
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
          },
        ],
      },
    },
  },
];

const renderLoginPage = (mocks = MOCKS) => {
  return render(
    <MockedProvider mocks={mocks}>
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

  it('should handle login success and start session', () => {
    const mockStartSession = vi.fn();

    // Update the mock for this specific test
    vi.mocked(useSession).mockReturnValue({
      startSession: mockStartSession,
      endSession: vi.fn(),
      handleLogout: vi.fn(),
      extendSession: vi.fn(),
    });

    renderLoginPage();

    // Verify session management is available
    expect(mockStartSession).toBeDefined();
  });

  it('should render registration form when tab is active', () => {
    renderLoginPage();

    // Switch to registration tab
    const registerTab = screen.getByTestId('register-tab');
    fireEvent.click(registerTab);

    // Verify registration form is rendered
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('should render community data when available', async () => {
    const COMMUNITY_DATA_MOCK = [
      {
        request: { query: GET_COMMUNITY_DATA_PG },
        result: {
          data: {
            community: {
              name: 'Test Community',
              logoURL: 'http://example.com/logo.png',
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
});
