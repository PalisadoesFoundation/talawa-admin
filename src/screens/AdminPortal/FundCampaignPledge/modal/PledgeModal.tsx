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
import React, { useCallback, useEffect, useState } from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { Autocomplete, InputLabel, MenuItem, Select } from '@mui/material';

import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';

import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import styles from './PledgeModal.module.css';

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

export const areOptionsEqual = (
  option: InterfaceUserInfoPG,
  value: InterfaceUserInfoPG,
): boolean => option.id === value.id;

export const getMemberLabel = (member: InterfaceUserInfoPG): string => {
  if (member.firstName || member.lastName) {
    return `${member.firstName || ''} ${member.lastName || ''}`.trim();
  }
  return member.name || '';
};

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
  const [amountTouched, setAmountTouched] = useState(false);

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

  const isAmountValid = formState.pledgeAmount > 0;

  // Update error handling to show exact error message
  const updatePledgeHandler = useCallback(
    async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      try {
        const variables = {
          id: pledge?.id ?? '',
          ...(pledge &&
            formState.pledgeAmount !== pledge.amount && {
              amount: formState.pledgeAmount,
            }),
        };

        await updatePledge({ variables });
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
    [formState, campaignId, createPledge, refetchPledge, hide, t],
  );

  const modalTitle = mode === 'create' ? t('createPledge') : t('editPledge');

  return (
    <BaseModal
      className={styles.pledgeModal}
      onHide={hide}
      show={isOpen}
      dataTestId="pledge-modal"
      showCloseButton={false}
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
      <form
        data-testid="pledgeForm"
        onSubmit={mode === 'edit' ? updatePledgeHandler : createPledgeHandler}
        className="p-3"
      >
        {/* A Multi-select dropdown enables admin to select more than one pledger for participating in a pledge */}
        <div className="d-flex mb-3 w-100">
          <Autocomplete
            className={`${styles.noOutlinePledge} w-100`}
            data-testid="pledgerSelect"
            options={pledgers}
            value={formState.pledgeUsers[0] || null}
            filterSelectedOptions={true}
            clearOnEscape
            disableClearable={false}
            componentsProps={{
              clearIndicator: {
                'aria-label': 'Clear',
              },
            }}
            isOptionEqualToValue={areOptionsEqual}
            getOptionLabel={getMemberLabel}
            onChange={(_, newPledger): void => {
              setFormState({
                ...formState,
                pledgeUsers: newPledger
                  ? [{ ...newPledger, id: newPledger.id }]
                  : [],
              });
            }}
            renderInput={(params) => (
              <FormFieldGroup name="pledgers" label={t('pledgers')}>
                <div ref={params.InputProps.ref}>
                  <input
                    {...params.inputProps}
                    className="form-control"
                    aria-label={t('pledgers')}
                    data-testid="pledgerInput"
                  />
                </div>
              </FormFieldGroup>
            )}
          />
        </div>

        <div className="d-flex gap-3 mx-auto mb-3">
          {/* Dropdown to select the currency in which amount is to be pledged */}
          <div className={`flex-grow-1 ${styles.currencyContainer}`}>
            <InputLabel>{t('currency')}</InputLabel>
            <Select
              value={formState.pledgeCurrency}
              label={t('currency')}
              inputProps={{ 'aria-label': t('currency') }}
              disabled
              fullWidth
            >
              {currencyOptions.map((currency) => (
                <MenuItem key={currency.label} value={currency.value}>
                  {currency.label} ({currencySymbols[currency.value]})
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Input field to enter amount to be pledged */}
          <div className="flex-grow-1">
            <FormTextField
              name="amount"
              label={t('amount')}
              type="number"
              value={formState.pledgeAmount.toString()}
              onChange={(value) => {
                const numValue = parseInt(value, 10);
                if (!isNaN(numValue)) {
                  setFormState({
                    ...formState,
                    pledgeAmount: Math.max(0, numValue),
                  });
                }
              }}
              error={
                formState.pledgeAmount < 1 ? t('amountMustBeAtLeastOne') : ''
              }
              touched={amountTouched}
              onBlur={() => setAmountTouched(true)}
              data-testid="pledgeAmount"
            />
          </div>
        </div>

        {/* Button to submit the pledge form */}
        <Button
          type="submit"
          className={styles.addButton}
          data-testid="submitPledgeBtn"
          disabled={!isAmountValid}
        >
          {t(mode === 'edit' ? 'updatePledge' : 'createPledge')}
        </Button>
      </form>
    </BaseModal>
  );
};

export default PledgeModal;
