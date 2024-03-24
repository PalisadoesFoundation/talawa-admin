import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './UserProfileSettings.module.css';

const OtherSettings: React.FC = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings',
  });
  return (
    <Card border="0" className="rounded-4 mb-4">
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{t('otherSettings')}</div>
      </div>
      <Card.Body className={styles.cardBody}>
        <Form.Label className={`text-secondary fw-bold ${styles.cardLabel}`}>
          {t('changeLanguage')}
        </Form.Label>
        <ChangeLanguageDropDown />
      </Card.Body>
    </Card>
  );
};

export default OtherSettings;
