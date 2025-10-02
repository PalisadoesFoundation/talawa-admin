/**
 * UpcomingEventsCard Component
 *
 * This component renders a card displaying upcoming events for the organization.
 * It shows a list of events scheduled in the future with their names, dates,
 * and locations, along with a "View All" button for navigation to the events page.
 *
 * @param props - The properties object for the component.
 * @param props.eventData - Object containing events data from GraphQL query.
 * @param props.eventData.organization - Organization object containing events.
 * @param props.eventData.organization.events - Object with edges array containing event nodes.
 * @param props.isLoading - Boolean indicating if events data is currently loading.
 * @param props.onViewAllClick - Callback function triggered when "View All" button is clicked.
 *
 * @returns A JSX.Element containing the upcoming events card with event list and navigation.
 *
 * @remarks
 * - Filters events to show only those with start dates in the future.
 * - Sorts filtered events by start date in ascending order.
 * - Displays loading state when data is being fetched.
 * - Shows "No Upcoming Events" message when there are no future events.
 * - Events are displayed with name, formatted start date, and location.
 * - Uses CardItem components for consistent event display styling.
 *
 * @example
 * ```tsx
 * <UpcomingEventsCard
 *   eventData={{
 *     organization: {
 *       events: {
 *         edges: [
 *           {
 *             node: {
 *               id: '1',
 *               name: 'Annual Meeting',
 *               startAt: '2023-12-25T10:00:00Z',
 *               location: 'Main Hall'
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   }}
 *   isLoading={false}
 *   onViewAllClick={() => navigate('/events')}
 * />
 * ```
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
