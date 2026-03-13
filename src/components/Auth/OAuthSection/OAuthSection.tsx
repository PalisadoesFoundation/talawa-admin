import GoogleOAuthButton from '../OAuthButton/GoogleOAuthButton';
import GitHubOAuthButton from '../OAuthButton/GitHubOAuthButton';
import type { OAuthMode } from '../OAuthButton/OAuthButton';
import { OAUTH_PROVIDERS } from 'config/oauthProviders';
import styles from './OAuthSection.module.css';
import { useTranslation } from 'react-i18next';

/**
 * Props for the OAuthSection component.
 */
type Props = {
  mode: OAuthMode;
};

/**
 * Renders the OAuth authentication section for auth screens.
 *
 * Displays a divider followed by the enabled third-party OAuth providers
 * for the current authentication mode.
 *
 * @param props - The component props
 * @returns A section containing the enabled OAuth buttons, or null when no providers are enabled
 *
 * @example
 * ```tsx
 * <OAuthSection mode="login" />
 * ```
 */
export const OAuthSection = ({ mode }: Props) => {
  const { t: tCommon } = useTranslation('common');

  const isGoogleEnabled = OAUTH_PROVIDERS.GOOGLE.enabled !== false;
  const isGitHubEnabled = OAUTH_PROVIDERS.GITHUB.enabled !== false;
  const hasAnyEnabledProvider = isGoogleEnabled || isGitHubEnabled;

  if (!hasAnyEnabledProvider) {
    return null;
  }

  return (
    <div>
      <div className={styles.divider}>{tCommon('OR')}</div>
      <div className={styles.oauthRow}>
        {isGoogleEnabled && <GoogleOAuthButton mode={mode} />}
        {isGitHubEnabled && <GitHubOAuthButton mode={mode} />}
      </div>
    </div>
  );
};
