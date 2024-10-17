import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './EventManagement.module.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AngleLeftIcon from 'assets/svgs/angleLeft.svg?react';
import EventDashboardIcon from 'assets/svgs/eventDashboard.svg?react';
import EventRegistrantsIcon from 'assets/svgs/people.svg?react';
import EventActionsIcon from 'assets/svgs/settings.svg?react';
import EventAgendaItemsIcon from 'assets/svgs/agenda-items.svg?react';
import EventStatisticsIcon from 'assets/svgs/eventStats.svg?react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import EventDashboard from 'components/EventManagement/Dashboard/EventDashboard';
import EventActionItems from 'components/EventManagement/EventActionItems/EventActionItems';
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
    icon: <EventDashboardIcon width={26} height={26} className="me-1" />,
  },
  {
    value: 'registrants',
    icon: <EventRegistrantsIcon width={23} height={23} className="me-1" />,
  },
  {
    value: 'eventActions',
    icon: <EventActionsIcon width={23} height={23} className="me-1" />,
  },
  {
    value: 'eventAgendas',
    icon: <EventAgendaItemsIcon width={23} height={23} className="me-1" />,
  },
  {
    value: 'eventStats',
    icon: <EventStatisticsIcon width={23} height={23} className="me-2" />,
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
   * Handles tab button clicks to update the selected tab.
   *
   * @param value - The value representing the tab to select
   */
  const handleClick = (value: TabOptions): void => {
    setTab(value);
  };

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
      ? 'px-4'
      : 'text-secondary border-secondary-subtle px-4';
    const props = {
      variant,
      className,
      size: 'sm' as 'sm' | 'lg',
      onClick: () => handleClick(value),
      'data-testid': `${value}Btn`,
    };

    return (
      <Button key={value} {...props}>
        {icon}
        {translatedText}
      </Button>
    );
  };

  return (
    <div className={`${styles.content} mt-3 p-4`}>
      <div className="d-flex ml-3">
        <AngleLeftIcon
          cursor={'pointer'}
          width={28}
          height={28}
          fill={'var(--bs-secondary)'}
          data-testid="backBtn"
          onClick={() => {
            /*istanbul ignore next*/
            (() =>
              userRole === 'USER'
                ? navigate(`/user/events/${orgId}`)
                : navigate(`/orgevents/${orgId}`))();
          }}
          className="mt-1"
        />
        <div className="d-flex ms-3 gap-4 mt-1">
          {eventDashboardTabs.map(renderButton)}
        </div>
      </div>
      <Row>
        <Col className="pt-4">
          {/* Render content based on the selected tab */}
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
                  <div data-testid="eventActionsTab">
                    <EventActionItems eventId={eventId} />
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
        </Col>
      </Row>
    </div>
  );
};

export default EventManagement;
