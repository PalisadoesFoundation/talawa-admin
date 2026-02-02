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
 * - Integrates with `NotificationToast` for user notifications..
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
 * - shared-components/Button for button components.
 * - shared-components/BaseModal for modal components.
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `@mui/material` for UI components like Avatar, Chip, and Autocomplete.
 * - `NotificationToast` for toast notifications.
 * - `react-i18next` for translations.
 */
import React, { useState, useEffect } from 'react';
import Button from 'shared-components/Button';
import { useMutation, useQuery } from '@apollo/client';
import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { ADD_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import AddOnSpotAttendee from './AddOnSpot/AddOnSpotAttendee';
import InviteByEmailModal from './InviteByEmail/InviteByEmailModal';
import type { InterfaceUser } from 'types/shared-components/User/interface';
import styles from './EventRegistrantsModal.module.css';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { InterfaceEventRegistrantsModalProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

export const EventRegistrantsModal = ({
  eventId,
  orgId,
  handleClose,
  show,
}: InterfaceEventRegistrantsModalProps): JSX.Element => {
  const [member, setMember] = useState<InterfaceUser | null>(null);
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  // Hooks for mutation operations
  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);

  // Translation hooks
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

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
      NotificationToast.warning(t('selectUserFirst'));
      return;
    }
    NotificationToast.warning(t('addingAttendee'));
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
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
          headerClassName={styles.modalHeader}
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
            disablePortal
            inputValue={inputValue}
            onInputChange={(_, value) => setInputValue(value)}
            id="addRegistrant"
            onChange={(_, newMember): void => {
              setMember(newMember);
            }}
            noOptionsText={
              <div className="d-flex ">
                <p className="me-2">{t('noRegistrationsFound')}</p>
                <button
                  type="button"
                  data-testid="add-onspot-link"
                  className={`underline ${styles.underlineText}`}
                  onClick={() => setOpen(true)}
                  onMouseDown={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpen(true);
                    }
                  }}
                >
                  {t('addOnspotRegistrationLink')}
                </button>
              </div>
            }
            options={memberData?.usersByOrganizationId || []}
            getOptionLabel={(member: InterfaceUser): string =>
              member.name || t('unknownUser')
            }
            renderInput={(params): React.ReactNode => (
              <FormTextField
                name="addRegistrant"
                label={t('addRegistrantLabel') as string}
                ref={params.InputProps.ref}
                value={inputValue}
                placeholder={t('addRegistrantPlaceholder') as string}
                data-testid="autocomplete"
                id={params.id}
                disabled={params.disabled}
                fullWidth
                onChange={(v: string) => {
                  if (params.inputProps?.onChange) {
                    params.inputProps.onChange({
                      target: { value: v },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              />
            )}
          />
          <br />
        </BaseModal>
      </section>
    </ErrorBoundaryWrapper>
  );
};
