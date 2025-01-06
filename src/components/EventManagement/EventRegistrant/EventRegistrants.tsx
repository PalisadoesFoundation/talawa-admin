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
import styles from '../../../style/app.module.css';
import { useLazyQuery } from '@apollo/client';
import { EVENT_ATTENDEES, EVENT_REGISTRANTS } from 'GraphQl/Queries/Queries';
import { useParams } from 'react-router-dom';
import type { InterfaceMember } from '../EventAttendance/InterfaceEvents';
import { EventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';
/**
 * Interface for user data
 */
interface InterfaceUser {
  _id: string;
  userId: string;
  isRegistered: boolean;
  __typename: string;
  time: string;
}
/**
 * Component to manage and display event registrant information
 * Includes adding new registrants and check-in functionality for registrants
 * @returns JSX element containing the event attendance interface
 */
function EventRegistrants(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrant',
  });
  const { orgId, eventId } = useParams<{ orgId: string; eventId: string }>();
  const [registrants, setRegistrants] = useState<InterfaceUser[]>([]);
  const [attendees, setAttendees] = useState<InterfaceMember[]>([]);
  const [combinedData, setCombinedData] = useState<
    (InterfaceUser & Partial<InterfaceMember>)[]
  >([]);
  // Fetch registrants
  const [getEventRegistrants] = useLazyQuery(EVENT_REGISTRANTS, {
    variables: { eventId },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.getEventAttendeesByEventId) {
        const mappedData = data.getEventAttendeesByEventId.map(
          (attendee: InterfaceUser) => ({
            _id: attendee._id,
            userId: attendee.userId,
            isRegistered: attendee.isRegistered,
            __typename: attendee.__typename,
          }),
        );
        setRegistrants(mappedData);
      }
    },
  });
  // Fetch attendees
  const [getEventAttendees] = useLazyQuery(EVENT_ATTENDEES, {
    variables: { id: eventId },
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
          (attendee) => attendee._id === registrant.userId,
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
          firstName: matchedAttendee?.firstName || 'N/A',
          lastName: matchedAttendee?.lastName || 'N/A',
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
      <TableContainer component={Paper} className={`mt-3 ${styles.tableHead}`}>
        <Table aria-label={t('eventRegistrantsTable')} role="grid">
          <TableHead>
            <TableRow role="row" className={`${styles.rowBackground}`}>
              <TableCell
                data-testid="table-header-serial"
                className={styles.tableHeader}
                role="columnheader"
                aria-sort="none"
              >
                {t('serialNumber')}
              </TableCell>
              <TableCell
                data-testid="table-header-registrant"
                className={styles.tableHeader}
              >
                {t('registrant')}
              </TableCell>
              <TableCell
                data-testid="table-header-registered-at"
                className={styles.tableHeader}
              >
                {t('registeredAt')}
              </TableCell>
              <TableCell
                data-testid="table-header-created-at"
                className={styles.tableHeader}
              >
                {t('createdAt')}
              </TableCell>
              <TableCell
                data-testid="table-header-add-registrant"
                className={styles.tableHeader}
              >
                {t('addRegistrant')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.length === 0 ? (
              <TableRow>
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
                <TableRow
                  key={data._id}
                  data-testid={`registrant-row-${index}`}
                >
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
                    {data.firstName} {data.lastName}
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
                    {data.time}
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
