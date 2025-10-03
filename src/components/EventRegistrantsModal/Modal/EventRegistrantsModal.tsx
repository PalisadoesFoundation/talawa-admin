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
import React, { useMemo, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import { EVENT_ATTENDEES, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
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

  // Hooks for mutation operations
  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);
  const [removeRegistrantMutation] = useMutation(REMOVE_EVENT_ATTENDEE);

  // Translation hooks
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');

  // Query hooks to fetch event attendees and organization members
  const {
    data: attendeesData,
    loading: attendeesLoading,
    refetch: attendeesRefetch,
  } = useQuery(EVENT_ATTENDEES, { variables: { id: eventId } });

  const { data: memberData, loading: memberLoading } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  const organizationMembers = useMemo(
    () => memberData?.usersByOrganizationId ?? [],
    [memberData],
  );

  const getAttendeeDisplayName = (attendee: InterfaceUser): string => {
    const fallbackName =
      `${attendee.firstName ?? ''} ${attendee.lastName ?? ''}`.trim();
    const name = attendee.name?.trim() || fallbackName;
    return name.length > 0 ? name : 'Unknown';
  };

  const getAttendeeInitials = (attendee: InterfaceUser): string => {
    const name = getAttendeeDisplayName(attendee);
    if (!name || name === 'Unknown') {
      return '?';
    }

    const words = name.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return '?';
    }

    const initials = words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('');

    return initials || '?';
  };

  // Function to add a new registrant to the event
  const addRegistrant = (): void => {
    if (member == null) {
      toast.warning('Please choose an user to add first!');
      return;
    }
    toast.warn('Adding the attendee...');
    addRegistrantMutation({
      variables: { userId: member.id, eventId: eventId },
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
    removeRegistrantMutation({ variables: { userId, eventId: eventId } })
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
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Registrants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="mb-2"> Registered Registrants </h5>
          {attendeesData.event.attendees.length == 0
            ? `There are no registered attendees for this event.`
            : null}
          <Stack direction="row" className="flex-wrap gap-2">
            {attendeesData.event.attendees.map(
              (attendee: InterfaceUser & { _id?: string }, index: number) => {
                const attendeeId = attendee.id ?? attendee._id ?? '';

                const handleDelete = (): void => {
                  if (!attendeeId) {
                    toast.error('Unable to remove this attendee.');
                    return;
                  }
                  deleteRegistrant(attendeeId);
                };

                return (
                  <Chip
                    avatar={<Avatar>{getAttendeeInitials(attendee)}</Avatar>}
                    label={getAttendeeDisplayName(attendee)}
                    variant="outlined"
                    key={attendeeId || `attendee-${index}`}
                    onDelete={handleDelete}
                  />
                );
              },
            )}
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
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Add Onspot Registration
                </span>
              </div>
            }
            options={organizationMembers}
            getOptionLabel={(member: InterfaceUser): string => {
              const fallbackName =
                `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim();
              const name = member.name?.trim() || fallbackName;
              return name.length > 0 ? name : 'Unknown';
            }}
            isOptionEqualToValue={(option, value): boolean =>
              option.id === value.id
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
          <Button variant="success" onClick={addRegistrant}>
            Add Registrant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
