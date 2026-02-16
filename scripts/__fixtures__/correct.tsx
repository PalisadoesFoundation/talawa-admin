import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from '../../src/shared-components/NotificationToast/NotificationToast';
import Button from '../../src/shared-components/Button/Button';

// Single component containing translated text, attrs, and toasts
export function CorrectFixture() {
  const { t } = useTranslation();

  React.useEffect(() => {
    NotificationToast.error(t('errors.somethingWrong')); // i18n-ignore-line
    NotificationToast.success(t('success.operationCompleted')); // i18n-ignore-line
    NotificationToast.warning(t('warnings.checkInput')); // i18n-ignore-line
    NotificationToast.info(t('info.updateAvailable')); // i18n-ignore-line
  }, [t]);

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1> {/* i18n-ignore-line */}
      <Button>{t('common.clickMe')}</Button> {/* i18n-ignore-line */}
      <p>{t('dashboard.description')}</p> {/* i18n-ignore-line */}
      <input
        placeholder={t('form.enterName')} // i18n-ignore-line
        title={t('form.nameFieldTitle')} // i18n-ignore-line
        aria-label={t('form.nameInputLabel')} // i18n-ignore-line
        aria-placeholder={t('form.startTyping')} // i18n-ignore-line
        alt={t('form.profilePicture')} // i18n-ignore-line
      />
      <select>
        <option label={t('form.selectOption')}>{t('form.default')}</option>{' '}
        {/* i18n-ignore-line */}
      </select>
    </div>
  );
}
