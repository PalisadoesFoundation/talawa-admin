import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from '../../../style/app.module.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaTasks } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import { TbCalendarEvent } from 'react-icons/tb';
import { FaRegEnvelopeOpen, FaUserGroup } from 'react-icons/fa6';
import UpcomingEvents from './UpcomingEvents/UpcomingEvents';
import Invitations from './Invitations/Invitations';
import Actions from './Actions/Actions';
import Groups from './Groups/Groups';

/**
 * List of tabs for the volunteer dashboard.
 *
 * Each tab is associated with an icon and value.
 */
const volunteerDashboardTabs: {
  value: TabOptions;
  icon: JSX.Element;
}[] = [
  {
    value: 'upcomingEvents',
    icon: <TbCalendarEvent size={21} className={styles['me-1']} />,
  },
  {
    value: 'invitations',
    icon: <FaRegEnvelopeOpen size={18} className={styles['me-1']} />,
  },
  {
    value: 'actions',
    icon: <FaTasks size={18} className={styles['me-2']} />,
  },
  {
    value: 'groups',
    icon: <FaUserGroup size={18} className={styles['me-2']} />,
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
  const { t } = useTranslation('translation', {
    keyPrefix: 'userVolunteer',
  });

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
      ? 'px-4 d-flex align-items-center rounded-3 shadow-sm'
      : 'text-secondary bg-white px-4 d-flex align-items-center rounded-3 shadow-sm';
    const props = {
      variant,
      className,
      style: { height: '2.5rem' },
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
    <div className={`${styles['d-flex']} ${styles['flex-column']}`}>
      <Row className={`${styles.row} ${styles['mt-4']}`}>
        <Col className={styles.rowChild}>
          <div
            className={`${styles['d-none']} ${styles['d-md-flex']} ${styles['gap-3']}`}
          >
            <Button
              size="sm"
              variant="light"
              className={`${styles['d-flex']} ${styles['text-secondary']} ${styles['bg-white']} ${styles['align-items-center']} ${styles['px-3']} ${styles['shadow-sm']} ${styles['rounded-3']}`}
            >
              <FaChevronLeft
                cursor={'pointer'}
                data-testid="backBtn"
                onClick={handleBack}
              />
            </Button>
            {volunteerDashboardTabs.map(renderButton)}
          </div>

          <Dropdown
            className={styles['d-md-none']}
            data-testid="tabsDropdownContainer"
            drop="down"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              data-testid="tabsDropdownToggle"
            >
              <span className={styles['me-1']}>{t(tab)}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Render dropdown items for each settings category */}
              {volunteerDashboardTabs.map(({ value, icon }, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setTab(value)}
                  className={`${styles['d-flex']} ${styles['gap-2']} ${tab === value && styles['text-secondary']}`}
                >
                  {icon} {t(value)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Row className={`${styles.row} ${styles['mt-3']}`}>
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
