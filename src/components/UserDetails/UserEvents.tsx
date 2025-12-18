/**
 * UserEvents Component
 *
 * This component displays a list of events associated with a user, providing
 * search and sorting capabilities for better discoverability. Events are rendered
 * using the `PeopleTabUserEvents` card component and are displayed within a
 * structured page layout.
 *
 * The component currently uses mock event data and performs client-side filtering
 * and sorting based on user input from the page header.
 *
 * @component
 * @param {PeopleTabUserEventsProps} props - The props for the component.
 * @param {string} [props.id] - Optional user ID for future integration with
 *                            user-specific event fetching.
 *
 * @returns {JSX.Element} The rendered UserEvents component.
 *
 * @remarks
 * - Uses React state hooks to manage search input and sorting order.
 * - Applies memoization via `useMemo` to efficiently filter and sort event data.
 * - Integrates a reusable `PageHeader` component for search and sort controls.
 * - Displays an empty state message when no events match the search criteria.
 * - Uses `react-i18next` for localization of UI text.
 * - Designed to be easily extended to support API-driven event data.
 *
 * @example
 * ```tsx
 * <UserEvents />
 * ```
 *
 * @dependencies
 * - `react-bootstrap` for layout and card structure
 * - `@mui/material` and `@mui/icons-material` for action icons
 * - `react-i18next` for translations
 * - Shared UI components such as `PageHeader` and `PeopleTabUserEvents`
 *
 */
import React, { useState, useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
// import useLocalStorage from 'utils/useLocalstorage';
import PeopleTabUserEvents from 'shared-components/PeopleTabUserEvents/PeopleTabUserEvents';
import PageHeader from 'shared-components/Navbar/Navbar';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// import { useLocation } from 'react-router';

type PeopleTabUserEventsProps = { id?: string };

const UserEvents: React.FC<PeopleTabUserEventsProps> = () => {
  // const { getItem } = useLocalStorage();
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  // const location = useLocation();
  // const currentId = location.state?.id || getItem('id') || id;

  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<'ASC' | 'DESC'>('ASC');

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
        <PageHeader
          search={{ placeholder: 'Search events...', onSearch: setSearchValue }}
          sorting={[
            {
              title: 'Sort By Name',
              options: [
                { label: 'A → Z', value: 'ASC' },
                { label: 'Z → A', value: 'DESC' },
              ],
              selected: sortOption,
              onChange: (value: string | number) =>
                setSortOption(value as 'ASC' | 'DESC'),
              testIdPrefix: 'eventsSort',
            },
          ]}
        />

        <Card.Body className={`${styles.peoplePageUserEventCardBody} px-4 `}>
          {filteredEvents.length === 0 ? (
            <div
              className={`${styles.emptyContainer} w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary`}
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
