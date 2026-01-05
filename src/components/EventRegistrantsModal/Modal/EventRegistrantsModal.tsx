/**
 * EventRegistrantsModal Component
 *
 * This component renders a modal to manage event registrants. It allows users to:
 * - View the list of registered attendees for a specific event.
 * - Add new attendees from the organization's member list or through on-spot registration.
 * - Remove existing attendees from the event.
 *
 * @param props - The properties passed to the component.
 * @param show - Determines whether the modal is visible.
 * @param eventId - The ID of the event for which registrants are being managed.
 * @param orgId - The ID of the organization associated with the event.
 * @param handleClose - Callback function to close the modal.
 *
 * @returns The rendered EventRegistrantsModal component.
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
 * Dependencies:
 * - `react-bootstrap` for modal and button components.
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `@mui/material` for UI components like Avatar, Chip, and Autocomplete.
 * - `react-toastify` for toast notifications.
 * - `react-i18next` for translations.
 */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
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
import type { InterfaceUser } from 'types/shared-components/User/interface';
import styles from '../EventRegistrants.module.css';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';

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
  const { refetch: attendeesRefetch } = useQuery(EVENT_ATTENDEES, {
    variables: { eventId: eventId },
  });

  const { data: memberData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  // Function to add a new registrant to the event
  const addRegistrant = (): void => {
    if (member == null) {
      NotificationToast.warning('Please choose an user to add first!');
      return;
    }
    NotificationToast.warning('Adding the attendee...');
    const addVariables = isRecurring
      ? { userId: member.id, recurringEventInstanceId: eventId }
      : { userId: member.id, eventId: eventId };

    addRegistrantMutation({
      variables: addVariables,
    })
      .then(() => {
        NotificationToast.success(
          tCommon('addedSuccessfully', { item: 'Attendee' }) as string,
        );
        attendeesRefetch(); // Refresh the list of attendees
      })
      .catch((err) => {
        NotificationToast.error(t('errorAddingAttendee') as string);
        NotificationToast.error(err.message);
      });
  };

  return (
    <section>
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
      <BaseModal
        show={show}
        onHide={handleClose}
        title={t('eventRegistrantsTitle')}
        dataTestId="invite-modal"
        showCloseButton
        footer={
          <div>
            <Button
              className={styles.inviteButton}
              data-testid="invite-by-email-btn"
              onClick={() => setInviteOpen(true)}
            >
              {t('inviteByEmailButton')}
            </Button>

            <Button
              className={styles.addButton}
              data-testid="add-registrant-btn"
              onClick={addRegistrant}
            >
              {t('addRegistrantButton')}
            </Button>
          </div>
        }
      >
        <Autocomplete
          id="addRegistrant"
          onChange={(_, newMember): void => {
            setMember(newMember);
          }}
          noOptionsText={
            <div className="d-flex ">
              <p className="me-2">{t('noRegistrationsFound')}</p>
              <span
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
                className={`underline ${styles.underlineText}`}
                onClick={() => {
                  setOpen(true);
                }}
              >
                {t('addOnspotRegistrationLink')}
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
              label={t('addRegistrantLabel') as string}
              placeholder={t('addRegistrantPlaceholder') as string}
            />
          )}
        />
        <br />
      </BaseModal>
    </section>
  );
};
