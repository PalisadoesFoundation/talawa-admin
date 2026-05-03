/**
 * EventManagement Component
 *
 * This component serves as the main interface for managing events within the application.
 * It provides a tab-based navigation system to access various event management features
 * such as dashboard, registrants, attendance, agendas, actions, volunteers, and statistics.
 *
 * Features:
 * - Dynamically renders content based on the selected tab.
 * - Supports internationalization using the `useTranslation` hook.
 * - Determines user roles (ADMIN, USER) based on local storage.
 * - Redirects to the organization list if event or organization IDs are missing.
 * - Responsive design with buttons for desktop and dropdown for mobile views.
 *
 * Tabs:
 * - `dashboard`: Displays the event dashboard.
 * - `registrants`: Manages event registrants.
 * - `attendance`: Tracks event attendance.
 * - `agendas`: Manages event agenda items.
 * - `actions`: Displays organization action items.
 * - `volunteers`: Manages event volunteers.
 * - `statistics`: Placeholder for event statistics.
 *
 * Props:
 * - None
 *
 * State:
 * - `tab`: Tracks the currently selected tab.
 *
 * Hooks:
 * - `useTranslation`: For internationalization.
 * - `useLocalStorage`: For accessing local storage.
 * - `useNavigate`: For navigation.
 * - `useParams`: For extracting event and organization IDs from the URL.
 *
 * @returns The rendered EventManagement component.
 */
import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { FaChevronLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import DropDownButton from 'shared-components/DropDownButton';
import EventDashboard from 'components/AdminPortal/EventManagement/Dashboard/EventDashboard';
import EventActionItems from 'components/AdminPortal/EventManagement/EventActionItems/EventActionItems';
import VolunteerContainer from 'screens/AdminPortal/EventVolunteers/VolunteerContainer';
import EventAgenda from 'components/AdminPortal/EventManagement/EventAgenda/EventAgenda';
import useLocalStorage from 'utils/useLocalstorage';
import EventAttendance from 'components/AdminPortal/EventManagement/EventAttendance/Attendance/EventAttendance';
import EventRegistrants from 'components/AdminPortal/EventManagement/EventRegistrant/EventRegistrants';

/**
 * Tab options for the event management component.
 */
type TabOptions =
  | 'dashboard'
  | 'registrants'
  | 'attendance'
  | 'agendas'
  | 'actions'
  | 'volunteers'
  | 'statistics';

interface InterfaceTabConfig {
  value: TabOptions;
  component: JSX.Element;
}

const EventManagement = (): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'eventManagement' });

  // Custom hook for accessing local storage
  const { getItem } = useLocalStorage();

  // Hook for navigation
  const navigate = useNavigate();

  // State hook for managing the currently selected tab
  const [tab, setTab] = useState<TabOptions>('dashboard');

  // Extract event and organization IDs from URL parameters
  const { eventId, orgId } = useParams();
  if (!eventId || !orgId) {
    // Redirect if event ID or organization ID is missing
    return <Navigate to={'/admin/orglist'} />;
  }

  // Determine user role based on local storage
  const userRoleValue = (getItem('role') as string | null) ?? '';
  const normalizedRole = userRoleValue.toLowerCase();
  const userRole =
    normalizedRole === 'administrator' || normalizedRole === 'superuser'
      ? 'ADMIN'
      : 'USER';

  /**
   * List of tabs for the event dashboard.
   *
   * Each tab is associated with an icon, value, and its corresponding component.
   */
  const eventDashboardTabs: InterfaceTabConfig[] = [
    {
      value: 'dashboard',
      component: (
        <div data-testid="eventDashboardTab">
          <EventDashboard eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'registrants',
      component: (
        <div data-testid="eventRegistrantsTab">
          <EventRegistrants />
        </div>
      ),
    },
    {
      value: 'attendance',
      component: (
        <div data-testid="eventAttendanceTab">
          <EventAttendance />
        </div>
      ),
    },
    {
      value: 'agendas',
      component: (
        <div data-testid="eventAgendasTab">
          <EventAgenda eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'actions',
      component: (
        <div data-testid="eventActionsTab">
          <EventActionItems eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'volunteers',
      component: (
        <div data-testid="eventVolunteersTab">
          <VolunteerContainer />
        </div>
      ),
    },
    {
      value: 'statistics',
      component: (
        <div data-testid="eventStatsTab"></div>
      ),
    },
  ];

  const handleBack = (): void => {
    if (userRole === 'USER') {
      navigate(`/user/events/${orgId}`);
    } else {
      navigate(`/admin/orgevents/${orgId}`);
    }
  };

  const currentTab = eventDashboardTabs.find((t) => t.value === tab);

  return (
    <div>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleBack(); }}
          data-testid="backBtn"
        >
          {t('events') || 'Events'}
        </a>
        {' \u203A '}{t('dashboard')}
      </nav>

      {/* Event Header Card */}
      <div
        className="event-header-card"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '24px',
        }}
      >
        <div
          className="event-header-top"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1
              className="event-name"
              style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '6px' }}
            >
              {t('dashboard')}
            </h1>
            <div
              className="event-meta-row"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}
            >
              <span>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {' '}{t('dashboard')}
              </span>
            </div>
          </div>
          <div className="event-actions" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              data-testid="backToEventsBtn"
            >
              <FaChevronLeft aria-hidden="true" style={{ marginRight: '4px' }} />
              {t('backToEvents') || 'Back to Events'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {eventDashboardTabs.map(({ value }) => (
          <button
            key={value}
            className={`tab${tab === value ? ' active' : ''}`}
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            data-testid={`${value}Btn`}
          >
            {t(value)}
          </button>
        ))}
      </div>

      {/* Mobile dropdown fallback */}
      <DropDownButton
        id="tabs-dropdown"
        options={eventDashboardTabs.map(({ value }) => ({
          value,
          label: t(value),
        }))}
        selectedValue={tab}
        onSelect={(value) => setTab(value as TabOptions)}
        variant="success"
        dataTestIdPrefix="tabs"
        drop="down"
        parentContainerStyle="d-md-none"
        ariaLabel={t('selectTab')}
      />

      {/* Tab content in a card */}
      <div className="card" style={{ marginTop: '4px' }}>
        <div className="card-body">
          {currentTab?.component}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
