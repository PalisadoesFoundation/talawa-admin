import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import OAuthCallbackPage from './callback';
import type { InterfaceAuthenticationPayload } from 'types/Auth/auth';
import { UserRole, Iso3166Alpha2CountryCode } from 'utils/interfaces';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import {
  handleOAuthLogin,
  handleOAuthLink,
} from 'utils/oauth/oauthFlowHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.oauthCallback ?? null,
  ),
);

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('index', () => ({
  client: {},
}));

vi.mock('utils/oauth/oauthFlowHandler', () => ({
  handleOAuthLogin: vi.fn(),
  handleOAuthLink: vi.fn(),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    setItem: vi.fn(),
  })),
}));

vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    startSession: vi.fn(),
  })),
}));

vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-state">{children}</div>
  ),
}));

vi.mock('config/oauthProviders', () => ({
  OAUTH_PROVIDERS: {
    GOOGLE: {
      redirectUri: 'http://localhost:3000/auth/callback',
    },
    GITHUB: {
      redirectUri: 'http://localhost:3000/auth/callback',
    },
  },
}));

describe('OAuthCallbackPage', () => {
  let mockAuthResponse: InterfaceAuthenticationPayload;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let mockSetItem: ReturnType<typeof vi.fn>;
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    originalLocation = window.location;
    // Mock console.error to prevent test output pollution
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock for useLocalStorage
    mockSetItem = vi.fn();
    vi.mocked(useLocalStorage).mockReturnValue({
      setItem: mockSetItem,
      getItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(),
      clearAllItems: vi.fn(),
    });

    // Mock successful auth response
    mockAuthResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        role: UserRole.Regular,
        countryCode: Iso3166Alpha2CountryCode.us,
        avatarURL: 'http://example.com/avatar.jpg',
        isEmailAddressVerified: true,
      },
      authenticationToken: 'mock-auth-token',
      refreshToken: 'mock-refresh-token',
    };

    // Set default window.location.search
    delete (window as { location?: Location }).location;
    (window as { location: Location }).location = {
      ...window.location,
      search: '',
      origin: 'http://localhost:3000',
    } as Location;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    (window as { location: Location }).location = originalLocation;
    sessionStorage.clear();
  });

  describe('Successful Login Flow', () => {
    it('should handle successful login with state parameter', async () => {
      // Arrange
      const nonce = 'test-nonce-123';
      (window as { location: Location }).location.search =
        `?code=auth-code-123&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'auth-code-123',
          'http://localhost:3000/auth/callback',
        );
        expect(mockSetItem).toHaveBeenCalledWith('userId', 'user-123');
        expect(mockSetItem).toHaveBeenCalledWith('IsLoggedIn', 'TRUE');
        expect(mockSetItem).toHaveBeenCalledWith('name', 'John Doe');
        expect(mockSetItem).toHaveBeenCalledWith('email', 'john@example.com');
        expect(mockSetItem).toHaveBeenCalledWith('role', 'regular');
        expect(NotificationToast.success).toHaveBeenCalledWith(
          translations.successfullyLoggedIn,
        );
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should handle successful login with sessionStorage fallback', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?code=auth-code-456';

      sessionStorage.setItem('oauth_mode', 'login');
      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      sessionStorage.setItem('oauth_nonce', 'fallback-nonce');

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <OAuthCallbackPage />
          </BrowserRouter>
        </I18nextProvider>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'auth-code-456',
          'http://localhost:3000/auth/callback',
        );
        expect(mockSetItem).toHaveBeenCalledWith('userId', 'user-123');
        expect(NotificationToast.success).toHaveBeenCalledWith(
          translations.successfullyLoggedIn,
        );
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should clear sessionStorage after successful login', async () => {
      // Arrange
      const nonce = 'test-nonce-789';
      (window as { location: Location }).location.search =
        `?code=auth-code-789&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_mode', 'login');
      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(sessionStorage.getItem('oauth_mode')).toBeNull();
        expect(sessionStorage.getItem('oauth_provider')).toBeNull();
        expect(sessionStorage.getItem('oauth_nonce')).toBeNull();
      });
    });

    it('should handle register mode correctly', async () => {
      // Arrange
      const nonce = 'test-register-nonce';
      (window as { location: Location }).location.search =
        `?code=auth-code-register&state=register:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'auth-code-register',
          'http://localhost:3000/auth/callback',
        );
        expect(NotificationToast.success).toHaveBeenCalledWith(
          translations.successfullyLoggedIn,
        );
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Successful Link Flow', () => {
    it('should handle successful account linking with state parameter', async () => {
      // Arrange
      const nonce = 'test-link-nonce-123';
      (window as { location: Location }).location.search =
        `?code=link-code-123&state=link:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLink).mockResolvedValueOnce({
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        isEmailAddressVerified: true,
        role: UserRole.Regular,
        oauthAccounts: [],
      });

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLink).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'link-code-123',
          'http://localhost:3000/auth/callback',
        );
        expect(NotificationToast.success).toHaveBeenCalledWith(
          translations.accountLinkedSuccessfully,
        );
        expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
        expect(mockSetItem).not.toHaveBeenCalled();
      });
    });

    it('should handle successful account linking with sessionStorage fallback', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?code=link-code-456';

      sessionStorage.setItem('oauth_mode', 'link');
      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      sessionStorage.setItem('oauth_nonce', 'fallback-link-nonce');

      vi.mocked(handleOAuthLink).mockResolvedValueOnce({
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        isEmailAddressVerified: true,
        role: UserRole.Regular,
        oauthAccounts: [],
      });

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLink).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'link-code-456',
          'http://localhost:3000/auth/callback',
        );
        expect(NotificationToast.success).toHaveBeenCalledWith(
          translations.accountLinkedSuccessfully,
        );
        expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
      });
    });

    it('should clear sessionStorage after successful link', async () => {
      // Arrange
      const nonce = 'test-link-nonce-789';
      (window as { location: Location }).location.search =
        `?code=link-code-789&state=link:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_mode', 'link');
      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLink).mockResolvedValueOnce({
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        isEmailAddressVerified: true,
        role: UserRole.Regular,
        oauthAccounts: [],
      });

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(sessionStorage.getItem('oauth_mode')).toBeNull();
        expect(sessionStorage.getItem('oauth_provider')).toBeNull();
        expect(sessionStorage.getItem('oauth_nonce')).toBeNull();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle OAuth provider error', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?error=access_denied&error_description=User+cancelled';

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'OAuth provider error: access_denied',
        );
        expect(handleOAuthLogin).not.toHaveBeenCalled();
        expect(handleOAuthLink).not.toHaveBeenCalled();
      });

      // Should navigate to home after delay
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        },
        { timeout: 3500 },
      );
    });

    it('should handle missing authorization code', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?state=login:GOOGLE';

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.noAuthCodeReceived,
        );
      });

      expect(handleOAuthLogin).not.toHaveBeenCalled();
      expect(handleOAuthLink).not.toHaveBeenCalled();
    });

    it('should handle missing mode and provider (no state, no sessionStorage)', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?code=auth-code-123';

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.oauthConfigurationNotFound,
        );
      });

      expect(handleOAuthLogin).not.toHaveBeenCalled();
      expect(handleOAuthLink).not.toHaveBeenCalled();
    });

    it('should handle missing mode (has provider but no mode)', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?code=auth-code-123';

      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      // oauth_mode is intentionally not set

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.oauthConfigurationNotFound,
        );
      });
    });

    it('should handle missing provider (has mode but no provider)', async () => {
      // Arrange
      (window as { location: Location }).location.search =
        '?code=auth-code-123';

      sessionStorage.setItem('oauth_mode', 'login');
      // oauth_provider is intentionally not set

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.oauthConfigurationNotFound,
        );
      });
    });

    it('should handle login error and navigate back', async () => {
      // Arrange
      const nonce = 'test-error-nonce';
      (window as { location: Location }).location.search =
        `?code=auth-code-error&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockRejectedValueOnce(
        new Error('Authentication failed'),
      );

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Authentication failed',
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'OAuth callback error:',
          expect.any(Error),
        );
        expect(mockSetItem).not.toHaveBeenCalled();
      });

      // Should navigate to home after delay
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/');
        },
        { timeout: 3500 },
      );
    });

    it('should handle link error and navigate back', async () => {
      // Arrange
      const nonce = 'test-link-error-nonce';
      (window as { location: Location }).location.search =
        `?code=link-code-error&state=link:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLink).mockRejectedValueOnce(
        new Error('Account linking failed'),
      );

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Account linking failed',
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'OAuth callback error:',
          expect.any(Error),
        );
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const nonce = 'test-unknown-error-nonce';
      (window as { location: Location }).location.search =
        `?code=auth-code-unknown&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockRejectedValueOnce('Unknown error');

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.oauthAuthenticationFailed,
        );
      });
    });

    it('should clear sessionStorage on error', async () => {
      // Arrange
      const nonce = 'test-clear-error-nonce';
      (window as { location: Location }).location.search =
        `?code=auth-code-error&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_mode', 'login');
      sessionStorage.setItem('oauth_provider', 'GOOGLE');
      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockRejectedValueOnce(
        new Error('Authentication failed'),
      );

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(sessionStorage.getItem('oauth_mode')).toBeNull();
        expect(sessionStorage.getItem('oauth_provider')).toBeNull();
        expect(sessionStorage.getItem('oauth_nonce')).toBeNull();
      });
    });

    it('should handle CSRF validation failure', async () => {
      // Arrange - state nonce doesn't match stored nonce
      (window as { location: Location }).location.search =
        '?code=auth-code-123&state=login:GOOGLE:wrong-nonce';

      sessionStorage.setItem('oauth_nonce', 'correct-nonce');

      // Act
      render(
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <OAuthCallbackPage />
          </BrowserRouter>
        </I18nextProvider>,
      );

      // Assert
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          translations.csrfValidationFailed,
        );
        expect(handleOAuthLogin).not.toHaveBeenCalled();
        expect(handleOAuthLink).not.toHaveBeenCalled();
      });

      // Should clear sessionStorage and navigate home
      await waitFor(
        () => {
          expect(sessionStorage.getItem('oauth_nonce')).toBeNull();
          expect(mockNavigate).toHaveBeenCalledWith('/');
        },
        { timeout: 3500 },
      );
    });
  });

  describe('State Parameter Parsing', () => {
    it('should parse state parameter with login mode', async () => {
      // Arrange
      const nonce = 'test-parse-login-nonce';
      (window as { location: Location }).location.search =
        `?code=code-123&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'code-123',
          'http://localhost:3000/auth/callback',
        );
      });
    });

    it('should parse state parameter with link mode', async () => {
      // Arrange
      const nonce = 'test-parse-link-nonce';
      (window as { location: Location }).location.search =
        `?code=code-456&state=link:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLink).mockResolvedValueOnce({
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        isEmailAddressVerified: true,
        role: UserRole.Regular,
        oauthAccounts: [],
      });

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLink).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'code-456',
          'http://localhost:3000/auth/callback',
        );
      });
    });

    it('should prefer state parameter over sessionStorage', async () => {
      // Arrange
      const nonce = 'test-prefer-state-nonce';
      (window as { location: Location }).location.search =
        `?code=code-789&state=link:GOOGLE:${nonce}`;

      // Set different values in sessionStorage
      sessionStorage.setItem('oauth_mode', 'login');
      sessionStorage.setItem('oauth_provider', 'GITHUB');
      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLink).mockResolvedValueOnce({
        id: 'user-123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        isEmailAddressVerified: true,
        role: UserRole.Regular,
        oauthAccounts: [],
      });

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert - should use state parameter values, not sessionStorage
      await waitFor(() => {
        expect(handleOAuthLink).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE', // from state, not GITHUB from sessionStorage
          'code-789',
          'http://localhost:3000/auth/callback',
        );
      });
    });
  });

  describe('Redirect URI', () => {
    it('should use VITE_GOOGLE_REDIRECT_URI from constants', async () => {
      // Arrange
      const nonce = 'test-uri-nonce';
      (window as { location: Location }).location.search =
        `?code=code-uri-test&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GOOGLE',
          'code-uri-test',
          'http://localhost:3000/auth/callback',
        );
      });
    });
  });

  describe('Component Rendering', () => {
    it('should render LoadingState component', () => {
      // Arrange
      const nonce = 'test-render-nonce';
      (window as { location: Location }).location.search =
        `?code=code-123&state=login:GOOGLE:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      const { getByTestId } = render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      expect(getByTestId('loading-state')).toBeInTheDocument();
    });
  });

  describe('Different OAuth Providers', () => {
    it('should handle GITHUB provider from state parameter', async () => {
      // Arrange
      const nonce = 'test-github-nonce';
      (window as { location: Location }).location.search =
        `?code=code-github&state=login:GITHUB:${nonce}`;

      sessionStorage.setItem('oauth_nonce', nonce);

      vi.mocked(handleOAuthLogin).mockResolvedValueOnce(mockAuthResponse);

      // Act
      render(
        <BrowserRouter>
          <OAuthCallbackPage />
        </BrowserRouter>,
      );

      // Assert
      await waitFor(() => {
        expect(handleOAuthLogin).toHaveBeenCalledWith(
          expect.anything(),
          'GITHUB',
          'code-github',
          'http://localhost:3000/auth/callback',
        );
      });
    });
  });
});
