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
import { useMutation, useQuery } from '@apollo/client/react';
import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { ADD_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import AddOnSpotAttendee from './AddOnSpot/AddOnSpotAttendee';
import InviteByEmailModal from './InviteByEmail/InviteByEmailModal';
import type { InterfaceUser } from 'types/User/interface';
import styles from './EventRegistrantsModal.module.css';

type ModalPropType = {
  show: boolean;
  eventId: string;
  orgId: string;
  handleClose: () => void;
};

interface InterfaceEventDetails {
  event: {
    recurrenceRule: {
      id: string;
    } | null;
  };
}

interface InterfaceMembersList {
  usersByOrganizationId: InterfaceUser[];
}

export const EventRegistrantsModal = (props: ModalPropType): JSX.Element => {
  const { eventId, orgId, handleClose, show } = props;
  const [member, setMember] = useState<InterfaceUser | null>(null);
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  // Hooks for mutation operations
  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);

  // Translation hooks
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');

  // First, get event details to determine if it's recurring or standalone
  const { data: eventData } = useQuery<InterfaceEventDetails>(EVENT_DETAILS, {
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
  const { refetch: attendeesRefetch } = useQuery(EVENT_ATTENDEES, {
    variables: { eventId: eventId },
  });

  const { data: memberData } = useQuery<InterfaceMembersList>(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  // Function to add a new registrant to the event
  const addRegistrant = (): void => {
    if (member == null) {
      toast.warning(t('pleaseChooseUser') as string);
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
        <InviteByEmailModal
          show={inviteOpen}
          handleClose={() => setInviteOpen(false)}
          eventId={eventId}
          isRecurring={isRecurring}
          onInvitesSent={() => {
            attendeesRefetch();
          }}
        />
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>{t('eventRegistrants')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            id="addRegistrant"
            onChange={(_, newMember): void => {
              setMember(newMember);
            }}
            noOptionsText={
              <div className="d-flex ">
                <p className="me-2">{t('noRegistrationsFound')}</p>
                <span
                  className={`underline ${styles.addOnspotLink}`}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  {t('addOnspotRegistration')}
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
                label={t('addRegistrant')}
                placeholder={t('chooseUserToAdd')}
              />
            )}
          />
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={styles.inviteButton}
            onClick={() => setInviteOpen(true)}
          >
            {t('inviteByEmailButton')}
          </Button>
          <Button
            className={styles.addRegistrantButton}
            onClick={addRegistrant}
          >
            {t('addRegistrantButton')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
