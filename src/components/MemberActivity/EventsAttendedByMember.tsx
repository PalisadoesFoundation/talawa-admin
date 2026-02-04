/**
 * Component to display the details of events attended by a member.
 *
 * This component fetches event details using the `EVENT_DETAILS` GraphQL query
 * and displays the information in a card format using the `EventAttendedCard` component.
 * It handles loading and error states gracefully.
 *
 * @param eventsId - The event id to fetch details for.
 *
 * @returns A React component that displays event details or appropriate
 * loading/error messages.
 *
 * @example
 * ```tsx
 * <EventsAttendedByMember eventsId="12345" />
 * ```
 *
 * @remarks
 * - Uses the `useQuery` hook from Apollo Client to fetch event details.
 * - Displays a loading spinner while the data is being fetched.
 * - Shows an error message if the query fails.
 */
import React from 'react';
import { useQuery } from '@apollo/client/react';
import { EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';
import EventAttendedCard from './Card/EventsAttendedCardItem';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useTranslation } from 'react-i18next';
import styles from './EventsAttendedByMember.module.css';
import type { InterfaceEventsAttendedByMemberProps } from 'types/MemberActivity/interface';
import type { InterfaceEventDetailsBasicQuery } from 'utils/interfaces';

function EventsAttendedByMember({
  eventsId,
}: InterfaceEventsAttendedByMemberProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'memberActivity' });
  const {
    data: events,
    loading,
    error,
  } = useQuery<InterfaceEventDetailsBasicQuery>(EVENT_DETAILS_BASIC, {
    variables: { eventId: eventsId },
  });

  if (error)
    return (
      <div
        data-testid="error"
        className={styles.errorState}
        role="alert"
        aria-live="polite"
      >
        <p>{t('unableToLoadEventDetails')}</p>
      </div>
    );
  // Support both legacy and current schema fields from EVENT_DETAILS
  const eventData = events?.event;
  const { organization, id, startAt, name, location } = eventData || {};

  return (
    <LoadingState isLoading={loading} variant="spinner">
      {eventData && (
        <EventAttendedCard
          orgId={organization?.id}
          eventId={id}
          key={id}
          startdate={startAt ?? ''}
          title={name ?? ''}
          location={location ?? undefined}
        />
      )}
    </LoadingState>
  );
}

export default EventsAttendedByMember;
