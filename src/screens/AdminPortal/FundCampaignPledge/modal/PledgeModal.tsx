/**
 * Modal for creating or editing a pledge.
 *
 * @remarks
 * Provides a form for selecting pledgers, amounts, currencies, and dates, supporting both create and edit flows.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Closes the modal.
 * @param campaignId - ID of the campaign associated with the pledge.
 * @param orgId - ID of the organization associated with the pledge.
 * @param pledge - Pledge data to edit or `null` for a new pledge.
 * @param refetchPledge - Refetches the list of pledges after creation or update.
 * @param endDate - Campaign end date used to validate pledge dates.
 * @param mode - Modal mode, either `create` or `edit`.
 *
 * @returns Rendered modal component.
 *
 * @example
 * ```tsx
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
 * ```
 */
import type { ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import styles from './PledgeModal.module.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { BaseModal } from 'shared-components/BaseModal';

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

  const modalTitle = mode === 'create' ? t('createPledge') : t('editPledge');

  return (
    <BaseModal
      className={styles.pledgeModal}
      onHide={hide}
      show={isOpen}
      dataTestId="pledge-modal"
      showCloseButton={false} // Custom close button used to preserve existing test ID
      headerContent={
        <div className="d-flex align-items-center justify-content-between w-100">
          <h5 data-testid="createPledgeTitle" className="mb-0">
            {modalTitle}
          </h5>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="pledgeModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </div>
      }
    >
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
                'aria-label': t('amount'),
              }}
              error={formState.pledgeAmount < 1}
              helperText={
                formState.pledgeAmount < 1 ? t('amountMustBeAtLeastOne') : ''
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
    </BaseModal>
  );
};
export default PledgeModal;
