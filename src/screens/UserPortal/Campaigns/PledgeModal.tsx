/**
 * @file PledgeModal.tsx
 * @description This file defines the `PledgeModal` component, which provides a modal interface for creating or editing pledges
 *              in a campaign. It includes form fields for selecting pledgers, specifying pledge amounts, currencies, and dates.
 *              The component supports internationalization and integrates with GraphQL mutations and queries for data handling.
 *
 * @module PledgeModal
 *
 * @typedef {InterfacePledgeModal} InterfacePledgeModal
 * @property {boolean} isOpen - Indicates whether the modal is open or closed.
 * @property {() => void} hide - Function to close the modal.
 * @property {string} campaignId - The ID of the campaign associated with the pledge.
 * @property {string} userId - The ID of the user creating or editing the pledge.
 * @property {InterfacePledgeInfo | null} pledge - The pledge data to edit, or null for creating a new pledge.
 * @property {() => void} refetchPledge - Function to refetch the pledge data after updates.
 * @property {Date} endDate - The maximum allowed end date for the pledge.
 * @property {'create' | 'edit'} mode - The mode of the modal, either 'create' or 'edit'.
 */

/**
 * @component
 * @name PledgeModal
 * @description A modal component for creating or editing pledges. It includes form fields for selecting pledgers,
 *              specifying pledge amounts, currencies, and dates. The component supports internationalization and
 *              integrates with GraphQL for data handling.
 *
 * @param {InterfacePledgeModal} props - The props for the PledgeModal component.
 * @returns {JSX.Element} The rendered PledgeModal component.
 *
 * @example
 * <PledgeModal
 *   isOpen={true}
 *   hide={() => {}}
 *   campaignId="123"
 *   userId="456"
 *   pledge={null}
 *   refetchPledge={() => {}}
 *   endDate={new Date()}
 *   mode="create"
 * />
 */
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceCreatePledge,
} from 'utils/interfaces';
import styles from '../../../style/app-fixed.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';

export interface InterfacePledgeModal {
  isOpen: boolean;
  hide: () => void;
  campaignId: string;
  userId: string;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
  mode: 'create' | 'edit';
}
/**
 * Compares two user options by ID.
 * Used by MUI Autocomplete to determine equality.
 *
 * @param option - Option from the Autocomplete list
 * @param value - Currently selected value
 * @returns True if both options refer to the same user
 *
 * @example
 * areOptionsEqual({ id: '1' } as InterfaceUserInfoPG, { id: '1' } as InterfaceUserInfoPG);
 * // returns true
 */
export const areOptionsEqual = (
  option: InterfaceUserInfoPG,
  value: InterfaceUserInfoPG,
): boolean => option.id === value.id;

/**
 * Builds a display label for a member.
 * Empty name parts are safely ignored.
 *
 * @param member - User object containing name fields
 * @returns Full name string constructed from available name parts
 *
 * @example
 * getMemberLabel({ firstName: 'John', lastName: 'Doe' } as InterfaceUserInfoPG);
 * // returns "John Doe"
 */
export const getMemberLabel = (member: InterfaceUserInfoPG): string =>
  [member.firstName, member.lastName].filter(Boolean).join(' ') || member.name;

const PledgeModal: React.FC<InterfacePledgeModal> = ({
  isOpen,
  hide,
  campaignId,
  userId,
  pledge,
  refetchPledge,
  mode,
}) => {
  // Translation functions to support internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });

  // State to manage the form inputs for the pledge
  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeUsers: pledge?.pledger ? [pledge.pledger] : [],
    pledgeAmount: pledge?.amount ?? 0,
    pledgeCurrency: pledge?.currency ?? 'USD',
  });

  // State to manage the list of pledgers (users who are part of the pledge)
  const [pledgers, setPledgers] = useState<InterfaceUserInfoPG[]>([]);

  // Mutation to update an existing pledge
  const [updatePledge] = useMutation(UPDATE_PLEDGE);

  // Mutation to create a new pledge
  const [createPledge] = useMutation(CREATE_PLEDGE);

  // Effect to update the form state when the pledge prop changes (e.g., when editing a pledge)
  useEffect(() => {
    if (pledge) {
      setFormState({
        pledgeUsers: pledge.pledger ? [pledge.pledger] : [],
        pledgeAmount: pledge?.amount ?? 0,
        pledgeCurrency: pledge?.currency ?? 'USD',
      });
    }
  }, [pledge]);

  // Destructuring the form state for easier access
  const { pledgeUsers, pledgeAmount, pledgeCurrency } = formState;

  // Query to get the user details based on the userId prop
  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { input: { id: userId } },
  });

  // Effect to update the pledgers state when user data is fetched
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      const nameParts = user.name ? user.name.split(' ') : [''];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const currentUser = {
        id: user.id,
        firstName,
        lastName,
        name: user.name,
        avatarURL: user.avatarURL,
      };

      setPledgers([currentUser]);

      if (user.role === 'regular') {
        setFormState((prevState) => ({
          ...prevState,
          pledgeUsers: [currentUser],
        }));
      }
    }
  }, [userData]);

  /**
   * Handler function to update an existing pledge.
   * It compares the current form state with the existing pledge and updates only the changed fields.
   *
   * @param e - The form submission event.
   * @returns A promise that resolves when the pledge is successfully updated.
   */

  const updatePledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updatedFields: { amount?: number } = {};
      if (pledgeAmount !== pledge?.amount) {
        updatedFields.amount = pledgeAmount;
      }
      try {
        await updatePledge({
          variables: { id: pledge?.id, ...updatedFields },
        });
        NotificationToast.success(t('pledgeUpdated'));
        refetchPledge();
        hide();
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [formState, pledge, t],
  );

  /**
   * Handler function to create a new pledge.
   * It collects the form data and sends a request to create a pledge with the specified details.
   *
   * @param e - The form submission event.
   * @returns A promise that resolves when the pledge is successfully created.
   */
  const createPledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (pledgeUsers.length === 0 || !pledgeUsers[0]) {
        NotificationToast.error(t('selectPledger'));
        return;
      }

      try {
        await createPledge({
          variables: {
            campaignId,
            amount: pledgeAmount,
            pledgerId: pledgeUsers[0].id,
          },
        });

        NotificationToast.success(t('pledgeCreated'));
        refetchPledge();
        setFormState({
          pledgeUsers: [],
          pledgeAmount: 0,
          pledgeCurrency: 'USD',
        });
        hide();
      } catch (error: unknown) {
        errorHandler(t, error);
      }
    },
    [
      formState,
      campaignId,
      pledgeAmount,
      pledgeCurrency,
      pledgeUsers,
      t,
      createPledge,
      refetchPledge,
      hide,
    ],
  );

  return (
    <Modal className={styles.pledgeModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>
          {t(mode === 'edit' ? 'editPledge' : 'createPledge')}
        </p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="pledgeModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form
          data-testid="pledgeForm"
          onSubmitCapture={
            mode === 'edit' ? updatePledgeHandler : createPledgeHandler
          }
          className="p-3"
        >
          {userData?.user?.role !== 'regular' && (
            <Form.Group className="d-flex mb-3 w-100">
              <Autocomplete
                className={`${styles.noOutline} w-100`}
                data-testid="pledgerSelect"
                options={[...pledgers, ...pledgeUsers].filter(
                  (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
                )}
                value={pledgeUsers[0] || null}
                readOnly={mode === 'edit'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                filterSelectedOptions={true}
                getOptionLabel={(member: InterfaceUserInfoPG): string =>
                  `${member.firstName} ${member.lastName}`
                }
                onChange={(_, newPledger): void => {
                  setFormState({
                    ...formState,
                    pledgeUsers: newPledger ? [newPledger] : [],
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label={t('pledgers')} />
                )}
              />
            </Form.Group>
          )}
          <Form.Group className="d-flex gap-3 mb-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t('currency')}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={pledgeCurrency}
                label={t('currency')}
                data-testid="currencySelect"
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    pledgeCurrency: e.target.value,
                  });
                }}
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency.label} value={currency.value}>
                    {currency.label} ({currencySymbols[currency.value]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label={t('amount')}
                variant="outlined"
                className={styles.noOutline}
                value={pledgeAmount}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 0) {
                    setFormState({
                      ...formState,
                      pledgeAmount: parseInt(e.target.value),
                    });
                  }
                }}
              />
            </FormControl>
          </Form.Group>
          <Button
            type="submit"
            className={styles.addButton}
            data-testid="submitPledgeBtn"
          >
            {t(mode === 'edit' ? 'updatePledge' : 'createPledge')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default PledgeModal;
