/**
 * @EventRegistrants Component
 *
 * This component is responsible for displaying a list of event registrants
 * and attendees in a tabular format. It fetches data from GraphQL queries
 * and combines registrants and attendees data to display relevant information.
 *
 * @Features
 * - Fetches event registrants and attendees using GraphQL lazy queries.
 * - Combines registrants and attendees data to display enriched information.
 * - Displays a table with serial number, registrant name, registration date,
 *   and creation time.
 * - Provides a button to add new registrants and a wrapper for event check-in.
 *
 * @Props
 * - None
 *
 * @Hooks
 * - `useTranslation`: For internationalization of text content.
 * - `useParams`: To extract `orgId` and `eventId` from the route parameters.
 * - `useLazyQuery`: To fetch event registrants and attendees data.
 * - `useState`: To manage state for registrants, attendees, and combined data.
 * - `useEffect`: To fetch and combine data on component mount and updates.
 * - `useCallback`: To memoize the data refresh function.
 *
 * @GraphQLQueries
 * - `EVENT_REGISTRANTS`: Fetches the list of registrants for the event.
 * - `EVENT_ATTENDEES`: Fetches the list of attendees for the event.
 *
 * @Returns
 * - A JSX element containing a table of event registrants and attendees.
 *
 * @Usage
 * - This component is used in the event management section of the application
 *   to display and manage event registrants and attendees.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styles from 'style/app-fixed.module.css';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import {
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
  EVENT_CHECKINS,
} from 'GraphQl/Queries/Queries';
import { REMOVE_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import { useParams } from 'react-router';
import { EventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';
import type { InterfaceUserAttendee } from 'types/AdminPortal/User/interface';

function EventRegistrants(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventRegistrant' });
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
        toast.error('Cannot unregister a user who has already checked in');
        return;
      }

      toast.warn('Removing the attendee...');
      const removeVariables = isRecurring
        ? { userId, recurringEventInstanceId: eventId }
        : { userId, eventId: eventId };

      removeRegistrantMutation({ variables: removeVariables })
        .then(() => {
          toast.success('Attendee removed successfully');
          refreshData(); // Refresh the data after removal
        })
        .catch((err) => {
          toast.error('Error removing attendee');
          toast.error(err.message);
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
  return (
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
      <TableContainer
        component={Paper}
        className="mt-3"
        sx={{ borderRadius: '16px' }}
      >
        <Table aria-label={t('eventRegistrantsTable')} role="grid">
          <TableHead>
            <TableRow>
              <TableCell
                data-testid="table-header-serial"
                className={styles.customcell}
                role="columnheader"
                aria-sort="none"
              >
                {t('serialNumber')}
              </TableCell>
              <TableCell
                data-testid="table-header-registrant"
                className={styles.customcell}
              >
                {t('registrant')}
              </TableCell>
              <TableCell
                data-testid="table-header-registered-at"
                className={styles.customcell}
              >
                {t('registeredAt')}
              </TableCell>
              <TableCell
                data-testid="table-header-created-at"
                className={styles.customcell}
              >
                {t('createdAt')}
              </TableCell>
              <TableCell
                data-testid="table-header-options"
                className={styles.customcell}
                align="center"
              >
                {t('options')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.length === 0 ? (
              <TableRow className={styles.noBorderRow}>
                <TableCell
                  colSpan={5}
                  align="center"
                  data-testid="no-registrants"
                >
                  {t('noRegistrantsFound')}
                </TableCell>
              </TableRow>
            ) : (
              combinedData.map((data, index) => (
                <TableRow key={data.id} data-testid={`registrant-row-${index}`}>
                  <TableCell
                    component="th"
                    scope="row"
                    data-testid={`serial-number-${index + 1}`}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-testid={`attendee-name-${index}`}
                  >
                    {data.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-testid={`registrant-registered-at-${index}`}
                  >
                    {data.createdAt}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-testid={`registrant-created-at-${index}`}
                  >
                    {data.time && data.time !== 'N/A'
                      ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString(
                          [],
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          },
                        )
                      : 'N/A'}
                  </TableCell>
                  <TableCell
                    align="center"
                    data-testid={`registrant-options-${index}`}
                  >
                    <button
                      className={`btn btn-sm ${
                        data.isCheckedIn
                          ? 'btn-secondary'
                          : 'btn-outline-danger'
                      }`}
                      onClick={() => deleteRegistrant(data.user.id)}
                      disabled={data.isCheckedIn}
                      data-testid={`delete-registrant-${index}`}
                      title={
                        data.isCheckedIn
                          ? 'Cannot unregister checked-in user'
                          : 'Unregister'
                      }
                    >
                      {data.isCheckedIn ? 'Checked In' : 'Unregister'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default EventRegistrants;
