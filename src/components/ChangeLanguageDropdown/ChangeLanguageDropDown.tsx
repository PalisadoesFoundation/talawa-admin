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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';

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

  const languageOptions = useMemo(
    () =>
      languages.map((language) => ({
        value: language.code,
        label: (
          <span>
            <span className={`fi fi-${language.country_code} me-2`}></span>
            {language.name}
          </span>
        ),
        disabled: currentLanguageCode === language.code,
      })),
    [currentLanguageCode],
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <DropDownButton
        id="change-language-dropdown"
        options={languageOptions}
        selectedValue={currentLanguageCode}
        onSelect={changeLanguage}
        btnStyle={`${styles.changeLanguageBtn} ${props?.btnTextStyle ?? ''}`}
        ariaLabel={tCommon('changeLanguage')}
        dataTestIdPrefix="change-language"
        variant="light"
      />
    </ErrorBoundaryWrapper>
  );
};

export default ChangeLanguageDropDown;
