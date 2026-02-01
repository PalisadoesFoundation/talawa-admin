/**
 * VolunteerCreateModal Component
 *
 * This component renders a modal that allows administrators to add a volunteer
 * to an event. It provides a form with a multi-select dropdown to choose a member
 * from the organization and submit the selection to add the member as a volunteer.
 *
 * @returns A modal element for adding volunteers to an event.
 *
 * @remarks
 * - Uses `@apollo/client` for GraphQL queries and mutations.
 * - Fetches the list of members from the organization using the `MEMBERS_LIST` query.
 * - Adds a volunteer to the event using the `ADD_VOLUNTEER` mutation.
 * - Displays success or error messages using `NotificationToast`.
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

import type { InterfaceUserInfo } from 'utils/interfaces';
import styles from './VolunteerCreateModal.module.css';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Autocomplete } from '@mui/material';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import {
  CreateModal,
  useMutationModal,
} from 'shared-components/CRUDModalTemplate';

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
  const { t: tCommon } = useTranslation('common');

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

  // Use useMutationModal for loading/error state management
  const { isSubmitting, execute } = useMutationModal<InterfaceAddVolunteerData>(
    async (data) => {
      await addVolunteer({ variables: { data } });
    },
    {
      onSuccess: () => {
        NotificationToast.success(t('volunteerAdded'));
        refetchVolunteers();
        setUserId('');
        setApplyTo('series');
        hide();
      },
      onError: (error) => {
        NotificationToast.error(error.message);
      },
    },
  );

  // Function to add a volunteer for an event
  const addVolunteerHandler = async (): Promise<void> => {
    if (!userId) {
      NotificationToast.error(t('selectVolunteer'));
      return;
    }

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

    await execute(mutationData);
  };

  const isSubmitDisabled = isSubmitting || !userId;

  return (
    <CreateModal
      open={isOpen}
      title={t('addVolunteer')}
      onClose={hide}
      onSubmit={addVolunteerHandler}
      loading={isSubmitting}
      submitDisabled={isSubmitDisabled}
      data-testid="volunteerCreateModal"
    >
      {/* Radio buttons for recurring events */}
      {isRecurring ? (
        <fieldset className={styles.radioFieldset}>
          <legend className={styles.radioLegend}>{t('applyTo')}</legend>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="applyTo"
                id="applyToSeries"
                value="series"
                checked={applyTo === 'series'}
                onChange={() => setApplyTo('series')}
              />
              <label htmlFor="applyToSeries">{t('entireSeries')}</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                name="applyTo"
                id="applyToInstance"
                value="instance"
                checked={applyTo === 'instance'}
                onChange={() => setApplyTo('instance')}
              />
              <label htmlFor="applyToInstance">{t('thisEventOnly')}</label>
            </div>
          </div>
        </fieldset>
      ) : null}

      {/* A Multi-select dropdown enables admin to invite a member as volunteer  */}
      <div className="d-flex mb-3 w-100">
        <Autocomplete
          className={`${styles.noOutline} w-100`}
          limitTags={2}
          data-testid="membersSelect"
          options={members}
          value={
            members.find((m: InterfaceUserInfo) => m.id === userId) || null
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          filterSelectedOptions={true}
          getOptionLabel={(member: InterfaceUserInfo): string => member.name}
          onChange={(_, newVolunteer): void => {
            setUserId(newVolunteer?.id ?? '');
          }}
          renderInput={(params) => (
            <FormFieldGroup name="members" label={tCommon('members')}>
              <div
                ref={params.InputProps.ref}
                className="d-flex w-100 align-items-center"
              >
                {params.InputProps.startAdornment}
                <input
                  {...params.inputProps}
                  id="members"
                  className="form-control"
                  data-testid="membersInput"
                />
                {params.InputProps.endAdornment}
              </div>
            </FormFieldGroup>
          )}
        />
      </div>
    </CreateModal>
  );
};
export default VolunteerCreateModal;
