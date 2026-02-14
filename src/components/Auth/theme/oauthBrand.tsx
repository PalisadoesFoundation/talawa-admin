import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { ReactElement } from 'react';
import styles from './oauthBrand.module.css';
import { OAuthProviderKey } from 'types/Auth/auth';

/**
 * Represents the visual branding configuration for an OAuth provider.
 */
interface InterfaceProviderBrand {
  icon: ReactElement;
  displayName: string;
  className: string;
}

/**
 * Configuration object containing branding information for supported OAuth providers.
 * Maps provider keys to their respective branding configuration.
 */
const providerBrands: Record<string, InterfaceProviderBrand> = {
  GOOGLE: {
    get icon(): ReactElement {
      return <FcGoogle className={styles.logo} />;
    },
    displayName: 'Google',
    className: styles.googleButton,
  },
  GITHUB: {
    get icon(): ReactElement {
      return <FaGithub className={styles.logo} />;
    },
    displayName: 'GitHub',
    className: styles.githubButton,
  },
};

/**
 * Retrieves the branding configuration for a specific OAuth provider.
 *
 * @param provider - The provider key (e.g., 'GOOGLE', 'GITHUB')
 * @returns The branding configuration for the provider, or Google branding as fallback
 *
 * @example
 * ```tsx
 * const googleBrand = brandForProvider('GOOGLE');
 * console.log(googleBrand.displayName); // 'Google'
 * ```
 */
export function brandForProvider(
  provider: OAuthProviderKey,
): InterfaceProviderBrand {
  return providerBrands[provider] ?? providerBrands.GOOGLE;
}
