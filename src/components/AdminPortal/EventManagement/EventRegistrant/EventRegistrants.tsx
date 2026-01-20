/**
 *
 * This component is responsible for displaying a list of event registrants
 * and attendees in a tabular format. It fetches data from GraphQL queries
 * and combines registrants and attendees data to display relevant information.
 *
 * Features
 * - Fetches event registrants and attendees using GraphQL lazy queries.
 * - Combines registrants and attendees data to display enriched information.
 * - Displays a table with serial number, registrant name, registration date,
 *   and creation time.
 * - Provides a button to add new registrants and a wrapper for event check-in.
 *
 * Props
 * - None
 *
 * Hooks
 * - `useTranslation`: For internationalization of text content.
 * - `useParams`: To extract `orgId` and `eventId` from the route parameters.
 * - `useLazyQuery`: To fetch event registrants and attendees data.
 * - `useState`: To manage state for registrants, attendees, and combined data.
 * - `useEffect`: To fetch and combine data on component mount and updates.
 * - `useCallback`: To memoize the data refresh function.
 *
 * GraphQLQueries
 * - `EVENT_REGISTRANTS`: Fetches the list of registrants for the event.
 * - `EVENT_ATTENDEES`: Fetches the list of attendees for the event.
 *
 * @returns
 * - A JSX element containing a table of event registrants and attendees.
 *
 * Usage
 * - This component is used in the event management section of the application
 *   to display and manage event registrants and attendees.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import {
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
  EVENT_CHECKINS,
} from 'GraphQl/Queries/Queries';
import { REMOVE_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import { useParams } from 'react-router';
import { EventRegistrantsWrapper } from 'components/AdminPortal/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'shared-components/CheckIn/CheckInWrapper';
import type { InterfaceUserAttendee } from 'types/shared-components/User/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import DataTable from 'shared-components/DataTable/DataTable';
import { IColumnDef } from 'types/shared-components/DataTable/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

function EventRegistrants(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventRegistrant' });
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');
  const { orgId, eventId } = useParams<{ orgId: string; eventId: string }>();
  const [registrants, setRegistrants] = useState<InterfaceUserAttendee[]>([]);
  const [checkedInUsers, setCheckedInUsers] = useState<string[]>([]);
  const [combinedData, setCombinedData] = useState<
    (InterfaceUserAttendee & { isCheckedIn?: boolean; name?: string })[]
  >([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  // Mutation for removing a registrant
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  // First, get event details to determine if it's recurring or standalone
  const { data: eventData } = useQuery(EVENT_DETAILS, {
    variables: { eventId: eventId },
    fetchPolicy: 'cache-first',
  });

  // Determine event type and set appropriate variables
  useEffect(() => {
    if (eventData?.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
    }
  }, [eventData]);

  const registrantVariables = isRecurring
    ? { recurringEventInstanceId: eventId }
    : { eventId: eventId };

  const [getEventRegistrants] = useLazyQuery(EVENT_REGISTRANTS, {
    variables: registrantVariables,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.getEventAttendeesByEventId) {
        const mappedData = data.getEventAttendeesByEventId.map(
          (attendee: {
            id: string;
            user: { id: string; name: string; emailAddress: string };
            isRegistered: boolean;
            createdAt: string;
          }) => ({
            id: attendee.id,
            userId: attendee.user?.id,
            isRegistered: attendee.isRegistered,
            user: attendee.user,
            createdAt: attendee.createdAt,
            time: '', // Will be processed in useEffect
          }),
        );
        setRegistrants(mappedData);
      }
    },
  });

  // Fetch check-in status
  const [getEventCheckIns] = useLazyQuery(EVENT_CHECKINS, {
    variables: { eventId: eventId },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.event?.attendeesCheckInStatus) {
        const checkedInUserIds = data.event.attendeesCheckInStatus
          .filter((status: { isCheckedIn: boolean }) => status.isCheckedIn)
          .map((status: { user: { id: string } }) => status.user.id);
        setCheckedInUsers(checkedInUserIds);
      }
    },
  });
  // callback function to refresh the data
  const refreshData = useCallback(() => {
    getEventRegistrants();
    getEventCheckIns();
  }, [getEventRegistrants, getEventCheckIns]);

  // Function to remove a registrant from the event
  const deleteRegistrant = useCallback(
    (userId: string): void => {
      // Check if user is already checked in
      if (checkedInUsers.includes(userId)) {
        NotificationToast.error(tCommon('cannotUnregisterCheckedIn'));
        return;
      }

      NotificationToast.warning(t('removingAttendee') as string);
      const removeVariables = isRecurring
        ? { userId, recurringEventInstanceId: eventId }
        : { userId, eventId: eventId };

      removeRegistrantMutation({ variables: removeVariables })
        .then(() => {
          NotificationToast.success(t('attendeeRemovedSuccessfully') as string);
          refreshData(); // Refresh the data after removal
        })
        .catch((err) => {
          NotificationToast.error(t('errorRemovingAttendee') as string);
          NotificationToast.error(err.message);
        });
    },
    [
      isRecurring,
      eventId,
      removeRegistrantMutation,
      refreshData,
      checkedInUsers,
    ],
  );
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  // Process registrants data with check-in status
  useEffect(() => {
    if (registrants.length > 0) {
      const processedData = registrants.map((registrant) => {
        const [date, timeWithMilliseconds] = registrant.createdAt
          ? registrant.createdAt.split('T')
          : ['N/A', 'N/A'];
        const [time] =
          timeWithMilliseconds !== 'N/A'
            ? timeWithMilliseconds.split('.')
            : ['N/A'];

        const isCheckedIn = checkedInUsers.includes(registrant.user.id);

        return {
          ...registrant,
          name: registrant.user.name || 'N/A',
          createdAt: date,
          time: time,
          isCheckedIn: isCheckedIn,
        };
      });
      setCombinedData(processedData);
    } else {
      setCombinedData([]);
    }
  }, [registrants, checkedInUsers]);

  const tableData = combinedData.map((row, index) => ({
    ...row,
    __serial: index + 1,
  }));

  const columns: IColumnDef<
    InterfaceUserAttendee & {
      isCheckedIn?: boolean;
      name?: string;
      __serial: number;
    }
  >[] = [
    {
      id: 'serial',
      header: t('serialNumber'),
      accessor: '__serial',
    },
    {
      id: 'registrant',
      header: t('registrant'),
      accessor: 'name',
    },
    {
      id: 'registeredAt',
      header: t('registeredAt'),
      accessor: 'createdAt',
    },
    {
      id: 'createdAt',
      header: t('createdAt'),
      accessor: (row) =>
        row.time && row.time !== 'N/A'
          ? new Date(`1970-01-01T${row.time}`).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : 'N/A',
    },
    {
      id: 'options',
      header: t('options'),
      accessor: () => null,
      render: (_val, row) => (
        <button
          type="button"
          className={`btn btn-sm ${
            row.isCheckedIn ? 'btn-secondary' : 'btn-outline-danger'
          }`}
          onClick={() => deleteRegistrant(row.user.id)}
          disabled={row.isCheckedIn}
          title={
            row.isCheckedIn
              ? t('cannotUnregisterCheckedInTooltip')
              : t('unregister')
          }
        >
          {row.isCheckedIn ? t('checkedIn') : t('unregister')}
        </button>
      ),
    },
  ];

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div>
        <div className="d-flex justify-content-between align-items-center">
          {eventId ? (
            <CheckInWrapper
              eventId={eventId.toString()}
              onCheckInUpdate={refreshData}
            />
          ) : (
            <CheckInWrapper eventId="" />
          )}
          {eventId && orgId && (
            <EventRegistrantsWrapper
              eventId={eventId.toString()}
              orgId={orgId}
              onUpdate={refreshData}
            />
          )}
        </div>

        <DataTable
          data={tableData}
          columns={columns}
          rowKey="id"
          ariaLabel={t('eventRegistrantsTable')}
          emptyMessage={t('noRegistrantsFound')}
        />
      </div>
    </ErrorBoundaryWrapper>
  );
}
export default EventRegistrants;
