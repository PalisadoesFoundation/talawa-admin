import React, { useMemo, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from '../VolunteerManagement.module.css';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
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
import { Circle, Search, WarningAmberRounded } from '@mui/icons-material';

import { GridExpandMoreIcon } from '@mui/x-data-grid';
import useLocalStorage from 'utils/useLocalstorage';
import { useMutation, useQuery } from '@apollo/client';
import type { InterfaceUserEvents } from 'utils/interfaces';
import { IoIosHand } from 'react-icons/io';
import Loader from 'components/Loader/Loader';
import { USER_EVENTS_VOLUNTEER } from 'GraphQl/Queries/PlugInQueries';
import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import SortingButton from 'subComponents/SortingButton';

/**
 * The `UpcomingEvents` component displays list of upcoming events for the user to volunteer.
 * It allows the user to search, sort, and volunteer for events/volunteer groups.
 *
 * @returns The rendered component displaying the upcoming events.
 */
const UpcomingEvents = (): JSX.Element => {
  // Retrieves translation functions for various namespaces
  const { t } = useTranslation('translation', {
    keyPrefix: 'userVolunteer',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Retrieves stored user ID from local storage
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  // Extracts organization ID from the URL parameters
  const { orgId } = useParams();
  if (!orgId || !userId) {
    // Redirects to the homepage if orgId or userId is missing
    return <Navigate to={'/'} replace />;
  }
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchBy, setSearchBy] = useState<'title' | 'location'>('title');

  const [createVolunteerMembership] = useMutation(CREATE_VOLUNTEER_MEMBERSHIP);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [],
  );

  const handleVolunteer = async (
    eventId: string,
    group: string | null,
    status: string,
  ): Promise<void> => {
    try {
      await createVolunteerMembership({
        variables: {
          data: {
            event: eventId,
            group,
            status,
            userId,
          },
        },
      });
      toast.success(t('volunteerSuccess'));
      refetchEvents();
    } catch (error) {
      toast.error((error as Error).message);
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
      eventsByOrganizationConnection: InterfaceUserEvents[];
    };
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
  } = useQuery(USER_EVENTS_VOLUNTEER, {
    variables: {
      organization_id: orgId,
      title_contains: searchBy === 'title' ? searchTerm : '',
      location_contains: searchBy === 'location' ? searchTerm : '',
      upcomingOnly: true,
      first: null,
      skip: null,
    },
  });

  // Extracts the list of upcoming events from the fetched data
  const events = useMemo(() => {
    if (eventsData) {
      return eventsData.eventsByOrganizationConnection;
    }
    return [];
  }, [eventsData]);

  // Renders a loader while events are being fetched
  if (eventsLoading) return <Loader size="xl" />;
  if (eventsError) {
    // Displays an error message if there is an issue loading the events
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
  }

  // Renders the upcoming events list and UI elements for searching, sorting, and adding pledges
  return (
    <>
      <div className={`${styles.btnsContainer} gap-4 flex-wrap`}>
        {/* Search input field and button */}
        <div className={`${styles.input} mb-1`}>
          <Form.Control
            type="name"
            placeholder={tCommon('searchBy', {
              item: searchBy.charAt(0).toUpperCase() + searchBy.slice(1),
            })}
            autoComplete="off"
            required
            className={styles.inputField}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            data-testid="searchBy"
          />
          <Button
            tabIndex={-1}
            className={`position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center`}
            data-testid="searchBtn"
          >
            <Search />
          </Button>
        </div>
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
        events.map((event: InterfaceUserEvents, index: number) => {
          const {
            title,
            description,
            startDate,
            endDate,
            location,
            volunteerGroups,
            recurring,
            _id,
            volunteers,
          } = event;
          const isVolunteered = volunteers.some(
            (volunteer) => volunteer.user._id === userId,
          );
          return (
            <Accordion className="mt-3 rounded" key={_id}>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <div className={styles.accordionSummary}>
                  <div
                    className={styles.titleContainer}
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
                      <span>Start Date: {startDate as unknown as string}</span>
                      <span>End Date: {endDate as unknown as string}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <Button
                      variant={
                        new Date(endDate) < new Date()
                          ? 'outline-secondary'
                          : 'outline-success'
                      }
                      data-testid="volunteerBtn"
                      disabled={isVolunteered || new Date(endDate) < new Date()}
                      onClick={() => handleVolunteer(_id, null, 'requested')}
                    >
                      {isVolunteered ? (
                        <FaCheck className="me-1" />
                      ) : (
                        <IoIosHand className="me-1" size={21} />
                      )}

                      {t(isVolunteered ? 'volunteered' : 'volunteer')}
                    </Button>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails className="d-flex gap-3 flex-column">
                {
                  /*istanbul ignore next*/
                  description && (
                    <div className="d-flex gap-3">
                      <span>Description: </span>
                      <span>{description}</span>
                    </div>
                  )
                }
                {volunteerGroups && volunteerGroups.length > 0 && (
                  <Form.Group>
                    <Form.Label
                      className="fw-lighter ms-2 mb-2 "
                      style={{
                        fontSize: '1rem',
                        color: 'grey',
                      }}
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
                          {volunteerGroups.map((group, index) => {
                            const { _id: gId, name, volunteers } = group;
                            const hasJoined = volunteers.some(
                              (volunteer) => volunteer._id === userId,
                            );
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
                                        : 'outline-success'
                                    }
                                    size="sm"
                                    data-testid="joinBtn"
                                    disabled={
                                      hasJoined ||
                                      new Date(endDate) < new Date()
                                    }
                                    onClick={() =>
                                      handleVolunteer(_id, gId, 'requested')
                                    }
                                  >
                                    {t(hasJoined ? 'joined' : 'join')}
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
    </>
  );
};

export default UpcomingEvents;
