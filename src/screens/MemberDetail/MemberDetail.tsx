/**
 * MemberDetail component
 *
 * Renders a detailed view of a member’s profile, allowing users to view
 * and update personal and contact information.
 *
 * Features include avatar upload, form validation, and tab-based navigation
 * for overview, organizations, events, and tags.
 *
 * @param props - Component props.
 * Optional {@link MemberDetailProps.id | id} may be provided to fetch
 * and display member details.
 *
 * @returns The rendered MemberDetail component.
 *
 * @remarks
 * - Uses Apollo Client hooks for fetching and updating user data.
 * - Provides form validation for sensitive fields such as passwords and avatar uploads.
 * - Uses react-bootstrap and MUI date pickers for UI elements.
 * - Supports localization via react-i18next.
 *
 * @example
 * ```tsx
 * <MemberDetail id="12345" />
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
import { MemberDetailProps } from 'types/AdminPortal/MemberDetail/type';

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(tCommon('overview'));

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
          {activeTab === tCommon('overview') && <UserContactDetails id={id} />}
          {activeTab === tCommon('organizations') && <UserOrganizations />}
          {activeTab === tCommon('events') && <UserEvents />}
          {activeTab === tCommon('tags') && <UserTags />}
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default MemberDetail;
