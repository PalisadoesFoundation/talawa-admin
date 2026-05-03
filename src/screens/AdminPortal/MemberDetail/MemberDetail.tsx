/**
 * MemberDetail — user settings page at /user/settings
 *
 * Tabs: Overview, Security, Organizations, Events, Tags
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';
import UserContactDetails from './UserContactDetails';
import UserOrganizations from 'components/UserDetails/UserOrganizations';
import UserEvents from 'components/UserDetails/UserEvents';
import UserTags from 'components/UserDetails/UserTags';
import { useParams } from 'react-router-dom';
import Security from './Security';
import useLocalStorage from 'utils/useLocalstorage';
import OAuthAccountsSettings from 'components/Auth/OAuthAccountsSettings/OAuthAccountsSettings';
import styles from './MemberDetail.module.css';

const MemberDetail: React.FC = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const storedUserId = getItem<string>('userId');
  const { userId: paramUserId, orgId } = useParams<{
    userId?: string;
    orgId?: string;
  }>();
  const userId = paramUserId ?? storedUserId;
  const { t: tCommon } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('overview');

  if (!userId) {
    return <div>{tCommon('noUserId')}</div>;
  }

  const tabItems = [
    { key: 'overview', label: tCommon('overview') },
    { key: 'security', label: tCommon('security') },
    { key: 'organizations', label: tCommon('organizations') },
    { key: 'events', label: tCommon('events') },
    { key: 'tags', label: tCommon('tags') },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{tCommon('settings')}</h1>
          <p className="page-subtitle">{tCommon('manageYourProfile')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {tabItems.map((item) => (
          <button
            key={item.key}
            className={`tab${activeTab === item.key ? ' active' : ''}`}
            role="tab"
            aria-selected={activeTab === item.key}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && <UserContactDetails id={userId} />}
        {activeTab === 'security' && (
          <div className={styles.securityStack}>
            <Security />
            <OAuthAccountsSettings id={userId} />
          </div>
        )}
        {activeTab === 'organizations' && <UserOrganizations />}
        {activeTab === 'events' && (
          <UserEvents orgId={orgId} userId={userId} />
        )}
        {activeTab === 'tags' && <UserTags id={userId} />}
      </div>
    </LocalizationProvider>
  );
};

export default MemberDetail;
