/**
 * @file PledgeModal.tsx
 * @description A React component for creating or editing a pledge within a modal dialog.
 *
 * @module PledgeModal
 *
 * @remarks
 * This component provides a form for managing pledges, allowing users to:
 * - Select participants (pledgers) for the pledge.
 * - Specify the pledge amount and currency.
 * - Set start and end dates for the pledge.
 *
 * The modal supports two modes:
 * - `create`: For creating a new pledge.
 * - `edit`: For editing an existing pledge.
 *
 * @param {boolean} isOpen - Indicates whether the modal is open.
 * @param {() => void} hide - Function to close the modal.
 * @param {string} campaignId - The ID of the campaign associated with the pledge.
 * @param {string} orgId - The ID of the organization associated with the pledge.
 * @param {InterfacePledgeInfo | null} pledge - The pledge object to edit, or `null` for a new pledge.
 * @param {() => void} refetchPledge - Function to refetch the list of pledges after creation or update.
 * @param {Date} endDate - The campaign's end date to validate pledge dates.
 * @param {'create' | 'edit'} mode - The mode of the modal, either 'create' or 'edit'.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * <PledgeModal
 *   isOpen={true}
 *   hide={() => {}}
 *   campaignId="123"
 *   orgId="456"
 *   pledge={null}
 *   refetchPledge={() => {}}
 *   endDate={new Date()}
 *   mode="create"
 * />
 *
 * @dependencies
 * - React
 * - Apollo Client for GraphQL queries and mutations.
 * - Material-UI and Bootstrap for UI components.
 * - Day.js for date manipulation.
 * - NotificationToast for notifications.
 *
 * @css
 * - Uses global styles from `app-fixed.module.css`.
 * - Reusable class `.addButton` for consistent button styling.
 */
import type { ChangeEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';

export interface InterfacePledgeModal {
  isOpen: boolean;
  hide: () => void;
  campaignId: string;
  orgId: string;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
  endDate: Date;
  mode: 'create' | 'edit';
}

const PledgeModal: React.FC<InterfacePledgeModal> = ({
  isOpen,
  hide,
  campaignId,
  orgId,
  pledge,
  refetchPledge,
  mode,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });

  const [formState, setFormState] = useState<InterfaceCreatePledge>({
    pledgeUsers: pledge?.pledger ? [pledge.pledger] : [],
    pledgeAmount: Math.max(0, pledge?.amount ?? 0),
    pledgeCurrency: pledge?.currency ?? 'USD',
  });

  const [pledgers, setPledgers] = useState<InterfaceUserInfoPG[]>([]);
  const [updatePledge] = useMutation(UPDATE_PLEDGE);
  const [createPledge] = useMutation(CREATE_PLEDGE);

  const { data: memberData } = useQuery(MEMBERS_LIST_PG, {
    variables: { input: { id: orgId } },
  });

  useEffect(() => {
    if (pledge) {
      setFormState({
        pledgeUsers: pledge.pledger ? [pledge.pledger] : [],
        pledgeAmount: pledge.amount ?? 0,
        pledgeCurrency: pledge.currency ?? 'USD',
      });
    }
  }, [pledge]);

  useEffect(() => {
    if (memberData) {
      const members = memberData.organization.members.edges.map(
        (edge: { node: InterfaceUserInfoPG }) => edge.node,
      );
      setPledgers(members);
    }
  }, [memberData]);

  const { pledgeUsers, pledgeAmount } = formState;

  const isAmountValid = formState.pledgeAmount > 0;

  // Update error handling to show exact error message
  const updatePledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      const variables: {
        id?: string;
        amount?: number;
      } = {
        id: pledge?.id,
      };

      if (pledgeAmount !== pledge?.amount) {
        variables.amount = pledgeAmount;
      }
      try {
        const variables = {
          id: pledge?.id ?? '',
          ...(pledge &&
            pledgeAmount !== pledge.amount && { amount: pledgeAmount }),
        };

        await updatePledge({
          variables,
        });
        NotificationToast.success(t('pledgeUpdated'));
        refetchPledge();
        hide();
      } catch (error: unknown) {
        NotificationToast.error((error as Error).message);
      }
    },
    [formState, pledge, updatePledge, t, refetchPledge, hide],
  );

  // Function to create a new pledge
  const createPledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        e.preventDefault();
        if (!formState.pledgeUsers[0]?.id) {
          throw new Error('Failed to create pledge');
        }
        await createPledge({
          variables: {
            campaignId,
            amount: formState.pledgeAmount,
            pledgerId: formState.pledgeUsers[0].id,
          },
        });

        NotificationToast.success(t('pledgeCreated') as string);
        refetchPledge();
        setFormState({
          pledgeUsers: [],
          pledgeAmount: 0,
          pledgeCurrency: 'USD',
        });
        hide();
      } catch (error: unknown) {
        NotificationToast.error((error as Error).message);
      }
    },
    [formState, campaignId],
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFormState({
        ...formState,
        pledgeAmount: Math.max(0, value),
      });
    }
  };

  return (
    <Modal className={styles.pledgeModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <Modal.Title data-testid="createPledgeTitle">
          {mode === 'create' ? t('createPledge') : t('editPledge')}
        </Modal.Title>
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
          {/* A Multi-select dropdown enables admin to select more than one pledger for participating in a pledge */}
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              className={`${styles.noOutlinePledge} w-100`}
              data-testid="pledgerSelect"
              options={pledgers}
              value={pledgeUsers[0] || null}
              // isOptionEqualToValue={(option, value) => option?.id === value?.id}
              filterSelectedOptions={true}
              getOptionLabel={(member: InterfaceUserInfoPG): string =>
                `${member.name || ''}`
              }
              onChange={(_, newPledger): void => {
                setFormState({
                  ...formState,
                  pledgeUsers: newPledger
                    ? [{ ...newPledger, id: newPledger.id }]
                    : [],
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('pledgers')}
                  inputProps={{
                    ...params.inputProps,
                    'aria-label': t('pledgers'),
                  }}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="d-flex gap-3 mx-auto  mb-3">
            {/* Dropdown to select the currency in which amount is to be pledged */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t('currency')}
              </InputLabel>
              <Select
                value={formState.pledgeCurrency || ''}
                label={t('currency')}
                inputProps={{
                  'aria-label': t('currency'),
                }}
                disabled
                className="MuiSelect-disabled"
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency.label} value={currency.value}>
                    {currency.label} ({currencySymbols[currency.value]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Input field to enter amount to be pledged */}
            <FormControl fullWidth>
              <TextField
                label={t('amount')}
                variant="outlined"
                type="number"
                inputProps={{
                  min: 1,
                  'aria-label': 'Amount',
                }}
                error={formState.pledgeAmount < 1}
                helperText={
                  formState.pledgeAmount < 1 ? 'Amount must be at least 1' : ''
                }
                className={styles.noOutlinePledge}
                value={formState.pledgeAmount}
                onChange={handleAmountChange}
              />
            </FormControl>
          </Form.Group>
          {/* Button to submit the pledge form */}
          <Button
            type="submit"
            className={styles.addButton}
            data-testid="submitPledgeBtn"
            disabled={!isAmountValid}
          >
            {t(mode === 'edit' ? 'updatePledge' : 'createPledge')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default PledgeModal;
