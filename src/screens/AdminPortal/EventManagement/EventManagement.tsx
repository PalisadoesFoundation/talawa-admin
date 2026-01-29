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
 * - Determines user roles (SUPERADMIN, ADMIN, USER) based on local storage.
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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navigate, useNavigate, useParams } from 'react-router';
import { FaChevronLeft, FaTasks } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import EventRegistrantsIcon from 'assets/svgs/people.svg?react';
import { BsPersonCheck } from 'react-icons/bs';
import { IoMdStats, IoIosHand } from 'react-icons/io';
import EventAgendaItemsIcon from 'assets/svgs/agenda-items.svg?react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import Button from 'shared-components/Button';
import styles from './EventManagement.module.css';

import EventDashboard from 'components/AdminPortal/EventManagement/Dashboard/EventDashboard';
import EventActionItems from 'components/AdminPortal/EventManagement/EventActionItems/EventActionItems';
import VolunteerContainer from 'screens/AdminPortal/EventVolunteers/VolunteerContainer';
import EventAgendaItems from 'components/AdminPortal/EventManagement/EventAgendaItems/EventAgendaItems';
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
  icon: JSX.Element;
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
  const superAdmin = getItem('SuperAdmin');
  const adminFor: string | string[] = getItem('AdminFor') || [];
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
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
      icon: <MdOutlineDashboard size={18} className="me-1" />,
      component: (
        <div data-testid="eventDashboardTab" className="mx-4 p-4 pt-2 mt-5">
          <EventDashboard eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'registrants',
      icon: <EventRegistrantsIcon width={23} height={23} className="me-1" />,
      component: (
        <div data-testid="eventRegistrantsTab" className="mx-4 p-4 pt-2 mt-5">
          <EventRegistrants />
        </div>
      ),
    },
    {
      value: 'attendance',
      icon: <BsPersonCheck size={20} className="me-1" />,
      component: (
        <div data-testid="eventAttendanceTab" className="mx-4 p-4 pt-2 mt-5">
          <EventAttendance />
        </div>
      ),
    },
    {
      value: 'agendas',
      icon: <EventAgendaItemsIcon width={23} height={23} className="me-1" />,
      component: (
        <div data-testid="eventAgendasTab" className="mx-4 p-4 pt-2 mt-5">
          <EventAgendaItems eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'actions',
      icon: <FaTasks size={16} className="me-1" />,
      component: (
        <div data-testid="eventActionsTab" className="mx-4 p-4 pt-2">
          <EventActionItems eventId={eventId} />
        </div>
      ),
    },
    {
      value: 'volunteers',
      icon: <IoIosHand size={20} className="me-1" />,
      component: (
        <div data-testid="eventVolunteersTab" className="mx-4 p-4 pt-2">
          <VolunteerContainer />
        </div>
      ),
    },
    {
      value: 'statistics',
      icon: <IoMdStats size={20} className="me-2" />,
      component: (
        <div data-testid="eventStatsTab" className="mx-4 p-4 pt-2 mt-5"></div>
      ),
    },
  ];

  /**
   * Renders a button for each tab with the appropriate icon and label.
   *
   * @param value - The tab value
   * @param icon - The icon to display for the tab
   * @returns JSX.Element - The rendered button component
   */
  const renderButton = ({ value, icon }: InterfaceTabConfig): JSX.Element => {
    const selected = tab === value;
    const variant = selected ? 'success' : 'light';
    const translatedText = t(value);

    const className = selected
      ? `px-4 d-flex align-items-center rounded-3 shadow-sm ${styles.eventManagementSelectedBtn}`
      : `text-secondary bg-white px-4 d-flex align-items-center rounded-3 shadow-sm ${styles.eventManagementBtn}`;
    const props = {
      role: 'tab',
      variant,
      className,
      onClick: () => setTab(value),
      'data-testid': `${value}Btn`,
    };

    return (
      <Button key={value} {...props}>
        {icon}
        {translatedText}
      </Button>
    );
  };

  const handleBack = (): void => {
    if (userRole === 'USER') {
      navigate(`/user/events/${orgId}`);
    } else {
      navigate(`/admin/orgevents/${orgId}`);
    }
  };

  const currentTab = eventDashboardTabs.find((t) => t.value === tab);

  return (
    <div className="d-flex flex-column bg-white rounded-4 min-vh-75">
      <Row className="mx-3 mt-4">
        <Col>
          <div className="d-none d-md-flex gap-3">
            <Button
              size="sm"
              variant="light"
              className="d-flex text-secondary bg-white align-items-center"
              aria-label={t('backToEvents')}
              onClick={handleBack}
            >
              <FaChevronLeft
                cursor={'pointer'}
                data-testid="backBtn"
                aria-hidden="true"
              />
            </Button>
            {eventDashboardTabs.map(renderButton)}
          </div>

          <Dropdown
            className="d-md-none"
            data-testid="tabsDropdownContainer"
            drop="down"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              data-testid="tabsDropdownToggle"
            >
              <span className="me-1">{t(tab)}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Render dropdown items for each settings category */}
              {eventDashboardTabs.map(({ value, icon }, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setTab(value)}
                  className={`d-flex gap-2 ${tab === value ? 'text-secondary' : ''}`}
                  data-testid={`${value}DropdownItem`}
                >
                  {icon} {t(value)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Render content based on the selected tab */}
      {currentTab?.component}
    </div>
  );
};

export default EventManagement;
