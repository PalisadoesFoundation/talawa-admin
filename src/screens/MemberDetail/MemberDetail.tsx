/**
 * MemberDetail Component
 *
 * This component renders the detailed view of a member's profile, allowing users to view and update personal and contact information.
 * It includes features such as avatar upload, form validation, and dynamic dropdowns for various fields.
 *
 * @component
 * @param {MemberDetailProps} props - The props for the component.
 * @param {string} [props.id] - Optional member ID to fetch and display details.
 *
 * @returns {JSX.Element} The rendered MemberDetail component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` and `useMutation` hooks for fetching and updating user data.
 * - Includes form validation for fields like password and avatar upload.
 * - Utilizes `react-bootstrap` and `@mui/x-date-pickers` for UI components.
 * - Handles localization using `react-i18next`.
 *
 * @example
 * ```tsx
 * <MemberDetail id="12345" />
 * ```
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `react-bootstrap` for UI components.
 * - `@mui/x-date-pickers` for date selection.
 * - `react-toastify` for toast notifications.
 * - `dayjs` for date manipulation.
 *
 *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PeopleTabNavbarButton from 'shared-components/PeopleTabNavButton/PeopleTabNavButton';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import EventsIcon from 'assets/svgs/events.svg?react';
import TagsIcon from 'assets/svgs/tag.svg?react';
import UserContactDetails from './UserContactDetails';
import UserOrganizations from 'components/UserDetails/UserOrganizations';
import UserEvents from 'components/UserDetails/UserEvents';
import UserTags from 'components/UserDetails/UserTags';

type MemberDetailProps = { id?: string };

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const [activeTab, setActiveTab] = useState(tCommon('overview'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="d-flex gap-3 mb-3">
        <PeopleTabNavbarButton
          title={tCommon('overview')}
          icon={<DashboardIcon />}
          isActive={activeTab === tCommon('overview')}
          action={() => setActiveTab(tCommon('overview'))}
        />
        <PeopleTabNavbarButton
          title={tCommon('organizations')}
          icon={<BusinessIcon />}
          isActive={activeTab === tCommon('organizations')}
          action={() => setActiveTab(tCommon('organizations'))}
        />
        <PeopleTabNavbarButton
          title={tCommon('events')}
          icon={<EventsIcon />}
          isActive={activeTab === tCommon('events')}
          action={() => setActiveTab(tCommon('events'))}
        />
        <PeopleTabNavbarButton
          title={tCommon('tags')}
          icon={<TagsIcon />}
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
  );
};

export default MemberDetail;
