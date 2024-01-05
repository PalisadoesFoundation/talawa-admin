import React from 'react';
import { useTranslation } from 'react-i18next';

import PalisadoesImage from 'assets/images/palisadoes_logo.png';
import TalawaImage from 'assets/images/talawa-logo-200x200.png';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import Login from 'components/UserPortal/Login/Login';
import Register from 'components/UserPortal/Register/Register';
import styles from './UserLoginPage.module.css';

import {
  FacebookLogo,
  LinkedInLogo,
  GithubLogo,
  InstagramLogo,
  SlackLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'assets/svgs/social-icons';

export default function userLoginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const [currentMode, setCurrentMode] = React.useState('login');
  const loginRegisterProps = {
    setCurrentMode: setCurrentMode,
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftPane}>
        <a
          href="https://www.palisadoes.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className={styles.palisadoesImage}
            src={PalisadoesImage}
            alt="Palisadoes Branding"
          />

          <h6 style={{ textAlign: `center` }}>
            <p>{t('fromPalisadoes')}</p>
          </h6>
        </a>
        <div className={styles.socialIcons}>
          <a
            href="https://www.facebook.com/palisadoesproject"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={FacebookLogo} />
          </a>
          <a
            href="https://twitter.com/palisadoesorg?lang=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={TwitterLogo} className={styles.socialIcon} />
          </a>
          <a
            href="https://www.linkedin.com/company/palisadoes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={LinkedInLogo} />
          </a>
          <a
            href="https://github.com/PalisadoesFoundation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={GithubLogo} />
          </a>
          <a
            href="https://www.youtube.com/@PalisadoesOrganization"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={YoutubeLogo} />
          </a>
          <a
            href="https://www.palisadoes.org/slack"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={SlackLogo} />
          </a>
          <a
            href="https://www.instagram.com/palisadoes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={InstagramLogo} />
          </a>
        </div>
      </div>
      <div className={`${styles.contentContainer} py-5`}>
        <ChangeLanguageDropDown parentContainerStyle="m-0" />
        <img
          className={styles.talawaImage}
          src={TalawaImage}
          alt="Talawa Branding"
        />
        {
          /* istanbul ignore next */
          currentMode === 'login' ? (
            <Login {...loginRegisterProps} />
          ) : (
            <Register {...loginRegisterProps} />
          )
        }
      </div>
    </div>
  );
}
