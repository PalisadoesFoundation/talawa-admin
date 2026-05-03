/**
 * Upcoming events card — uses global design system classes (tw-card pattern).
 */
import React from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import CardItem from 'components/AdminPortal/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import type { IEvent } from 'utils/interfaces';

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
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });

  return (
    <div className="tw-card">
      <div className="tw-card-header">
        <span className="tw-card-title">{t('upcomingEvents')}</span>
        <button
          className="tw-card-action"
          data-testid="viewAllEvents"
          onClick={onViewAllEventsClick}
        >
          {t('viewAll')}
        </button>
      </div>
      <div className="tw-card-body">
        <LoadingState
          isLoading={eventLoading}
          variant="custom"
          customLoader={[...Array(4)].map((_, index) => (
            <CardItemLoading key={`eventLoading_${index}`} />
          ))}
        >
          {!upcomingEvents.length ? (
            <div className="tw-card-empty">
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
              .map((event) => (
                <CardItem
                  type="Event"
                  key={event.node.id}
                  startdate={event.node.startAt}
                  enddate={event.node.endAt}
                  title={event.node.name}
                />
              ))
          )}
        </LoadingState>
      </div>
    </div>
  );
};

export default UpcomingEventsCard;
