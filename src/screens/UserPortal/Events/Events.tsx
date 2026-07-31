/**
 * User Portal Events — mirrors the admin OrganizationEvents layout.
 * Calendar view (default) + Card view toggle, Upcoming/Past/Recurring tabs.
 */
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import {
  ORGANIZATIONS_LIST_BASIC,
  GET_ORGANIZATION_EVENTS_PG,
} from 'GraphQl/Queries/Queries';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useState, useEffect, useMemo } from 'react';
import {
  CRUDModalTemplate,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import type { InterfaceEvent, IEventFormInput } from 'types/Event/interface';
import { mapCreateEventInputToMutationInput } from 'types/Event/createEventInput';
import styles from './Events.module.css';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import Button from 'shared-components/Button/Button';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';

dayjs.extend(utc);

interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string | null;
    endAt: string | null;
    allDay: boolean;
    location?: string | null;
    isPublic: boolean;
    isRegisterable: boolean;
    isInviteOnly?: boolean;
    isRecurringEventTemplate?: boolean;
    baseEvent?: { id: string; name: string } | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    recurrenceDescription?: string | null;
    recurrenceRule?: InterfaceRecurrenceRule | null;
    creator?: { id: string; name: string };
    attendees?: Array<{ id: string; name: string }>;
  };
  cursor: string;
}

export default function Events(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const { orgId: organizationId } = useParams();

  const createEventModal = useModalState();
  const [viewMode, setViewMode] = useState<'calendar' | 'cards'>('calendar');
  const [eventFilter, setEventFilter] = useState<
    'upcoming' | 'past' | 'recurring'
  >('upcoming');
  const [searchByName, setSearchByName] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [formResetKey, setFormResetKey] = useState(0);

  const startDate = dayjs(new Date(currentYear, currentMonth, 1))
    .startOf('month')
    .toISOString();
  const endDate = dayjs(new Date(currentYear, currentMonth, 1))
    .endOf('month')
    .toISOString();

  const userId = (getItem('userId') || getItem('id') || '') as string;
  const storedRole = getItem('role') as string | null;
  const userRole = storedRole === 'administrator' ? 'ADMINISTRATOR' : 'REGULAR';

  // Use the same query as admin (no broken startDate/endDate fields on event node)
  const {
    data: eventData,
    error: eventDataError,
    refetch,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: organizationId,
      first: 100,
      after: null,
      startDate,
      endDate,
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const { data: orgData } = useQuery(ORGANIZATIONS_LIST_BASIC);
  const [create] = useMutation(CREATE_EVENT_MUTATION, { errorPolicy: 'all' });

  useEffect(() => {
    if (eventDataError) {
      const msg = eventDataError.message?.toLowerCase() || '';
      if (msg.includes('rate limit') || msg.includes('too many requests'))
        return;
      console.warn('Events query error:', eventDataError.message);
    }
  }, [eventDataError]);

  const mapNodeToEvent = (node: IEventEdge['node']): InterfaceEvent => ({
    id: node.id,
    name: node.name,
    description: node.description || '',
    startAt: node.startAt,
    endAt: node.endAt,
    startDate: null,
    endDate: null,
    startTime: node.allDay
      ? null
      : node.startAt
        ? dayjs(node.startAt).format('HH:mm:ss')
        : null,
    endTime: node.allDay
      ? null
      : node.endAt
        ? dayjs(node.endAt).format('HH:mm:ss')
        : null,
    allDay: node.allDay,
    location: node.location || '',
    isPublic: node.isPublic,
    isRegisterable: node.isRegisterable,
    isInviteOnly: Boolean(node.isInviteOnly),
    isRecurringEventTemplate: node.isRecurringEventTemplate,
    baseEvent: node.baseEvent,
    sequenceNumber: node.sequenceNumber,
    totalCount: node.totalCount,
    hasExceptions: node.hasExceptions,
    progressLabel: node.progressLabel,
    recurrenceDescription: node.recurrenceDescription,
    recurrenceRule: node.recurrenceRule,
    creator: { id: node.creator?.id || '', name: node.creator?.name || '' },
    attendees: node.attendees || [],
  });

  const allEvents: InterfaceEvent[] = (
    eventData?.organization?.events?.edges || []
  ).map((edge: IEventEdge) => mapNodeToEvent(edge.node));

  // Search filter
  const searchedEvents = useMemo(() => {
    if (!searchByName.trim()) return allEvents;
    const q = searchByName.toLowerCase();
    return allEvents.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q),
    );
  }, [allEvents, searchByName]);

  // Tab filter
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'upcoming') {
      return searchedEvents.filter((e) => {
        const s = e.startAt ? dayjs(e.startAt) : null;
        return s && s.isAfter(dayjs());
      });
    }
    if (eventFilter === 'past') {
      return searchedEvents.filter((e) => {
        const s = e.startAt ? dayjs(e.startAt) : null;
        return s && s.isBefore(dayjs());
      });
    }
    if (eventFilter === 'recurring') {
      return searchedEvents.filter((e) => e.isRecurringEventTemplate);
    }
    return searchedEvents;
  }, [searchedEvents, eventFilter]);

  // Create event
  const buildDefaultEventValues = (): IEventFormValues => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(Math.min(now.getHours() + 1, 23), 0, 0, 0);
    const twoLater = new Date(nextHour);
    twoLater.setHours(Math.min(nextHour.getHours() + 2, 23), 0, 0, 0);
    return {
      name: '',
      description: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: nextHour.toTimeString().split(' ')[0],
      endTime: twoLater.toTimeString().split(' ')[0],
      allDay: true,
      isPublic: false,
      isInviteOnly: true,
      isRegisterable: true,
      recurrenceRule: null,
      createChat: false,
    };
  };

  const [defaultEventValues, setDefaultEventValues] =
    useState<IEventFormValues>(buildDefaultEventValues);

  const handleCreateEvent = async (
    payload: IEventFormSubmitPayload,
  ): Promise<void> => {
    try {
      const recurrenceInput = payload.recurrenceRule
        ? formatRecurrenceForPayload(payload.recurrenceRule, payload.startDate)
        : undefined;
      const input: IEventFormInput = {
        name: payload.name,
        ...(payload.allDay
          ? {
              startDate: dayjs(payload.startDate).format('YYYY-MM-DD'),
              endDate: dayjs(payload.endDate)
                .add(1, 'day')
                .format('YYYY-MM-DD'),
            }
          : { startAt: payload.startAtISO, endAt: payload.endAtISO }),
        organizationId,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
        isInviteOnly: payload.isInviteOnly,
        ...(payload.description && { description: payload.description }),
        ...(payload.location && { location: payload.location }),
        ...(recurrenceInput && { recurrence: recurrenceInput }),
      };
      const mutationInput = mapCreateEventInputToMutationInput(input);
      const { data: createData, errors } = await create({
        variables: { input: mutationInput },
      });
      if (createData?.createEvent) {
        NotificationToast.success(t('eventCreated') as string);
        try {
          await refetch();
        } catch {
          /* non-critical */
        }
        setFormResetKey((p) => p + 1);
        createEventModal.close();
      } else if (errors?.length) {
        throw new Error(errors[0].message);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      <div data-testid="events-screen">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">
              {t('title')}{' '}
              <span className="count-badge">{allEvents.length}</span>
            </h1>
            <p className="page-subtitle">{t('createEventTitle')}</p>
          </div>
          <div className="page-header-actions">
            <Button
              variant="plain"
              onClick={() => {
                setDefaultEventValues(buildDefaultEventValues());
                createEventModal.open();
              }}
              data-testid="createEventModalBtn"
              className="btn btn-primary"
            >
              + {tCommon('create')}
            </Button>
          </div>
        </div>

        {/* Tabs: Upcoming / Past / Recurring */}
        <div className="tabs" role="tablist">
          <Button
            variant="plain"
            className={`tab ${eventFilter === 'upcoming' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'upcoming'}
            onClick={() => setEventFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant="plain"
            className={`tab ${eventFilter === 'past' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'past'}
            onClick={() => setEventFilter('past')}
          >
            Past
          </Button>
          <Button
            variant="plain"
            className={`tab ${eventFilter === 'recurring' ? 'active' : ''}`}
            role="tab"
            aria-selected={eventFilter === 'recurring'}
            onClick={() => setEventFilter('recurring')}
          >
            Recurring
          </Button>
        </div>

        {/* View toggle */}
        <div className={styles.viewToggle}>
          <Button
            variant="plain"
            className={`${styles.viewToggleBtn} ${viewMode === 'calendar' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </Button>
          <Button
            variant="plain"
            className={`${styles.viewToggleBtn} ${viewMode === 'cards' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
        </div>

        {/* Search */}
        <div className="toolbar">
          <div className="search-bar">
            <span className="search-icon">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search events..."
              aria-label="Search events"
              data-testid="searchEvent"
              value={searchByName}
              onChange={(e) => setSearchByName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'cards' &&
        (filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p className="empty-state-title">No events found</p>
            <p className="empty-state-text">
              Try a different filter or create a new event.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {filteredEvents.map((event, index) => {
              const start = event.startAt ? dayjs(event.startAt) : null;
              const end = event.endAt ? dayjs(event.endAt) : null;
              const monthLabel = start ? start.format('MMM') : '';
              const dayLabel = start ? start.format('DD') : '';
              const dateRange =
                start && end
                  ? `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
                  : start
                    ? start.format('MMM D, YYYY')
                    : '';
              const attendeeCount = event.attendees?.length ?? 0;
              const isUpcoming = start && start.isAfter(dayjs());

              return (
                <div className="event-card" key={event.id}>
                  <div
                    className={`event-date-strip ${
                      styles[`dateStrip${index % 5}`]
                    }`}
                  >
                    <div className="month">{monthLabel}</div>
                    <div className="day">{dayLabel}</div>
                  </div>
                  <div className="event-card-body">
                    <div className="event-card-title">{event.name}</div>
                    <div className="event-card-detail">
                      <span className="event-card-detail-icon">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>{' '}
                      {dateRange}
                    </div>
                    {event.location && (
                      <div className="event-card-detail">
                        <span className="event-card-detail-icon">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </span>{' '}
                        {event.location}
                      </div>
                    )}
                    <div className="event-card-footer">
                      <span className="attendee-badge">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.attendeeIcon}
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>{' '}
                        {attendeeCount} attendees
                      </span>
                      <span
                        className={`badge ${isUpcoming ? 'badge-green' : 'badge-gray'}`}
                      >
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <EventCalendar
          viewType={ViewType.MONTH}
          eventData={allEvents}
          refetchEvents={refetch}
          orgData={orgData?.organizations?.find(
            (o: { id: string }) => o.id === organizationId,
          )}
          userRole={userRole}
          userId={userId}
          onMonthChange={(month, year) => {
            setCurrentMonth(month);
            setCurrentYear(year);
          }}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      )}

      <CRUDModalTemplate
        open={createEventModal.isOpen}
        onClose={createEventModal.close}
        title={t('eventDetails')}
        data-testid="createEventModal"
        showFooter={false}
      >
        <EventForm
          key={formResetKey}
          initialValues={defaultEventValues}
          onSubmit={handleCreateEvent}
          onCancel={createEventModal.close}
          submitLabel={tCommon('create')}
          showCreateChat
          showRegisterable
          showPublicToggle
          showRecurrenceToggle
        />
      </CRUDModalTemplate>
    </>
  );
}
