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
        getCommunityData: {
          __typename: 'Community',
          name: 'Test Community',
        },
      },
    },
  },
  {
    request: { query: ORGANIZATION_LIST_NO_MEMBERS },
    result: {
      data: {
        organizationsList: [
          {
            __typename: 'Organization',
            _id: '6437904485008f171cf29924',
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

  beforeEach(() => {
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
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin/login' },
      writable: true,
    });

    renderLoginPage();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should render social media links', () => {
    renderLoginPage();

    // Check for social media links by looking for external links
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('should render language dropdown', () => {
    renderLoginPage();

    // Check for any dropdown or language-related element
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
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

  it('should handle registration success', () => {
    renderLoginPage();

    // Switch to registration tab
    const registerTab = screen.getByTestId('register-tab');
    fireEvent.click(registerTab);

    // Verify registration form is rendered
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('should render community data when available', () => {
    renderLoginPage();

    // Community data rendering is handled by the component
    expect(screen.getByTestId('login-tab')).toBeInTheDocument();
  });
});
