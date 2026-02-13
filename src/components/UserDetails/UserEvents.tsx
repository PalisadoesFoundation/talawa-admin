/**
 * UserEvents
 *
 * Displays a list of events associated with a user.
 *
 * The component provides client-side searching and sorting to help
 * users discover events easily. Events are rendered using the
 * PeopleTabUserEvents card component within a structured layout.
 *
 * The current implementation uses mock data and is designed to be
 * easily extended to support API-driven event data.
 *
 * @param props - Component props.
 * Optional {@link PeopleTabUserEventsProps.id | id} may be provided and is
 * reserved for future event fetching support.
 *
 * @returns The rendered UserEvents component.
 *
 * @remarks
 * - Uses React state hooks to manage search input and sorting order.
 * - Applies memoization to efficiently filter and sort event data.
 * - Integrates PeopleTabNavbar for search and sort controls.
 * - Displays an empty state when no events match the search criteria.
 * - Uses react-i18next for localization.
 *
 * @example
 * ```tsx
 * <UserEvents />
 * ```
 */
import React, { useState, useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './UserEvents.module.css';
import PeopleTabUserEvents from 'shared-components/PeopleTabUserEvents/PeopleTabUserEvents';
import PeopleTabNavbar from 'shared-components/PeopleTabNavbar/PeopleTabNavbar';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery } from '@apollo/client';
import { GET_EVENTS_BY_ORGANIZATION_ID } from 'GraphQl/Queries/Queries';
import {
  InterfaceUserEvent,
  InterfaceGetUserEventsData,
} from 'types/AdminPortal/UserDetails/UserEvent/interface';
import { PeopleTabUserEventsProps } from 'types/AdminPortal/UserDetails/UserEvent/type';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const UserEvents: React.FC<PeopleTabUserEventsProps> = ({ orgId, userId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState('Sort');
  type ParticipationFilter = 'ALL' | 'ADMIN_CREATOR';

  const [participationFilter, setParticipationFilter] =
    useState<ParticipationFilter>('ALL');

  const splitDateTime = (dateTime: string) => {
    const d = dayjs.utc(dateTime);
    return {
      date: d.format('YYYY-MM-DD'),
      time: d.format('HH:mm'),
    };
  };

  const { data, loading, error } = useQuery<InterfaceGetUserEventsData>(
    GET_EVENTS_BY_ORGANIZATION_ID,
    {
      variables: {
        organizationId: orgId,
      },
      skip: !orgId,
    },
  );

  const userEvents: InterfaceUserEvent[] =
    data?.eventsByOrganizationId.map((event) => {
      const start = splitDateTime(event.startAt);
      const end = splitDateTime(event.endAt);

      return {
        id: event.id,
        name: event.name,
        description: event.description ?? '',
        startDate: start.date,
        startTime: start.time,
        endDate: end.date,
        endTime: end.time,
        creatorId: event.creator.id,
      };
    }) ?? [];

  const filteredEvents = useMemo(() => {
    let filtered = userEvents;

    //  Search
    filtered = filtered.filter(
      (event) =>
        event.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        event.description.toLowerCase().includes(searchValue.toLowerCase()),
    );

    //  Participation filter
    if (participationFilter === 'ADMIN_CREATOR') {
      filtered = filtered.filter((event) => event.creatorId === userId);
    }

    //  Sorting
    filtered = [...filtered].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOption === 'ASC'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtered;
  }, [userEvents, searchValue, sortOption, participationFilter, orgId]);

  if (loading) {
    return (
      <div>
        <p>{tCommon('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{tCommon('somethingWentWrong')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.peopleTabUserEventsContainer}>
        {/* ===== Page Header with Search & Sort ===== */}
        <PeopleTabNavbar
          search={{
            placeholder: 'Search created events',
            onSearch: setSearchValue,
          }}
          sorting={[
            {
              title: 'Sort By Name',
              options: [
                { label: 'A → Z', value: 'ASC' },
                { label: 'Z → A', value: 'DESC' },
              ],
              icon: '/images/svg/ri_arrow-up-down-line.svg',
              selected: sortOption,
              onChange: (value: string | number) =>
                setSortOption(value as 'ASC' | 'DESC'),
              testIdPrefix: 'eventsSort',
            },
            {
              title: 'Event Participation',
              options: [
                { label: 'Admin / Creator of Events', value: 'ADMIN_CREATOR' },
                { label: 'All', value: 'ALL' },
              ],
              icon: '/images/svg/ri_arrow-up-down-line.svg',
              selected: participationFilter,
              onChange: (value: string | number) =>
                setParticipationFilter(value as ParticipationFilter),
              testIdPrefix: 'eventsParticipationFilter',
            },
          ]}
        />

        <Card.Body className={`${styles.peoplePageUserEventCardBody}`}>
          {filteredEvents.length === 0 ? (
            <div
              className={`w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary`}
            >
              {t('noeventsAttended')}
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <PeopleTabUserEvents
                key={index}
                startTime={event.startTime}
                endTime={event.endTime}
                startDate={event.startDate}
                endDate={event.endDate}
                eventName={event.name}
                eventDescription={event.description}
                actionIcon={
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                }
                actionName={'Edit'}
              />
            ))
          )}
        </Card.Body>
      </div>
    </div>
  );
};

export default UserEvents;
