import { client } from 'index';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { OAuthProviderKey } from 'types/Auth/auth';
import {
  handleOAuthLink,
  handleOAuthLogin,
} from 'utils/oauth/oauthFlowHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { OAUTH_PROVIDERS } from 'config/oauthProviders';
import useSession from 'utils/useSession';
import { useTranslation } from 'react-i18next';
import styles from './callback.module.css';

/**
 * OAuth callback page component that handles the OAuth authentication flow redirect.
 *
 * This component processes the OAuth provider's redirect after user authorization,
 * handling both login/register and account linking flows.
 *
 * @remarks
 * The component extracts the authorization code and state from the URL parameters,
 * then processes the authentication based on the mode (login/register or link).
 *
 * Flow:
 * 1. Extracts code, state, and error parameters from URL
 * 2. Validates authorization code and OAuth configuration
 * 3. Determines mode (login/register vs link) from state parameter or sessionStorage
 * 4. Calls appropriate handler (handleOAuthLogin or handleOAuthLink)
 * 5. On success:
 *    - Login/Register: Stores user data and authentication tokens, redirects to home
 *    - Link: Shows success message, redirects to user settings
 * 6. On error: Shows error message, clears session storage, redirects to home
 *
 * @returns A loading state component while processing the OAuth callback
 *
 * @example
 * ```tsx
 * // Route configuration
 * <Route path="/auth/callback" element={<OAuthCallbackPage />} />
 * ```
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage();
  const { startSession } = useSession();
  const { t } = useTranslation('translation', { keyPrefix: 'oauthCallback' });
  useEffect(() => {
    /**
     * Processes the OAuth callback by extracting URL parameters and completing
     * the authentication or account linking flow.
     *
     * @throws Error When OAuth provider returns an error
     * @throws Error When no authorization code is received
     * @throws Error When OAuth configuration (mode/provider) is missing
     */
    const processOAuthCallback = async (): Promise<void> => {
      try {
        // Extract parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');

        // Check for OAuth provider errors
        if (errorParam) {
          throw new Error(t('oauthProviderError', { error: errorParam }));
        }

        // Validate authorization code
        if (!code) {
          throw new Error(t('noAuthCodeReceived'));
        }

        // Get mode, provider, and nonce from state parameter (preferred) or sessionStorage (fallback)
        let mode: string | null = null;
        let provider: OAuthProviderKey | null = null;
        let stateNonce: string | null = null;

        if (state) {
          // State format: "mode:provider:nonce" (e.g., "login:GOOGLE:uuid")
          const [stateMode, stateProvider, nonce] = state.split(':');
          mode = stateMode;
          provider = stateProvider as OAuthProviderKey;
          stateNonce = nonce;
        } else {
          // Fallback to sessionStorage
          mode = sessionStorage.getItem('oauth_mode');
          provider = sessionStorage.getItem(
            'oauth_provider',
          ) as OAuthProviderKey;
        }

        if (!mode || !provider) {
          throw new Error(t('oauthConfigurationNotFound'));
        }

        // CSRF protection: Validate nonce
        const storedNonce = sessionStorage.getItem('oauth_nonce');
        if (stateNonce && storedNonce && stateNonce !== storedNonce) {
          throw new Error(t('csrfValidationFailed'));
        }

        // Use the correct redirect URI (must match what was sent to the OAuth provider)
        const redirectUri =
          OAUTH_PROVIDERS[provider].redirectUri ||
          window.location.origin + '/auth/callback';

        if (mode === 'link') {
          // Handle account linking
          await handleOAuthLink(client, provider, code, redirectUri);

          NotificationToast.success(t('accountLinkedSuccessfully'));

          // Clear sessionStorage
          sessionStorage.removeItem('oauth_mode');
          sessionStorage.removeItem('oauth_provider');
          sessionStorage.removeItem('oauth_nonce');

          // Redirect to settings page
          navigate('/user/settings');
        } else {
          // Handle login/register
          const authResponse = await handleOAuthLogin(
            client,
            provider,
            code,
            redirectUri,
          );

          // Store authentication tokens and user data
          setItem('userId', authResponse.user.id);
          setItem('IsLoggedIn', 'TRUE');
          setItem('name', `${authResponse.user.name}`);
          setItem('email', authResponse.user.emailAddress);
          setItem('role', authResponse.user.role);

          NotificationToast.success(t('successfullyLoggedIn'));

          // Clear sessionStorage
          sessionStorage.removeItem('oauth_mode');
          sessionStorage.removeItem('oauth_provider');
          sessionStorage.removeItem('oauth_nonce');
          startSession();
          // Redirect to organization list
          navigate('/');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('oauthAuthenticationFailed');
        console.error('OAuth callback error:', err);
        NotificationToast.error(errorMessage);

        // Clear sessionStorage even on error
        sessionStorage.removeItem('oauth_mode');
        sessionStorage.removeItem('oauth_provider');
        sessionStorage.removeItem('oauth_nonce');

        // Redirect back to login after a delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [navigate, t, setItem, startSession]);

  return (
    <div className={styles.spinnerWrapper}>
      <LoadingState isLoading={true} variant="inline">
        <div />
      </LoadingState>
    </div>
  );
};

export default OAuthCallbackPage;
