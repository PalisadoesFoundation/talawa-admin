/**
 * @file OtherSettings.tsx
 * @description This file defines the `OtherSettings` component, which provides a user interface
 *              for managing miscellaneous settings, such as changing the application language.
 *              It utilizes React-Bootstrap components for styling and layout, and integrates
 *              internationalization support via the `react-i18next` library.
 *
 * @module OtherSettings
 *
 * @component
 * @example
 * // Usage example:
 * import OtherSettings from './OtherSettings';
 *
 * function App() {
 *   return <OtherSettings />;
 * }
 *
 * @dependencies
 * - `ChangeLanguageDropDown`: A dropdown component for selecting the application language.
 * - `react-i18next`: Used for internationalization and translation support.
 * - `react-bootstrap`: Provides UI components such as `Card` and `Form`.
 * - `app-fixed.module.css`: Contains custom styles for the component.
 *
 * @remarks
 * - The component uses the `useTranslation` hook to fetch localized strings with the key prefix `settings`.
 * - The `ChangeLanguageDropDown` component is rendered to allow users to change the application language.
 *
 * @returns {React.FC} A React functional component that renders the "Other Settings" card.
 */
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';

const OtherSettings: React.FC = () => {
  const { t } = useTranslation('translation');
  return (
    <Card border="0" className={styles.cardOtherSettings}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>{t('settings.otherSettings')}</div>
      </div>
      <Card.Body className={styles.otherSettingsCardBody}>
        <Form.Label className={`text-secondary fw-bold ${styles.cardLabel}`}>
          {t('settings.changeLanguage')}
        </Form.Label>
        <div className={styles.dropDownContainer}>
          <ChangeLanguageDropDown />
        </div>
      </Card.Body>
    </Card>
  );
};

export default OtherSettings;
