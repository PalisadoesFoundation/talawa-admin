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
import { Button, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  EVENT_ATTENDEES,
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { useParams } from 'react-router';
import type { InterfaceMember } from 'types/Event/interface';
import { EventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';
import type { InterfaceUserAttendee } from 'types/User/interface';

function EventRegistrants(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'eventRegistrant' });
  const { orgId, eventId } = useParams<{ orgId: string; eventId: string }>();
  const [registrants, setRegistrants] = useState<InterfaceUserAttendee[]>([]);
  const [attendees, setAttendees] = useState<InterfaceMember[]>([]);
  const [combinedData, setCombinedData] = useState<
    (InterfaceUserAttendee & Partial<InterfaceMember>)[]
  >([]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

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

  // Create proper GraphQL variables based on event type
  const registrantVariables = isRecurring
    ? { recurringEventInstanceId: eventId }
    : { eventId: eventId };

  const [getEventRegistrants] = useLazyQuery(EVENT_REGISTRANTS, {
    variables: registrantVariables,
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.getEventAttendeesByEventId) {
        const mappedData = data.getEventAttendeesByEventId.map(
          (attendee: InterfaceUserAttendee) => ({
            id: attendee.id,
            userId: attendee.user?.id,
            isRegistered: attendee.isRegistered,
            user: attendee.user,
          }),
        );
        setRegistrants(mappedData);
      }
    },
  });
  // Fetch attendees
  const [getEventAttendees] = useLazyQuery(EVENT_ATTENDEES, {
    variables: { eventId: eventId },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.event?.attendees) {
        setAttendees(data.event.attendees);
      }
    },
  });
  // callback function to refresh the data
  const refreshData = useCallback(() => {
    getEventRegistrants();
    getEventAttendees();
  }, [getEventRegistrants, getEventAttendees]);
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  // Combine registrants and attendees data
  useEffect(() => {
    if (registrants.length > 0 && attendees.length > 0) {
      const mergedData = registrants.map((registrant) => {
        const matchedAttendee = attendees.find(
          (attendee) => attendee.id === registrant.user.id,
        );
        const [date, timeWithMilliseconds] = matchedAttendee?.createdAt
          ? matchedAttendee.createdAt.split('T')
          : ['N/A', 'N/A'];
        const [time] =
          timeWithMilliseconds !== 'N/A'
            ? timeWithMilliseconds.split('.')
            : ['N/A'];
        return {
          ...registrant,
          name: matchedAttendee?.name || 'N/A',
          createdAt: date,
          time: time,
        };
      });
      setCombinedData(mergedData);
    }
  }, [registrants, attendees]);
  return (
    <div>
      <div>
        {eventId ? (
          <CheckInWrapper eventId={eventId.toString()} />
        ) : (
          <CheckInWrapper eventId="" />
        )}
        <Button
          data-testid="filter-button"
          className={`border-1 mx-4 ${styles.createButton} `}
        >
          <img
            src="/images/svg/organization.svg"
            width={30.63}
            height={30.63}
            alt={t('sort')}
          />
          {t('allRegistrants')}
        </Button>
      </div>
      <TableContainer
        component={Paper}
        className="mt-3"
        sx={{ borderRadius: '16px' }}
      >
        <Table aria-label={t('eventRegistrantsTable')} role="grid">
          <TableHead>
            <TableRow role="row">
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
                data-testid="table-header-add-registrant"
                className={styles.customcell}
              >
                {t('addRegistrant')}
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
                    align="left"
                    data-testid={`add-registrant-button-${index}`}
                  >
                    {eventId && orgId && (
                      <EventRegistrantsWrapper
                        eventId={eventId.toString()}
                        orgId={orgId}
                        onUpdate={refreshData}
                      />
                    )}
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
