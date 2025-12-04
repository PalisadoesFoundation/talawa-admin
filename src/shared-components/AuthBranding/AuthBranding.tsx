import React from 'react';
import PalisadoesLogo from 'assets/svgs/palisadoes.svg?react';
import { InterfaceAuthBrandingProps } from 'types/AuthBranding/interface';
import styles from 'style/app-fixed.module.css';
import {
  FacebookLogo,
  LinkedInLogo,
  GithubLogo,
  InstagramLogo,
  XLogo,
  YoutubeLogo,
  RedditLogo,
  SlackLogo,
} from 'assets/svgs/social-icons';
import { useTranslation } from 'react-i18next';

const socialMediaLinks = [
  {
    tag: 'facebookURL',
    href: 'https://www.facebook.com/palisadoesproject',
    logo: FacebookLogo,
  },
  {
    tag: 'xURL',
    href: 'https://X.com/palisadoesorg?lang=en',
    logo: XLogo,
  },
  {
    tag: 'linkedInURL',
    href: 'https://www.linkedin.com/company/palisadoes/',
    logo: LinkedInLogo,
  },
  {
    tag: 'githubURL',
    href: 'https://github.com/PalisadoesFoundation',
    logo: GithubLogo,
  },
  {
    tag: 'youtubeURL',
    href: 'https://www.youtube.com/@PalisadoesOrganization',
    logo: YoutubeLogo,
  },
  {
    tag: 'slackURL',
    href: 'https://www.palisadoes.org/slack',
    logo: SlackLogo,
  },
  {
    tag: 'instagramURL',
    href: 'https://www.instagram.com/palisadoes/',
    logo: InstagramLogo,
  },
  {
    tag: 'redditURL',
    href: '',
    logo: RedditLogo,
  },
];

/**
 * AuthBranding Component
 * Displays organization branding and social media links on login/register pages.
 */
const AuthBranding: React.FC<InterfaceAuthBrandingProps> = ({
  communityData,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const renderSocialLinks = () =>
    socialMediaLinks.map(({ href, logo, tag }, index) => {
      if (communityData && communityData[tag]) {
        return (
          <a
            key={index}
            href={communityData[tag] as string}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="preLoginSocialMedia"
          >
            <img src={logo} alt={tag} />
          </a>
        );
      }

      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="PalisadoesSocialMedia"
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
            alt="Community Logo"
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
          <p className="text-center">{t('fromPalisadoes')}</p>
        </a>
      )}

      {/* Social Media Icons */}
      <div className={styles.socialIcons}>{renderSocialLinks()}</div>
    </div>
  );
};

export default AuthBranding;
