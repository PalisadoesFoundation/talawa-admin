import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import { useMutation, useQuery } from '@apollo/client';
import {
  InterfaceVolunteerMembership,
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
import { FaCheck } from 'react-icons/fa';
import AdminSearchFilterBar from 'components/AdminSearchFilterBar/AdminSearchFilterBar';
import RecurringEventVolunteerModal from './RecurringEventVolunteerModal';

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

  useMutation(CREATE_VOLUNTEER_MEMBERSHIP);

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
    return <Loader size="xl" />;
  }

  if (eventsError) {
    return (
      <div className={`${styles.container} bg-white rounded-4 my-3`}>
        <div className={styles.message} data-testid="errorMsg">
          <WarningAmberRounded className={styles.errorIcon} />
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
      <AdminSearchFilterBar
        searchPlaceholder={tCommon('searchBy', { item: 'Title or Location' })}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputTestId="searchByInput"
        searchButtonTestId="searchBtn"
        hasDropdowns={true}
        dropdowns={[searchByDropdown]}
      />

      {events.length === 0 ? (
        <Stack alignItems="center" justifyContent="center">
          {t('noEvents')}
        </Stack>
      ) : (
        events.map((event, index) => {
          const status = getVolunteerStatus(event._id);
          const Icon = status.icon;

          return (
            <Accordion key={event._id} className="mt-3 rounded">
              <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <div
                  className={styles.titleContainerVolunteer}
                  data-testid={`detailContainer${index + 1}`}
                >
                  <h3 data-testid="eventTitle">{event.title}</h3>
                  <Button
                    variant={status.buttonVariant}
                    data-testid="volunteerBtn"
                    disabled={status.disabled}
                  >
                    <Icon className="me-1" />
                    {status.buttonText}
                  </Button>
                </div>
              </AccordionSummary>
              <AccordionDetails />
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
        groupName={pendingVolunteerRequest?.groupName}
        onSelectSeries={() => {}}
        onSelectInstance={() => {}}
      />
    </>
  );
};

export default UpcomingEvents;
