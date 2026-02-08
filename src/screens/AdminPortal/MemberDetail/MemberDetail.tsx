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
import styles from './MemberDetail.module.css';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';

import PeopleTabNavbarButton from 'shared-components/PeopleTabNavbarButton/PeopleTabNavbarButton';
import UserContactDetails from './UserContactDetails';
import UserOrganizations from 'components/UserDetails/UserOrganizations';
import UserEvents from 'components/UserDetails/UserEvents';
import UserTags from 'components/UserDetails/UserTags';
import { useParams } from 'react-router-dom';

const MemberDetail: React.FC = (): JSX.Element => {
  const { userId } = useParams<{ userId: string }>();
  const { t: tCommon } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(tCommon('overview'));
  if (!userId) {
    return <div>{tCommon('noUserId')}</div>;
  }
  return (
    <div className={styles.peopleTabComponent}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={styles.peopleTabNavbarButtonHeader}>
          <PeopleTabNavbarButton
            title={tCommon('overview')}
            icon={'/images/svg/material-symbols_dashboard-outline.svg'}
            isActive={activeTab === tCommon('overview')}
            action={() => setActiveTab(tCommon('overview'))}
          />
          <PeopleTabNavbarButton
            title={tCommon('organizations')}
            icon={'/images/svg/octicon_organization-24.svg'}
            isActive={activeTab === tCommon('organizations')}
            action={() => setActiveTab(tCommon('organizations'))}
          />
          <PeopleTabNavbarButton
            title={tCommon('events')}
            icon={'/images/svg/mdi_events.svg'}
            isActive={activeTab === tCommon('events')}
            action={() => setActiveTab(tCommon('events'))}
          />
          <PeopleTabNavbarButton
            title={tCommon('tags')}
            icon={'/images/svg/bi_tags.svg'}
            isActive={activeTab === tCommon('tags')}
            action={() => setActiveTab(tCommon('tags'))}
          />
        </div>

        <div className={styles.peopleTabComponentSection}>
          {activeTab === tCommon('overview') && (
            <UserContactDetails id={userId} />
          )}
          {activeTab === tCommon('organizations') && <UserOrganizations />}
          {activeTab === tCommon('events') && <UserEvents />}
          {activeTab === tCommon('tags') && <UserTags id={userId} />}
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default MemberDetail;
