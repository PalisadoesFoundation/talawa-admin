import React, { type FC } from 'react';
import styles from './GeneralSettings.module.css';
import DeleteOrg from './DeleteOrg/DeleteOrg';
import OrgUpdate from './OrgUpdate/OrgUpdate';
import { useTranslation } from 'react-i18next';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';

interface InterfaceGeneralSettingsProps {
  orgId: string;
}

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
