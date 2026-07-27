/**
 * `VolunteerManagement` component provides a tabbed interface for managing various aspects
 * of volunteer activities within an organization. It allows users to navigate between
 * different sections such as upcoming events, invitations, actions, and groups.
 *
 * ## Features:
 * - **Tabbed Navigation**: Users can switch between tabs to view and manage specific sections.
 * - **Responsive Design**: Includes a dropdown for smaller screens and buttons for larger screens.
 * - **Dynamic Content Rendering**: Displays content based on the selected tab.
 * - **Internationalization**: Supports translations for tab labels and content.
 *
 * ## Tabs:
 * - **Upcoming Events**: Displays a list of upcoming events for volunteers.
 * - **Invitations**: Manages volunteer invitations.
 * - **Actions**: Handles volunteer-related tasks and actions.
 * - **Groups**: Manages volunteer groups.
 *
 * ## Props:
 * - None
 *
 * ## State:
 * - `tab` (`TabOptions`): Tracks the currently selected tab.
 *
 * ## Hooks:
 * - `useTranslation`: For internationalization of tab labels and content.
 * - `useParams`: Extracts the organization ID from the URL.
 *
 * @returns JSX.Element - The rendered `VolunteerManagement` component.
 */
import React, { useState, useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import { FaTasks } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import DropDownButton from 'shared-components/DropDownButton';
import { TbCalendarEvent } from 'react-icons/tb';
import { FaRegEnvelopeOpen, FaUserGroup } from 'react-icons/fa6';
import UpcomingEvents from './UpcomingEvents/UpcomingEvents';
import Invitations from './Invitations/Invitations';
import Actions from './Actions/Actions';
import Groups from './Groups/Groups';
import styles from './VolunteerManagement.module.css';

const volunteerDashboardTabs: { value: TabOptions; icon: JSX.Element }[] = [
  {
    value: 'upcomingEvents',
    icon: <TbCalendarEvent size={21} className={styles.tabIcon} />,
  },
  {
    value: 'invitations',
    icon: <FaRegEnvelopeOpen size={18} className={styles.tabIcon} />,
  },
  {
    value: 'actions',
    icon: <FaTasks size={18} className={styles.tabIcon} />,
  },
  {
    value: 'groups',
    icon: <FaUserGroup size={18} className={styles.tabIcon} />,
  },
];

/**
 * Tab options for the volunteer management component.
 */
type TabOptions = 'upcomingEvents' | 'invitations' | 'actions' | 'groups';

/**
 * `VolunteerManagement` component handles the display and navigation of different event management sections.
 *
 * It provides a tabbed interface for:
 * - Viewing upcoming events to volunteer
 * - Managing volunteer requests
 * - Managing volunteer invitations
 * - Managing volunteer groups
 *
 * @returns JSX.Element - The `VolunteerManagement` component.
 */
const VolunteerManagement = (): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'userVolunteer' });

  // Extract organization ID from URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} />;
  }

  // State hook for managing the currently selected tab
  const [tab, setTab] = useState<TabOptions>('upcomingEvents');

  // Create options for DropDownButton
  const tabOptions = useMemo(
    () =>
      volunteerDashboardTabs.map(({ value, icon }) => ({
        value,
        label: t(value),
        icon,
      })),
    [t],
  );

  const isTabOption = (val: string): val is TabOptions =>
    volunteerDashboardTabs.some((option) => option.value === val);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('volunteerManagement')}</h1>
          <p className="page-subtitle">{t('volunteerTabs')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">{t('upcomingEvents')}</span>
            <div className="stat-card-icon green">
              <TbCalendarEvent size={18} />
            </div>
          </div>
          <div className="stat-card-value">--</div>
          <div className="stat-card-change">--</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">{t('invitations')}</span>
            <div className="stat-card-icon blue">
              <FaRegEnvelopeOpen size={18} />
            </div>
          </div>
          <div className="stat-card-value">--</div>
          <div className="stat-card-change">--</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">{t('groups')}</span>
            <div className="stat-card-icon purple">
              <FaUserGroup size={18} />
            </div>
          </div>
          <div className="stat-card-value">--</div>
          <div className="stat-card-change">--</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {volunteerDashboardTabs.map(({ value, icon }) => (
          <button
            key={value}
            className={`tab${tab === value ? ' active' : ''}`}
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            data-testid={`${value}Btn`}
          >
            {icon}
            {t(value)}
          </button>
        ))}
      </div>

      {/* Mobile dropdown fallback */}
      <div className={styles.mobileNav}>
        <DropDownButton
          id="tabs-dropdown"
          options={tabOptions}
          selectedValue={tab}
          onSelect={(val) => {
            if (isTabOption(val)) setTab(val);
          }}
          variant="success"
          btnStyle={styles.dropdown}
          dataTestIdPrefix="tabs-dropdown"
          buttonLabel={t(tab)}
          parentContainerStyle={styles.dropdownGrow}
          ariaLabel={t('volunteerTabs')}
        />
      </div>

      {/* Tab content */}
      {(() => {
        switch (tab) {
          case 'upcomingEvents':
            return (
              <div data-testid="upcomingEventsTab">
                <UpcomingEvents />
              </div>
            );
          case 'invitations':
            return (
              <div data-testid="invitationsTab">
                <Invitations />
              </div>
            );
          case 'actions':
            return (
              <div data-testid="actionsTab">
                <Actions />
              </div>
            );
          case 'groups':
            return (
              <div data-testid="groupsTab">
                <Groups />
              </div>
            );
        }
      })()}
    </div>
  );
};

export default VolunteerManagement;
