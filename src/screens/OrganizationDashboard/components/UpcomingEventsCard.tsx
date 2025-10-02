/**
 * @fileoverview Upcoming events card component for organization dashboard
 * @author The Talawa Team
 * @see https://github.com/PalisadoesFoundation/talawa-admin
 */

import React from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CardItem from 'components/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import type { IEvent } from 'utils/interfaces';
import styles from '../../../style/app-fixed.module.css';

interface InterfaceUpcomingEventsCardProps {
  upcomingEvents: IEvent[];
  eventLoading: boolean;
  onViewAllEventsClick: () => void;
}

const UpcomingEventsCard: React.FC<InterfaceUpcomingEventsCardProps> = ({
  upcomingEvents,
  eventLoading,
  onViewAllEventsClick,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationDashboard',
  });

  return (
    <Col lg={6} className="mb-4 ">
      <Card border="0" className="rounded-4 ">
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('upcomingEvents')}</div>
          <Button
            size="sm"
            variant="light"
            data-testid="viewAllEvents"
            onClick={onViewAllEventsClick}
          >
            {t('viewAll')}
          </Button>
        </div>
        <Card.Body className={styles.containerBody}>
          {eventLoading ? (
            [...Array(4)].map((_, index) => (
              <CardItemLoading key={`eventLoading_${index}`} />
            ))
          ) : upcomingEvents?.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h6>{t('noUpcomingEvents')}</h6>
            </div>
          ) : (
            [...upcomingEvents]
              .sort(
                (a, b) =>
                  new Date(a.node.startAt).getTime() -
                  new Date(b.node.startAt).getTime(),
              )
              .slice(0, 10)
              .map((event) => {
                return (
                  <CardItem
                    data-testid="cardItem"
                    type="Event"
                    key={event.node.id}
                    startdate={event?.node.startAt}
                    enddate={event?.node.endAt}
                    title={event?.node.name}
                  />
                );
              })
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UpcomingEventsCard;
