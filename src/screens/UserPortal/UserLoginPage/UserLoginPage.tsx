import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import { languages } from 'utils/languages';
import i18next from 'i18next';

import styles from './UserLoginPage.module.css';
import PalisadoesImage from 'assets/images/palisadoes_logo.png';
import TalawaImage from 'assets/talawa-logo-200x200.png';
import Login from 'components/UserPortal/Login/Login';
import Register from 'components/UserPortal/Register/Register';

export default function UserLoginPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const currentLanguageCode = cookies.get('i18next') || 'en';

  const currentLanguage = languages.find(
    (language) => language.code === currentLanguageCode
  )?.name;

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
      </div>
      <div className={`${styles.contentContainer} py-5`}>
        <DropdownButton title={currentLanguage} variant="outline-success">
          {languages.map((language, index: number) => (
            <Dropdown.Item
              key={index}
              onClick={() => i18next.changeLanguage(language.code)}
              disabled={currentLanguageCode === language.code}
              data-testid={`changeLanguageBtn${index}`}
            >
              <span className={`fi fi-${language.country_code} mr-2`}></span>
              {language.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <img
          className={styles.talawaImage}
          src={TalawaImage}
          alt="Talawa Branding"
        />
        {currentMode === 'login' ? (
          <Login {...loginRegisterProps} />
        ) : (
          <Register {...loginRegisterProps} />
        )}
      </div>
    </div>
  );
}
