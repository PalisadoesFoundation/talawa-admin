import React from 'react';
import { useTranslation } from 'react-i18next';

function orgDelete(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgDelete',
  });

  return (
    <>
      <div id="OrgDelete" className="search-OrgDelete">
        {t('deleteOrg')}
      </div>
    </>
  );
}
export default orgDelete;
