import React from 'react';
import { Dropdown } from 'react-bootstrap';
import i18next from 'i18next';
import { languages } from 'utils/languages';
import cookies from 'js-cookie';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';

const { getItem } = useLocalStorage();

interface InterfaceChangeLanguageDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

/**
 * A dropdown component that allows users to change the application's language.
 * It updates the user's language preference in the backend and stores the selection in cookies.
 *
 * @param props - The properties for customizing the dropdown component.
 * @param parentContainerStyle - Custom style for the dropdown container.
 * @param btnStyle - Custom style for the dropdown button.
 * @param btnTextStyle - Custom style for the button text.
 *
 * @returns JSX.Element - The rendered dropdown component for changing languages.
 */
const ChangeLanguageDropDown = (
  props: InterfaceChangeLanguageDropDownProps,
): JSX.Element => {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const userId = getItem('userId');
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  /**
   * Changes the application's language and updates the user's language preference.
   *
   * @param languageCode - The code of the language to switch to.
   */
  const changeLanguage = async (languageCode: string): Promise<void> => {
    if (userId) {
      try {
        await updateUser({
          variables: {
            appLanguageCode: languageCode,
          },
        });
        await i18next.changeLanguage(languageCode);
        cookies.set('i18next', languageCode);
      } catch (error) {
        console.log('Error in changing language', error);
      }
    }
  };

  return (
    <Dropdown
      title="Change Langauge"
      className={`${props?.parentContainerStyle ?? ''}`}
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
            className={`dropdown-item`}
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
