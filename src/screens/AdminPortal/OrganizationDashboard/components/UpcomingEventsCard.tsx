/**
 * Upcoming events card component for displaying organization's future events.
 *
 * This component presents a chronologically sorted list of future events with detailed
 * scheduling information including start and end dates. It provides comprehensive
 * event management with loading states, empty states, and navigation functionality
 * to view all events in detail.
 *
 * @param upcomingEvents - Array of upcoming event objects. Each item includes a `node` with id, name, startAt, and endAt.
 * @param eventLoading - Loading state indicator. When true, displays skeleton loaders instead of actual content.
 * @param onViewAllEventsClick - Callback function triggered when the "View All" button is clicked.
 *
 * @returns A JSX element representing a styled card component displaying chronologically sorted upcoming events.
 *
 * @example
 * ```tsx
 * <UpcomingEventsCard
 *   upcomingEvents={[
 *     {
 *       node: {
 *         id: 'event1',
 *         name: 'Annual Conference 2024',
 *         startAt: '2024-12-15T09:00:00Z',
 *         endAt: '2024-12-16T17:00:00Z'
 *       }
 *     }
 *   ]}
 *   eventLoading={false}
 *   onViewAllEventsClick={() => navigate('/events')}
 * />
 * ```
 *
 * @remarks
 * - Events are automatically sorted by start date in ascending order (earliest events first).
 * - Date formatting is delegated to the CardItem component for consistent presentation.
 * - When no upcoming events exist, the card still displays with appropriate empty state messaging.
 * - Loading states use skeleton components that maintain the same layout structure as actual events.
 * - Each event is rendered using the CardItem component with event-specific formatting for dates.
 * - The component handles edge cases such as missing event data gracefully.
 * - Date formatting follows the pattern 'MMM D, YYYY' for consistency across the application.
 * - Supports internationalization through react-i18next.
 *
 */

import React from 'react';
import { Card, Col } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import CardItem from 'components/AdminPortal/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type { IEvent } from 'utils/interfaces';
import styles from './UpcomingEventsCard.module.css';

interface InterfaceUpcomingEventsCardProps {
  upcomingEvents: IEvent[];
  eventLoading: boolean;
  onViewAllEventsClick: () => void;
}

const UpcomingEventsCard: React.FC<InterfaceUpcomingEventsCardProps> = ({
  upcomingEvents = [],
  eventLoading,
  onViewAllEventsClick,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'dashboard',
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
          <LoadingState
            isLoading={eventLoading}
            variant="custom"
            customLoader={[...Array(4)].map((_, index) => (
              <CardItemLoading key={`eventLoading_${index}`} />
            ))}
          >
            {!upcomingEvents.length ? (
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
                      type="Event"
                      key={event.node.id}
                      startdate={event.node.startAt}
                      enddate={event.node.endAt}
                      title={event.node.name}
                    />
                  );
                })
            )}
          </LoadingState>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default UpcomingEventsCard;
