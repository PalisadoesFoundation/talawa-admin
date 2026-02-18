/**
 * Modal for creating or editing a pledge.
 *
 * @remarks
 * Uses CreateModal and EditModal templates from CRUDModalTemplate for consistent UI and behavior.
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
import React, { useCallback, useEffect, useState } from 'react';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfaceCreatePledge,
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
} from 'utils/interfaces';
import styles from './PledgeModal.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { Autocomplete } from '@mui/material';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { FormSelectField } from 'shared-components/FormFieldGroup/FormSelectField';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, pledge, updatePledge, t, refetchPledge, hide, isSubmitting],
  );

  // Function to create a new pledge
  const createPledgeHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        if (!formState.pledgeUsers[0]?.id) {
          throw new Error(t('pledgeCreateFailed'));
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, campaignId, isSubmitting],
  );

  const modalTitle = mode === 'create' ? t('createPledge') : t('editPledge');

  const formContent = (
    <>
      {/* Single-select dropdown to choose the pledger for this pledge*/}
      <FormFieldGroup
        name="pledgers"
        label={t('pledgers')}
        touched={false}
        error={undefined}
      >
        <Autocomplete
          className={`${styles.noOutlinePledge} w-100`}
          data-testid="pledgerSelect"
          options={pledgers}
          value={formState.pledgeUsers[0] || null}
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
          renderInput={(params) => {
            const { InputProps, inputProps } = params;
            return (
              <div ref={InputProps.ref} className="position-relative">
                <input
                  {...inputProps}
                  type="text"
                  className="form-control"
                  aria-label={t('pledgers')}
                />
                {InputProps.endAdornment}
              </div>
            );
          }}
        />
      </FormFieldGroup>

      <div className="d-flex gap-3 mx-auto  mb-3">
        {/* Dropdown to select the currency in which amount is to be pledged */}
        <div className="w-50">
          <FormSelectField
            name="currency"
            label={t('currency')}
            value={formState.pledgeCurrency || ''}
            onChange={(value) =>
              setFormState({ ...formState, pledgeCurrency: value })
            }
            touched={false}
            error={undefined}
            data-testid="currencySelect"
          >
            {currencyOptions.map((currency) => (
              <option key={currency.label} value={currency.value}>
                {currency.label} ({currencySymbols[currency.value]})
              </option>
            ))}
          </FormSelectField>
        </div>

        {/* Input field to enter amount to be pledged */}
        <div className="w-50">
          <FormTextField
            name="amount"
            label={t('amount')}
            type="number"
            value={formState.pledgeAmount.toString()}
            onChange={(value) => {
              if (value === '') {
                setFormState({
                  ...formState,
                  pledgeAmount: 0,
                });
              } else {
                const parsed = parseInt(value);
                if (!isNaN(parsed)) {
                  setFormState({
                    ...formState,
                    pledgeAmount: Math.max(0, parsed),
                  });
                }
              }
            }}
            touched={true}
            error={
              formState.pledgeAmount < 1
                ? t('amountMustBeAtLeastOne')
                : undefined
            }
            data-testid="amountInput"
            min={1}
          />
        </div>
      </div>
    </>
  );

  if (mode === 'create') {
    return (
      <CreateModal
        open={isOpen}
        title={modalTitle}
        onClose={hide}
        onSubmit={createPledgeHandler}
        loading={isSubmitting}
        submitDisabled={!isAmountValid}
        data-testid="pledge-modal"
        className={styles.pledgeModal}
      >
        {formContent}
      </CreateModal>
    );
  }

  return (
    <EditModal
      open={isOpen}
      title={modalTitle}
      onClose={hide}
      onSubmit={updatePledgeHandler}
      loading={isSubmitting}
      submitDisabled={!isAmountValid}
      data-testid="pledge-modal"
      className={styles.pledgeModal}
    >
      {formContent}
    </EditModal>
  );
};

export default PledgeModal;
