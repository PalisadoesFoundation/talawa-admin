import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Single component containing translated text, attrs, and toasts
export function CorrectFixture() {
  const { t } = useTranslation();

  React.useEffect(() => {
    toast.error(t('errors.somethingWrong'));
    toast.success(t('success.operationCompleted'));
    toast.warning(t('warnings.checkInput'));
    toast.info(t('info.updateAvailable'));
  }, [t]);

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button>{t('common.clickMe')}</button>
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
