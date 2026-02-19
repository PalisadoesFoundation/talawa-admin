import { OAuthButton } from './OAuthButton';
import { OAUTH_PROVIDERS } from 'config/oauthProviders';
import { Props } from './types';

/**
 * Google OAuth authentication button component.
 *
 * Handles Google OAuth flow by redirecting users to Google's authentication page
 * and storing the authentication mode (login/register/link) for callback processing.
 *
 * @param Props - Component Props
 * @returns A Google-branded OAuth button
 *
 * @example
 * ```tsx
 * // Sign-in button
 * <GoogleOAuthButton mode="login" fullWidth />
 *
 * // Link account button
 * <GoogleOAuthButton mode="link" size="sm" />
 * ```
 *
 * @remarks
 * - Uses OAuth `state` parameter to pass mode, provider, and CSRF nonce through the OAuth flow
 * - Also stores configuration in sessionStorage as fallback
 * - The callback handler extracts mode and nonce from state parameter (or sessionStorage) and calls
 *   the appropriate OAuth flow handler (`handleOAuthLogin` or `handleOAuthLink`)
 * - State parameter format: "mode:provider:nonce" (e.g., "login:GOOGLE:uuid-v4")
 * - CSRF protection: Nonce is validated in callback to prevent CSRF attacks
 */
const GoogleOAuthButton: React.FC<Props> = ({
  mode,
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  children,
}) => {
  /**
   * Initiates Google OAuth flow by redirecting to Google's authorization endpoint.
   * Uses OAuth state parameter to pass mode, provider, and CSRF nonce (preferred method).
   * Also stores in sessionStorage as a fallback.
   */
  const googleAuthHandler: () => void = () => {
    const clientID = OAUTH_PROVIDERS.GOOGLE.clientId;
    const redirectURI = OAUTH_PROVIDERS.GOOGLE.redirectUri;
    const enabled = OAUTH_PROVIDERS.GOOGLE.enabled;

    if (!enabled || !clientID || !redirectURI) {
      console.error(
        'Google OAuth is not properly configured. Please check your environment variables.',
      );
      return;
    }
    const scope = OAUTH_PROVIDERS.GOOGLE.scopes.join(' ');
    const responseType = 'code';

    // Generate CSRF protection nonce
    const nonce = crypto.randomUUID();

    // Store in sessionStorage as fallback (in case state is lost)
    sessionStorage.setItem('oauth_mode', mode);
    sessionStorage.setItem('oauth_provider', 'GOOGLE');
    sessionStorage.setItem('oauth_nonce', nonce);

    const OAUTH_PROVIDER = 'GOOGLE';

    // State format: "mode:provider:nonce" for CSRF protection
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientID,
    )}&redirect_uri=${encodeURIComponent(
      redirectURI,
    )}&response_type=${encodeURIComponent(
      responseType,
    )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(`${mode}:${OAUTH_PROVIDER}:${nonce}`)}`;

    window.location.href = authUrl;
  };

  const buttonProps = {
    provider: 'GOOGLE' as const,
    mode,
    onClick: googleAuthHandler,
    loading,
    disabled,
    fullWidth,
    size,
    className,
    'aria-label': ariaLabel,
    children,
  };

  return <OAuthButton {...buttonProps} />;
};

export default GoogleOAuthButton;
