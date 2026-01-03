// upcomingevents.tsx
import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
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
import Loader from 'components/Loader/Loader';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { FaCheck } from 'react-icons/fa';
import AdminSearchFilterBar from 'components/AdminSearchFilterBar/AdminSearchFilterBar';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';
import EmptyState from 'shared-components/EmptyState/EmptyState';
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
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const pendingVolunteerRequestState = useState<{
    eventId: string;
    eventName: string;
    eventDate: string;
    groupId?: string;
    groupName?: string;
    status: string;
    isRecurring: boolean;
  } | null>(null);
  const pendingVolunteerRequest = pendingVolunteerRequestState[0];
  const setPendingVolunteerRequest = pendingVolunteerRequestState[1];
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
    setShowRecurringModal(true);
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
  if (eventsLoading || membershipLoading) {
    return <Loader size="xl" data-testid="loader" />;
  }
  if (eventsError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded
            className={styles.errorIcon}
            aria-hidden="true"
          />
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
    <>
      <div className={styles.calendar__header}>
        {/* 1. Search Section */}
        <div className={styles.calendar__search}>
          <SearchBar
            placeholder={tCommon('searchBy', {
              item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
            })}
            onChange={debouncedSearch}
            onSearch={debouncedSearch}
            inputTestId="searchBy"
            buttonTestId="searchBtn"
            showSearchButton={true}
            showLeadingIcon={true}
            showClearButton={true}
            buttonAriaLabel={t('search')}
          />
        </div>

        {/* 2. Controls Section (Sort Button) */}
        <div className={styles.btnsBlock}>
          <SortingButton
            sortingOptions={[
              { label: t('name'), value: 'title' },
              { label: tCommon('location'), value: 'location' },
            ]}
            selectedOption={searchBy}
            onSortChange={(value) => setSearchBy(value as 'title' | 'location')}
            dataTestIdPrefix="searchByToggle"
            buttonLabel={tCommon('searchBy', { item: '' })}
          />
        </div>
      </div>

      {events.length < 1 ? (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {/* Displayed if no events are found */}
          {tCommon('noEvents')}
        </Stack>
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
                  <h3 data-testid="eventTitle">{event.title}</h3>
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
                            {event.volunteerGroups.length} groups available
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
                            <span className="fw-semibold">{group.name}</span>
                            {group.description && (
                              <span className="text-muted">
                                {group.description}
                              </span>
                            )}
                            <span className="text-muted">
                              Required: {group.volunteersRequired}, Signed up:{' '}
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
                {volunteerGroups && volunteerGroups.length > 0 && (
                  <Form.Group>
                    <Form.Label
                      className={`fw-lighter ms-2 mb-2 ${styles.volunteerGroupsLabel}`}
                    >
                      {t('volunteerGroups')}:
                    </Form.Label>

                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      className={styles.modalTable}
                    >
                      <Table aria-label={t('groupTable')}>
                        <TableHead>
                          <TableRow>
                            <TableCell className="fw-bold">
                              {t('srNo')}
                            </TableCell>
                            <TableCell className="fw-bold">
                              {t('groupName')}
                            </TableCell>
                            <TableCell className="fw-bold" align="center">
                              {t('noOfMembers')}
                            </TableCell>
                            <TableCell className="fw-bold" align="center">
                              {t('options')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {volunteerGroups.map((group, index: number) => {
                            const { _id: gId, name, volunteers } = group;

                            // Get volunteer status for this specific group
                            const groupStatus = getVolunteerStatus(_id, gId);
                            const GroupIcon = groupStatus.icon;

                            return (
                              <TableRow
                                key={gId}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {name}
                                </TableCell>
                                <TableCell align="center">
                                  {volunteers.length}
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant={
                                      new Date(endDate) < new Date()
                                        ? 'outline-secondary'
                                        : groupStatus.buttonVariant
                                    }
                                    size="sm"
                                    data-testid="joinBtn"
                                    disabled={
                                      groupStatus.disabled ||
                                      new Date(endDate) < new Date()
                                    }
                                    onClick={() =>
                                      handleVolunteerClick(
                                        _id,
                                        title,
                                        startDate,
                                        gId,
                                        name,
                                        'requested',
                                        recurring,
                                      )
                                    }
                                  >
                                    {groupStatus.status !== 'none' && (
                                      <GroupIcon className="me-1" size={16} />
                                    )}
                                    {groupStatus.buttonText}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Form.Group>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
      <RecurringEventVolunteerModal
        show={showRecurringModal}
        onHide={() => setShowRecurringModal(false)}
        eventName={pendingVolunteerRequest?.eventName || ''}
        eventDate={pendingVolunteerRequest?.eventDate || ''}
        isForGroup={!!pendingVolunteerRequest?.groupId}
        groupName={pendingVolunteerRequest?.groupName || ''}
        onSelectSeries={() => {}}
        onSelectInstance={() => {}}
      />
    </>
  );
};
export default UpcomingEvents;
