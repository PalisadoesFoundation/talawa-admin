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
 * - `useNavigate`: Enables navigation to other routes.
 *
 * ## Methods:
 * - `renderButton`: Renders a button for each tab with the appropriate icon and label.
 * - `handleBack`: Navigates back to the organization page.
 *
 * @returns JSX.Element - The rendered `VolunteerManagement` component.
 */
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navigate, useNavigate, useParams } from 'react-router';
import { FaChevronLeft, FaTasks } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared-components/Button';
import { Dropdown } from 'react-bootstrap';
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
    icon: <TbCalendarEvent size={21} className="me-1" />,
  },
  {
    value: 'invitations',
    icon: <FaRegEnvelopeOpen size={18} className="me-1" />,
  },
  { value: 'actions', icon: <FaTasks size={18} className="me-2" /> },
  { value: 'groups', icon: <FaUserGroup size={18} className="me-2" /> },
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

  // Hook for navigation
  const navigate = useNavigate();

  // State hook for managing the currently selected tab
  const [tab, setTab] = useState<TabOptions>('upcomingEvents');

  /**
   * Renders a button for each tab with the appropriate icon and label.
   *
   * @param value - The tab value
   * @param icon - The icon to display for the tab
   * @returns JSX.Element - The rendered button component
   */
  const renderButton = ({
    value,
    icon,
  }: {
    value: TabOptions;
    icon: React.ReactNode;
  }): JSX.Element => {
    const selected = tab === value;
    const variant = selected ? 'success' : 'light';
    const translatedText = t(value);

    const className = selected
      ? `rounded-3 shadow-sm ${styles.activeTab}`
      : `rounded-3 shadow-sm ${styles.inActiveTab}`;
    const props = {
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
    navigate(`/user/organization/${orgId}`);
  };

  return (
    <div className="d-flex flex-column">
      <Row className="mt-4">
        <Col>
          <div className="d-none d-md-flex gap-3">
            <Button
              size="sm"
              variant="light"
              className="d-flex text-secondary bg-white align-items-center px-3 shadow-sm rounded-3"
              onClick={handleBack}
            >
              <FaChevronLeft
                cursor={'pointer'}
                data-testid="chevron-left-icon"
              />
            </Button>
            {volunteerDashboardTabs.map(renderButton)}
          </div>

          <Dropdown
            className="d-md-none"
            data-testid="tabsDropdownContainer"
            drop="down"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className={styles.dropdown}
              data-testid="tabsDropdownToggle"
            >
              <span className="me-1">{t(tab)}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Render dropdown items for each settings category */}
              {volunteerDashboardTabs.map(({ value, icon }, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setTab(value)}
                  className={`d-flex gap-2 ${tab === value && 'text-secondary'}`}
                >
                  {icon} {t(value)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Row className="mt-3">
          <hr />
        </Row>
      </Row>

      {/* Render content based on the selected settings category */}
      {(() => {
        switch (tab) {
          case 'upcomingEvents':
            return (
              <div
                data-testid="upcomingEventsTab"
                // className="bg-white p-4 pt-2 rounded-4 shadow"
              >
                <UpcomingEvents />
              </div>
            );
          case 'invitations':
            return (
              <div
                data-testid="invitationsTab"
                // className="bg-white p-4 pt-2 rounded-4 shadow"
              >
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
