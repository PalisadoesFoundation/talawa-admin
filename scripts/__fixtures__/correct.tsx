import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from '../../src/shared-components/NotificationToast/NotificationToast';
import Button from '../../src/shared-components/Button/Button';

// Single component containing translated text, attrs, and toasts
export function CorrectFixture() {
  const { t } = useTranslation();

  React.useEffect(() => {
    NotificationToast.error(t('errors.somethingWrong'));
    NotificationToast.success(t('success.operationCompleted'));
    NotificationToast.warning(t('warnings.checkInput'));
    NotificationToast.info(t('info.updateAvailable'));
  }, [t]);

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <Button>{t('common.clickMe')}</Button>
      <p>{t('dashboard.description')}</p>
      <input
        placeholder={t('form.enterName')}
        title={t('form.nameFieldTitle')}
        aria-label={t('form.nameInputLabel')}
        aria-placeholder={t('form.startTyping')}
        alt={t('form.profilePicture')}
      />
      <select>
        <option label={t('form.selectOption')}>{t('form.default')}</option>
      </select>
    </div>
  );
}
