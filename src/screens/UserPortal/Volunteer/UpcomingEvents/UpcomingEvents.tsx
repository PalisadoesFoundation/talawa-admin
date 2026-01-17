/**
 * UpcomingEvents Component
 *
 * This component renders a list of upcoming events for volunteers in a specific organization.
 * It provides functionality for searching, sorting, and volunteering for events or groups.
 *
 * @component
 *
 *
 * @returns {JSX.Element} The rendered UpcomingEvents component.
 *
 *
 * @example
 * ```tsx
 * <UpcomingEvents />
 * ```
 *
 * @functionality
 * - Fetches upcoming events using the `USER_EVENTS_VOLUNTEER` GraphQL query.
 * - Allows users to volunteer for events using the `CREATE_VOLUNTEER_MEMBERSHIP` mutation.
 * - Provides a search bar and sorting options for filtering events.
 * - Displays event details, including title, location, dates, and volunteer groups.
 *
 * @state
 * - `searchTerm` - The current search term entered by the user.
 * - `searchBy` - The field to search by, either "title" or "location".
 *
 */
import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { IoLocationOutline } from 'react-icons/io5';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
  debounce,
} from '@mui/material';
import { Circle, WarningAmberRounded } from '@mui/icons-material';

import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import { useMutation, useQuery } from '@apollo/client';
import type {
  InterfaceVolunteerMembership,
  InterfaceVolunteerData,
  InterfaceEventEdge,
  InterfaceMappedEvent,
  InterfaceVolunteerStatus,
} from 'types/Volunteer/interface';
import { IoIosHand } from 'react-icons/io';
import Loader from 'components/Loader/Loader';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';

const UpcomingEvents = (): JSX.Element => {
  // Retrieves translation functions for various namespaces
  const { t } = useTranslation('translation', { keyPrefix: 'userVolunteer' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Retrieves stored user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Extracts organization ID from the URL parameters
  const { orgId } = useParams();
  // Redirects to the homepage if orgId or userId is missing
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'title' | 'location'>('title');

  if (!orgId || !userId) return <Navigate to={'/'} replace />;

  // Modal state for recurring event volunteering
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [pendingVolunteerRequest, setPendingVolunteerRequest] = useState<{
    eventId: string;
    eventName: string;
    eventDate: string;
    groupId?: string;
    groupName?: string;
    status: string;
    isRecurring: boolean;
  } | null>(null);

  const [createVolunteerMembership] = useMutation(CREATE_VOLUNTEER_MEMBERSHIP);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const handleVolunteerClick = (
    eventId: string,
    eventName: string,
    eventDate: string,
    group: string | null,
    groupName: string | null,
    status: string,
    isRecurring: boolean,
  ): void => {
    if (isRecurring) {
      // Show modal for recurring events to let user choose series vs instance
      setPendingVolunteerRequest({
        eventId,
        eventName,
        eventDate,
        groupId: group || undefined,
        groupName: groupName || undefined,
        status,
        isRecurring,
      });
      setShowRecurringModal(true);
    } else {
      // Direct volunteer for non-recurring events
      handleVolunteer(eventId, group, status);
    }
  };

  const handleVolunteer = async (
    eventId: string,
    group: string | null,
    status: string,
    scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY',
    recurringEventInstanceId?: string,
  ): Promise<void> => {
    try {
      const volunteerData: InterfaceVolunteerData = {
        event: eventId,
        group,
        status,
        userId: userId as string,
      };

      // Add scope fields for recurring events
      if (scope) {
        volunteerData.scope = scope;
        if (recurringEventInstanceId) {
          volunteerData.recurringEventInstanceId = recurringEventInstanceId;
        }
      }

      await createVolunteerMembership({
        variables: { data: volunteerData },
      });
      toast.success(t('volunteerSuccess'));
      // Refetch membership data first, then events with a small delay to prevent rate limiting
      await refetchMemberships();
      setTimeout(() => {
        refetchEvents();
      }, 500);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleRecurringModalSelection = async (
    scope: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY',
  ): Promise<void> => {
    if (!pendingVolunteerRequest) return;

    const { eventId, groupId, status } = pendingVolunteerRequest;

    // Find the event in our list to get its metadata
    const eventData = events.find((e) => e._id === eventId);

    let targetEventId = eventId;
    let recurringEventInstanceId = undefined;

    if (scope === 'ENTIRE_SERIES') {
      // For series volunteering, use the base event ID (template)
      if (eventData?.baseEventId) {
        targetEventId = eventData.baseEventId;
      }
    } else if (scope === 'THIS_INSTANCE_ONLY') {
      // For instance-only volunteering, use current event ID and pass instanceId
      recurringEventInstanceId = eventId;
      // The target event should be the base event for the backend logic
      if (eventData?.baseEventId) {
        targetEventId = eventData.baseEventId;
      }
    }

    await handleVolunteer(
      targetEventId,
      groupId || null,
      status,
      scope,
      recurringEventInstanceId,
    );

    // Close modal and reset state
    setShowRecurringModal(false);
    setPendingVolunteerRequest(null);
  };

  const handleModalClose = (): void => {
    setShowRecurringModal(false);
    setPendingVolunteerRequest(null);
  };

  // Helper function to get volunteer status and button configuration
  // Uses the same color scheme as EventVolunteers/Volunteers component
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
        buttonVariant: 'outline-success' as const,
        disabled: false,
        icon: IoIosHand,
      };
    }

    // Match the exact color scheme from EventVolunteers/Volunteers component
    switch (membership.status) {
      case 'requested':
      case 'invited':
        return {
          status: 'requested',
          buttonText: t('pending'),
          buttonVariant: 'outline-warning' as const,
          disabled: true,
          icon: IoIosHand,
        };
      case 'accepted':
        return {
          status: 'accepted',
          buttonText: groupId ? t('joined') : t('volunteered'),
          buttonVariant: 'outline-success' as const,
          disabled: true,
          icon: FaCheck,
        };
      case 'rejected':
        return {
          status: 'rejected',
          buttonText: t('rejected'),
          buttonVariant: 'outline-danger' as const,
          disabled: true,
          icon: IoIosHand,
        };
      default:
        return {
          status: 'none',
          buttonText: groupId ? t('join') : t('volunteer'),
          buttonVariant: 'outline-success' as const,
          disabled: false,
          icon: IoIosHand,
        };
    }
  };

  // Fetches upcoming events based on the organization ID, search term, and sorting order
  const {
    data: eventsData,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  }: {
    data?: {
      organization: {
        events: {
          edges: Array<InterfaceEventEdge>;
        };
      };
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_EVENTS_VOLUNTEER, {
    variables: {
      organizationId: orgId,
      upcomingOnly: true,
      first: 30,
    },
    fetchPolicy: 'cache-first', // Use cache-first to reduce network requests
    errorPolicy: 'all', // Handle rate limiting errors gracefully
  });

  // Fetch user's volunteer memberships to get status information
  const {
    data: membershipData,
    refetch: refetchMemberships,
    loading: membershipLoading,
  } = useQuery(USER_VOLUNTEER_MEMBERSHIP, {
    variables: {
      where: { userId },
    },
    skip: !userId,
    fetchPolicy: 'cache-first', // Use cache-first to reduce network requests
    errorPolicy: 'all', // Handle errors gracefully
  });

  // Create a basic lookup map for user's volunteer memberships
  const basicMembershipLookup = useMemo(() => {
    if (!membershipData?.getVolunteerMembership) {
      return {};
    }

    const lookup: Record<string, InterfaceVolunteerMembership> = {};
    membershipData.getVolunteerMembership.forEach(
      (membership: InterfaceVolunteerMembership) => {
        const key = membership.group
          ? `${membership.event.id}-${membership.group.id}`
          : membership.event.id;

        lookup[key] = membership;
      },
    );
    return lookup;
  }, [membershipData]);

  // Extracts the list of upcoming events from the fetched data
  const events = useMemo(() => {
    if (eventsData?.organization?.events?.edges) {
      const mappedEvents = eventsData.organization.events.edges.map((edge) => {
        // Determine if this is a recurring event:
        // 1. If isRecurringEventTemplate is true, it's the base template/series
        // 2. If isRecurringEventTemplate is false but baseEvent exists and baseEvent.isRecurringEventTemplate is true, it's a recurring instance
        // 3. If isRecurringEventTemplate is false and no baseEvent, it's standalone
        const isRecurringInstance =
          edge.node.baseEvent && edge.node.baseEvent.isRecurringEventTemplate;
        const isRecurringTemplate = edge.node.isRecurringEventTemplate;
        const isRecurring = isRecurringTemplate || isRecurringInstance;

        const event: InterfaceMappedEvent = {
          ...edge.node,
          _id: edge.node.id,
          title: edge.node.name,
          startDate: edge.node.startAt,
          endDate: edge.node.endAt,
          recurring: Boolean(isRecurring),
          isRecurringInstance: Boolean(isRecurringInstance),
          baseEventId: edge.node.baseEvent?.id || null,
          volunteerGroups:
            edge.node.volunteerGroups?.map((group) => ({
              _id: group.id,
              name: group.name,
              description: group.description,
              volunteersRequired: group.volunteersRequired,
              volunteers: group.volunteers || [],
            })) || [],
          volunteers: edge.node.volunteers || [],
        };

        return event;
      });

      // Filter events based on search term and search by field
      if (searchTerm.trim()) {
        return mappedEvents.filter((event) => {
          const searchValue = searchTerm.toLowerCase();
          if (searchBy === 'title') {
            return event.title.toLowerCase().includes(searchValue);
          }
          const location = event.location?.toLowerCase() ?? '';
          return location.includes(searchValue);
        });
      }

      return mappedEvents;
    }
    return [];
  }, [eventsData, searchTerm, searchBy]);

  // Create enhanced membership lookup after events are defined
  const membershipLookup = useMemo(() => {
    const lookup: Record<string, InterfaceVolunteerMembership> = {
      ...basicMembershipLookup,
    };

    // For recurring events, add cross-references between instances and series
    if (events.length > 0) {
      Object.entries(basicMembershipLookup).forEach(([, membership]) => {
        const eventId = membership.event.id;

        // Find if this membership is for a base template (series-level)
        const relatedInstances = events.filter(
          (event) => event.baseEventId === eventId, // This instance belongs to this template
        );

        // Add lookup keys for all related instances
        relatedInstances.forEach((relatedEvent) => {
          const instanceKey = membership.group
            ? `${relatedEvent._id}-${membership.group.id}`
            : relatedEvent._id;

          // Only add if we don't already have a specific membership for this instance
          if (!lookup[instanceKey]) lookup[instanceKey] = membership;
        });
      });
    }

    return lookup;
  }, [basicMembershipLookup, events]);

  // Renders a loader while events or membership data are being fetched
  if (eventsLoading || membershipLoading) return <Loader size="xl" />;
  // Displays an error message if there is an issue loading the events
  if (eventsError)
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            {tErrors('errorLoading', { entity: 'Events' })}
          </h6>
        </div>
      </div>
    );

  // Renders the upcoming events list and UI elements for searching, sorting, and adding pledges
  return (
    <>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        {/* Search input field and button */}
        <SearchBar
          placeholder={tCommon('searchBy', {
            item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
          })}
          onChange={debouncedSearch}
          onSearch={debouncedSearch}
          inputTestId="searchBy"
          buttonTestId="searchBtn"
        />
        <div className="d-flex gap-4 mb-1">
          <div className="d-flex justify-space-between align-items-center gap-3">
            <SortingButton
              sortingOptions={[
                { label: t('name'), value: 'title' },
                { label: tCommon('location'), value: 'location' },
              ]}
              selectedOption={searchBy}
              onSortChange={(value) =>
                setSearchBy(value as 'title' | 'location')
              }
              dataTestIdPrefix="searchByToggle"
              buttonLabel={tCommon('searchBy', { item: '' })}
            />
          </div>
        </div>
      </div>
      {events.length < 1 ? (
        <Stack height="100%" alignItems="center" justifyContent="center">
          {/* Displayed if no events are found */}
          {t('noEvents')}
        </Stack>
      ) : (
        events.map((event: InterfaceMappedEvent, index: number) => {
          const {
            title,
            description,
            startDate,
            endDate,
            location,
            volunteerGroups,
            recurring,
            _id,
          } = event;

          // Get volunteer status for individual volunteering
          const volunteerStatus = getVolunteerStatus(_id);
          const Icon = volunteerStatus.icon;

          return (
            <Accordion className="mt-3 rounded" key={_id}>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <div className={styles.accordionSummary}>
                  <div
                    className={styles.titleContainerVolunteer}
                    data-testid={`detailContainer${index + 1}`}
                  >
                    <div className="d-flex">
                      <h3 data-testid="eventTitle">{title}</h3>
                      {recurring && (
                        <Chip
                          icon={<Circle className={styles.chipIcon} />}
                          label={t('recurring')}
                          variant="outlined"
                          color="primary"
                          className={`${styles.chip} ${styles.active}`}
                        />
                      )}
                    </div>

                    <div className={`d-flex gap-4 ${styles.subContainer}`}>
                      <span>
                        {' '}
                        <IoLocationOutline className="me-1 mb-1" />
                        location: {location}
                      </span>
                      {recurring ? (
                        <span>
                          Recurrence: {event.recurrenceRule?.frequency}
                        </span>
                      ) : (
                        <>
                          <span>
                            Start Date:{' '}
                            {new Date(startDate).toLocaleDateString()}
                          </span>
                          <span>
                            End Date: {new Date(endDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <Button
                      variant={
                        new Date(endDate) < new Date()
                          ? 'outline-secondary'
                          : volunteerStatus.buttonVariant
                      }
                      data-testid="volunteerBtn"
                      disabled={
                        volunteerStatus.disabled ||
                        new Date(endDate) < new Date()
                      }
                      onClick={() =>
                        handleVolunteerClick(
                          _id,
                          title,
                          startDate,
                          null,
                          null,
                          'requested',
                          recurring,
                        )
                      }
                      className={styles.outlineBtn}
                    >
                      <Icon className="me-1" size={21} />
                      {volunteerStatus.buttonText}
                    </Button>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails className="d-flex gap-3 flex-column">
                {description && (
                  <div className="d-flex gap-3">
                    <span>Description: </span>
                    <span>{description}</span>
                  </div>
                )}
                {volunteerGroups && volunteerGroups.length > 0 && (
                  <Form.Group>
                    <Form.Label
                      className="fw-lighter ms-2 mb-2 "
                      style={{ fontSize: '1rem', color: 'grey' }}
                    >
                      Volunteer Groups:
                    </Form.Label>

                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      className={styles.modalTable}
                    >
                      <Table aria-label="group table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="fw-bold">Sr. No.</TableCell>
                            <TableCell className="fw-bold">
                              Group Name
                            </TableCell>
                            <TableCell className="fw-bold" align="center">
                              No. of Members
                            </TableCell>
                            <TableCell className="fw-bold" align="center">
                              Options
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

      {/* Recurring Event Volunteer Modal */}
      <RecurringEventVolunteerModal
        show={showRecurringModal}
        onHide={handleModalClose}
        eventName={pendingVolunteerRequest?.eventName || ''}
        eventDate={pendingVolunteerRequest?.eventDate || ''}
        isForGroup={!!pendingVolunteerRequest?.groupId}
        groupName={pendingVolunteerRequest?.groupName}
        onSelectSeries={() => handleRecurringModalSelection('ENTIRE_SERIES')}
        onSelectInstance={() =>
          handleRecurringModalSelection('THIS_INSTANCE_ONLY')
        }
      />
    </>
  );
};

export default UpcomingEvents;
