import React, { useCallback, useEffect, useState, type FormEvent } from 'react';
import { currencyOptions, currencySymbols } from 'utils/currency';
import type {
  InterfacePledgeInfo,
  InterfaceUserInfoPG,
  InterfaceCreatePledge,
} from 'utils/interfaces';
import styles from './PledgeModal.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { InterfaceUserDetailsQuery } from 'utils/interfaces';
import { errorHandler } from 'utils/errorHandler';
import { CreateModal } from 'shared-components/CRUDModalTemplate/CreateModal';
import { EditModal } from 'shared-components/CRUDModalTemplate/EditModal';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import { FormSelectField } from 'shared-components/FormFieldGroup/FormSelectField';

/**
 * Props for the `PledgeModal` component.
 */
export interface InterfacePledgeModal {
  /** Indicates whether the modal is open or closed. */
  isOpen: boolean;
  /** Handler to close the modal. */
  hide: () => void;
  /** ID of the campaign associated with the pledge. */
  campaignId: string;
  /** ID of the user creating or editing the pledge. */
  userId: string;
  /** Pledge data to edit; null when creating a new pledge. */
  pledge: InterfacePledgeInfo | null;
  /** Trigger to refetch pledge data after updates. */
  refetchPledge: () => void;
  /** Determines whether the modal is in create or edit mode. */
  mode: 'create' | 'edit';
}

/**
 * Builds a display label for a member.
 * Empty name parts are safely ignored.
 *
 * @param member - User object containing name fields
 * @returns Full name string constructed from available name parts
 *
 * @example
 * ```ts
 * getMemberLabel({
 *   firstName: 'John',
 *   lastName: 'Doe',
 * } as InterfaceUserInfoPG);
 * // returns "John Doe"
 * ```
 */
export const getMemberLabel = (member: InterfaceUserInfoPG): string =>
  [member.firstName, member.lastName].filter(Boolean).join(' ') || member.name;

/**
 * Modal component for creating or editing pledges in a campaign.
 *
 * @remarks Integrates internationalization and GraphQL operations for pledge creation and updates.
 *
 * @param props - Props for the PledgeModal component.
 * @returns Rendered `PledgeModal` component.
 *
 * @example
 * ```tsx
 * <PledgeModal
 * isOpen={true}
 * hide={() => {}}
 * campaignId="123"
 * userId="456"
 * pledge={null}
 * refetchPledge={() => {}}
 * mode="create"
 * />
 * ```
 */
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
  const [updatePledge] = useMutation<unknown>(UPDATE_PLEDGE);

  // Mutation to create a new pledge
  const [createPledge] = useMutation<unknown>(CREATE_PLEDGE);

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
  const { data: userData } = useQuery<InterfaceUserDetailsQuery>(USER_DETAILS, {
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
    async (e: FormEvent<HTMLFormElement>) => {
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
    [pledgeAmount, pledge, t, updatePledge, refetchPledge, hide],
  );

  /**
   * Handler function to create a new pledge.
   * It collects the form data and sends a request to create a pledge with the specified details.
   *
   * @param e - The form submission event.
   * @returns A promise that resolves when the pledge is successfully created.
   */
  const createPledgeHandler = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

  // Form content shared between create and edit modes
  const formContent = (
    <>
      {userData?.user?.role !== 'regular' && (
        <div className="d-flex mb-3 w-100">
          <DropDownButton
            id="pledgerSelect"
            dataTestIdPrefix="pledgerSelect"
            options={[...pledgers, ...pledgeUsers]
              .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
              .map((p) => ({
                value: p.id,
                label: getMemberLabel(p),
              }))}
            selectedValue={pledgeUsers[0]?.id}
            disabled={mode === 'edit'}
            onSelect={(val: string) => {
              const newPledger =
                [...pledgers, ...pledgeUsers].find((p) => p.id === val) || null;
              setFormState({
                ...formState,
                pledgeUsers: newPledger ? [newPledger] : [],
              });
            }}
            searchable
            ariaLabel={t('pledgers')}
            parentContainerStyle="w-100"
            btnStyle={styles.noOutline}
          />
        </div>
      )}
      <div className="d-flex gap-3 mb-4">
        <div className="flex-grow-1">
          <FormSelectField
            name="currency"
            label={t('currency')}
            value={pledgeCurrency}
            data-testid="currencySelect"
            onChange={(value: string) => {
              setFormState({
                ...formState,
                pledgeCurrency: value,
              });
            }}
          >
            {currencyOptions.map((currency) => (
              <option key={currency.label} value={currency.value}>
                {currency.label} ({currencySymbols[currency.value]})
              </option>
            ))}
          </FormSelectField>
        </div>
        <div className="flex-grow-1">
          <FormTextField
            name="amount"
            label={t('amount')}
            type="number"
            value={String(pledgeAmount)}
            onChange={(value: string) => {
              if (value === '' || value.trim() === '') {
                setFormState({
                  ...formState,
                  pledgeAmount: 0,
                });
                return;
              }
              const numValue = parseInt(value);
              if (!isNaN(numValue) && numValue >= 0) {
                setFormState({
                  ...formState,
                  pledgeAmount: numValue,
                });
              }
            }}
            className={styles.noOutline}
          />
        </div>
      </div>
    </>
  );

  if (mode === 'edit') {
    return (
      <EditModal
        open={isOpen}
        title={t('editPledge')}
        onClose={hide}
        onSubmit={updatePledgeHandler}
        className={styles.pledgeModal}
        data-testid="pledgeModal"
      >
        <div data-testid="pledgeForm">{formContent}</div>
      </EditModal>
    );
  }

  return (
    <CreateModal
      open={isOpen}
      title={t('createPledge')}
      onClose={hide}
      onSubmit={createPledgeHandler}
      className={styles.pledgeModal}
      data-testid="pledgeModal"
    >
      <div data-testid="pledgeForm">{formContent}</div>
    </CreateModal>
  );
};
export default PledgeModal;
