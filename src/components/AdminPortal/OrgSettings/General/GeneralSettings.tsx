import React, { type FC } from 'react';
import styles from './GeneralSettings.module.css';
import DeleteOrg from './DeleteOrg/DeleteOrg';
import OrgUpdate from './OrgUpdate/OrgUpdate';
import { useTranslation } from 'react-i18next';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';

/**
 * Props for the `GeneralSettings` component.
 */
interface InterfaceGeneralSettingsProps {
  orgId: string;
}

/**
 * A component for displaying general settings for an organization.
 *
 * @param props - The properties passed to the component.
 * @returns The `GeneralSettings` component.
 */

const GeneralSettings: FC<InterfaceGeneralSettingsProps> = ({ orgId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'orgSettings' });

  return (
    <div
      className={styles.settingsBody}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '1rem' }}
    >
      <div style={{ flex: '1 1 58%', marginBottom: '1.5rem' }}>
        <div
          className={styles.mainCard}
          style={{
            borderRadius: '1rem',
            marginBottom: '1.5rem',
            boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
            border: '1px solid #e9ecef',
          }}
        >
          <div className={styles.deleteCardHeader}>
            <h5 className={styles.cardHeading} style={{ margin: 0, fontWeight: 600 }}>
              {t('editOrganization')}
            </h5>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.orgCardSettings}>
              <OrgUpdate orgId={orgId} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <DeleteOrg />
        <div
          style={{
            borderRadius: '1rem',
            boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
            border: '1px solid #e9ecef',
          }}
        >
          <div className={styles.deleteCardHeader}>
            <div className={styles.cardTitle}>
              <h5 className={styles.cardHeading} style={{ margin: 0, fontWeight: 600 }}>
                {t('otherSettings')}
              </h5>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.textBox}>
              <label style={{ color: '#6c757d', fontWeight: 'bold' }}>
                {t('changeLanguage')}
              </label>
              <ChangeLanguageDropDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
