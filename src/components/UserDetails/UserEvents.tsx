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

type PeopleTabUserEventsProps = { id?: string };

const UserEvents: React.FC<PeopleTabUserEventsProps> = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState('Sort');

  // Example dummy events
  const dummyEvents = [
    {
      startTime: '10:00',
      endTime: '12:00',
      startDate: '2025-12-10',
      endDate: '2025-12-10',
      eventName: 'React Workshop',
      eventDescription: 'Learn React basics and advanced patterns.',
      actionIcon: '⭐',
      actionName: 'Join',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
    {
      startTime: '14:00',
      endTime: '16:00',
      startDate: '2025-12-12',
      endDate: '2025-12-12',
      eventName: 'Node.js Seminar',
      eventDescription: 'Deep dive into Node.js performance.',
      actionIcon: '🔗',
      actionName: 'Register',
    },
  ];

  // ===== Filter & Sort Before Rendering =====
  const filteredEvents = useMemo(() => {
    let filtered = dummyEvents.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchValue.toLowerCase()) ||
        event.eventDescription
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const nameA = a.eventName.toLowerCase();
      const nameB = b.eventName.toLowerCase();
      return sortOption === 'ASC'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtered;
  }, [dummyEvents, searchValue, sortOption]);

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
                eventName={event.eventName}
                eventDescription={event.eventDescription}
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
