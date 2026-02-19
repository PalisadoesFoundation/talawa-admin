import { OAuthButton } from './OAuthButton';
import { OAUTH_PROVIDERS } from 'config/oauthProviders';
import { Props } from './types';

/**
 * GitHub OAuth authentication button component.
 *
 * Handles GitHub OAuth flow by redirecting users to GitHub's authentication page
 * and storing the authentication mode (login/register/link) for callback processing.
 *
 * @returns A GitHub-branded OAuth button
 *
 * @example
 * ```tsx
 * // Sign-in button
 * <GitHubOAuthButton mode="login" fullWidth />
 *
 * // Link account button
 * <GitHubOAuthButton mode="link" size="sm" />
 * ```
 *
 * @remarks
 * - Uses OAuth `state` parameter to pass mode, provider, and CSRF nonce through the OAuth flow
 * - Also stores configuration in sessionStorage as fallback
 * - The callback handler extracts mode and nonce from state parameter (or sessionStorage) and calls
 *   the appropriate OAuth flow handler (`handleOAuthLogin` or `handleOAuthLink`)
 * - State parameter format: "mode:provider:nonce" (e.g., "login:GITHUB:uuid-v4")
 * - CSRF protection: Nonce is validated in callback to prevent CSRF attacks
 */
const GitHubOAuthButton: React.FC<Props> = ({
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
   * Initiates GitHub OAuth flow by redirecting to GitHub's authorization endpoint.
   * Uses OAuth state parameter to pass mode, provider, and CSRF nonce (preferred method).
   * Also stores in sessionStorage as a fallback.
   */
  const githubAuthHandler: () => void = () => {
    const clientID = OAUTH_PROVIDERS.GITHUB.clientId;
    const redirectURI = OAUTH_PROVIDERS.GITHUB.redirectUri;
    const enabled = OAUTH_PROVIDERS.GITHUB.enabled;

    if (!enabled || !clientID || !redirectURI) {
      console.error(
        'GitHub OAuth is not properly configured. Please check your environment variables.',
      );
      return;
    }
    const scope = OAUTH_PROVIDERS.GITHUB.scopes.join(' ');

    // Generate CSRF protection nonce
    const nonce = crypto.randomUUID();

    // Store in sessionStorage as fallback (in case state is lost)
    sessionStorage.setItem('oauth_mode', mode);
    sessionStorage.setItem('oauth_provider', 'GITHUB');
    sessionStorage.setItem('oauth_nonce', nonce);

    const OAUTH_PROVIDER = 'GITHUB';

    // State format: "mode:provider:nonce" for CSRF protection
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientID,
    )}&redirect_uri=${encodeURIComponent(
      redirectURI,
    )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(`${mode}:${OAUTH_PROVIDER}:${nonce}`)}`;

    window.location.href = authUrl;
  };

  const buttonProps = {
    provider: 'GITHUB' as const,
    mode,
    onClick: githubAuthHandler,
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

export default GitHubOAuthButton;
