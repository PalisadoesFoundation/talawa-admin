import React from 'react';
import styles from './UserNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-200x200.png';
import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useHistory } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';

function userNavbar(): JSX.Element {
  const history = useHistory();

  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });

  const { getItem } = useLocalStorage();

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    /* istanbul ignore next */
    cookies.get('i18next') || 'en'
  );

  /* istanbul ignore next */
  const handleLogout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    window.location.replace('/user');
  };

  const userName = getItem('name');

  return (
    <Navbar variant="dark" className={`${styles.colorPrimary}`}>
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            className={styles.talawaImage}
            src={TalawaImage}
            alt="Talawa Branding"
          />
          <b>{t('talawa')}</b>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown data-testid="languageDropdown" drop="start">
            <Dropdown.Toggle
              variant="white"
              id="dropdown-basic"
              data-testid="languageDropdownToggle"
              className={styles.colorWhite}
            >
              <LanguageIcon
                className={styles.colorWhite}
                data-testid="languageIcon"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((language, index: number) => (
                <Dropdown.Item
                  key={index}
                  onClick={async (): Promise<void> => {
                    setCurrentLanguageCode(language.code);
                    await i18next.changeLanguage(language.code);
                  }}
                  disabled={currentLanguageCode === language.code}
                  data-testid={`changeLanguageBtn${index}`}
                >
                  <span
                    className={`fi fi-${language.country_code} mr-2`}
                  ></span>{' '}
                  {language.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown drop="start">
            <Dropdown.Toggle
              variant="white"
              id="dropdown-basic"
              data-testid="logoutDropdown"
              className={styles.colorWhite}
            >
              <PermIdentityIcon
                className={styles.colorWhite}
                data-testid="personIcon"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                <b>{userName}</b>
              </Dropdown.ItemText>
              <Dropdown.Item
                onClick={() => history.push('/user/settings')}
                className={styles.link}
              >
                {t('settings')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} data-testid={`logoutBtn`}>
                {t('logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default userNavbar;
