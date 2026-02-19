import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import type { OAuthMode } from './OAuthButton';
import GoogleOAuthButton from './GoogleOAuthButton';

// Mock the OAuthButton component
vi.mock('./OAuthButton', () => ({
  OAuthButton: vi.fn(
    ({
      onClick,
      children,
      provider,
      mode,
      size,
      loading,
      disabled,
      fullWidth,
      className,
      'aria-label': ariaLabel,
    }) => (
      <button
        onClick={onClick}
        data-testid="oauth-button"
        data-provider={provider}
        data-mode={mode}
        data-size={size}
        data-loading={loading}
        data-disabled={disabled}
        data-fullwidth={String(fullWidth)}
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {children || `${provider} ${mode}`}
      </button>
    ),
  ),
}));

vi.mock('config/oauthProviders', () => ({
  OAUTH_PROVIDERS: {
    GOOGLE: {
      clientId: 'test-client-id',
      redirectUri: 'http://localhost/auth/callback',
      enabled: true,
      scopes: ['openid', 'profile', 'email'],
    },
  },
}));

describe('GoogleOAuthButton', () => {
  let originalLocation: Location;
  let sessionStorageSetItemSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let randomUUIDSpy: ReturnType<typeof vi.spyOn>;
  const mockNonce = 'test-uuid-1234-5678-90ab';

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Save original location
    originalLocation = window.location;

    // Mock window.location.href
    delete (window as { location?: Location }).location;
    (window as { location: Location }).location = {
      ...originalLocation,
      href: '',
    } as Location;

    // Spy on sessionStorage
    sessionStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    // Mock crypto.randomUUID
    randomUUIDSpy = vi.spyOn(crypto, 'randomUUID').mockReturnValue(mockNonce);

    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Clear sessionStorage
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    (window as { location: Location }).location = originalLocation;
    sessionStorage.clear();
  });

  describe('Component Rendering', () => {
    it('should render with required props', () => {
      render(<GoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-provider', 'GOOGLE');
      expect(button).toHaveAttribute('data-mode', 'login');
    });

    it('should render with all optional props', () => {
      render(
        <GoogleOAuthButton
          mode="register"
          loading={true}
          disabled={true}
          fullWidth={true}
          size="lg"
          className="custom-class"
          aria-label="Custom Google Button"
        >
          Sign up with Google
        </GoogleOAuthButton>,
      );

      const button = screen.getByTestId('oauth-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-mode', 'register');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toHaveAttribute('data-disabled', 'true');
      expect(button).toHaveAttribute('data-fullwidth', 'true');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveAttribute('aria-label', 'Custom Google Button');
      expect(button).toHaveTextContent('Sign up with Google');
    });

    it('should use default prop values when not provided', () => {
      render(<GoogleOAuthButton mode="link" />);

      const button = screen.getByTestId('oauth-button');
      expect(button).toHaveAttribute('data-loading', 'false');
      expect(button).toHaveAttribute('data-disabled', 'false');
      expect(button).toHaveAttribute('data-fullwidth', 'false');
      expect(button).toHaveAttribute('data-size', 'md');
    });
  });

  describe('OAuth Handler - Enabled', () => {
    it('should initiate OAuth flow with login mode', async () => {
      render(<GoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Check sessionStorage
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_mode',
        'login',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_provider',
        'GOOGLE',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_nonce',
        mockNonce,
      );

      // Check URL contains expected parameters
      const url = new URL(window.location.href);
      expect(url.origin + url.pathname).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth',
      );
      expect(url.searchParams.get('client_id')).toBe('test-client-id');
      expect(url.searchParams.get('redirect_uri')).toBe(
        'http://localhost/auth/callback',
      );
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe('openid profile email');
      expect(url.searchParams.get('state')).toBe(`login:GOOGLE:${mockNonce}`);
    });

    it('should initiate OAuth flow with register mode', async () => {
      render(<GoogleOAuthButton mode="register" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Check sessionStorage
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_mode',
        'register',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_provider',
        'GOOGLE',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_nonce',
        mockNonce,
      );

      // Check URL contains expected parameters
      const url = new URL(window.location.href);
      expect(url.origin + url.pathname).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth',
      );
      expect(url.searchParams.get('client_id')).toBe('test-client-id');
      expect(url.searchParams.get('redirect_uri')).toBe(
        'http://localhost/auth/callback',
      );
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe('openid profile email');
      expect(url.searchParams.get('state')).toBe(
        `register:GOOGLE:${mockNonce}`,
      );
    });

    it('should initiate OAuth flow with link mode', async () => {
      render(<GoogleOAuthButton mode="link" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Check sessionStorage
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_mode',
        'link',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_provider',
        'GOOGLE',
      );
      expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
        'oauth_nonce',
        mockNonce,
      );

      // Check URL contains expected parameters
      const url = new URL(window.location.href);
      expect(url.origin + url.pathname).toBe(
        'https://accounts.google.com/o/oauth2/v2/auth',
      );
      expect(url.searchParams.get('client_id')).toBe('test-client-id');
      expect(url.searchParams.get('redirect_uri')).toBe(
        'http://localhost/auth/callback',
      );
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe('openid profile email');
      expect(url.searchParams.get('state')).toBe(`link:GOOGLE:${mockNonce}`);
    });
  });

  describe('OAuth Handler - Disabled', () => {
    it('should not redirect when OAuth is not enabled (missing client ID)', async () => {
      // Override mock to return empty client ID
      vi.doMock('config/oauthProviders', () => ({
        OAUTH_PROVIDERS: {
          GOOGLE: {
            clientId: '',
            redirectUri: 'http://localhost/auth/callback',
            enabled: true,
            scopes: ['openid', 'profile', 'email'],
          },
        },
      }));

      const { default: TestGoogleOAuthButton } =
        await import('./GoogleOAuthButton');

      render(<TestGoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Google OAuth is not properly configured. Please check your environment variables.',
      );

      // Should not set sessionStorage
      expect(sessionStorageSetItemSpy).not.toHaveBeenCalled();

      // Should not redirect
      expect(window.location.href).toBe('');
    });

    it('should not redirect when OAuth is not enabled (missing redirect URI)', async () => {
      // Override mock to return empty redirect URI
      vi.doMock('config/oauthProviders', () => ({
        OAUTH_PROVIDERS: {
          GOOGLE: {
            clientId: 'test-client-id',
            redirectUri: '',
            enabled: true,
            scopes: ['openid', 'profile', 'email'],
          },
        },
      }));

      const { default: TestGoogleOAuthButton } =
        await import('./GoogleOAuthButton');

      render(<TestGoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Google OAuth is not properly configured. Please check your environment variables.',
      );

      // Should not set sessionStorage
      expect(sessionStorageSetItemSpy).not.toHaveBeenCalled();

      // Should not redirect
      expect(window.location.href).toBe('');
    });

    it('should not redirect when OAuth is not enabled (enabled flag false)', async () => {
      // Override mock to return enabled: false
      vi.doMock('config/oauthProviders', () => ({
        OAUTH_PROVIDERS: {
          GOOGLE: {
            clientId: 'test-client-id',
            redirectUri: 'http://localhost/auth/callback',
            enabled: false,
            scopes: ['openid', 'profile', 'email'],
          },
        },
      }));

      const { default: TestGoogleOAuthButton } =
        await import('./GoogleOAuthButton');

      render(<TestGoogleOAuthButton mode="register" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Google OAuth is not properly configured. Please check your environment variables.',
      );

      // Should not set sessionStorage
      expect(sessionStorageSetItemSpy).not.toHaveBeenCalled();

      // Should not redirect
      expect(window.location.href).toBe('');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward all props to OAuthButton component', async () => {
      const { OAuthButton } = await import('./OAuthButton');
      render(
        <GoogleOAuthButton
          mode="login"
          loading={true}
          disabled={true}
          fullWidth={true}
          size="sm"
          className="test-class"
          aria-label="Test Label"
        >
          Custom Content
        </GoogleOAuthButton>,
      );

      expect(OAuthButton).toHaveBeenCalled();
      const callArgs = vi.mocked(OAuthButton).mock.calls[0][0];
      expect(callArgs.provider).toBe('GOOGLE');
      expect(callArgs.mode).toBe('login');
      expect(callArgs.loading).toBe(true);
      expect(callArgs.disabled).toBe(true);
      expect(callArgs.fullWidth).toBe(true);
      expect(callArgs.size).toBe('sm');
      expect(callArgs.className).toBe('test-class');
      expect(callArgs['aria-label']).toBe('Test Label');
      expect(callArgs.children).toBe('Custom Content');
      expect(typeof callArgs.onClick).toBe('function');
    });

    it('should use default values for optional props when not provided', async () => {
      const { OAuthButton } = await import('./OAuthButton');
      render(<GoogleOAuthButton mode="link" />);

      expect(OAuthButton).toHaveBeenCalled();
      const callArgs = vi.mocked(OAuthButton).mock.calls[0][0];
      expect(callArgs.provider).toBe('GOOGLE');
      expect(callArgs.mode).toBe('link');
      expect(callArgs.loading).toBe(false);
      expect(callArgs.disabled).toBe(false);
      expect(callArgs.fullWidth).toBe(false);
      expect(callArgs.size).toBe('md');
      expect(typeof callArgs.onClick).toBe('function');
    });
  });

  describe('SessionStorage Behavior', () => {
    it('should store OAuth mode, provider, and nonce in sessionStorage', async () => {
      render(<GoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      expect(sessionStorage.getItem('oauth_mode')).toBe('login');
      expect(sessionStorage.getItem('oauth_provider')).toBe('GOOGLE');
      expect(sessionStorage.getItem('oauth_nonce')).toBe(mockNonce);
    });

    it('should update sessionStorage for different modes', async () => {
      // Test register mode
      const { rerender } = render(<GoogleOAuthButton mode="register" />);
      let button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      expect(sessionStorage.getItem('oauth_mode')).toBe('register');

      // Clear and test link mode
      sessionStorage.clear();
      rerender(<GoogleOAuthButton mode="link" />);
      button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      expect(sessionStorage.getItem('oauth_mode')).toBe('link');
    });
  });

  describe('State Parameter', () => {
    it('should include state parameter in OAuth URL with correct format including nonce', async () => {
      const modes: OAuthMode[] = ['login', 'register', 'link'];

      for (const mode of modes) {
        // Reset window.location.href
        window.location.href = '';

        const { unmount } = render(<GoogleOAuthButton mode={mode} />);

        const button = screen.getByTestId('oauth-button');
        await userEvent.click(button);

        const url = new URL(window.location.href);
        const state = url.searchParams.get('state');

        expect(state).toBe(`${mode}:GOOGLE:${mockNonce}`);

        unmount();
      }
    });

    it('should generate unique nonce for each OAuth flow', async () => {
      const nonce1 = 'nonce-1';
      const nonce2 = 'nonce-2';

      randomUUIDSpy.mockReturnValueOnce(nonce1);
      render(<GoogleOAuthButton mode="login" />);
      let button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      let url = new URL(window.location.href);
      expect(url.searchParams.get('state')).toBe(`login:GOOGLE:${nonce1}`);

      // Reset and test again with different nonce
      window.location.href = '';
      randomUUIDSpy.mockReturnValueOnce(nonce2);

      render(<GoogleOAuthButton mode="login" />);
      button = screen.getByTestId('oauth-button');
      await userEvent.click(button);

      url = new URL(window.location.href);
      expect(url.searchParams.get('state')).toBe(`login:GOOGLE:${nonce2}`);
    });
  });

  describe('Size Variants', () => {
    it('should support small size variant', async () => {
      render(<GoogleOAuthButton mode="login" size="sm" />);

      const button = screen.getByTestId('oauth-button');
      expect(button).toHaveAttribute('data-size', 'sm');
    });

    it('should support medium size variant (default)', async () => {
      render(<GoogleOAuthButton mode="login" />);

      const button = screen.getByTestId('oauth-button');
      expect(button).toHaveAttribute('data-size', 'md');
    });

    it('should support large size variant', async () => {
      render(<GoogleOAuthButton mode="login" size="lg" />);

      const button = screen.getByTestId('oauth-button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });
  });
});
