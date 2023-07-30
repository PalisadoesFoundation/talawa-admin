import React from 'react';
import { Dropdown } from 'react-bootstrap';
import i18next from 'i18next';
import styles from './ChangeLanguageDropdown.module.css';
import { languages } from 'utils/languages';
import cookies from 'js-cookie';

interface InterfaceChangeLanguageDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

export const changeLanguage = async (languageCode: string): Promise<void> => {
  await i18next.changeLanguage(languageCode);
};

const ChangeLanguageDropDown = (
  props: InterfaceChangeLanguageDropDownProps
): JSX.Element => {
  const currentLanguageCode = cookies.get('i18next') || 'en';

  return (
    <Dropdown
      title="Change Langauge"
      className={`${styles.parentContainer} ${
        props?.parentContainerStyle ?? ''
      }`}
      data-testid="language-dropdown-container"
    >
      <Dropdown.Toggle
        variant="outline-success"
        className={`${props?.btnStyle ?? ''}`}
        data-testid="language-dropdown-btn"
      >
        {languages.map((language, index: number) => (
          <span
            key={`dropdown-btn-${index}`}
            data-testid={`dropdown-btn-${index}`}
          >
            {currentLanguageCode === language.code ? (
              <span className={`${props?.btnTextStyle ?? ''}`}>
                <span className={`fi fi-${language.country_code} me-2`}></span>
                {language.name}
              </span>
            ) : null}
          </span>
        ))}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((language, index: number) => (
          <Dropdown.Item
            key={`dropdown-item-${index}`}
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={async (): Promise<void> => changeLanguage(language.code)}
            disabled={currentLanguageCode === language.code}
            data-testid={`change-language-btn-${language.code}`}
          >
            <span className={`fi fi-${language.country_code} me-2`}></span>
            {language.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChangeLanguageDropDown;
