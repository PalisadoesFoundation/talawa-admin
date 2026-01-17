/**
 * VolunteerCreateModal Component
 *
 * This component renders a modal that allows administrators to add a volunteer
 * to an event. It provides a form with a multi-select dropdown to choose a member
 * from the organization and submit the selection to add the member as a volunteer.
 *
 * @param {boolean} isOpen - Determines whether the modal is visible.
 * @param {() => void} hide - Function to close the modal.
 * @param {string} eventId - The ID of the event to which the volunteer is being added.
 * @param {string} orgId - The ID of the organization to fetch members from.
 * @param {() => void} refetchVolunteers - Function to refetch the list of volunteers after adding a new one.
 *
 * @returns {React.FC<InterfaceVolunteerCreateModal>} A React functional component that renders the modal.
 *
 * @remarks
 * - Uses `@apollo/client` for GraphQL queries and mutations.
 * - Fetches the list of members from the organization using the `MEMBERS_LIST` query.
 * - Adds a volunteer to the event using the `ADD_VOLUNTEER` mutation.
 * - Displays success or error messages using `react-toastify`.
 *
 * @example
 * ```tsx
 * <VolunteerCreateModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   eventId="event123"
 *   orgId="org456"
 *   refetchVolunteers={fetchVolunteers}
 * />
 * ```
 */
import type { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import type { InterfaceUserInfo } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { Autocomplete, TextField } from '@mui/material';

import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { ADD_VOLUNTEER } from 'GraphQl/Mutations/EventVolunteerMutation';

// Interface for add volunteer mutation data
interface InterfaceAddVolunteerData {
  userId: string;
  eventId: string | undefined;
  scope?: 'ENTIRE_SERIES' | 'THIS_INSTANCE_ONLY';
  recurringEventInstanceId?: string;
}

export interface InterfaceVolunteerCreateModal {
  isOpen: boolean;
  hide: () => void;
  eventId: string;
  orgId: string;
  refetchVolunteers: () => void;
  // New props for recurring events
  isRecurring?: boolean;
  baseEvent?: { id: string } | null;
  recurringEventInstanceId?: string;
}

const VolunteerCreateModal: React.FC<InterfaceVolunteerCreateModal> = ({
  isOpen,
  hide,
  eventId,
  orgId,
  refetchVolunteers,
  isRecurring = false,
  baseEvent = null,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

  const [userId, setUserId] = useState<string>('');
  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [addVolunteer] = useMutation(ADD_VOLUNTEER);

  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: orgId },
  });

  const members = useMemo(
    () => membersData?.usersByOrganizationId || [],
    [membersData],
  );

  // Function to add a volunteer for an event
  const addVolunteerHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();

        // Template-First Hierarchy: Use scope-based approach
        const mutationData: InterfaceAddVolunteerData = {
          userId,
          eventId: isRecurring
            ? baseEvent?.id // Use baseEvent.id if available, fallback to eventId
            : eventId, // Use eventId for non-recurring events
        };

        // Add Template-First recurring event logic
        if (isRecurring) {
          if (applyTo === 'series') {
            mutationData.scope = 'ENTIRE_SERIES';
            // No recurringEventInstanceId needed - template appears on all instances
          } else {
            mutationData.scope = 'THIS_INSTANCE_ONLY';
            mutationData.recurringEventInstanceId = eventId; // Current instance ID
          }
        }

        await addVolunteer({ variables: { data: mutationData } });

        toast.success(t('volunteerAdded'));
        refetchVolunteers();
        setUserId('');
        setApplyTo('series'); // Reset to default
        hide();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    },
    [userId, eventId, isRecurring, applyTo, baseEvent],
  );

  return (
    <Modal className={styles.volunteerCreateModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('addVolunteer')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          data-testid="volunteerForm"
          onSubmitCapture={addVolunteerHandler}
          className="p-3"
        >
          {/* Radio buttons for recurring events */}
          {isRecurring ? (
            <Form.Group className="mb-3">
              <Form.Label>{t('applyTo')}</Form.Label>
              <Form.Check
                type="radio"
                label={t('entireSeries')}
                name="applyTo"
                id="applyToSeries"
                checked={applyTo === 'series'}
                onChange={() => setApplyTo('series')}
              />
              <Form.Check
                type="radio"
                label={t('thisEventOnly')}
                name="applyTo"
                id="applyToInstance"
                checked={applyTo === 'instance'}
                onChange={() => setApplyTo('instance')}
              />
            </Form.Group>
          ) : null}

          {/* A Multi-select dropdown enables admin to invite a member as volunteer  */}
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="membersSelect"
              options={members}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfo): string =>
                member.name
              }
              onChange={(_, newVolunteer): void => {
                setUserId(newVolunteer?.id ?? '');
              }}
              renderInput={(params) => <TextField {...params} label="Member" />}
            />
          </Form.Group>

          {/* Button to submit the volunteer form */}
          <Button
            type="submit"
            className={styles.regBtn}
            data-testid="submitBtn"
          >
            {t('addVolunteer')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default VolunteerCreateModal;
