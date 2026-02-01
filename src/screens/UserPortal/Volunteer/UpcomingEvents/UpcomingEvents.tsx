import React, { useMemo, useState } from 'react';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import Button from 'shared-components/Button/Button';
import styles from './UpcomingEvents.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { WarningAmberRounded, ExpandMore, Event } from '@mui/icons-material';
import useLocalStorage from 'utils/useLocalstorage';
import { useQuery } from '@apollo/client';
import {
  InterfaceVolunteerMembership,
  InterfaceEventEdge,
  InterfaceMappedEvent,
  InterfaceVolunteerStatus,
} from 'types/Volunteer/interface';
import { IoLocationOutline } from 'react-icons/io5';
import { IoIosHand } from 'react-icons/io';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { FaCheck } from 'react-icons/fa';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { mapVolunteerStatusToVariant } from 'utils/volunteerStatusMapper';

/**
 * Maps membership status to StatusBadge variant.
 *
 * @deprecated Use mapVolunteerStatusToVariant from utils/volunteerStatusMapper instead.
 * This export is maintained for backward compatibility with existing tests.
 *
 * @param status - The membership status string (e.g., 'requested', 'invited', 'accepted', 'rejected')
 * @returns Object containing the StatusBadge variant
 */
export const getStatusBadgeProps = mapVolunteerStatusToVariant;
/**
 * Component for displaying upcoming volunteer events for an organization.
 * Allows users to volunteer for events and groups, and tracks their membership status.
 *
 * @returns The UpcomingEvents component.
 */
const UpcomingEvents = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'userVolunteer' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const { orgId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'title' | 'location'>('title');
  if (!orgId || !userId) {
    return <Navigate to="/" replace />;
  }
  const {
    isOpen: showRecurringModal,
    open: openRecurringModal,
    close: closeRecurringModal,
  } = useModalState();
  const [pendingVolunteerRequest, setPendingVolunteerRequest] = useState<{
    eventId: string;
    eventName: string;
    eventDate: string;
    groupId?: string;
    groupName?: string;
    status: string;
    isRecurring: boolean;
  } | null>(null);
  const handleVolunteerClick = (
    eventId: string,
    eventName: string,
    eventDate: string,
    groupId?: string,
    groupName?: string,
    status?: string,
    isRecurring?: boolean,
  ): void => {
    setPendingVolunteerRequest({
      eventId,
      eventName,
      eventDate,
      groupId,
      groupName,
      status: status || 'requested',
      isRecurring: isRecurring || false,
    });
    openRecurringModal();
  };
  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
  } = useQuery(USER_EVENTS_VOLUNTEER, {
    variables: {
      organizationId: orgId,
      upcomingOnly: true,
      first: 30,
    },
  });
  const { data: membershipData, loading: membershipLoading } = useQuery(
    USER_VOLUNTEER_MEMBERSHIP,
    {
      variables: { where: { userId } },
      skip: !userId,
    },
  );
  const basicMembershipLookup = useMemo(() => {
    const lookup: Record<string, InterfaceVolunteerMembership> = {};
    membershipData?.getVolunteerMembership?.forEach(
      (membership: InterfaceVolunteerMembership) => {
        const key = membership.group
          ? `${membership.event.id}-${membership.group.id}`
          : membership.event.id;
        lookup[key] = membership;
      },
    );
    return lookup;
  }, [membershipData]);
  const events = useMemo<InterfaceMappedEvent[]>(() => {
    if (!eventsData?.organization?.events?.edges) {
      return [];
    }
    const mapped = eventsData.organization.events.edges.map(
      (edge: InterfaceEventEdge) => {
        const isRecurringInstance =
          edge.node.baseEvent?.isRecurringEventTemplate;
        const isRecurringTemplate = edge.node.isRecurringEventTemplate;
        return {
          ...edge.node,
          _id: edge.node.id,
          title: edge.node.name,
          startDate: edge.node.startAt,
          endDate: edge.node.endAt,
          recurring: Boolean(isRecurringTemplate || isRecurringInstance),
          isRecurringInstance: Boolean(isRecurringInstance),
          baseEventId: edge.node.baseEvent?.id || null,
          volunteerGroups:
            edge.node.volunteerGroups?.map((g) => ({
              _id: g.id,
              name: g.name,
              volunteers: g.volunteers || [],
              volunteersRequired: g.volunteersRequired,
              description: g.description,
            })) || [],
          volunteers: edge.node.volunteers || [],
        };
      },
    );
    if (!searchTerm.trim()) {
      return mapped;
    }
    const value = searchTerm.toLowerCase();
    return mapped.filter((event: InterfaceMappedEvent) => {
      if (searchBy === 'title') {
        return event.title.toLowerCase().includes(value);
      }
      return (event.location || '').toLowerCase().includes(value);
    });
  }, [eventsData, searchTerm, searchBy]);
  const membershipLookup = useMemo(() => {
    const lookup = { ...basicMembershipLookup };
    events.forEach((event: InterfaceMappedEvent) => {
      Object.values(basicMembershipLookup).forEach(
        (membership: InterfaceVolunteerMembership) => {
          if (event.baseEventId === membership.event.id) {
            const key = membership.group
              ? `${event._id}-${membership.group.id}`
              : event._id;
            if (!lookup[key]) {
              lookup[key] = membership;
            }
          }
        },
      );
    });
    return lookup;
  }, [basicMembershipLookup, events]);
  const getVolunteerStatus = (
    eventId: string,
    groupId?: string,
  ): InterfaceVolunteerStatus => {
    const key = groupId ? `${eventId}-${groupId}` : eventId;
    const membership = membershipLookup[key];
    if (!membership) {
      return {
        status: 'none',
        buttonText: groupId ? t('join') : t('volunteer'),
        buttonVariant: 'outline-success',
        disabled: false,
        icon: IoIosHand,
      };
    }
    switch (membership.status) {
      case 'requested':
      case 'invited':
        return {
          status: 'requested',
          buttonText: t('pending'),
          buttonVariant: 'outline-warning',
          disabled: true,
          icon: IoIosHand,
        };
      case 'accepted':
        return {
          status: 'accepted',
          buttonText: groupId ? t('joined') : t('volunteered'),
          buttonVariant: 'outline-success',
          disabled: true,
          icon: FaCheck,
        };
      case 'rejected':
        return {
          status: 'rejected',
          buttonText: t('rejected'),
          buttonVariant: 'outline-danger',
          disabled: true,
          icon: IoIosHand,
        };
      default:
        return {
          status: 'none',
          buttonText: groupId ? t('join') : t('volunteer'),
          buttonVariant: 'outline-success',
          disabled: false,
          icon: IoIosHand,
        };
    }
  };

  if (eventsError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <span className={styles.errorIcon} aria-hidden="true">
            <WarningAmberRounded />
          </span>
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Events' })}
          </h6>
        </div>
      </div>
    );
  }
  const searchByDropdown = {
    id: 'search-by',
    label: tCommon('searchBy', { item: '' }),
    type: 'filter' as const,
    options: [
      { label: t('name'), value: 'title' },
      { label: tCommon('location'), value: 'location' },
    ],
    selectedOption: searchBy,
    onOptionChange: (v: string | number) =>
      setSearchBy(v as 'title' | 'location'),
    dataTestIdPrefix: 'searchBy',
  };
  return (
    <LoadingState
      isLoading={eventsLoading || membershipLoading}
      variant="spinner"
    >
      <SearchFilterBar
        searchPlaceholder={tCommon('searchBy', { item: t('titleOrLocation') })}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputTestId="searchByInput"
        searchButtonTestId="searchBtn"
        hasDropdowns={true}
        dropdowns={[searchByDropdown]}
      />
      {events.length === 0 ? (
        <EmptyState
          icon={<Event />}
          message={t('noEvents')}
          dataTestId="events-empty-state"
        />
      ) : (
        events.map((event, index) => {
          const status = getVolunteerStatus(event._id);
          const Icon = status.icon;
          return (
            <Accordion key={event._id} className="mt-3 rounded">
              <AccordionSummary expandIcon={<ExpandMore />}>
                <div
                  className={styles.titleContainerVolunteer}
                  data-testid={`detailContainer${index + 1}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <h3 data-testid="eventTitle">{event.title}</h3>
                    {status.status !== 'none' && (
                      <StatusBadge
                        {...getStatusBadgeProps(status.status)}
                        size="sm"
                        dataTestId={'event-status-' + index}
                      />
                    )}
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails className="d-flex gap-3 flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-3 flex-column">
                    {event.description && (
                      <div className="d-flex gap-3">
                        <span>{t('description')}: </span>
                        <span>{event.description}</span>
                      </div>
                    )}
                    <div className="d-flex gap-3">
                      <span>
                        <IoLocationOutline className="me-1 mb-1" />
                        {tCommon('location')}:{' '}
                        {event.location || t('notSpecified')}
                      </span>
                    </div>
                    {event.recurring ? (
                      <div className="d-flex gap-3">
                        <span>
                          {t('recurrence')}: {event.recurrenceRule?.frequency}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex gap-3">
                          <span>
                            {t('startDate')}:{' '}
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="d-flex gap-3">
                          <span>
                            {t('endDate')}:{' '}
                            {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                    {event.volunteerGroups &&
                      event.volunteerGroups.length > 0 && (
                        <div className="d-flex gap-3">
                          <span>
                            {t('volunteerGroups')}:{' '}
                            {t('groupsAvailable', {
                              count: event.volunteerGroups.length,
                            })}
                          </span>
                        </div>
                      )}
                  </div>
                  <Button
                    variant={status.buttonVariant}
                    data-testid={`eventVolunteerBtn-${index}`}
                    disabled={status.disabled}
                    onClick={() =>
                      handleVolunteerClick(
                        event._id,
                        event.title,
                        event.startDate,
                        undefined,
                        undefined,
                        'requested',
                        event.recurring,
                      )
                    }
                  >
                    <Icon className="me-1" />
                    {status.buttonText}
                  </Button>
                </div>
                {event.volunteerGroups?.length > 0 && (
                  <div className="mt-3">
                    <h6 className="fw-bold">{t('volunteerGroups')}</h6>
                    {event.volunteerGroups.map((group) => {
                      const groupStatus = getVolunteerStatus(
                        event._id,
                        group._id,
                      );
                      const GroupIcon = groupStatus.icon;
                      return (
                        <div
                          key={group._id}
                          className="d-flex justify-content-between align-items-center p-2 border rounded mb-2"
                        >
                          <div className="d-flex flex-column gap-1">
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-semibold">{group.name}</span>
                              {groupStatus.status !== 'none' && (
                                <StatusBadge
                                  {...getStatusBadgeProps(groupStatus.status)}
                                  size="sm"
                                  dataTestId={'group-status-' + group._id}
                                />
                              )}
                            </div>
                            {group.description && (
                              <span className="text-muted">
                                {group.description}
                              </span>
                            )}
                            <span className="text-muted">
                              {t('volunteersRequired')}:{' '}
                              {group.volunteersRequired}, {t('signedUp')}:{' '}
                              {group.volunteers.length}
                            </span>
                          </div>
                          <Button
                            variant={groupStatus.buttonVariant}
                            data-testid={`groupVolunteerBtn-${group._id}`}
                            disabled={groupStatus.disabled}
                            onClick={() =>
                              handleVolunteerClick(
                                event._id,
                                event.title,
                                event.startDate,
                                group._id,
                                group.name,
                                undefined,
                                event.recurring,
                              )
                            }
                          >
                            <GroupIcon className="me-1" />
                            {groupStatus.buttonText}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
      <RecurringEventVolunteerModal
        show={showRecurringModal}
        onHide={closeRecurringModal}
        eventName={pendingVolunteerRequest?.eventName || ''}
        eventDate={pendingVolunteerRequest?.eventDate || ''}
        isForGroup={!!pendingVolunteerRequest?.groupId}
        groupName={pendingVolunteerRequest?.groupName || ''}
        onSelectSeries={() => {}}
        onSelectInstance={() => {}}
      />
    </LoadingState>
  );
};
export default UpcomingEvents;
