import React, { type FC } from 'react';
import styles from './GeneralSettings.module.css';
import DeleteOrg from './DeleteOrg/DeleteOrg';
import OrgUpdate from './OrgUpdate/OrgUpdate';
import { useTranslation } from 'react-i18next';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';

/**
 * Props for the {@link GeneralSettings} component.
 */
interface InterfaceGeneralSettingsProps {
  /**
   * The ID of the organization whose general settings are being managed.
   */
  orgId: string;
}

/**
 * `GeneralSettings` component provides the general settings page for an organization.
 * It renders cards for editing organization details, deleting the organization,
 * and changing the application language.
 */
const GeneralSettings: FC<InterfaceGeneralSettingsProps> = ({ orgId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'orgSettings' });

  return (
    <div className={styles.layout}>
      {/* Left: Edit Organization */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardHeaderTitle}>{t('editOrganization')}</h3>
        </div>
        <div className={styles.cardBody}>
          <OrgUpdate orgId={orgId} />
        </div>
      </div>

      {/* Right: Delete + Other Settings */}
      <div className={styles.rightColumn}>
        <DeleteOrg />

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardHeaderTitle}>{t('otherSettings')}</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.languageRow}>
              <label className={styles.languageLabel}>
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
