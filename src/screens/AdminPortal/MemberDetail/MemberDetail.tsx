/**
 * MemberDetail component
 *
 * Renders a detailed view of a member’s profile, allowing users to view
 * and update personal and contact information via tab-based navigation.
 *
 * Tabs include:
 * - Overview: Shows the member's contact details.
 * - Organizations: Lists organizations the member belongs to.
 * - Events: Shows events associated with the member.
 * - Tags: Displays tags assigned to the member.
 * - Security: Allows password updates.
 *
 * The component determines which member to display from the URL parameters
 * `orgId` and `userId` using `useParams`. The `userId` is passed to child
 * components that require it (e.g., `UserContactDetails` and `UserTags`).
 *
 * The expected route format is:
 * ```
 * /admin/member/:orgId/:userId
 * ```
 *
 * @returns JSX.Element representing the member detail view.
 *
 * @remarks
 * - Uses React state to manage the active tab.
 * - Uses `react-i18next` for localization.
 * - Uses MUI `LocalizationProvider` and `AdapterDayjs` for date pickers.
 * - Child components include `UserContactDetails`, `UserOrganizations`,
 *   `UserEvents`, and `UserTags`.
 *
 * @example
 * ```tsx
 * // URL: /admin/member/123/456
 * <MemberDetail />
 * ```
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

const MemberDetail: React.FC = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const storedUserId = getItem<string>('userId');
  const { userId: paramUserId, orgId } = useParams<{
    userId?: string;
    orgId?: string;
  }>();
  const userId = paramUserId ?? storedUserId;
  const { t: tCommon } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(tCommon('overview'));
  if (!userId) {
    return <div>{tCommon('noUserId')}</div>;
  }

  const tabItems = [
    { key: tCommon('overview'), label: tCommon('overview') },
    { key: tCommon('security'), label: tCommon('security') },
    { key: tCommon('organizations'), label: tCommon('organizations') },
    { key: tCommon('events'), label: tCommon('events') },
    { key: tCommon('tags'), label: tCommon('tags') },
  ];

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href={`/admin/orgpeople/${orgId ?? ''}`}>{tCommon('members') || 'Members'}</a>
          {' \u203A '}{tCommon('overview')}
        </nav>

        {/* Profile Header */}
        <div
          className="profile-header"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div
            className="profile-avatar-lg"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--green-500), var(--green-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {/* Avatar initials placeholder */}
          </div>
          <div className="profile-info" style={{ flex: 1, minWidth: '200px' }}>
            <div className="profile-name" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '2px' }}>
              {tCommon('overview')}
            </div>
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

        {/* Tab Content */}
        <div className="card">
          <div className="card-body">
            {activeTab === tCommon('overview') && (
              <UserContactDetails id={userId} />
            )}
            {activeTab === tCommon('security') && (
              <div>
                <Security />
                <OAuthAccountsSettings id={userId} />
              </div>
            )}
            {activeTab === tCommon('organizations') && <UserOrganizations />}
            {activeTab === tCommon('events') && (
              <UserEvents orgId={orgId} userId={userId} />
            )}
            {activeTab === tCommon('tags') && <UserTags id={userId} />}
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default MemberDetail;
