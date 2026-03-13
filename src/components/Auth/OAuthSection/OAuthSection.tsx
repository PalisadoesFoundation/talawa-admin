import GoogleOAuthButton from 'components/Auth/OAuthButton/GoogleOAuthButton';
import GitHubOAuthButton from 'components/Auth/OAuthButton/GitHubOAuthButton';
import type { OAuthMode } from 'components/Auth/OAuthButton/OAuthButton';
import { OAUTH_PROVIDERS } from 'config/oauthProviders';
import styles from './OAuthSection.module.css';
import { useTranslation } from 'react-i18next';
import type { ComponentType } from 'react';

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
const providerButtonComponents: Partial<
  Record<keyof typeof OAUTH_PROVIDERS, ComponentType<{ mode: OAuthMode }>>
> = {
  GOOGLE: GoogleOAuthButton,
  GITHUB: GitHubOAuthButton,
};

export const OAuthSection = ({ mode }: Props) => {
  const { t: tCommon } = useTranslation('common');

  const enabledProviders = Object.entries(OAUTH_PROVIDERS).filter(
    ([, config]) => config.enabled !== false,
  );

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.divider}>{tCommon('OR')}</div>
      <div className={styles.oauthRow}>
        {enabledProviders.map(([providerKey]) => {
          const ProviderButton =
            providerButtonComponents[
              providerKey as keyof typeof providerButtonComponents
            ];

          return ProviderButton ? (
            <ProviderButton key={providerKey} mode={mode} />
          ) : null;
        })}
      </div>
    </div>
  );
};
