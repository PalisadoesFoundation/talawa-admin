/**
 * Component: ChangeLanguageDropDown
 *
 * A React component that provides a dropdown menu for changing the application's language.
 * It integrates with i18next for internationalization and updates the user's language preference
 * on the server using a GraphQL mutation.
 *
 * @param props - Props for the dropdown, see {@link InterfaceDropDownProps}
 * @returns JSX.Element
 * @remarks
 * - The component uses shared `DropDownButton` for the dropdown UI.
 * - The current language is determined using a cookie (`i18next`).
 * - Updates the user's language preference on the server using the `UPDATE_CURRENT_USER_MUTATION`.
 * - If a user avatar exists in localStorage, it is processed and included in the mutation.
 * - Displays a toast notification if the user ID is not found.
 */
import React, { useMemo } from 'react';
import i18next from 'i18next';
import { languages } from 'utils/languages';
import styles from './ChangeLanguageDropDown.module.css';
import cookies from 'js-cookie';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceDropDownProps } from 'types/DropDown/interface';
import { urlToFile } from 'utils/urlToFile';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import DropDownButton from 'shared-components/DropDownButton';

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
      NotificationToast.error(tCommon('userNotFound'));
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
        NotificationToast.error(tCommon('avatarProcessingError'));
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

  // Build dropdown options from languages
  const languageOptions = useMemo(
    () =>
      languages.map((language) => ({
        value: language.code,
        label: language.name,
      })),
    [],
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <DropDownButton
        id="language-dropdown"
        options={languageOptions}
        selectedValue={currentLanguageCode}
        onSelect={changeLanguage}
        ariaLabel={tCommon('changeLanguage')}
        dataTestIdPrefix="language-dropdown"
        parentContainerStyle={props?.parentContainerStyle}
        btnStyle={`${styles.changeLanguageBtn} ${props?.btnStyle ?? ''}`}
        icon={
          languages.find((lang) => lang.code === currentLanguageCode) && (
            <span
              className={`fi fi-${languages.find((lang) => lang.code === currentLanguageCode)?.country_code} me-2`}
            ></span>
          )
        }
      />
    </ErrorBoundaryWrapper>
  );
};

export default ChangeLanguageDropDown;
