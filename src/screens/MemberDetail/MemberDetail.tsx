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
import styles from 'style/app-fixed.module.css';
import { languages } from 'utils/languages';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import PeopleTabNavbarButton from 'shared-components/PeopleTab/PeopleTabNavbarButton';

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
  const [activeTab, setActiveTab] = useState('Overview');
  console.log('MemberDetail ID:', id);

  const tabs = [
    {
      name: 'Overview',
      component: <UserContactDetails id={id} />,
      icon: <DashboardIcon />,
    },
    {
      name: 'Organizations',
      component: <UserOrganizations />,
      icon: <BusinessIcon />,
    },
    { name: 'Events', component: <UserEvents />, icon: <EventsIcon /> },
    { name: 'Tags', component: <UserTags />, icon: <TagsIcon /> },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="d-flex gap-3 mb-3">
        {tabs.map((tab) => (
          <PeopleTabNavbarButton
            key={tab.name}
            title={tab.name}
            icon={tab.icon}
            isActive={activeTab === tab.name}
            action={() => setActiveTab(tab.name)}
          />
        ))}
      </div>

      {/* Render below buttons */}
      <div className={styles.peopleTabComponentSection}>
        {tabs.find((t) => t.name === activeTab)?.component}
      </div>
    </LocalizationProvider>
  );
};

export const prettyDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
export const getLanguageName = (code: string): string => {
  let language = 'Unavailable';
  languages.map((data) => {
    if (data.code == code) {
      language = data.name;
    }
  });
  return language;
};

export default MemberDetail;
