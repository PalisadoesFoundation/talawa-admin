import React from 'react';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import { InterfaceAuthBrandingProps } from 'types/AuthBranding/interface';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { socialMediaLinks } from '../../constants';

/**
 * AuthBranding
 * Displays organization branding and social media links on authentication pages.
 * Shows custom community branding when communityData is provided; otherwise displays Palisadoes branding.
 * @param {InterfaceAuthBrandingProps} props
 * @param {Object} [props.communityData] - Optional community data containing logoURL, name, websiteURL, and social media URLs
 * @returns {JSX.Element}
 */
const AuthBranding: React.FC<InterfaceAuthBrandingProps> = ({
  communityData,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const renderSocialLinks = () =>
    socialMediaLinks
      .map(({ href, logo, tag }) => ({
        tag,
        logo,
        finalHref: (communityData?.[tag] as string | undefined) ?? href,
      }))
      .filter(({ finalHref }) => Boolean(finalHref))
      .map(({ finalHref, logo, tag }) => {
        const testId = communityData?.[tag]
          ? 'preLoginSocialMedia'
          : 'PalisadoesSocialMedia';
        return (
          <a
            key={tag}
            href={finalHref}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={testId}
          >
            <img src={logo} alt={tag} />
          </a>
        );
      });

  return (
    <div className={styles.inner}>
      {/* Branding Block */}
      {communityData ? (
        <a
          href={communityData.websiteURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.communityLogo}
        >
          <img
            src={communityData.logoURL}
            alt={`${communityData.name} logo`}
            data-testid="preLoginLogo"
          />
          <p className="text-center">{communityData.name}</p>
        </a>
      ) : (
        <a
          href="https://www.palisadoes.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PalisadoesLogo
            className={styles.palisadoes_logo}
            data-testid="PalisadoesLogo"
          />
          <p className={styles.fromPalisadoes}>{t('fromPalisadoes')}</p>
        </a>
      )}

      {/* Social Media Icons */}
      <div className={styles.socialIcons}>{renderSocialLinks()}</div>
    </div>
  );
};

export default AuthBranding;
