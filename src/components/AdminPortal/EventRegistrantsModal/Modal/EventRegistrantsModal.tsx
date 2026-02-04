
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
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';

import Button from 'shared-components/Button';
import { BaseModal } from 'shared-components/BaseModal';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';

import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
/* eslint-disable no-restricted-imports */
import TextField from '@mui/material/TextField';

import {
  EVENT_ATTENDEES,
  MEMBERS_LIST,
  EVENT_DETAILS,
} from 'GraphQl/Queries/Queries';
import { ADD_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';

import AddOnSpotAttendee from './AddOnSpot/AddOnSpotAttendee';
import InviteByEmailModal from './InviteByEmail/InviteByEmailModal';

import type { InterfaceUser } from 'types/shared-components/User/interface';
import { InterfaceEventRegistrantsModalProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

import styles from './EventRegistrantsModal.module.css';

export const EventRegistrantsModal = ({
  eventId,
  orgId,
  handleClose,
  show,
}: InterfaceEventRegistrantsModalProps): JSX.Element => {
  const [selectedMember, setSelectedMember] = useState<InterfaceUser | null>(
    null,
  );
  const [openOnSpot, setOpenOnSpot] = useState(false);
  const [openInviteByEmail, setOpenInviteByEmail] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const { t } = useTranslation('translation', {
    keyPrefix: 'eventRegistrantsModal',
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { data: eventData } = useQuery(EVENT_DETAILS, {
    variables: { eventId },
  });

  useEffect(() => {
    if (eventData?.event) {
      setIsRecurring(Boolean(eventData.event.recurrenceRule));
    }
  }, [eventData]);

  const { refetch: refetchAttendees } = useQuery(EVENT_ATTENDEES, {
    variables: { eventId },
  });

  const { data: memberData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  const [addRegistrantMutation] = useMutation(ADD_EVENT_ATTENDEE);

  const addRegistrant = async (): Promise<void> => {
    if (!selectedMember) {
      NotificationToast.warning(t('selectUserFirst'));
      return;
    }

    NotificationToast.warning(t('addingAttendee'));

    const variables = isRecurring
      ? {
          userId: selectedMember.id,
          recurringEventInstanceId: eventId,
        }
      : {
          userId: selectedMember.id,
          eventId,
        };

    try {
      await addRegistrantMutation({ variables });

      NotificationToast.success(
        tCommon('addedSuccessfully', { item: 'Attendee' }) as string,
      );

      setSelectedMember(null);
      refetchAttendees();
    } catch (error) {
      NotificationToast.error(t('errorAddingAttendee') as string);
      NotificationToast.error((error as Error).message);
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <section>
        {/* On-Spot Attendee Modal */}
        <AddOnSpotAttendee
          show={openOnSpot}
          handleClose={() => setOpenOnSpot(false)}
          reloadMembers={refetchAttendees}
        />

        {/* Invite by Email Modal */}
        <InviteByEmailModal
          show={openInviteByEmail}
          handleClose={() => setOpenInviteByEmail(false)}
          eventId={eventId}
          isRecurring={isRecurring}
          onInvitesSent={refetchAttendees}
        />

        <BaseModal
          show={show}
          onHide={handleClose}
          title={t('eventRegistrantsTitle')}
          headerClassName={styles.modalHeader}
          showCloseButton
          footer={
            <div>
              <Button
                className={styles.inviteButton}
                data-testid="invite-by-email-btn"
                onClick={() => setOpenInviteByEmail(true)}
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
          <FormFieldGroup name="addRegistrant" label={t('addRegistrantLabel')}>
            <Autocomplete
              options={memberData?.usersByOrganizationId || []}
              getOptionLabel={(user: InterfaceUser) =>
                user?.name || t('unknownUser')
              }
              onChange={(_, newMember) => setSelectedMember(newMember)}
              noOptionsText={
                <div className="d-flex">
                  <p className="me-2">{t('noRegistrationsFound')}</p>
                  <button
                    type="button"
                    className={`underline ${styles.underlineText}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setOpenOnSpot(true)}
                  >
                    {t('addOnspotRegistrationLink')}
                  </button>
                </div>
              }
              renderInput={(params) => (
                /* 
                  MUI Autocomplete requires a MUI-compatible input.
                  FormTextField is not compatible with Autocomplete’s internal input handling.
                */
                <TextField
                  {...params}
                  placeholder={t('addRegistrantPlaceholder')}
                  data-testid="autocomplete"
                />
              )}
            />
          </FormFieldGroup>

          <br />
        </BaseModal>
      </section>
    </ErrorBoundaryWrapper>
  );
};
