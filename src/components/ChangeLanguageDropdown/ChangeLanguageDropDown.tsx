/**
 * Component: ChangeLanguageDropDown
 *
 * A React component that provides a dropdown menu for changing the application's language.
 * It integrates with i18next for internationalization and updates the user's language preference
 * on the server using a GraphQL mutation.
 *
 * @remarks
 * - The component uses `react-bootstrap` for the dropdown UI.
 * - The current language is determined using a cookie (`i18next`).
 * - Updates the user's language preference on the server using the `UPDATE_CURRENT_USER_MUTATION`.
 * - If a user avatar exists in localStorage, it is processed and included in the mutation.
 * - Displays a toast notification if the user ID is not found.
 */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import i18next from 'i18next';
import { languages } from 'utils/languages';
import styles from 'style/app-fixed.module.css';
import cookies from 'js-cookie';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceDropDownProps } from 'types/DropDown/interface';
import { urlToFile } from 'utils/urlToFile';
import { toast } from 'react-toastify';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

const ChangeLanguageDropDown = (props: InterfaceDropDownProps): JSX.Element => {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const { getItem } = useLocalStorage();
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');

  const userId = getItem('id');
  const userImage = getItem('UserImage');
  const isLoggedIn = getItem('IsLoggedIn') === 'TRUE';
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);

  const changeLanguage = async (languageCode: string): Promise<void> => {
    if (!isLoggedIn) {
      await i18next.changeLanguage(languageCode);
      cookies.set('i18next', languageCode);
      return;
    }

    if (!userId) {
      toast.error('User not found');
      return;
    }

    let avatarFile: File | null = null;

    // Only process avatar if userImage exists in localStorage
    if (userImage) {
      try {
        if (typeof userImage === 'string') {
          avatarFile = await urlToFile(userImage);
        }
      } catch (error) {
        console.error('Error processing avatar:', error);
      }
    }
    const input = {
      naturalLanguageCode: languageCode,
      ...(avatarFile && { avatar: avatarFile }),
    };

    try {
      await updateUser({
        variables: { input },
      });
    } catch (error) {
      console.error('Error in changing language', error);
    } finally {
      await i18next.changeLanguage(languageCode);
      cookies.set('i18next', languageCode);
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Dropdown
        title={tCommon('changeLanguage')}
        data-testid="language-dropdown-container"
      >
        <Dropdown.Toggle
          className={styles.changeLanguageBtn}
          data-testid="language-dropdown-btn"
        >
          {languages.map((language, index: number) => (
            <span
              key={`dropdown-btn-${index}`}
              data-testid={`dropdown-btn-${index}`}
            >
              {currentLanguageCode === language.code && (
                <span className={`${props?.btnTextStyle ?? ''}`}>
                  <span
                    className={`fi fi-${language.country_code} me-2`}
                  ></span>
                  {language.name}
                </span>
              )}
            </span>
          ))}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {languages.map((language, index: number) => (
            <Dropdown.Item
              key={`dropdown-item-${index}`}
              className="dropdown-item"
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
    </ErrorBoundaryWrapper>
  );
};

export default ChangeLanguageDropDown;
