import React from 'react';
import { brandForProvider } from '../theme/oauthBrand';
import styles from './OAuthButton.module.css';
import { OAuthProviderKey } from 'types/Auth/auth';
import { Button } from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
/**
 * Defines the authentication mode for OAuth operations.
 */
export type OAuthMode = 'login' | 'register' | 'link';

/**
 * Defines the size variants for the OAuth button.
 */
export type OAuthSize = 'sm' | 'md' | 'lg';

/**
 * Props for the OAuthButton component.
 */
type Props = {
  provider: OAuthProviderKey;
  mode: OAuthMode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: OAuthSize;
  className?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
};

/**
 * A customizable OAuth authentication button component that supports multiple providers.
 *
 * @param props - The component props
 * @returns A styled OAuth button with provider-specific branding
 *
 * @example
 * ```tsx
 * <OAuthButton
 *   provider="GOOGLE"
 *   mode="login"
 *   onClick={handleGoogleLogin}
 *   loading={isLoading}
 *   size="lg"
 *   fullWidth
 * />
 * ```
 */
export const OAuthButton: React.FC<Props> = ({
  provider,
  mode,
  onClick,
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  children,
}) => {
  const brand = brandForProvider(provider);
  const isDisabled = disabled || loading;
  const { t } = useTranslation();
  const cls = [
    styles.base,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isDisabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <Button
      type="button"
      variant="primary"
      className={`${cls} ${brand.className}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel ?? t('oauth.ariaLabel', { provider, mode })}
      data-provider={provider}
      data-mode={mode}
    >
      <span className={styles.icon} aria-hidden="true">
        {brand.icon}
      </span>
      <span className={styles.label}>
        {children ?? t('oauth.continueWith', { provider: brand.displayName })}
      </span>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </Button>
  );
};
