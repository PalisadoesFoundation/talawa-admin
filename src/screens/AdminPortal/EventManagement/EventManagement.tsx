/**
 * EventManagement — main event dashboard with tabbed navigation.
 */
import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import EventDashboard from 'components/AdminPortal/EventManagement/Dashboard/EventDashboard';
import EventActionItems from 'components/AdminPortal/EventManagement/EventActionItems/EventActionItems';
import VolunteerContainer from 'screens/AdminPortal/EventVolunteers/VolunteerContainer';
import EventAgenda from 'components/AdminPortal/EventManagement/EventAgenda/EventAgenda';
import useLocalStorage from 'utils/useLocalstorage';
import EventAttendance from 'components/AdminPortal/EventManagement/EventAttendance/Attendance/EventAttendance';
import EventRegistrants from 'components/AdminPortal/EventManagement/EventRegistrant/EventRegistrants';
import styles from './EventManagement.module.css';

type TabOptions =
  | 'dashboard'
  | 'registrants'
  | 'attendance'
  | 'agendas'
  | 'actions'
  | 'volunteers';

interface InterfaceTabConfig {
  value: TabOptions;
  component: JSX.Element;
}

const EventManagement = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventManagement' });
  const { getItem } = useLocalStorage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabOptions>('dashboard');
  const { eventId, orgId } = useParams();

  if (!eventId || !orgId) {
    return <Navigate to={'/admin/orglist'} />;
  }

  const userRoleValue = (getItem('role') as string | null) ?? '';
  const normalizedRole = userRoleValue.toLowerCase();
  const userRole =
    normalizedRole === 'administrator' || normalizedRole === 'superuser'
      ? 'ADMIN'
      : 'USER';

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
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('dashboard')}</h1>
          <p className="page-subtitle">{t('events')}</p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
            data-testid="backBtn"
          >
            &larr; {t('backToEvents') || 'Back to Events'}
          </button>
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

      {/* Tab content */}
      <div className={styles.tabContent}>{currentTab?.component}</div>
    </div>
  );
};

export default EventManagement;
