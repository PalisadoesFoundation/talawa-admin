import React from 'react';
import { useTranslation } from 'react-i18next';

import PalisadoesImage from 'assets/images/palisadoes_logo.png';
import TalawaImage from 'assets/images/talawa-logo-200x200.png';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import Login from 'components/UserPortal/Login/Login';
import Register from 'components/UserPortal/Register/Register';
import styles from './UserLoginPage.module.css';
import { ReactComponent as SlackLogo } from '../../../assets/svgs/Slack-mark.svg';
import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function userLoginPage(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const [currentMode, setCurrentMode] = React.useState('login');
  const loginRegisterProps = {
    setCurrentMode: setCurrentMode,
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftPane}>
        <img
          className={styles.palisadoesImage}
          src={PalisadoesImage}
          alt="Palisadoes Branding"
        />
        <h6 style={{ textAlign: `center` }}>
          <p>{t('fromPalisadoes')}</p>
        </h6>
        <div className={styles.socialIcons}>
          <a
            href="https://www.facebook.com/palisadoesproject"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook
              className={`${styles.socialIcon} ${styles.facebookIcon}`}
            />
          </a>
          <a
            href="https://twitter.com/palisadoesorg?lang=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter
              className={`${styles.socialIcon} ${styles.twitterIcon}`}
            />
          </a>
          <a
            href="https://www.linkedin.com/company/palisadoes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin
              className={`${styles.socialIcon} ${styles.linkedinIcon}`}
            />
          </a>
          <a
            href="https://github.com/PalisadoesFoundation"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className={`${styles.socialIcon} ${styles.githubIcon}`} />
          </a>
          <a
            href="https://www.youtube.com/@PalisadoesOrganization"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube
              className={`${styles.socialIcon} ${styles.youtubeIcon}`}
            />
          </a>
          <a
            href="https://join.slack.com/t/thepalisadoes-dyb6419/shared_invite/zt-29oltereu-qJ931LcKxswuCAy29iA9WA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SlackLogo className={`${styles.socialIcon} ${styles.slackIcon}`} />
          </a>
          <a
            href="https://www.instagram.com/palisadoes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram
              className={`${styles.socialIcon} ${styles.instagramIcon}`}
            />
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
