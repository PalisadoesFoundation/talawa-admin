import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './EventManagement.module.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as AngleLeftIcon } from 'assets/svgs/angleLeft.svg';
import { ReactComponent as EventDashboardIcon } from 'assets/svgs/eventDashboard.svg';
import { ReactComponent as EventRegistrantsIcon } from 'assets/svgs/people.svg';
import { ReactComponent as EventActionsIcon } from 'assets/svgs/settings.svg';
import { ReactComponent as EventStatisticsIcon } from 'assets/svgs/eventStats.svg';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import EventDashboard from 'components/EventManagement/Dashboard/EventDashboard';

const eventDashboardTabs = [
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
    value: 'eventStats',
    icon: <EventStatisticsIcon width={23} height={23} className="me-2" />,
  },
];

const EventManagement = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventManagement',
  });

  const { eventId, orgId } = useParams();
  if (!eventId || !orgId) {
    return <Navigate to={'/orglist'} />;
  }
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');

  const handleClick = (value: string): void => {
    setTab(value);
  };

  const renderButton = ({
    value,
    icon,
  }: {
    value: string;
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
      key: value,
      size: 'sm' as 'sm' | 'lg',
      onClick: () => handleClick(value),
      'data-testid': `${value}Btn`,
    };

    return (
      <Button {...props}>
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
          onClick={() => navigate(`/orgevents/${orgId}`)}
          className="mt-1"
        />
        <div className="d-flex ms-3 gap-4 mt-1">
          {eventDashboardTabs.map(renderButton)}
        </div>
      </div>
      <Row>
        <Col className="pt-4">
          {(() => {
            switch (tab) {
              case 'dashboard':
                return <EventDashboard eventId={eventId} />;
              case 'registrants':
                return (
                  <div>
                    <h2>Registrants</h2>
                  </div>
                );
              case 'eventActions':
                return (
                  <div>
                    <h2>Event Actions</h2>
                  </div>
                );
              case 'eventStats':
                return (
                  <div>
                    <h2>Event Statistics</h2>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </Col>
      </Row>
    </div>
  );
};

export default EventManagement;
