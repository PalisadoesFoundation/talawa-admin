import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaTasks } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import EventRegistrantsIcon from 'assets/svgs/people.svg?react';
import { IoMdStats } from 'react-icons/io';
import EventAgendaItemsIcon from 'assets/svgs/agenda-items.svg?react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'react-bootstrap';
import EventDashboard from 'components/EventManagement/Dashboard/EventDashboard';
import OrganizationActionItems from 'screens/OrganizationActionItems/OrganizationActionItems';
import EventAgendaItems from 'components/EventManagement/EventAgendaItems/EventAgendaItems';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * List of tabs for the event dashboard.
 *
 * Each tab is associated with an icon and value.
 */
const eventDashboardTabs: {
  value: TabOptions;
  icon: JSX.Element;
}[] = [
  {
    value: 'dashboard',
    icon: <MdOutlineDashboard size={18} className="me-1" />,
  },
  {
    value: 'registrants',
    icon: <EventRegistrantsIcon width={23} height={23} className="me-1" />,
  },
  {
    value: 'eventActions',
    icon: <FaTasks size={16} className="me-1" />,
  },
  {
    value: 'eventAgendas',
    icon: <EventAgendaItemsIcon width={23} height={23} className="me-1" />,
  },
  {
    value: 'eventStats',
    icon: <IoMdStats size={20} className="me-2" />,
  },
];

/**
 * Tab options for the event management component.
 */
type TabOptions =
  | 'dashboard'
  | 'registrants'
  | 'eventActions'
  | 'eventAgendas'
  | 'eventStats';

/**
 * `EventManagement` component handles the display and navigation of different event management sections.
 *
 * It provides a tabbed interface for:
 * - Viewing event dashboard
 * - Managing event registrants
 * - Handling event actions
 * - Reviewing event agendas
 * - Viewing event statistics
 *
 * @returns JSX.Element - The `EventManagement` component.
 *
 * @example
 * ```tsx
 * <EventManagement />
 * ```
 */
const EventManagement = (): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventManagement',
  });

  // Custom hook for accessing local storage
  const { getItem } = useLocalStorage();

  // Determine user role based on local storage
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  /*istanbul ignore next*/
  const userRole = superAdmin
    ? 'SUPERADMIN'
    : adminFor?.length > 0
      ? 'ADMIN'
      : 'USER';

  // Extract event and organization IDs from URL parameters
  const { eventId, orgId } = useParams();
  /*istanbul ignore next*/
  if (!eventId || !orgId) {
    // Redirect if event ID or organization ID is missing
    return <Navigate to={'/orglist'} />;
  }

  // Hook for navigation
  const navigate = useNavigate();

  // State hook for managing the currently selected tab
  const [tab, setTab] = useState<TabOptions>('dashboard');

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
      ? 'px-4 d-flex align-items-center shadow'
      : 'text-secondary bg-white px-4 d-flex align-items-center rounded shadow';
    const props = {
      variant,
      className,
      style: { height: '2.5rem' },
      size: 'sm' as 'sm' | 'lg',
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
    /*istanbul ignore next*/
    userRole === 'USER'
      ? navigate(`/user/events/${orgId}`)
      : navigate(`/orgevents/${orgId}`);
  };

  return (
    <div className="d-flex flex-column">
      <Row className="mx-3 mt-4">
        <Col>
          <div className="d-none d-md-flex gap-3">
            <Button
              size="sm"
              variant="light"
              className="d-flex text-secondary bg-white align-items-center px-3 shadow"
            >
              <FaChevronLeft
                cursor={'pointer'}
                data-testid="backBtn"
                onClick={handleBack}
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
                  onClick={
                    /* istanbul ignore next */
                    () => setTab(value)
                  }
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
          case 'dashboard':
            return (
              <div data-testid="eventDashboadTab">
                <EventDashboard eventId={eventId} />
              </div>
            );
          case 'registrants':
            return (
              <div data-testid="eventRegistrantsTab">
                <h2>Event Registrants</h2>
              </div>
            );
          case 'eventActions':
            return (
              <div data-testid="eventActionsTab" className="mx-4">
                <OrganizationActionItems />
              </div>
            );
          case 'eventAgendas':
            return (
              <div data-testid="eventAgendasTab">
                <EventAgendaItems eventId={eventId} />
              </div>
            );
          case 'eventStats':
            return (
              <div data-testid="eventStatsTab">
                <h2>Event Statistics</h2>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default EventManagement;
