/**
 * OrganizationEvents Component
 *
 * This component is responsible for rendering and managing the organization events page.
 * It includes functionalities for viewing events in different calendar views and creating new events.
 *
 * @returns The rendered OrganizationEvents component.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Integrates with `react-bootstrap` for UI components and `@mui/x-date-pickers` for date/time pickers.
 * - Supports multilingual translations using `react-i18next`.
 * - Handles event creation with validations.
 *
 * @example
 * ```tsx
 * <OrganizationEvents />
 * ```
 */

import React, { useState, useEffect, JSX } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import EventCalendar from 'components/EventCalender/Monthly/EventCalender';
import EventHeader from 'components/EventCalender/Header/EventHeader';
import styles from './OrganizationEvents.module.css';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/EventMutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useLocalStorage from 'utils/useLocalstorage';
import { useParams } from 'react-router';
import type { InterfaceEvent, ICreateEventInput } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';
import {
  CRUDModalTemplate,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import EventForm, {
  formatRecurrenceForPayload,
} from 'shared-components/EventForm/EventForm';
import type {
  IEventFormSubmitPayload,
  IEventFormValues,
} from 'types/EventForm/interface';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';

dayjs.extend(utc);

// Define the type for an event edge
interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    location?: string | null;
    isPublic: boolean;
    isRegisterable: boolean;
    // Recurring event fields
    isRecurringEventTemplate?: boolean;
    baseEvent?: {
      id: string;
      name: string;
    } | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    // New recurrence description fields
    recurrenceDescription?: string | null;
    recurrenceRule?: InterfaceRecurrenceRule | null;
    // Attachments
    attachments?: Array<{
      url: string;
      mimeType: string;
    }>;
    creator: {
      id: string;
      name: string;
    };
    organization: {
      id: string;
      name: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  cursor: string;
}

export enum ViewType {
  DAY = 'Day',
  MONTH = 'Month',
  YEAR = 'Year',
}

function organizationEvents(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const [viewType, setViewType] = useState<ViewType>(ViewType.MONTH);
  const createEventModal = useModalState();
  const { orgId: currentUrl } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const showInviteModal = (): void => createEventModal.open();
  const closeCreateEventModal = (): void => createEventModal.close();

  const handleChangeView = (item: string | null): void => {
    if (item) setViewType(item as ViewType);
  };

  const {
    data: eventData,
    error: eventDataError,
    refetch: refetchEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: {
      id: currentUrl,
      first: 100,
      after: null,
      startDate: dayjs(new Date(currentYear, currentMonth, 1))
        .startOf('month')
        .toISOString(),
      endDate: dayjs(new Date(currentYear, currentMonth, 1))
        .endOf('month')
        .toISOString(),
      includeRecurring: true,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const { data: orgData } = useQuery(
    GET_ORGANIZATION_DATA_PG,
    {
      variables: {
        id: currentUrl,
        first: 10,
        after: null,
      },
    },
  );

  // Mutation to create a new event
  const [create] = useMutation(CREATE_EVENT_MUTATION, {
    errorPolicy: 'all',
  });

  const userId = getItem('id') as string;
  const storedRole = getItem('role') as string | null;
  const userRole =
    storedRole === 'administrator' ? UserRole.ADMINISTRATOR : UserRole.REGULAR;

  const defaultEventValues = React.useMemo<IEventFormValues>(
    () => ({
      name: '',
      description: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '08:00:00',
      endTime: '10:00:00',
      allDay: true,
      isPublic: false,
      isInviteOnly: true,
      isRegisterable: true,
      recurrenceRule: null,
      createChat: false,
    }),
    [],
  );
  const [formResetKey, setFormResetKey] = useState(0);

  const handleCreateEvent = async (
    payload: IEventFormSubmitPayload,
  ): Promise<void> => {
    try {
      const recurrenceInput = payload.recurrenceRule
        ? formatRecurrenceForPayload(payload.recurrenceRule, payload.startDate)
        : undefined;

      const input: ICreateEventInput = {
        name: payload.name,
        startAt: payload.startAtISO,
        endAt: payload.endAtISO,
        organizationId: currentUrl,
        allDay: payload.allDay,
        isPublic: payload.isPublic,
        isRegisterable: payload.isRegisterable,
        isInviteOnly: payload.isInviteOnly,
        ...(payload.description && { description: payload.description }),
        ...(payload.location && { location: payload.location }),
        ...(recurrenceInput && { recurrence: recurrenceInput }),
      };

      const { data: createEventData, errors } = await create({
        variables: { input },
      });

      if (createEventData) {
        NotificationToast.success(t('eventCreated'));
        try {
          await refetchEvents();
        } catch {
          // Refetch failure is non-critical
        }
        setFormResetKey((prev) => prev + 1);
        createEventModal.close();
      } else if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  // Normalize event data for EventCalendar with proper typing
  const events: InterfaceEvent[] = (
    eventData?.organization?.events?.edges || []
  ).map((edge: IEventEdge) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description || '',
    startAt: dayjs.utc(edge.node.startAt).format('YYYY-MM-DD'),
    endAt: dayjs.utc(edge.node.endAt).format('YYYY-MM-DD'),
    startTime: edge.node.allDay
      ? null
      : dayjs.utc(edge.node.startAt).format('HH:mm:ss'),
    endTime: edge.node.allDay
      ? null
      : dayjs.utc(edge.node.endAt).format('HH:mm:ss'),
    allDay: edge.node.allDay,
    location: edge.node.location || '',
    isPublic: edge.node.isPublic,
    isRegisterable: edge.node.isRegisterable,
    // Add recurring event information
    isRecurringEventTemplate: edge.node.isRecurringEventTemplate,
    baseEvent: edge.node.baseEvent,
    sequenceNumber: edge.node.sequenceNumber,
    totalCount: edge.node.totalCount,
    hasExceptions: edge.node.hasExceptions,
    progressLabel: edge.node.progressLabel,
    recurrenceDescription: edge.node.recurrenceDescription,
    recurrenceRule: edge.node.recurrenceRule,
    creator: {
      id: edge.node.creator.id,
      name: edge.node.creator.name,
    },
    attendees: [],
  }));

  useEffect(() => {
    if (eventDataError) {
      const hasData =
        Array.isArray(eventData?.organization?.events?.edges) &&
        eventData.organization.events.edges.length > 0;

      const errorMessage = eventDataError.message?.toLowerCase() || '';
      const isRateLimitError =
        errorMessage.includes('too many requests') ||
        errorMessage.includes('rate limit') ||
        eventDataError.message?.includes('Please try again later');
      const isAuthError = errorMessage.includes('not authorized');

      if (isRateLimitError || (isAuthError && hasData)) {
        return;
      }

      errorHandler(t, eventDataError);
    }
  }, [eventDataError, eventData, t]);

  return (
    <>
      <div className={styles.mainpageright}>
        <div className={styles.justifyspOrganizationEvents}>
          <EventHeader
            viewType={viewType}
            showInviteModal={showInviteModal}
            handleChangeView={handleChangeView}
          />
        </div>
      </div>

      <EventCalendar
        viewType={viewType}
        eventData={events}
        refetchEvents={refetchEvents}
        orgData={orgData?.organization}
        userRole={userRole}
        userId={userId}
        onMonthChange={(month, year) => {
          setCurrentMonth(month);
          setCurrentYear(year);
        }}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      <CRUDModalTemplate
        open={createEventModal.isOpen}
        onClose={closeCreateEventModal}
        title={t('eventDetails')}
        data-testid="createEventModal"
        showFooter={false}
      >
        <EventForm
          key={formResetKey}
          initialValues={defaultEventValues}
          onSubmit={handleCreateEvent}
          onCancel={closeCreateEventModal}
          submitLabel={t('createEvent')}
          t={t}
          tCommon={tCommon}
          showCreateChat
          showRegisterable
          showPublicToggle
          showRecurrenceToggle
        />
      </CRUDModalTemplate>
    </>
  );
}

export default organizationEvents;
