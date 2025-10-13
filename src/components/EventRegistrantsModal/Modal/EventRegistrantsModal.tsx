/**
 * EventRegistrantsModal Component
 *
 * This component renders a modal to manage event registrants. It allows users to:
 * - View the list of registered attendees for a specific event.
 * - Add new attendees from the organization's member list or through on-spot registration.
 * - Remove existing attendees from the event.
 *
 * @component
 * @param {ModalPropType} props - The properties passed to the component.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {string} props.eventId - The ID of the event for which registrants are being managed.
 * @param {string} props.orgId - The ID of the organization associated with the event.
 * @param {() => void} props.handleClose - Callback function to close the modal.
 *
 * @returns {JSX.Element} The rendered EventRegistrantsModal component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` and `useMutation` hooks to fetch and modify data.
 * - Displays a loading spinner while data is being fetched.
 * - Integrates with `react-toastify` for user notifications.
 * - Supports translations using `react-i18next`.
 *
 * @example
 * ```tsx
 * <EventRegistrantsModal
 *   show={true}
 *   eventId="event123"
 *   orgId="org456"
 *   handleClose={() => setShowModal(false)}
 * />
 * ```
 *
 * @dependencies
 * - `react-bootstrap` for modal and button components.
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `@mui/material` for UI components like Avatar, Chip, and Autocomplete.
 * - `react-toastify` for toast notifications.
 * - `react-i18next` for translations.
 */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import {
  ADD_EVENT_ATTENDEE,
  REMOVE_EVENT_ATTENDEE,
} from 'GraphQl/Mutations/mutations';
import styles from 'style/app-fixed.module.css';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import AddOnSpotAttendee from './AddOnSpot/AddOnSpotAttendee';
import type { InterfaceUser } from 'types/User/interface';

type ModalPropType = {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
};

export const EventRegistrantsModal = (props: ModalPropType): JSX.Element => {
  const { eventId, orgId, handleClose, show } = props;
  const [member, setMember] = useState<InterfaceUser | null>(null);
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  // Hooks for mutation operations
  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  // Translation hooks
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');

  // First, get event details to determine if it's recurring or standalone
  const { data: eventData } = useQuery(EVENT_DETAILS, {
    variables: { eventId: eventId },
    fetchPolicy: 'cache-first',
  });

  // Determine event type
  useEffect(() => {
    if (eventData?.event) {
      setIsRecurring(!!eventData.event.recurrenceRule);
    }
  }, [eventData]);

  // Query hooks to fetch event attendees and organization members
  const {
    data: attendeesData,
    loading: attendeesLoading,
    refetch: attendeesRefetch,
  } = useQuery(EVENT_ATTENDEES, { variables: { eventId: eventId } });

  const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  // Function to add a new registrant to the event
  const addRegistrant = (): void => {
    if (member == null) {
      toast.warning('Please choose an user to add first!');
      return;
    }
    toast.warn('Adding the attendee...');
    const addVariables = isRecurring
      ? { userId: member.id, recurringEventInstanceId: eventId }
      : { userId: member.id, eventId: eventId };

    addRegistrantMutation({
      variables: addVariables,
    })
      .then(() => {
        toast.success(
          tCommon('addedSuccessfully', { item: 'Attendee' }) as string,
        );
        attendeesRefetch(); // Refresh the list of attendees
      })
      .catch((err) => {
        toast.error(t('errorAddingAttendee') as string);
        toast.error(err.message);
      });
  };

  // Function to remove a registrant from the event
  const deleteRegistrant = (userId: string): void => {
    toast.warn('Removing the attendee...');
    const removeVariables = isRecurring
      ? { userId, recurringEventInstanceId: eventId }
      : { userId, eventId: eventId };

    removeRegistrantMutation({ variables: removeVariables })
      .then(() => {
        toast.success(
          tCommon('removedSuccessfully', { item: 'Attendee' }) as string,
        );
        attendeesRefetch(); // Refresh the list of attendees
      })
      .catch((err) => {
        toast.error(t('errorRemovingAttendee') as string);
        toast.error(err.message);
      });
  };

  // Show a loading screen if data is still being fetched
  if (attendeesLoading || memberLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <AddOnSpotAttendee
          show={open}
          handleClose={() => setOpen(false)}
          reloadMembers={() => {
            attendeesRefetch();
          }}
        />
        <Modal.Header
          closeButton
          style={{ backgroundColor: 'var(--tableHeader-bg)' }}
        >
          <Modal.Title>Event Registrants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2"> Registered Registrants </h5>
          {!attendeesData?.event?.attendees ||
          attendeesData.event.attendees.length === 0
            ? `There are no registered attendees for this event.`
            : null}
          <Stack direction="row" className="flex-wrap gap-2">
            {attendeesData?.event?.attendees?.map((attendee: InterfaceUser) => (
              <Chip
                avatar={
                  <Avatar>{attendee.name?.[0]?.toUpperCase() || 'U'}</Avatar>
                }
                label={attendee.name || 'Unknown User'}
                variant="outlined"
                key={
                  (attendee as InterfaceUser & { _id?: string })._id ||
                  attendee.id
                }
                onDelete={(): void =>
                  deleteRegistrant(
                    (attendee as InterfaceUser & { _id?: string })._id ||
                      attendee.id,
                  )
                }
              />
            )) || []}
          </Stack>
          <br />

          <Autocomplete
            id="addRegistrant"
            onChange={(_, newMember): void => {
              setMember(newMember);
            }}
            noOptionsText={
              <div className="d-flex ">
                <p className="me-2">No Registrations found</p>
                <span
                  className="underline"
                  style={{
                    color: '#555',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add Onspot Registration
                </span>
              </div>
            }
            options={memberData?.usersByOrganizationId || []}
            getOptionLabel={(member: InterfaceUser): string =>
              member.name || 'Unknown User'
            }
            renderInput={(params): React.ReactNode => (
              <TextField
                {...params}
                data-testid="autocomplete"
                label="Add an Registrant"
                placeholder="Choose the user that you want to add"
              />
            )}
          />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: '#A8C7FA', color: '#555' }}
            onClick={addRegistrant}
          >
            Add Registrant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
